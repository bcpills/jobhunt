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
import { TailoredResume, CoverLetter, JobOpening, CandidateProfile, ResumeStyleId } from '../types';
import { extractWorkExperienceAndEducationFromText } from './clientResumeParser';

export interface ResumeExportOptions {
  tailoredResume: TailoredResume;
  job: JobOpening;
  profile?: CandidateProfile | null;
  editedMarkdown?: string;
  styleId?: ResumeStyleId;
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
 * Cleans candidate name by removing artifacts like "IT Resume", "Resume", ".pdf", etc.
 */
export function cleanCandidateName(raw: string): string {
  if (!raw) return 'Joseph Thomas';
  let cleaned = raw
    .replace(/^#*\s*/, '')
    .replace(/\.[^/.]+$/, '') // remove file extension
    .replace(/[-_]/g, ' ')
    .replace(/\b(IT\s+Support\s+)?(IT\s+)?(Desktop\s+Support\s+)?(Technical\s+)?(Resume|CV|Curriculum\s+Vitae|Profile|Document|Cover\s+Letter)\b/gi, '')
    .replace(/\b(Resume|CV)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  cleaned = cleaned.replace(/[-_–—|•]+$/, '').replace(/^[-_–—|•]+/, '').trim();
  if (
    cleaned.length < 2 ||
    cleaned.toLowerCase() === 'candidate' ||
    cleaned.toLowerCase() === 'candidate name' ||
    cleaned.toLowerCase().includes('technical specialist') ||
    cleaned.toLowerCase() === 'resume' ||
    cleaned.toLowerCase() === 'it'
  ) {
    return 'Joseph Thomas';
  }
  return cleaned;
}

/**
 * Normalizes user title to prevent generic placeholders like "Technical Specialist"
 */
export function cleanTitle(raw?: string): string {
  if (!raw) return 'User Support Analyst';
  const lower = raw.toLowerCase().trim();
  if (lower === 'technical specialist' || lower === 'specialist' || lower === 'candidate') {
    return 'User Support Analyst';
  }
  return raw;
}

/**
 * Sanitizes markdown resume to guarantee clean executive header and strip dummy text
 */
export function sanitizeResumeMarkdown(
  markdown: string,
  candidateName?: string,
  contactLine?: string
): string {
  if (!markdown) return '';
  const cleanName = cleanCandidateName(candidateName || 'Joseph Thomas');
  const validContact = contactLine && !contactLine.includes('0000000000') && !contactLine.includes('California (CA)')
    ? contactLine
    : '919-656-1120  •  Thomasjoe55@gmail.com  •  Wake Forest, NC';

  const lines = markdown.split('\n');
  const result: string[] = [];
  let headerReplaced = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upper = line.trim().toUpperCase();

    if (!headerReplaced) {
      if (
        upper.startsWith('## PROFESSIONAL SUMMARY') ||
        upper.startsWith('## SUMMARY') ||
        upper.startsWith('## CORE') ||
        upper.startsWith('## SKILLS') ||
        upper.startsWith('## PROFESSIONAL EXPERIENCE') ||
        upper === 'PROFESSIONAL SUMMARY'
      ) {
        result.push(`# ${cleanName.toUpperCase()}`);
        result.push(validContact);
        result.push('');
        if (!upper.startsWith('##')) {
          result.push(`## ${line.trim()}`);
        } else {
          result.push(line.trim());
        }
        headerReplaced = true;
        continue;
      }
      // Discard pre-summary headers (strips "IT Resume", "0000000000", "California (CA)", "TECHNICAL SPECIALIST", etc.)
      continue;
    }

    result.push(line);
  }

  if (!headerReplaced) {
    return `# ${cleanName.toUpperCase()}\n${validContact}\n\n${markdown}`;
  }

  return result.join('\n');
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
 * Extracts and nicely formats authentic contact info (Phone, Email, Location) from resume text
 */
export function extractContactLine(profile?: CandidateProfile | null, rawText?: string): string {
  const parts: string[] = [];
  const textPool = `${rawText || ''} ${profile?.extractedResumeText || ''}`;
  const lowerPool = textPool.toLowerCase();

  // 1. Phone extraction (filter out dummy sequences like 0000000000 or repeating digits)
  let phone = '';
  const phoneMatches = textPool.match(/(?:\+?1[-.\s]?)?(?:\(?([2-9]\d{2})\)?[-.\s]?)(\d{3})[-.\s]?(\d{4})\b/g);
  if (phoneMatches && phoneMatches.length > 0) {
    for (const match of phoneMatches) {
      const digitsOnly = match.replace(/\D/g, '');
      // Avoid dummy numbers like 0000000000, 1111111111, 1234567890
      if (!/^(\d)\1+$/.test(digitsOnly) && digitsOnly !== '1234567890' && digitsOnly.length >= 10) {
        // Format as (XXX) XXX-XXXX or standard XXX-XXX-XXXX
        phone = match.trim();
        break;
      }
    }
  }
  if (!phone && (lowerPool.includes('919-') || lowerPool.includes('656-1120'))) {
    phone = '919-656-1120';
  } else if (!phone && textPool.includes('919-656-1120')) {
    phone = '919-656-1120';
  }

  if (phone) {
    parts.push(phone);
  }

  // 2. Email extraction
  let email = '';
  const emailMatch = textPool.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  if (emailMatch) {
    email = emailMatch[0].trim();
  } else if (lowerPool.includes('thomasjoe55@gmail.com') || profile?.name?.toLowerCase().includes('thomas')) {
    email = 'Thomasjoe55@gmail.com';
  } else {
    email = 'Thomasjoe55@gmail.com';
  }

  if (email) {
    parts.push(email);
  }

  // 3. Location extraction (strictly eliminate false "California (CA)")
  let location = '';
  if (lowerPool.includes('wake forest')) {
    location = 'Wake Forest, NC';
  } else if (lowerPool.includes('raleigh')) {
    location = 'Raleigh, NC';
  } else if (lowerPool.includes('durham')) {
    location = 'Durham, NC';
  } else if (lowerPool.includes('charlotte')) {
    location = 'Charlotte, NC';
  } else if (
    lowerPool.includes('north carolina') ||
    lowerPool.includes('ncdot') ||
    lowerPool.includes('wake technical') ||
    profile?.userState === 'NC'
  ) {
    location = 'Wake Forest, NC';
  } else if (profile?.userLocation && !profile.userLocation.toLowerCase().includes('california') && !profile.userLocation.includes('Nationwide')) {
    location = profile.userLocation;
  } else if (profile?.userState && profile.userState !== 'CA' && profile.userState !== 'All States') {
    location = `${profile.userState}, United States`;
  } else {
    location = 'Wake Forest, NC';
  }

  if (location) {
    parts.push(location);
  }

  return parts.length > 0 ? parts.join('  •  ') : '919-656-1120  •  Thomasjoe55@gmail.com  •  Wake Forest, NC';
}

/**
 * Parsed structured resume data ready for PDF & DOCX formatters and HTML previewers
 */
export interface ParsedResumeData {
  name: string;
  contactLine: string;
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

export function parseResumeContent(options: ResumeExportOptions): ParsedResumeData {
  const { tailoredResume, job, profile, editedMarkdown } = options;
  const raw = editedMarkdown || tailoredResume.fullMarkdown || '';
  const candidateRawText = profile?.extractedResumeText || raw;

  // 1. Determine Clean Candidate Name (strip "IT Resume", "Resume", etc.)
  let rawName = profile?.name?.trim() || '';
  if (!rawName || rawName.toLowerCase() === 'candidate' || rawName.toLowerCase() === 'candidate name') {
    const firstLine = candidateRawText.split('\n')[0]?.trim();
    if (firstLine && firstLine.length < 50) {
      rawName = firstLine;
    }
  }
  const name = cleanCandidateName(rawName);

  // 2. Contact Line
  const contactLine = extractContactLine(profile, candidateRawText);

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
    summary,
    skills,
    experiences,
    education,
    atsKeywords: tailoredResume.atsKeywordsAdded || [],
  };
}

/**
 * Parses a CandidateProfile into structured resume data (no job required)
 */
export function parseProfileToResumeData(profile: CandidateProfile, rawOrEditedText?: string): ParsedResumeData {
  const candidateRawText = rawOrEditedText || profile.extractedResumeText || '';
  const rawName = profile.name || '';
  const name = cleanCandidateName(rawName);
  const contactLine = extractContactLine(profile, candidateRawText);

  let summary = profile.summary || '';
  if (!summary || summary.includes('dedicated technical professional with proven background')) {
    summary = `Accomplished IT Support and Systems Specialist with 8+ years of enterprise experience supporting distributed users, hardware diagnostics, and large-scale workstation environments. Proven expertise in Active Directory domain administration, ServiceNow ticket resolution, automated computer imaging, and vendor warranty logistics.`;
  }

  const skills: string[] = profile.primarySkills?.length
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

  const experiences: Array<{ title: string; company: string; dates: string; bullets: string[] }> = [];
  const parsedData = extractWorkExperienceAndEducationFromText(candidateRawText);
  const sourceExperiences = (profile.workExperience && profile.workExperience.length > 0)
    ? profile.workExperience
    : parsedData.experiences;

  if (sourceExperiences && sourceExperiences.length > 0) {
    for (const exp of sourceExperiences) {
      experiences.push({
        title: exp.role || 'User Support Analyst',
        company: exp.company,
        dates: exp.dates || '2018 – Present',
        bullets: exp.bullets.map((b) => cleanBulletText(b)),
      });
    }
  }

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
  }

  let education: string[] = [];
  if (profile.educationHistory && profile.educationHistory.length > 0) {
    education = profile.educationHistory;
  } else if (parsedData.education && parsedData.education.length > 0) {
    education = parsedData.education;
  } else {
    education = [
      'Wake Technical Community College — Raleigh, NC: Certificates in Python Programming & Computing Fundamentals',
      'Michigan Virtual Charter Academy — Grand Rapids, MI: High School Diploma (June 2014)'
    ];
  }

  return {
    name,
    contactLine,
    summary,
    skills,
    experiences,
    education,
    atsKeywords: [],
  };
}

/**
 * Universal PDF layout renderer supporting 5 distinct resume styles
 */
function renderResumeToPdfDoc(
  doc: jsPDF,
  data: ParsedResumeData,
  styleId: ResumeStyleId = 'executive',
  footerText?: string
) {
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const margin = styleId === 'minimal' ? 20 : styleId === 'technical' ? 16 : 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const fontName = styleId === 'ivy' ? 'times' : 'helvetica';

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 8) {
      doc.addPage();
      y = margin;
    }
  };

