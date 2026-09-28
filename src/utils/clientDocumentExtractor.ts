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
 * Safely decompress RFC 1950 zlib FlateDecode stream bytes using Web DecompressionStream API.
 * Validates zlib magic bytes before decompression to avoid 'incorrect header check' errors,
 * and handles stream errors cleanly without orphan unhandled promise rejections.
 */
async function safelyDecompressZlib(bytes: Uint8Array): Promise<string> {
  // RFC 1950 header check:
  // Byte 0: 0x78 (deflate compression with 32KB window)
  // Byte 1: flags such that (byte0 * 256 + byte1) % 31 === 0
  if (
    bytes.length < 6 ||
    bytes[0] !== 0x78 ||
    (((bytes[0] << 8) | bytes[1]) % 31 !== 0)
  ) {
    return '';
  }

  if (typeof DecompressionStream !== 'function' || typeof Response === 'undefined') {
    return '';
  }

  try {
    const blob = new Blob([bytes.buffer as ArrayBuffer]);
    const stream = blob.stream().pipeThrough(new DecompressionStream('deflate'));
    const response = new Response(stream);
    const arrayBuffer = await response.arrayBuffer();
    return new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);
  } catch {
    // Non-text, corrupt, or truncated stream - safely ignore without unhandled promise rejections
    return '';
  }
}

/**
 * Parses PDF text streams from an ArrayBuffer directly in the browser
 * Extracts uncompressed operators and safely decompresses valid FlateDecode streams.
 */
async function extractTextFromPdfArrayBuffer(buffer: ArrayBuffer): Promise<string> {
  try {
    const bytes = new Uint8Array(buffer);
    const textChunks: string[] = [];

    // Convert buffer to binary string representation for operator pattern matching
    let binaryStr = '';
    const len = bytes.length;
    // Process in safe blocks to avoid stack overflow
    const blockSize = 32768;
    for (let i = 0; i < len; i += blockSize) {
      const chunk = bytes.subarray(i, Math.min(i + blockSize, len));
      let sub = '';
      for (let j = 0; j < chunk.length; j++) {
        sub += String.fromCharCode(chunk[j]);
      }
      binaryStr += sub;
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

    // 2. If uncompressed extraction gave sufficient content (>100 chars), return it
    if (textChunks.length > 10) {
      const combined = textChunks.join(' ').replace(/\s{2,}/g, ' ').trim();
      if (combined.length > 100) {
        return combined;
      }
    }

    // 3. Scan for FlateDecode streams directly from binary byte offsets
    const streamRegex = /stream[\r\n]+/g;
    let match: RegExpExecArray | null;
    let streamCount = 0;

    while ((match = streamRegex.exec(binaryStr)) !== null && streamCount < 30) {
      streamCount++;
      const streamStart = match.index + match[0].length;
      const endStreamIndex = binaryStr.indexOf('endstream', streamStart);
      if (endStreamIndex === -1 || endStreamIndex - streamStart < 10) continue;

      let streamEnd = endStreamIndex;
      if (binaryStr[streamEnd - 1] === '\n') streamEnd--;
      if (binaryStr[streamEnd - 1] === '\r') streamEnd--;

      const streamBytes = bytes.subarray(streamStart, streamEnd);
      // Validate zlib header before calling decompression API
      const decompressed = await safelyDecompressZlib(streamBytes);
      if (decompressed && decompressed.length > 20) {
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
  } catch (err) {
    console.log('PDF text parsing handled gracefully:', err);
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
