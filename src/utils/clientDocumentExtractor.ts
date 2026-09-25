/**
 * In-browser document text extractor and base64 sanitizer
 * Handles mobile uploads (iOS/Android), Netlify static hosting, and desktop browsers.
 * Eliminates HTTP packet malformed errors and extracts readable text directly client-side.
 */

import mammoth from 'mammoth';

/**
 * Sanitizes base64 string and strips Data URL prefixes and illegal characters (newlines, spaces, carriage returns)
 * Prevents HTTP chunk / packet malformed errors on Cloud Run, Netlify, and reverse proxies.
 */
export async function fileToCleanBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = (reader.result as string) || '';
      let mime = file.type || '';
      const name = file.name.toLowerCase();

      if (!mime) {
        if (name.endsWith('.pdf')) mime = 'application/pdf';
        else if (name.endsWith('.docx')) mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (name.endsWith('.doc')) mime = 'application/msword';
        else if (name.endsWith('.txt')) mime = 'text/plain';
        else if (name.endsWith('.md')) mime = 'text/markdown';
        else mime = 'application/pdf';
      }

      // Extract raw base64 and strip all line breaks, carriage returns, and spaces
      let rawBase64 = dataUrl;
      if (dataUrl.includes(';base64,')) {
        rawBase64 = dataUrl.split(';base64,')[1];
      }
      // Strict base64 cleanup to avoid malformed packet errors
      const sanitized = rawBase64.replace(/[\r\n\s\t]/g, '').trim();

      resolve({
        base64: sanitized,
        mimeType: mime,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Decodes standard PDF text strings, unescaping parentheses and octal codes
 */
function cleanPdfString(raw: string): string {
  return raw
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\r/g, ' ')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, ' ')
    .replace(/\\([()\\])/g, '$1')
    .trim();
}

/**
 * Parses PDF text streams from an ArrayBuffer directly in the browser
 * Extracts both uncompressed and FlateDecode compressed streams using modern Web DecompressionStream API.
 */