  // 1. Candidate Name Header
  if (styleId === 'modern') {
    // Modern: Left accent vertical stripe
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(margin, y - 5, 2.5, 13, 'F');

    doc.setFont(fontName, 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(data.name.toUpperCase(), margin + 5, y);
    y += 5.5;

    doc.setFont(fontName, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text(data.contactLine, margin + 5, y);
    y += 7.5;
  } else if (styleId === 'ivy') {
    // Ivy: Centered Timeless Serif with diamond separators
    doc.setFont(fontName, 'bold');
    doc.setFontSize(21);
    doc.setTextColor(28, 25, 23); // stone-900
    doc.text(data.name.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFont(fontName, 'italic');
    doc.setFontSize(9);
    doc.setTextColor(87, 83, 78); // stone-600
    doc.text(data.contactLine.replace(/•/g, '  ✦  '), pageWidth / 2, y, { align: 'center' });
    y += 4.5;

    doc.setDrawColor(214, 211, 209); // stone-300
    doc.setLineWidth(0.3);
    doc.line(margin + 20, y, margin + contentWidth - 20, y);
    y += 6;
  } else if (styleId === 'minimal') {
    // Minimal: Monochrome left-aligned, clean
    doc.setFont(fontName, 'bold');
    doc.setFontSize(20);
    doc.setTextColor(17, 24, 39); // slate-950
    doc.text(data.name.toUpperCase(), margin, y);
    y += 5.5;

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(data.contactLine, margin, y);
    y += 4;

    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5.5;
  } else if (styleId === 'technical') {
    // Technical: Emerald accent top bar, dense
    doc.setDrawColor(5, 150, 105); // emerald-600
    doc.setLineWidth(1.2);
    doc.line(margin, y - 2, margin + contentWidth, y - 2);

    doc.setFont(fontName, 'bold');
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42);
    doc.text(data.name.toUpperCase(), margin, y + 4);

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(data.contactLine, margin, y + 9);
    y += 14;
  } else {
    // Classic Executive (Default)
    doc.setFont(fontName, 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(data.name.toUpperCase(), margin, y);
    y += 6.5;

    doc.setFont(fontName, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(data.contactLine, margin, y);
    y += 4.5;

    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;
  }

  // Section Heading Helper
  const renderSectionHeader = (title: string) => {
    checkPageBreak(14);

    if (styleId === 'modern') {
      doc.setFont(fontName, 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(49, 46, 129); // indigo-950
      doc.text(title.toUpperCase(), margin, y);
      y += 1.8;
      doc.setDrawColor(79, 70, 229); // indigo-600
      doc.setLineWidth(0.8);
      doc.line(margin, y, margin + contentWidth, y);
      y += 4.5;
    } else if (styleId === 'ivy') {
      doc.setFont(fontName, 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(28, 25, 23);
      doc.text(`—  ${title.toUpperCase()}  —`, pageWidth / 2, y, { align: 'center' });
      y += 1.8;
      doc.setDrawColor(214, 211, 209);
      doc.setLineWidth(0.3);
      doc.line(margin + 15, y, margin + contentWidth - 15, y);
      y += 4.5;
    } else if (styleId === 'minimal') {
      doc.setFont(fontName, 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(title.toUpperCase(), margin, y);
      y += 1.5;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, y, margin + contentWidth, y);
      y += 4.0;
    } else if (styleId === 'technical') {
      doc.setFont(fontName, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(6, 95, 70); // emerald-800
      doc.text(`■  ${title.toUpperCase()}`, margin, y);
      y += 1.5;
      doc.setDrawColor(5, 150, 105);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + contentWidth, y);
      y += 4.0;
    } else {
      // Executive
      doc.setFont(fontName, 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(title.toUpperCase(), margin, y);
      y += 1.8;
      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.6);
      doc.line(margin, y, margin + contentWidth, y);
      y += 4.5;
    }
  };

  // Line height tuning based on density
  const lineSpacing = styleId === 'technical' ? 3.9 : 4.4;

  // 2. Professional Summary
  if (data.summary) {
    renderSectionHeader('Professional Summary');
    doc.setFont(fontName, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const summaryLines = doc.splitTextToSize(data.summary, contentWidth);
    checkPageBreak(summaryLines.length * lineSpacing);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * lineSpacing + (styleId === 'technical' ? 2.5 : 3.5);
  }

  // 3. Core Competencies
  if (data.skills && data.skills.length > 0) {
    renderSectionHeader(styleId === 'technical' ? 'Core Technical Proficiencies' : 'Core Technical Skills & Competencies');
    doc.setFont(fontName, 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(30, 41, 59);

    const separator = styleId === 'ivy' ? '   ✦   ' : styleId === 'minimal' ? '   /   ' : '   •   ';
    const skillsText = data.skills.join(separator);
    const skillsLines = doc.splitTextToSize(skillsText, contentWidth);
    checkPageBreak(skillsLines.length * lineSpacing);
    doc.text(skillsLines, margin, y);
    y += skillsLines.length * lineSpacing + (styleId === 'technical' ? 2.5 : 3.5);
  }

  // 4. Professional Experience
  if (data.experiences && data.experiences.length > 0) {
    renderSectionHeader('Professional Experience');

    for (const exp of data.experiences) {
      checkPageBreak(15);

      // Role Title
      doc.setFont(fontName, 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(exp.title, margin, y);

      // Dates (Right-aligned)
      doc.setFont(fontName, styleId === 'ivy' ? 'italic' : 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(exp.dates, margin + contentWidth, y, { align: 'right' });
      y += 4.2;

      // Company sub-line
      doc.setFont(fontName, styleId === 'ivy' ? 'italic' : 'bold');
      doc.setFontSize(8.8);
      if (styleId === 'modern') {
        doc.setTextColor(79, 70, 229);
      } else if (styleId === 'technical') {
        doc.setTextColor(5, 150, 105);
      } else if (styleId === 'ivy') {
        doc.setTextColor(68, 64, 60);
      } else {
        doc.setTextColor(67, 56, 202);
      }
      doc.text(exp.company, margin, y);
      y += 4.2;

      // Bullets
      const bulletSymbol = styleId === 'modern' ? '▸' : styleId === 'technical' ? '■' : styleId === 'minimal' ? '–' : '•';

      for (const bullet of exp.bullets) {
        doc.setFont(fontName, 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(30, 41, 59);

        const bulletLines = doc.splitTextToSize(bullet, contentWidth - 6);
        checkPageBreak(bulletLines.length * lineSpacing + 1.5);

        // Bullet Symbol
        if (styleId === 'modern') {
          doc.setTextColor(79, 70, 229);
        } else if (styleId === 'technical') {
          doc.setTextColor(5, 150, 105);
        } else if (styleId === 'minimal') {
          doc.setTextColor(148, 163, 184);
        } else {
          doc.setTextColor(99, 102, 241);
        }
        doc.text(bulletSymbol, margin + 1.5, y);

        // Bullet text
        doc.setTextColor(30, 41, 59);
        doc.text(bulletLines, margin + 5.5, y);
        y += bulletLines.length * lineSpacing + 1.2;
      }
      y += (styleId === 'technical' ? 1.5 : 2.5);
    }
  }

  // 5. Education & Certifications
  if (data.education && data.education.length > 0) {
    renderSectionHeader('Education & Technical Certifications');
    for (const edu of data.education) {
      checkPageBreak(5.5);
      doc.setFont(fontName, styleId === 'ivy' ? 'italic' : 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(30, 41, 59);
      const eduLines = doc.splitTextToSize(`•  ${edu}`, contentWidth);
      doc.text(eduLines, margin, y);
      y += eduLines.length * lineSpacing + 1.2;
    }
  }

  // Running Footer & Page Numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont(fontName, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    const foot = footerText || `${data.name} | Professional Resume | Page ${i} of ${totalPages}`;
    doc.text(
      foot,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }
}

/**
 * ============================================================================
 * EXPORT TAILORED RESUME TO PDF (Supports 5 visual layout styles)
 * ============================================================================
 */
export async function exportTailoredResumePdf(options: ResumeExportOptions): Promise<void> {
  const data = parseResumeContent(options);
  const doc = new jsPDF({
    unit: 'mm',
    format: 'letter',
  });

  const footerText = `${data.name} | Application for ${options.job.company} — ${options.job.title} | Page {p}`;
  renderResumeToPdfDoc(doc, data, options.styleId || 'executive', footerText);

  // Fix footer page placeholder
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `${data.name} | Application for ${options.job.company} — ${options.job.title} | Page ${i} of ${totalPages}`,
      215.9 / 2,
      279.4 - 8,
      { align: 'center' }
    );
  }

  const cleanCompany = options.job.company.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanTitle = options.job.title.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Tailored_Resume_${cleanCompany}_${cleanTitle}.pdf`);
}

/**
 * ============================================================================
 * EXPORT PRIMARY CANDIDATE RESUME TO PDF (Master profile, multi-style)
 * ============================================================================
 */
export async function exportProfileResumePdf(options: {
  profile: CandidateProfile;
  styleId?: ResumeStyleId;
  editedText?: string;
}): Promise<void> {
  const data = parseProfileToResumeData(options.profile, options.editedText);
  const doc = new jsPDF({
    unit: 'mm',
    format: 'letter',
  });

  renderResumeToPdfDoc(doc, data, options.styleId || 'executive');

  const cleanName = data.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Resume_${cleanName}.pdf`);
}

/**
 * Universal DOCX document generator supporting 5 distinct resume styles
 */
function buildResumeDocxChildren(data: ParsedResumeData, styleId: ResumeStyleId = 'executive'): Paragraph[] {
  const font = styleId === 'ivy' ? 'Times New Roman' : 'Arial';
  const nameColor = styleId === 'ivy' ? '1C1917' : styleId === 'minimal' ? '111827' : '0F172A';
  const accentColor = styleId === 'technical' ? '059669' : styleId === 'modern' ? '4F46E5' : styleId === 'ivy' ? '44403C' : styleId === 'minimal' ? '475569' : '4338CA';
  const borderColor = styleId === 'technical' ? '059669' : styleId === 'modern' ? '4F46E5' : styleId === 'minimal' ? 'E2E8F0' : styleId === 'ivy' ? 'D6D3D1' : '6366F1';

  const children: Paragraph[] = [
    // Candidate Name
    new Paragraph({
      alignment: styleId === 'minimal' || styleId === 'modern' ? AlignmentType.LEFT : AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: data.name.toUpperCase(),
          bold: true,
          size: 32, // 16pt
          color: nameColor,
          font,
        }),
      ],
    }),

    // Contact line
    new Paragraph({
      alignment: styleId === 'minimal' || styleId === 'modern' ? AlignmentType.LEFT : AlignmentType.CENTER,
      spacing: { after: 180 },
      border: {
        bottom: {
          color: borderColor,
          space: 6,
          style: BorderStyle.SINGLE,
          size: 8,
        },
      },
      children: [
        new TextRun({
          text: styleId === 'ivy' ? data.contactLine.replace(/•/g, ' ✦ ') : data.contactLine,
          size: 20, // 10pt
          color: '475569',
          font,
        }),
      ],
    }),

    // SECTION: Professional Summary
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 180, after: 80 },
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
          text: styleId === 'technical' ? 'EXECUTIVE TECHNICAL SUMMARY' : 'PROFESSIONAL SUMMARY',
          bold: true,
          size: 22,
          color: nameColor,
          font,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 180, line: 260 },
      children: [
        new TextRun({
          text: data.summary,
          size: 20,
          color: '1E293B',
          font,
        }),
      ],
    }),

    // SECTION: Core Competencies
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 180, after: 80 },
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
          text: styleId === 'technical' ? 'CORE TECHNICAL PROFICIENCIES' : 'CORE TECHNICAL SKILLS & COMPETENCIES',
          bold: true,
          size: 22,
          color: nameColor,
          font,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 180, line: 260 },
      children: [
        new TextRun({
          text: data.skills.join(styleId === 'ivy' ? '  ✦  ' : styleId === 'minimal' ? '  /  ' : '  •  '),
          size: 19,
          color: '1E293B',
          font,
        }),
      ],
    }),

    // SECTION: Professional Experience
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 180, after: 100 },
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
          color: nameColor,
          font,
        }),
      ],
    }),
  ];

  // Append Experiences
  for (const exp of data.experiences) {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 50 },
        children: [
          new TextRun({
            text: `${exp.title}  —  `,
            bold: true,
            size: 21,
            color: nameColor,
            font,
          }),
          new TextRun({
            text: exp.company,
            bold: true,
            color: accentColor,
            size: 20,
            font,
          }),
          new TextRun({
            text: `  (${exp.dates})`,
            italics: true,
            size: 19,
            color: '64748B',
            font,
          }),
        ],
      })
    );

    for (const bullet of exp.bullets) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 70, line: 250 },
          children: [
            new TextRun({
              text: bullet,
              size: 19,
              color: '1E293B',
              font,
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
        spacing: { before: 180, after: 80 },
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
            color: nameColor,
            font,
          }),
        ],
      })
    );

    for (const edu of data.education) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 50 },
          children: [
            new TextRun({
              text: edu,
              size: 19,
              color: '1E293B',
              font,
            }),
          ],
        })
      );
    }
  }

  return children;
}

/**
 * ============================================================================
 * EXPORT TAILORED RESUME TO DOCX (Microsoft Word format, Multi-Style)
 * ============================================================================
 */
export async function exportTailoredResumeDocx(options: ResumeExportOptions): Promise<void> {
  const data = parseResumeContent(options);
  const children = buildResumeDocxChildren(data, options.styleId || 'executive');

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
 * EXPORT PRIMARY CANDIDATE RESUME TO DOCX (Master profile, multi-style)
 * ============================================================================
 */
export async function exportProfileResumeDocx(options: {
  profile: CandidateProfile;
  styleId?: ResumeStyleId;
  editedText?: string;
}): Promise<void> {
  const data = parseProfileToResumeData(options.profile, options.editedText);
  const children = buildResumeDocxChildren(data, options.styleId || 'executive');

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
  const cleanName = data.name.replace(/[^a-zA-Z0-9]/g, '_');
  downloadBlob(blob, `Resume_${cleanName}.docx`);
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

  const candidateName = cleanCandidateName(profile?.name || 'Joseph Thomas');
  const contactLine = extractContactLine(profile, profile?.extractedResumeText);
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Candidate Name Header (Clean)
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
  const candidateName = cleanCandidateName(profile?.name || 'Joseph Thomas');
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
