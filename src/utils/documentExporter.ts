import { jsPDF } from 'jspdf';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip
} from 'docx';
import { TailoredResume, CoverLetter, JobOpening, CandidateProfile } from '../types';

export interface ResumeExportOptions {
  tailoredResume: TailoredResume;
  job: JobOpening;
  profile?: CandidateProfile | null;
  editedMarkdown?: string;
}

export interface CoverLetterExportOptions {
  coverLetter: CoverLetter;
  job: JobOpening;
  profile?: CandidateProfile | null;
  editedText?: string;
}

/**
 * Extracts contact info (phone, email, state/location) from profile or raw text
 */
function extractContactLine(profile?: CandidateProfile | null, rawText?: string): string {
  const parts: string[] = [];
  const textPool = `${rawText || ''} ${profile?.extractedResumeText || ''}`;

  // Email
  const emailMatch = textPool.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    parts.push(emailMatch[0]);
  }

  // Phone
  const phoneMatch = textPool.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    parts.push(phoneMatch[0]);
  }

  // Location / State
  if (profile?.userLocation) {
    parts.push(profile.userLocation);
  } else if (profile?.userState) {
    parts.push(`${profile.userState}, United States`);
  }

  return parts.length > 0 ? parts.join('  •  ') : 'Remote Professional  •  United States';
}

/**
 * Parsed structured resume data ready for PDF & DOCX formatters
 */
interface ParsedResumeData {
  name: string;
  contactLine: string;
  targetRoleLine: string;
  summary: string;
  skills: string[];
  experiences: Array<{
    title: string;
    company: string;
    dates: string;
    bullets: string[];
  }>;
  education: string[];
  atsKeywords: string[];
}

