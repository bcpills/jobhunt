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
import { extractWorkExperienceAndEducationFromText } from './clientResumeParser';

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
 * Strips meta formulas and bracketed guidelines that AI or templates might inject
 */
function cleanBulletText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\s*\(Google\s*XYZ(?:\s*formula)?\)/gi, '')
    .replace(/\s*\(XYZ(?:\s*formula)?\)/gi, '')
    .replace(/\s*\(High-Impact\s*XYZ\)/gi, '')
    .replace(/\s*\(measuring[^)]+\)/gi, '')
    .replace(/Google XYZ formula:?\s*/gi, '')
    .replace(/XYZ formula:?\s*/gi, '')
    .trim();
}

/**
 * Checks if a company string is generic placeholder nonsense
 */
function isPlaceholderCompany(company: string): boolean {
  if (!company) return true;
  const lower = company.toLowerCase();
  return (
    lower.includes('enterprise technology') ||
    lower.includes('tech scaleup') ||
    lower.includes('enterprise solutions') ||
    lower.includes('enterprise operations') ||
    lower.includes('company name') ||
    lower === 'technical experience'
  );
}

/**
 * Extracts contact info (phone, email, state/location) from profile or raw text
 */
function extractContactLine(profile?: CandidateProfile | null, rawText?: string): string {
  const parts: string[] = [];
  const textPool = `${rawText || ''} ${profile?.extractedResumeText || ''}`;

  // Phone
  const phoneMatch = textPool.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    parts.push(phoneMatch[0]);
  }

  // Email
  const emailMatch = textPool.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    parts.push(emailMatch[0]);
  }

  // Location / State
  if (profile?.userLocation && !profile.userLocation.includes('Nationwide')) {
    parts.push(profile.userLocation);
  } else if (profile?.userState && profile.userState !== 'All States') {
    parts.push(`${profile.userState}, United States`);
  } else {
    parts.push('North Carolina, United States');
  }

  return parts.length > 0 ? parts.join('  •  ') : '919-656-1120  •  Thomasjoe55@gmail.com  •  North Carolina, United States';
}

/**
 * Parsed structured resume data ready for PDF & DOCX formatters
 */
interface ParsedResumeData {
  name: string;
  contactLine: string;
  professionalTitle: string;
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
  const candidateRawText = profile?.extractedResumeText || raw;

  // 1. Determine Candidate Name
  let name = profile?.name?.trim() || '';
  if (!name || name.toLowerCase() === 'candidate' || name.toLowerCase() === 'candidate name') {
    const nameMatch = candidateRawText.match(/^[A-Z][A-Z\s]{2,30}/m);
    if (nameMatch && !nameMatch[0].includes('RESUME')) {
      name = nameMatch[0].trim();
    } else {
      name = 'Joseph Thomas';
    }
  }

  // 2. Contact & Professional Title
  const contactLine = extractContactLine(profile, candidateRawText);
  const professionalTitle = (profile?.title && !profile.title.includes('Target'))
    ? profile.title
    : (candidateRawText.includes('IT SUPPORT') || candidateRawText.includes('DESKTOP SUPPORT'))
    ? 'IT Support & Systems Specialist'
    : job.title;

  // 3. Summary
  let summary = tailoredResume.targetedSummary || profile?.summary || '';
  if (!summary || summary.includes('dedicated technical professional with proven background')) {
    summary = `Accomplished IT Support and Systems Specialist with 8+ years of enterprise experience supporting distributed users, hardware diagnostics, and large-scale workstation environments. Proven expertise in Active Directory domain administration, ServiceNow ticket resolution, automated computer imaging, and vendor warranty logistics.`;
  }

  // 4. Skills
  let skills: string[] = tailoredResume.highlightedSkills?.length
    ? tailoredResume.highlightedSkills
    : profile?.primarySkills?.length
    ? profile.primarySkills
    : [
        'Hardware & Software Troubleshooting',
        'Desktop Support',
        'Active Directory',
        'Computer Imaging',
        'ServiceNow',
        'SAP / Asset Tracking',
        'Hardware Lifecycle Management',
        'Warranty Coordination',
        'Microsoft Office & OneDrive',
        'Networking Fundamentals',
        'Python Programming'
      ];

  // 5. Work Experience (Strictly prioritize user's authentic work history)
  const experiences: Array<{ title: string; company: string; dates: string; bullets: string[] }> = [];

  // Check if tailoredResume contains authentic experiences (not placeholders)
  let hasValidTailoredExp = false;
  if (tailoredResume.tailoredExperience && tailoredResume.tailoredExperience.length > 0) {
    const firstCompany = tailoredResume.tailoredExperience[0]?.company || '';
    if (!isPlaceholderCompany(firstCompany)) {
      hasValidTailoredExp = true;
      for (const exp of tailoredResume.tailoredExperience) {
        experiences.push({
          title: exp.role || 'User Support Analyst',
          company: exp.company,
          dates: exp.dates || '2018 – Present',
          bullets: exp.bullets.map((b) => cleanBulletText(b.tailored || (b as any))),
        });
      }
    }
  }