async function extractTextFromPdfArrayBuffer(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const textChunks: string[] = [];

  // Convert buffer to binary string representation for pattern matching
  let binaryStr = '';
  const len = bytes.length;
  // Read in 64KB blocks for memory efficiency on mobile
  const blockSize = 65536;
  for (let i = 0; i < len; i += blockSize) {
    const chunk = bytes.subarray(i, Math.min(i + blockSize, len));
    binaryStr += String.fromCharCode.apply(null, Array.from(chunk));
  }

  // 1. Look for uncompressed text streams: (text) Tj or [(text)] TJ
  const tjMatches = binaryStr.match(/\(([^)]{2,})\)\s*Tj/g);
  if (tjMatches && tjMatches.length > 5) {
    for (const match of tjMatches) {
      const inner = match.replace(/\)\s*Tj$/, '').replace(/^\(/, '');
      const cleaned = cleanPdfString(inner);
      if (cleaned.length > 1) {
        textChunks.push(cleaned);
      }
    }
  }

  const tjArrayMatches = binaryStr.match(/\[([^\]]{3,})\]\s*TJ/g);
  if (tjArrayMatches && tjArrayMatches.length > 5) {
    for (const match of tjArrayMatches) {
      const parts = match.match(/\(([^)]*)\)/g);
      if (parts) {
        const line = parts
          .map((p) => cleanPdfString(p.slice(1, -1)))
          .join('')
          .trim();
        if (line.length > 1) {
          textChunks.push(line);
        }
      }
    }
  }

  // 2. If uncompressed extraction gave good content (>100 chars), return it
  if (textChunks.length > 10) {
    const combined = textChunks.join(' ').replace(/\s{2,}/g, ' ').trim();
    if (combined.length > 100) {
      return combined;
    }
  }

  // 3. Scan for FlateDecode compressed streams and decompress via Web DecompressionStream
  if (typeof DecompressionStream === 'function') {
    try {
      const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
      let match;
      let streamCount = 0;

      while ((match = streamRegex.exec(binaryStr)) !== null && streamCount < 25) {
        streamCount++;
        const streamData = match[1];
        if (!streamData || streamData.length < 20) continue;

        // Convert slice back to Uint8Array
        const streamBytes = new Uint8Array(streamData.length);
        for (let j = 0; j < streamData.length; j++) {
          streamBytes[j] = streamData.charCodeAt(j);
        }

        try {
          const ds = new DecompressionStream('deflate');
          const writer = ds.writable.getWriter();
          writer.write(streamBytes);
          writer.close();

          const reader = ds.readable.getReader();
          let decompressed = '';
          const decoder = new TextDecoder('utf-8', { fatal: false });

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            decompressed += decoder.decode(value, { stream: true });
          }

          if (decompressed && decompressed.length > 20) {
            // Extract text from decompressed PDF operators
            const subTj = decompressed.match(/\(([^)]{2,})\)\s*Tj/g);
            if (subTj) {
              for (const m of subTj) {
                const inner = m.replace(/\)\s*Tj$/, '').replace(/^\(/, '');
                textChunks.push(cleanPdfString(inner));
              }
            }
            const subTJ = decompressed.match(/\[([^\]]{3,})\]\s*TJ/g);
            if (subTJ) {
              for (const m of subTJ) {
                const parts = m.match(/\(([^)]*)\)/g);
                if (parts) {
                  textChunks.push(parts.map((p) => cleanPdfString(p.slice(1, -1))).join(''));
                }
              }
            }
          }
        } catch {
          // Stream might not be zlib/deflate or could be an image stream; continue safely
        }
      }
    } catch (err) {
      console.warn('DecompressionStream PDF extraction notice:', err);
    }
  }

  // 4. Return combined chunks if found
  if (textChunks.length > 0) {
    const combined = textChunks.join(' ').replace(/\s{2,}/g, ' ').trim();
    if (combined.length > 50) {
      return combined;
    }
  }

  // 5. Printable ASCII fallback
  const printable = binaryStr.replace(/[^\x20-\x7E\t\n\r]/g, ' ');
  const words = printable.split(/\s+/).filter((w) => w.length > 2 && /^[a-zA-Z0-9#+.-]+$/.test(w));
  if (words.length > 40) {
    return words.join(' ').slice(0, 10000);
  }

  return '';
}

/**
 * Extracts plain text from a File object directly in the browser.
 * Works on iOS Safari, Android Chrome, and Netlify static sites without backend dependencies.
 */
export async function extractTextFromFileInBrowser(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  // 1. Text, Markdown, HTML, RTF
  if (
    name.endsWith('.txt') ||
    name.endsWith('.md') ||
    name.endsWith('.rtf') ||
    name.endsWith('.html') ||
    name.endsWith('.csv') ||
    file.type.startsWith('text/')
  ) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(((reader.result as string) || '').trim());
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  }

  // 2. Word documents (.docx) via mammoth in-browser
  if (name.endsWith('.docx') || file.type.includes('wordprocessingml')) {
    try {
      const buffer = await file.arrayBuffer();
      const mammothObj = (mammoth as any).default || mammoth;
      if (mammothObj && typeof mammothObj.extractRawText === 'function') {
        const result = await mammothObj.extractRawText({ arrayBuffer: buffer });
        if (result && result.value && result.value.trim().length > 20) {
          return result.value.trim();
        }
      }
    } catch (err) {
      console.warn('In-browser mammoth extraction notice:', err);
    }

    // Fallback for docx: extract XML text elements <w:t> directly from ArrayBuffer
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const len = Math.min(bytes.length, 3 * 1024 * 1024);
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const wtMatches = binary.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (wtMatches && wtMatches.length > 5) {
        const text = wtMatches
          .map((m) => m.replace(/<[^>]+>/g, ''))
          .join(' ')
          .replace(/\s{2,}/g, ' ')
          .trim();
        if (text.length > 50) return text;
      }
    } catch (e) {
      console.warn('Fallback docx xml extraction notice:', e);
    }
  }

  // 3. PDF documents (.pdf)
  if (name.endsWith('.pdf') || file.type.includes('pdf')) {
    try {
      const buffer = await file.arrayBuffer();
      const text = await extractTextFromPdfArrayBuffer(buffer);
      if (text && text.length > 30) {
        return text;
      }
    } catch (err) {
      console.warn('In-browser PDF extraction notice:', err);
    }
  }

  // 4. Legacy .doc / binary files
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const len = Math.min(bytes.length, 1024 * 1024);
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const printable = binary.replace(/[^\x20-\x7E\t\n\r]/g, ' ');
    const tokens = printable.split(/\s+/).filter((t) => t.length > 3 && /^[A-Za-z]+$/.test(t));
    if (tokens.length > 40) {
      return tokens.join(' ').slice(0, 10000);
    }
  } catch (err) {
    console.warn('Binary fallback notice:', err);
  }

  return '';
}