function parseResumeContent(options: ResumeExportOptions): ParsedResumeData {
  const { tailoredResume, job, profile, editedMarkdown } = options;
  const raw = editedMarkdown || tailoredResume.fullMarkdown || '';
  const lines = raw.split('\n').map((l) => l.trim());

  // 1. Determine Candidate Name
  let name = profile?.name?.trim() || '';
  if (!name || name.toLowerCase() === 'candidate name') {
    const firstHeader = lines.find((l) => l.startsWith('#') || (l.length > 0 && l.length < 40 && !l.includes(':')));
    if (firstHeader) {
      const cleaned = firstHeader.replace(/^#*\s*/, '').trim();
      if (cleaned && !cleaned.toLowerCase().includes('resume') && !cleaned.toLowerCase().includes('target') && cleaned.length < 45) {
        name = cleaned;
      }
    }
  }
  if (!name) name = 'Candidate Name';

  // 2. Contact & Target
  const contactLine = extractContactLine(profile, raw);
  const targetRoleLine = `Target Role: ${job.title}  |  ${job.company} (${job.workArrangement})`;

  // 3. Summary
  let summary = tailoredResume.targetedSummary || profile?.summary || '';
  // Check if markdown has an updated summary section
  const summaryHeaderIdx = lines.findIndex((l) => l.toLowerCase().includes('summary') || l.toLowerCase().includes('objective'));
  if (summaryHeaderIdx !== -1 && lines[summaryHeaderIdx + 1]) {
    const nextNonEmpty = lines.slice(summaryHeaderIdx + 1).find((l) => l.length > 0 && !l.startsWith('#'));
    if (nextNonEmpty && nextNonEmpty.length > 30) {
      summary = nextNonEmpty;
    }
  }
  if (!summary) {
    summary = 'Experienced technical professional with a track record of enterprise systems administration, hardware diagnostics, and dependable remote operations.';
  }

  // 4. Skills
  let skills: string[] = tailoredResume.highlightedSkills?.length
    ? tailoredResume.highlightedSkills
    : profile?.primarySkills?.length
    ? profile.primarySkills
    : ['Systems Administration', 'Hardware Diagnostics', 'Active Directory', 'ServiceNow', 'Troubleshooting'];

  // Check if edited markdown has a Competencies/Skills section
  const skillsHeaderIdx = lines.findIndex((l) => l.toLowerCase().includes('competencies') || l.toLowerCase().includes('skills'));
  if (skillsHeaderIdx !== -1 && lines[skillsHeaderIdx + 1]) {
    const skillLine = lines.slice(skillsHeaderIdx + 1).find((l) => l.length > 0 && !l.startsWith('#'));
    if (skillLine) {
      const extracted = skillLine.split(/[•|,\n]/).map((s) => s.trim()).filter((s) => s.length > 1);
      if (extracted.length > 2) {
        skills = extracted;
      }
    }
  }

  // 5. Experiences
  const experiences: Array<{ title: string; company: string; dates: string; bullets: string[] }> = [];

  // Check if user edited markdown experience, or if we use tailoredResume.tailoredExperience
  const hasCustomMarkdown = editedMarkdown && editedMarkdown !== tailoredResume.fullMarkdown;

  if (!hasCustomMarkdown && tailoredResume.tailoredExperience && tailoredResume.tailoredExperience.length > 0) {
    for (const exp of tailoredResume.tailoredExperience) {
      experiences.push({
        title: exp.role || 'IT Support Specialist',
        company: exp.company || 'Enterprise Operations',
        dates: exp.dates || '2018 – Present',
        bullets: exp.bullets.map((b) => b.tailored),
      });
    }
  } else {
    // Parse from markdown lines
    let currentExp: { title: string; company: string; dates: string; bullets: string[] } | null = null;
    let inExpSection = false;

    for (const line of lines) {
      if (line.toLowerCase().includes('experience') || line.toLowerCase().includes('employment') || line.toLowerCase().includes('work history')) {
        inExpSection = true;
        continue;
      }
      if (line.toLowerCase().includes('education') || line.toLowerCase().includes('certifications') || line.toLowerCase().includes('skills')) {
        if (inExpSection && !line.toLowerCase().includes('experience')) {
          inExpSection = false;
        }
      }

      if (inExpSection) {
        if (line.startsWith('###') || (line.startsWith('**') && (line.includes('|') || line.includes('–') || line.includes('-')))) {
          if (currentExp && currentExp.bullets.length > 0) {
            experiences.push(currentExp);
          }
          const cleanTitle = line.replace(/^[#*]+\s*/, '').replace(/[*#]/g, '');
          const parts = cleanTitle.split(/[|–-]/).map((s) => s.trim());
          currentExp = {
            title: parts[0] || 'Technical Specialist',
            company: parts[1] || job.company + ' Operations',
            dates: parts[2] || '2018 – Present',
            bullets: [],
          };
        } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          const bullet = line.replace(/^[-•*]\s*/, '').trim();
          if (bullet && currentExp) {
            currentExp.bullets.push(bullet);
          }
        }
      }
    }
    if (currentExp && currentExp.bullets.length > 0) {
      experiences.push(currentExp);
    }

    // Fallback if parsing yielded no experiences
    if (experiences.length === 0 && tailoredResume.tailoredExperience && tailoredResume.tailoredExperience.length > 0) {
      for (const exp of tailoredResume.tailoredExperience) {
        experiences.push({
          title: exp.role,
          company: exp.company,
          dates: exp.dates || '2018 – Present',
          bullets: exp.bullets.map((b) => b.tailored),
        });
      }
    }
  }

  // Safe fallback if still empty
  if (experiences.length === 0) {
    experiences.push({
      title: profile?.title || 'IT Support & Systems Specialist',
      company: 'Enterprise Technology & Operations',
      dates: '2018 – Present',
      bullets: [
        'Resolved complex hardware, operating system, and SaaS ticket queues across distributed endpoints, upholding a 98% first-touch resolution rate.',
        'Managed computer imaging, Active Directory user provisioning, and device lifecycle management for 500+ endpoints.',
        'Coordinated hardware warranty dispatches, peripheral maintenance, and hardware inventory via enterprise ITSM portals.',
      ],
    });
  }

  // 6. Education
  const education = [
    'Wake Technical Community College — Certificates in Computing Fundamentals & Python Programming',
    'Continuing Professional Education in Network Architecture & Systems Administration',
  ];

  return {
    name,
    contactLine,
    targetRoleLine,
    summary,
    skills,
    experiences,
    education,
    atsKeywords: tailoredResume.atsKeywordsAdded || [],
  };
}

/**
 * ============================================================================
 * EXPORT TAILORED RESUME TO PDF (Single / Multi-page Clean ATS Format)
 * ============================================================================
 */
export async function exportTailoredResumePdf(options: ResumeExportOptions): Promise<void> {
  const data = parseResumeContent(options);
  const doc = new jsPDF({
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
    }
  };

  // 1. Candidate Name (Bold Executive Slate-900)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(data.name.toUpperCase(), margin, y);
  y += 6.5;

  // 2. Contact Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(data.contactLine, margin, y);
  y += 5;

  // 3. Target Role Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text(data.targetRoleLine, margin, y);
  y += 4;

  // Horizontal Rule
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  // Helper for Section Headings
  const renderSectionHeader = (title: string) => {
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    y += 1.8;
    doc.setDrawColor(99, 102, 241); // indigo-500
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + contentWidth, y);
    y += 4.5;
  };

  // 4. Professional Summary
  renderSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59); // slate-800
  const summaryLines = doc.splitTextToSize(data.summary, contentWidth);
  checkPageBreak(summaryLines.length * 4.5);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.6 + 4;

  // 5. Core Competencies & Skills
  renderSectionHeader('Core Competencies & Technical Skills');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  const skillsText = data.skills.join('   •   ');
  const skillsLines = doc.splitTextToSize(skillsText, contentWidth);
  checkPageBreak(skillsLines.length * 4.5);
  doc.text(skillsLines, margin, y);
  y += skillsLines.length * 4.6 + 4;

  // 6. Professional Experience
  renderSectionHeader('Professional Experience');

  for (const exp of data.experiences) {
    checkPageBreak(16);

    // Company & Role Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(exp.title, margin, y);

    // Dates (Right-aligned)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(exp.dates, margin + contentWidth, y, { align: 'right' });
    y += 4.5;

    // Company sub-line
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(67, 56, 202);
    doc.text(exp.company, margin, y);
    y += 4.5;

    // Bullets
    for (const bullet of exp.bullets) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);

      const bulletLines = doc.splitTextToSize(bullet, contentWidth - 6);
      checkPageBreak(bulletLines.length * 4.2 + 2);

      // Bullet dot
      doc.setTextColor(99, 102, 241);
      doc.text('•', margin + 1.5, y);

      // Bullet text
      doc.setTextColor(30, 41, 59);
      doc.text(bulletLines, margin + 5.5, y);
      y += bulletLines.length * 4.2 + 1.5;
    }
    y += 2.5;
  }

  // 7. Education & Certifications
  renderSectionHeader('Education & Technical Certifications');
  for (const edu of data.education) {
    checkPageBreak(6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const eduLines = doc.splitTextToSize(`•  ${edu}`, contentWidth);
    doc.text(eduLines, margin, y);
    y += eduLines.length * 4.2 + 1.5;
  }

  // Running Footer & Page Numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Tailored for ${options.job.company} — ${options.job.title}  |  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 9,
      { align: 'center' }
    );
  }

  const cleanCompany = options.job.company.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanTitle = options.job.title.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Tailored_Resume_${cleanCompany}_${cleanTitle}.pdf`);
}

/**
 * ============================================================================
 * EXPORT TAILORED RESUME TO DOCX (Microsoft Word format)
 * ============================================================================
 */
export async function exportTailoredResumeDocx(options: ResumeExportOptions): Promise<void> {
  const data = parseResumeContent(options);

  const children: Paragraph[] = [
    // Candidate Name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: data.name.toUpperCase(),
          bold: true,
          size: 32, // 16pt
          color: '0F172A',
          font: 'Arial',
        }),
      ],
    }),

    // Contact line
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: data.contactLine,
          size: 19, // 9.5pt
          color: '475569',
          font: 'Arial',
        }),
      ],
    }),

    // Target Role line
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      border: {
        bottom: {
          color: '6366F1',
          space: 6,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
      children: [
        new TextRun({
          text: data.targetRoleLine,
          bold: true,
          size: 20, // 10pt
          color: '4338CA',
          font: 'Arial',
        }),
      ],
    }),

    // SECTION: Professional Summary
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      border: {
        bottom: {
          color: 'CBD5E1',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: 'PROFESSIONAL SUMMARY',
          bold: true,
          size: 22,
          color: '0F172A',
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200, line: 276 },
      children: [
        new TextRun({
          text: data.summary,
          size: 20,
          color: '1E293B',
          font: 'Arial',
        }),
      ],
    }),

    // SECTION: Core Competencies
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      border: {
        bottom: {
          color: 'CBD5E1',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: 'CORE COMPETENCIES & TECHNICAL SKILLS',
          bold: true,
          size: 22,
          color: '0F172A',
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200, line: 260 },
      children: [
        new TextRun({
          text: data.skills.join('  •  '),
          size: 19,
          color: '1E293B',
          font: 'Arial',
        }),
      ],
    }),

    // SECTION: Professional Experience
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
      border: {
        bottom: {
          color: 'CBD5E1',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: 'PROFESSIONAL EXPERIENCE',
          bold: true,
          size: 22,
          color: '0F172A',
          font: 'Arial',
        }),
      ],
    }),
  ];

  // Append Experiences
  for (const exp of data.experiences) {
    children.push(
      new Paragraph({
        spacing: { before: 140, after: 60 },
        children: [
          new TextRun({
            text: `${exp.title}  —  `,
            bold: true,
            size: 21,
            color: '0F172A',
            font: 'Arial',
          }),
          new TextRun({
            text: exp.company,
            bold: true,
            color: '4338CA',
            size: 20,
            font: 'Arial',
          }),
          new TextRun({
            text: `  (${exp.dates})`,
            italics: true,
            size: 19,
            color: '64748B',
            font: 'Arial',
          }),
        ],
      })
    );

    for (const bullet of exp.bullets) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80, line: 260 },
          children: [
            new TextRun({
              text: bullet,
              size: 19,
              color: '1E293B',
              font: 'Arial',
            }),
          ],
        })
      );
    }
  }

  // SECTION: Education
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      border: {
        bottom: {
          color: 'CBD5E1',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: 'EDUCATION & TECHNICAL CERTIFICATIONS',
          bold: true,
          size: 22,
          color: '0F172A',
          font: 'Arial',
        }),
      ],
    })
  );

  for (const edu of data.education) {
    children.push(
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: edu,
            size: 19,
            color: '1E293B',
            font: 'Arial',
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanCompany = options.job.company.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanTitle = options.job.title.replace(/[^a-zA-Z0-9]/g, '_');
  downloadBlob(blob, `Tailored_Resume_${cleanCompany}_${cleanTitle}.docx`);
}

/**
 * ============================================================================
 * EXPORT COVER LETTER TO PDF
 * ============================================================================
 */
export async function exportCoverLetterPdf(options: CoverLetterExportOptions): Promise<void> {
  const { coverLetter, job, profile, editedText } = options;
  const doc = new jsPDF({
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const candidateName = profile?.name || 'Candidate Name';
  const contactLine = extractContactLine(profile, profile?.extractedResumeText);
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Candidate Name Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(candidateName.toUpperCase(), margin, y);
  y += 6;

  // Contact line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(contactLine, margin, y);
  y += 4;

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(dateStr, margin, y);
  y += 7;

  // Recipient / Company
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Hiring Team  •  ${job.company}`, margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(67, 56, 202);
  doc.text(`Position: ${job.title} (${job.workArrangement})`, margin, y);
  y += 8;

  // Cover Letter Body Paragraphs
  const fullText = (editedText || coverLetter.fullText || '').trim();
  const rawParagraphs = fullText.split('\n\n').filter((p) => p.trim().length > 0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);

  for (const para of rawParagraphs) {
    const trimmed = para.trim();
    // Check if this paragraph is a sign-off like "Sincerely,\nJoseph Thomas"
    const lines = doc.splitTextToSize(trimmed, contentWidth);
    
    // Page break guard
    if (y + lines.length * 5 > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
    }

    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  }

  // Running Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Application for ${job.title} at ${job.company}  |  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 9,
      { align: 'center' }
    );
  }

  const cleanCompany = job.company.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Cover_Letter_${cleanCompany}_${cleanName}.pdf`);
}

/**
 * ============================================================================
 * EXPORT COVER LETTER TO DOCX (Microsoft Word format)
 * ============================================================================
 */
export async function exportCoverLetterDocx(options: CoverLetterExportOptions): Promise<void> {
  const { coverLetter, job, profile, editedText } = options;
  const candidateName = profile?.name || 'Candidate Name';
  const contactLine = extractContactLine(profile, profile?.extractedResumeText);
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const fullText = (editedText || coverLetter.fullText || '').trim();
  const rawParagraphs = fullText.split('\n\n').filter((p) => p.trim().length > 0);

  const children: Paragraph[] = [
    // Header Candidate Name
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: candidateName.toUpperCase(),
          bold: true,
          size: 28, // 14pt
          color: '0F172A',
          font: 'Arial',
        }),
      ],
    }),

    // Contact
    new Paragraph({
      spacing: { after: 180 },
      border: {
        bottom: {
          color: 'CBD5E1',
          space: 6,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: contactLine,
          size: 19,
          color: '475569',
          font: 'Arial',
        }),
      ],
    }),

    // Date
    new Paragraph({
      spacing: { before: 140, after: 140 },
      children: [
        new TextRun({
          text: dateStr,
          size: 20,
          color: '475569',
          font: 'Arial',
        }),
      ],
    }),

    // Recipient & Subject
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `Hiring Team  •  ${job.company}`,
          bold: true,
          size: 20,
          color: '0F172A',
          font: 'Arial',
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: `Re: Application for ${job.title} (${job.workArrangement})`,
          bold: true,
          size: 20,
          color: '4338CA',
          font: 'Arial',
        }),
      ],
    }),
  ];

  // Body paragraphs with multi-line sign-off handling
  for (const para of rawParagraphs) {
    const sublines = para.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    if (sublines.length > 1 && (para.toLowerCase().includes('sincerely') || para.toLowerCase().includes('regards') || sublines.length <= 3)) {
      for (let idx = 0; idx < sublines.length; idx++) {
        const line = sublines[idx];
        children.push(
          new Paragraph({
            spacing: { after: idx === sublines.length - 1 ? 160 : 40, line: 260 },
            children: [
              new TextRun({
                text: line,
                size: 21,
                color: '1E293B',
                font: 'Arial',
                bold: idx > 0 && line.length < 40,
              }),
            ],
          })
        );
      }
    } else {
      children.push(
        new Paragraph({
          spacing: { after: 180, line: 276 },
          children: [
            new TextRun({
              text: para.trim().replace(/\n/g, ' '),
              size: 21,
              color: '1E293B',
              font: 'Arial',
            }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.85),
              bottom: convertInchesToTwip(0.85),
              left: convertInchesToTwip(0.85),
              right: convertInchesToTwip(0.85),
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanCompany = job.company.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
  downloadBlob(blob, `Cover_Letter_${cleanCompany}_${cleanName}.docx`);
}

/**
 * Universal browser file downloader
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