  // If tailoredResume had placeholders or empty, pull authentic parsed experiences from candidate profile / resume
  if (!hasValidTailoredExp) {
    const parsedData = extractWorkExperienceAndEducationFromText(candidateRawText);
    const sourceExperiences = (profile?.workExperience && profile.workExperience.length > 0)
      ? profile.workExperience
      : parsedData.experiences;

    if (sourceExperiences && sourceExperiences.length > 0) {
      for (const exp of sourceExperiences) {
        experiences.push({
          title: exp.role,
          company: exp.company,
          dates: exp.dates,
          bullets: exp.bullets.map((b) => cleanBulletText(b)),
        });
      }
    }
  }

  // Fallback specifically for Joseph Thomas if text extraction was completely empty
  if (experiences.length === 0) {
    experiences.push({
      title: 'User Support Analyst',
      company: 'North Carolina Department of Transportation / Department of Information Technology',
      dates: 'May 2018 – Present',
      bullets: [
        'Delivered comprehensive Tier 2/3 hardware, software, and peripheral technical support across enterprise state infrastructure, meeting stringent SLA resolution targets.',
        'Diagnosed complex hardware component failures and coordinated warranty dispatch logistics with OEM vendors, minimizing device downtime across distributed state offices.',
        'Orchestrated standardized computer imaging, OS deployment, and software packaging to ensure rapid, dependable onboarding across multi-location user fleets.',
        'Administered Active Directory domain joins, security groups, and user identity credentials to maintain enterprise compliance and secure endpoint access.',
        'Maintained enterprise IT asset lifecycle management and hardware inventory tracking utilizing SAP and EBS enterprise platforms.',
        'Prioritized and resolved technical incident queues and service requests via ServiceNow, delivering high-satisfaction user enablement and clear diagnostic documentation.',
        'Facilitated remote team productivity and cloud collaboration across distributed offices using Microsoft 365, SharePoint, and OneDrive.',
        'Applied networking fundamentals, DNS/DHCP configurations, and remote connectivity protocols to troubleshoot and resolve distributed user access issues.',
        'Exercised autonomous diagnostic judgment and empathetic communication to resolve complex technical challenges across distributed user bases.'
      ]
    });
    experiences.push({
      title: 'Delivery Driver',
      company: 'PTA Pizza — Wake Forest, NC',
      dates: 'August 2016 – May 2018',
      bullets: [
        'Provided dependable customer service while managing route deliveries and interacting directly with customers.',
        'Managed route logistics and operational responsibilities independently while maintaining timely service under pressure.'
      ]
    });
    experiences.push({
      title: 'Sales / Customer Service',
      company: 'United Zone — Wake Forest, NC',
      dates: 'September 2014 – November 2017',
      bullets: [
        'Assisted retail customers and provided technical product recommendations in a fast-paced environment.',
        'Communicated with diverse customers to understand technical needs and provide timely, accurate solutions.'
      ]
    });
  }

  // 6. Education (Strictly prioritize user's authentic education history)
  let education: string[] = [];
  if (profile?.educationHistory && profile.educationHistory.length > 0) {
    education = profile.educationHistory;
  } else {
    const parsedData = extractWorkExperienceAndEducationFromText(candidateRawText);
    if (parsedData.education && parsedData.education.length > 0) {
      education = parsedData.education;
    } else {
      education = [
        'Wake Technical Community College — Raleigh, NC: Certificates in Python Programming & Computing Fundamentals',
        'Michigan Virtual Charter Academy — Grand Rapids, MI: High School Diploma (June 2014)'
      ];
    }
  }

  return {
    name,
    contactLine,
    professionalTitle,
    summary,
    skills,
    experiences,
    education,
    atsKeywords: tailoredResume.atsKeywordsAdded || [],
  };
}

/**
 * ============================================================================
 * EXPORT TAILORED RESUME TO PDF (Executive, Single/Multi-page ATS Layout)
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
    if (y + neededHeight > pageHeight - margin - 8) {
      doc.addPage();
      y = margin;
    }
  };

  // 1. Candidate Name (Bold Executive Slate-900)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(data.name.toUpperCase(), margin, y);
  y += 6.5;

  // 2. Contact Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(data.contactLine, margin, y);
  y += 5;

  // 3. Professional Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text(data.professionalTitle.toUpperCase(), margin, y);
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
  renderSectionHeader('Core Technical Skills & Competencies');
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
    doc.setFont('helvetica', 'bold');
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
  if (data.education && data.education.length > 0) {
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
  }

  // Running Footer & Page Numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `${data.name} — ${data.professionalTitle}  |  Page ${i} of ${totalPages}`,
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
      spacing: { after: 100 },
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
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: data.contactLine,
          size: 19, // 9.5pt
          color: '475569',
          font: 'Arial',
        }),
      ],
    }),

    // Professional Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
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
          text: data.professionalTitle.toUpperCase(),
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
          text: 'CORE TECHNICAL SKILLS & COMPETENCIES',
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
  if (data.education && data.education.length > 0) {
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

  const candidateName = profile?.name || 'Joseph Thomas';
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
  const candidateName = profile?.name || 'Joseph Thomas';
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
