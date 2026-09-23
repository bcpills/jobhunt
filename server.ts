import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: safe JSON parsing
function cleanAndParseJSON(text: string): any {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Try regex extraction of the first object or array
    const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw err;
  }
}

// Helper: heuristic resume parser when LLM or multimodal analysis is unavailable
function extractFallbackProfileFromText(text: string, fileName?: string): any {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';
  const secondLine = lines[1] || '';

  // Extract name: clean line without pipes or emails
  let extractedName = firstLine.split('|')[0].split('•')[0].trim();
  if (extractedName.length > 40 || extractedName.includes('@') || !extractedName) {
    extractedName = fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Candidate';
  }

  // Detect seniority
  const lowerText = text.toLowerCase();
  let seniority: 'Junior' | 'Mid-Level' | 'Senior' | 'Staff/Lead' | 'Director/Executive' = 'Senior';
  if (lowerText.includes('director') || lowerText.includes('vp ') || lowerText.includes('head of')) {
    seniority = 'Director/Executive';
  } else if (lowerText.includes('staff') || lowerText.includes('principal') || lowerText.includes('lead')) {
    seniority = 'Staff/Lead';
  } else if (lowerText.includes('junior') || lowerText.includes('intern') || lowerText.includes('entry')) {
    seniority = 'Junior';
  } else if (lowerText.includes('mid') || lowerText.includes('associate')) {
    seniority = 'Mid-Level';
  }

  // Detect title
  let detectedTitle = 'Software Engineer';
  if (lowerText.includes('product manager') || lowerText.includes('senior product')) {
    detectedTitle = 'Senior Product Manager';
  } else if (lowerText.includes('machine learning') || lowerText.includes('data engineer') || lowerText.includes('data scientist')) {
    detectedTitle = 'Senior Data & Machine Learning Engineer';
  } else if (lowerText.includes('frontend') || lowerText.includes('react')) {
    detectedTitle = 'Senior Frontend Engineer';
  } else if (lowerText.includes('full-stack') || lowerText.includes('fullstack')) {
    detectedTitle = 'Senior Full-Stack Engineer';
  } else if (lowerText.includes('devops') || lowerText.includes('sre') || lowerText.includes('cloud')) {
    detectedTitle = 'Senior DevOps / Cloud Engineer';
  } else if (lowerText.includes('customer success') || lowerText.includes('account manager')) {
    detectedTitle = 'Customer Success Lead';
  } else if (lines.length > 1 && secondLine.length < 50 && !secondLine.includes('@')) {
    detectedTitle = secondLine;
  }

  // Extract skills from text
  const potentialSkills = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'PostgreSQL',
    'Redis', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST APIs', 'Tailwind CSS',
    'Git', 'CI/CD', 'SQL', 'MongoDB', 'Product Strategy', 'Agile', 'Jira', 'Figma',
    'Customer Success', 'Salesforce', 'HubSpot', 'Communication', 'Documentation'
  ];
  const matchedSkills = potentialSkills.filter((s) => lowerText.includes(s.toLowerCase()));
  const primarySkills = matchedSkills.slice(0, 7).length > 0 ? matchedSkills.slice(0, 7) : ['Problem Solving', 'Remote Collaboration', 'System Architecture'];
  const secondarySkills = matchedSkills.slice(7, 14).length > 0 ? matchedSkills.slice(7, 14) : ['Async Workflow', 'Technical Documentation', 'Agile Delivery'];

  return {
    name: extractedName,
    title: detectedTitle,
    summary: `${extractedName} is an accomplished professional with demonstrated track record in ${detectedTitle.toLowerCase()} disciplines, driving business outcomes, high-autonomy execution, and async collaboration in distributed remote environments.`,
    seniorityLevel: seniority,
    yearsOfExperience: seniority === 'Junior' ? 2 : seniority === 'Mid-Level' ? 4 : seniority === 'Senior' ? 6 : 9,
    primarySkills,
    secondarySkills,
    toolsAndTechnologies: matchedSkills.slice(0, 10),
    remoteWorkStrengths: [
      'Proven track record in asynchronous documentation and remote team alignment',
      'High degree of personal ownership and independent sprint velocity',
      'Clear, articulate written communication across distributed time zones'
    ],
    salaryExpectationRange: {
      min: seniority === 'Junior' ? 85000 : seniority === 'Mid-Level' ? 115000 : seniority === 'Senior' ? 140000 : 175000,
      max: seniority === 'Junior' ? 115000 : seniority === 'Mid-Level' ? 145000 : seniority === 'Senior' ? 180000 : 225000,
      currency: 'USD',
      period: 'yearly'
    },
    targetJobTitles: [
      detectedTitle,
      `Remote ${detectedTitle}`,
      seniority === 'Senior' ? `Staff ${detectedTitle.replace('Senior ', '')}` : `Senior ${detectedTitle}`,
      `${detectedTitle} (Distributed / Anywhere)`
    ],
    recommendedIndustries: ['B2B SaaS', 'Developer Tooling', 'Distributed Cloud Services', 'Remote Work Tech'],
    careerTrajectory: {
      progressionPace: 'Accelerated',
      nextLogicalStep: `Advancement into high-impact remote leadership within ${detectedTitle}`,
      leadershipTrajectory: 'Technical Lead / Senior Individual Contributor',
      velocitySummary: 'Demonstrates consistent velocity, scope expansion, and autonomous delivery across professional roles.'
    },
    inferredCulturePreferences: {
      preferredCompanyStage: 'High-autonomy growth scaleup (Series B-D) or distributed pioneer',
      workstylePace: 'Async-first, high documentation, minimal meeting overhead',
      teamEnvironment: 'Mission-driven, transparent roadmap, high individual ownership',
      keyMotivators: ['Autonomy & async trust', 'Technical craft & product depth', 'High impact & velocity']
    },
    extractedResumeText: text
  };
}

// Helper: extract raw text from binary base64 if it's plaintext, RTF, HTML, or DOCX XML
function tryExtractTextFromBase64(base64: string): string {
  try {
    const buffer = Buffer.from(base64, 'base64');
    const rawStr = buffer.toString('utf-8');

    // If it looks like HTML, strip tags
    if (rawStr.includes('<html') || rawStr.includes('<body') || rawStr.includes('<div') || rawStr.includes('<p>')) {
      const cleaned = rawStr.replace(/<style[\s\S]*?<\/style>/gi, '')
                            .replace(/<script[\s\S]*?<\/script>/gi, '')
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/&nbsp;/g, ' ')
                            .replace(/&amp;/g, '&')
                            .replace(/\s{2,}/g, ' ')
                            .trim();
      if (cleaned.length > 50) return cleaned;
    }

    // If it contains printable text (at least 70% ASCII printable)
    const printableChars = rawStr.replace(/[^\x20-\x7E\t\n\r]/g, '');
    if (printableChars.length > 50 && printableChars.length / rawStr.length > 0.6) {
      return printableChars;
    }
  } catch (e) {
    // ignore
  }
  return '';
}

// 1. Analyze Resume Endpoint
app.post('/api/resume/analyze', async (req: Request, res: Response) => {
  const { resumeText, fileBase64, mimeType, fileName } = req.body;

  if (!resumeText && !fileBase64) {
    return res.status(400).json({ error: 'Resume text or file data is required.' });
  }

  // Pre-check: if fileBase64 contains embedded readable text, extract it
  let extractedTextCandidate = '';
  let cleanBase64 = '';
  if (fileBase64) {
    cleanBase64 = fileBase64.includes(';base64,')
      ? fileBase64.split(';base64,')[1]
      : fileBase64;
    extractedTextCandidate = tryExtractTextFromBase64(cleanBase64);
  }

  const effectiveText = resumeText && resumeText.trim().length > 0
    ? resumeText
    : extractedTextCandidate;

  try {
    let contents: any;

    if (effectiveText && effectiveText.trim().length > 15) {
      // Direct formatted/raw text analysis
      contents = `You are an expert executive tech recruiter and career strategist. Read, parse, and analyze this candidate's resume (which may include formatted text, markdown, bullet points, headers, or plain text):

--- CANDIDATE RESUME START ---
${effectiveText}
--- CANDIDATE RESUME END ---

Extract a comprehensive, realistic candidate profile and return a valid JSON object matching this exact schema:
{
  "name": "Candidate full name",
  "title": "Current or best-fit professional title",
  "summary": "2-3 sentence executive career summary highlighting key achievements and remote capability",
  "seniorityLevel": "Junior" | "Mid-Level" | "Senior" | "Staff/Lead" | "Director/Executive",
  "yearsOfExperience": number,
  "primarySkills": ["top 5-8 hard skills / technologies / methodologies"],
  "secondarySkills": ["supporting technical or domain skills"],
  "toolsAndTechnologies": ["specific frameworks, languages, tools"],
  "remoteWorkStrengths": ["3-5 concrete reasons why this candidate thrives in remote & async work"],
  "salaryExpectationRange": {
    "min": number,
    "max": number,
    "currency": "USD",
    "period": "yearly"
  },
  "targetJobTitles": ["4-6 realistic remote job titles they are qualified to win today"],
  "recommendedIndustries": ["3-4 industries fitting their track record"],
  "careerTrajectory": {
    "progressionPace": "Accelerated" | "Steady & Proven" | "Pivoting / Expanding",
    "nextLogicalStep": "Diagnosis of their next promotion or scope expansion",
    "leadershipTrajectory": "e.g. Individual Contributor Specialist, Tech Lead, Engineering Manager",
    "velocitySummary": "1-2 sentence analysis of their career velocity and promotion readiness based on past roles"
  },
  "inferredCulturePreferences": {
    "preferredCompanyStage": "e.g. High-autonomy scaleup (Series B-D) or distributed remote pioneer",
    "workstylePace": "e.g. Async-first, high documentation, low meeting overhead",
    "teamEnvironment": "e.g. Engineering-led, transparent roadmap, high individual ownership",
    "keyMotivators": ["Autonomy & async trust", "Technical depth & craft", "High impact & velocity"]
  },
  "extractedResumeText": "A clean, well-formatted plain text / markdown version of their full resume content for downstream editing and tailoring"
}
Respond with ONLY valid JSON.`;
    } else if (cleanBase64) {
      // PDF or inline binary document
      const fileMime = mimeType && mimeType.includes('pdf') ? 'application/pdf' : 'application/pdf';
      contents = {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: fileMime,
            },
          },
          {
            text: `You are an expert executive tech recruiter and career strategist. Read and thoroughly analyze this uploaded formatted resume document (${fileName || 'resume'}).
Extract a comprehensive, realistic candidate profile and return a valid JSON object matching this schema:
{
  "name": "Candidate full name",
  "title": "Current or best-fit professional title",
  "summary": "2-3 sentence executive career summary",
  "seniorityLevel": "Junior" | "Mid-Level" | "Senior" | "Staff/Lead" | "Director/Executive",
  "yearsOfExperience": number,
  "primarySkills": ["top 5-8 hard skills / technologies / methodologies"],
  "secondarySkills": ["supporting technical or domain skills"],
  "toolsAndTechnologies": ["specific frameworks, languages, tools"],
  "remoteWorkStrengths": ["3-5 concrete reasons why this candidate thrives in remote & async work"],
  "salaryExpectationRange": {
    "min": number,
    "max": number,
    "currency": "USD",
    "period": "yearly"
  },
  "targetJobTitles": ["4-6 realistic remote job titles they are qualified to win today"],
  "recommendedIndustries": ["3-4 industries fitting their track record"],
  "careerTrajectory": {
    "progressionPace": "Accelerated" | "Steady & Proven" | "Pivoting / Expanding",
    "nextLogicalStep": "Diagnosis of their next promotion or scope expansion",
    "leadershipTrajectory": "e.g. Individual Contributor Specialist, Tech Lead, Engineering Manager",
    "velocitySummary": "1-2 sentence analysis of their career velocity and promotion readiness based on past roles"
  },
  "inferredCulturePreferences": {
    "preferredCompanyStage": "e.g. High-autonomy scaleup (Series B-D) or distributed remote pioneer",
    "workstylePace": "e.g. Async-first, high documentation, low meeting overhead",
    "teamEnvironment": "e.g. Engineering-led, transparent roadmap, high individual ownership",
    "keyMotivators": ["Autonomy & async trust", "Technical depth & craft", "High impact & velocity"]
  },
  "extractedResumeText": "A clean, well-formatted plain text / markdown version of their full resume content for downstream editing and tailoring"
}
Provide ONLY the JSON response. Do not include markdown code block backticks if possible, or standard \`\`\`json.`,
          },
        ],
      };
    } else {
      throw new Error('No readable text or file content provided.');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    if (parsed && parsed.name) {
      return res.json({ profile: parsed });
    }
    throw new Error('Incomplete candidate profile parsed from AI response.');
  } catch (error: any) {
    console.error('Error analyzing resume via AI:', error?.message || error);

    // If text was provided or can be extracted from resumeText, provide a graceful fallback profile
    if (resumeText && resumeText.trim().length > 10) {
      console.log('Generating graceful fallback profile from raw resume text...');
      const fallbackProfile = extractFallbackProfileFromText(resumeText, fileName);
      return res.json({ profile: fallbackProfile, isFallback: true });
    }

    // If fileBase64 was provided but AI model failed (e.g. corrupted PDF or size limit), synthesize profile from filename
    if (fileName) {
      console.log('Generating graceful fallback profile from file metadata...');
      const fallbackProfile = extractFallbackProfileFromText(`Resume file: ${fileName}`, fileName);
      return res.json({ profile: fallbackProfile, isFallback: true });
    }

    return res.status(500).json({
      error: error.message || 'Failed to analyze resume. Please paste your resume text directly.',
    });
  }
});

// 2. Find Realistic Remote Job Openings
app.post('/api/jobs/find', async (req: Request, res: Response) => {
  try {
    const { profile, filters, customQuery } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Candidate profile is required.' });
    }

    const targetRoles = filters?.targetRole
      ? [filters.targetRole]
      : profile.targetJobTitles || ['Software Engineer'];
    const seniority = filters?.seniority || profile.seniorityLevel || 'Mid-Level';
    const region = filters?.region || 'Worldwide / Anywhere or US';

    const trajectory = profile.careerTrajectory || {
      progressionPace: 'Steady & Proven',
      nextLogicalStep: 'Senior to Staff/Tech Lead level expansion',
      leadershipTrajectory: 'Technical Lead / Senior IC',
      velocitySummary: 'Demonstrates consistent velocity and ownership across multi-year initiatives.'
    };

    const culture = profile.inferredCulturePreferences || {
      preferredCompanyStage: 'High-autonomy growth scaleup or distributed remote pioneer',
      workstylePace: 'Async-first, high documentation, low meeting overhead',
      teamEnvironment: 'Engineering-led, transparent roadmap, high individual ownership',
      keyMotivators: ['Autonomy', 'Technical craft', 'High impact']
    };

    const prompt = `You are a premier recruitment intelligence engine equipped with an ADVANCED MULTI-DIMENSIONAL JOB MATCHING ALGORITHM.
Your mission is to find 6 to 9 REALISTIC, highly personalized remote job openings that perfectly match this candidate across three fundamental axes:
1. Career Trajectory & Promotion Velocity
2. Inferred Desired Company Culture & Operating Style (Startup vs. Corporate, Async vs. Sync)
3. Deep Skill Overlap & Technical Parity

CANDIDATE PROFILE:
- Name: ${profile.name}
- Current Title: ${profile.title}
- Seniority Level: ${seniority}
- Years of Experience: ${profile.yearsOfExperience || '5+'}
- Primary Skills: ${(profile.primarySkills || []).join(', ')}
- Secondary Skills: ${(profile.secondarySkills || []).join(', ')}
- Tools/Tech: ${(profile.toolsAndTechnologies || []).join(', ')}
- Salary Range: $${profile.salaryExpectationRange?.min || 110000} - $${profile.salaryExpectationRange?.max || 160000} USD
- Target Roles: ${targetRoles.join(', ')}
- Preferred Remote Region: ${region}
- Inferred Career Trajectory: Pace: ${trajectory.progressionPace}; Next Step: ${trajectory.nextLogicalStep}; Leadership: ${trajectory.leadershipTrajectory}; Summary: ${trajectory.velocitySummary}
- Inferred Culture Preferences: Stage: ${culture.preferredCompanyStage}; Workstyle: ${culture.workstylePace}; Team: ${culture.teamEnvironment}
${customQuery ? `- User Additional Search Request: ${customQuery}` : ''}

ADVANCED MATCHING ALGORITHM REQUIREMENTS:
- Evaluate Career Trajectory Fit (trajectoryFitScore: 0-100): Is this role the natural next step in their career arc? Does it expand their scope, provide the right level of ownership, or leverage their proven velocity?
- Evaluate Culture & Workstyle Fit (cultureFitScore: 0-100): How closely does the company's operating model (early startup, high-autonomy scaleup, open-source async pioneer, or structured corporate) align with the candidate's inferred culture preference?
- Evaluate Skill Overlap (skillOverlapScore: 0-100): Assess deep technical parity across core stack, transferable architectures, and identify honest minor gaps.
- Compute Overall Match Score: (0.35 * skillOverlapScore) + (0.35 * trajectoryFitScore) + (0.30 * cultureFitScore), rounded to nearest integer (typically 78 to 97).
- Company Diversity: Select real reputable remote employers (e.g. GitLab, Supabase, Buffer, Zapier, Automattic, Elastic, Stripe, Vercel, DuckDuckGo, Grafana Labs, 1Password, PostHog, Linear, Fly.io, etc.).

Return a valid JSON array of job objects:
[
  {
    "id": "job-uuid-1",
    "title": "Senior Frontend Engineer - Remote",
    "company": "GitLab",
    "companyDomain": "gitlab.com",
    "location": "Remote (Global / Americas)",
    "timezoneRequirement": "UTC-8 to UTC+2 flexible",
    "workArrangement": "100% Remote · Async First",
    "salary": "$148,000 - $182,000 / yr + Equity",
    "matchScore": 93,
    "matchTier": "Strong Match",
    "trajectoryFitScore": 92,
    "cultureFitScore": 95,
    "skillOverlapScore": 93,
    "careerTrajectoryAnalysis": "Positions candidate for technical leadership in large-scale distributed systems, serving as the natural bridge between Senior IC and Staff Engineer.",
    "cultureFitDetails": {
      "companyStage": "Public Remote Pioneer (~2,000 employees)",
      "operatingStyle": "100% Async-first, public handbook, zero calendar clutter",
      "alignmentNotes": "Directly matches candidate's proven strength in asynchronous RFC writing and self-directed sprint execution."
    },
    "skillOverlapDetails": {
      "matchedCore": ["TypeScript", "React", "State Management", "Web Performance"],
      "transferableSkills": ["Component Design Systems", "CI/CD Pipelines", "Async Code Review"],
      "gaps": ["Vue.js / Ruby on Rails integration"]
    },
    "matchReasoning": [
      "Extensive modern TypeScript & React architecture background matches GitLab’s stack.",
      "Proven experience building real-time collaboration engines and asynchronous RFC documentation workflows.",
      "Documented success cutting bundle load times by 48% aligns directly with GitLab’s performance team goals."
    ],
    "skillGaps": [
      "Familiarity with Vue.js/Ruby on Rails monolith integration is beneficial to brush up on."
    ],
    "description": "Comprehensive role summary...",
    "keyResponsibilities": ["Key responsibility 1", "Key responsibility 2"],
    "requirements": ["Requirement 1", "Requirement 2"],
    "benefits": ["$2,500 Home Office stipend", "Unlimited PTO", "Learning budget"],
    "postedDate": "Just now",
    "applicantCompetition": "Moderate",
    "applyUrl": "https://about.gitlab.com/jobs/all-jobs/",
    "source": "GitLab Remote Careers"
  }
]
Return ONLY the JSON array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanAndParseJSON(response.text || '[]');
    return res.json({ jobs: Array.isArray(parsed) ? parsed : parsed.jobs || [] });
  } catch (error: any) {
    console.error('Error finding remote jobs:', error);
    return res.status(500).json({
      error: error.message || 'Failed to pull remote jobs.',
    });
  }
});

// 3. Tailor Resume to a Selected Role
app.post('/api/jobs/tailor-resume', async (req: Request, res: Response) => {
  try {
    const { originalResumeText, candidateProfile, job } = req.body;

    if (!originalResumeText || !job) {
      return res.status(400).json({ error: 'Original resume and job data are required.' });
    }

    const prompt = `You are a world-class executive resume writer and ATS (Applicant Tracking System) optimization specialist.
A candidate is applying for the following remote job opening:

TARGET JOB:
- Title: ${job.title}
- Company: ${job.company}
- Location / Remote Setup: ${job.location} (${job.workArrangement})
- Description: ${job.description}
- Key Responsibilities: ${(job.keyResponsibilities || []).join('; ')}
- Requirements: ${(job.requirements || []).join('; ')}

CANDIDATE CURRENT RESUME:
${originalResumeText}

TASK:
1. Tailor the candidate's resume specifically for this ${job.title} position at ${job.company}.
2. Rewrite the Executive Summary to align directly with the company's domain and target responsibilities.
3. Reframe and elevate work experience bullet points using the Google XYZ Formula ("Accomplished [X], as measured by [Y], by doing [Z]") while preserving factual truth (do not fabricate nonexistent companies, but sharpen verbs, metrics, and relevant keyword density).
4. Reorder or emphasize skills that match the job requirements (highlighting both hard skills and remote async collaboration strengths).
5. Identify specific ATS keywords integrated, and provide clear strategic notes explaining what was changed and why it elevates their chances from average applicant to top 5% candidate.

Return a valid JSON object with the following schema:
{
  "jobId": "${job.id || 'target-job'}",
  "jobTitle": "${job.title}",
  "company": "${job.company}",
  "matchScoreBefore": ${job.matchScore || 80},
  "matchScoreAfter": 98,
  "targetedSummary": "Targeted 3-sentence summary highlighting key alignment...",
  "tailoredExperience": [
    {
      "company": "Company Name",
      "role": "Role Title",
      "dates": "Date Range",
      "bullets": [
        {
          "original": "Original bullet if identifiable or null",
          "tailored": "Sharpened, high-impact XYZ bullet point tailored to the target role",
          "rationale": "Why this change strengthens the application",
          "isHighImpact": true
        }
      ]
    }
  ],
  "highlightedSkills": ["List of prioritized skills tailored to the role"],
  "atsKeywordsAdded": ["List of 6-10 specific keywords from job description seamlessly integrated"],
  "tailoringStrategyNotes": [
    "Key strategic change #1 explained",
    "Key strategic change #2 explained",
    "Key strategic change #3 explained"
  ],
  "fullMarkdown": "The complete, beautifully formatted full tailored resume in clean markdown ready to copy or download"
}
Respond with ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json({ tailoredResume: parsed });
  } catch (error: any) {
    console.error('Error tailoring resume:', error);
    return res.status(500).json({
      error: error.message || 'Failed to tailor resume.',
    });
  }
});

// 4. Generate Cover Letter for Selected Role
app.post('/api/jobs/generate-cover-letter', async (req: Request, res: Response) => {
  try {
    const { originalResumeText, candidateProfile, job, preferences } = req.body;

    if (!job) {
      return res.status(400).json({ error: 'Target job data is required.' });
    }

    const tone = preferences?.tone || 'Professional & Confident';
    const length = preferences?.length || 'Balanced (350 words)';
    const customNotes = preferences?.customNotes || '';

    const prompt = `You are an elite career coach who crafts unforgettable, high-conversion job application cover letters.
Write a standout, tailored cover letter for this candidate applying to this specific remote position.

TARGET ROLE:
- Title: ${job.title}
- Company: ${job.company}
- Remote Policy: ${job.workArrangement || '100% Remote'} (${job.location})
- Role Description: ${job.description}
- Key Responsibilities: ${(job.keyResponsibilities || []).join('; ')}
- Requirements: ${(job.requirements || []).join('; ')}

CANDIDATE PROFILE:
- Name: ${candidateProfile?.name || 'Applicant'}
- Title: ${candidateProfile?.title || 'Professional'}
- Experience Summary: ${candidateProfile?.summary || ''}
- Core Skills: ${(candidateProfile?.primarySkills || []).join(', ')}
- Resume Excerpt:
${originalResumeText ? originalResumeText.slice(0, 2500) : 'See skills above'}

COVER LETTER PREFERENCES:
- Tone: ${tone} (Options: "Professional & Confident", "Modern & Concise", "High-Impact & Direct", "Warm & Mission-Driven")
- Length: ${length}
${customNotes ? `- Custom user instruction / emphasis: ${customNotes}` : ''}

COVER LETTER GUIDELINES:
1. HOOK: Start with an attention-grabbing, specific opening sentence that proves knowledge of ${job.company}'s work and demonstrates genuine excitement, rather than "I am writing to apply for...".
2. EVIDENCE: In the core paragraphs, highlight 2 concrete past wins directly demonstrating they have already solved the exact challenges this role faces.
3. REMOTE EXCELLENCE: Seamlessly weave in evidence of self-direction, high async communication clarity, and autonomy.
4. CALL TO ACTION: A confident, low-friction closing proposing a conversational next step.

Return a valid JSON object:
{
  "jobId": "${job.id || 'target-job'}",
  "jobTitle": "${job.title}",
  "company": "${job.company}",
  "tone": "${tone}",
  "subjectLine": "Application for ${job.title} - ${candidateProfile?.name || 'Candidate'}",
  "salutation": "Dear ${job.company} Hiring Team,",
  "opening": "Opening hook paragraph...",
  "bodyParagraphs": [
    "First proof paragraph connecting past achievements with their core needs...",
    "Second proof paragraph demonstrating remote execution, technical leadership, and domain impact..."
  ],
  "callToAction": "Closing action and forward-looking statement...",
  "signoff": "Sincerely,\\n${candidateProfile?.name || 'Candidate'}",
  "keyHighlightsUsed": [
    "Highlight #1 used in the letter",
    "Highlight #2 used in the letter"
  ],
  "fullText": "Full formatted cover letter ready to copy or print..."
}
Respond with ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json({ coverLetter: parsed });
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate cover letter.',
    });
  }
});

// 5. Company Research & Intelligence Endpoint
app.post('/api/company/research', async (req: Request, res: Response) => {
  try {
    const { companyName, jobTitle, seniorityLevel, companyDomain } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required.' });
    }

    const prompt = `You are a corporate intelligence analyst and tech talent advisor specializing in remote company research.
Provide deep, authoritative, and realistic research data on the following company and target role:
- Company Name: ${companyName}
${companyDomain ? `- Domain / Website: ${companyDomain}` : ''}
- Target Role: ${jobTitle || 'Software Engineer'}
- Seniority Level: ${seniorityLevel || 'Senior'}

Generate an exhaustive, realistic company intelligence dossier formatted as a valid JSON object matching this exact structure:
{
  "companyName": "${companyName}",
  "tagline": "A crisp, authoritative 1-sentence tagline describing their primary business or product",
  "companySize": "e.g. 1,800 - 2,500 employees (100% distributed across 40+ countries)",
  "foundedYear": "e.g. 2014",
  "headquarters": "e.g. San Francisco, CA · Remote-First / No Physical HQ",
  "fundingStageOrTicker": "e.g. Public (NASDAQ: GTLB) OR Series B ($85M raised, Sequoia / Benchmark)",
  "businessModel": "Clear summary of their core product, revenue streams, and market position",
  "cultureArchetype": "e.g. Async-First Engineering Meritocracy / Fast-Paced Product Lab / Transparent Open-Source Culture",
  "recentNews": [
    {
      "title": "Recent press release or major milestone headline (product release, AI capability launch, funding, or executive expansion)",
      "date": "Within the last 3-6 months",
      "source": "TechCrunch / Company Blog / Business Wire / Forbes",
      "summary": "2-sentence synopsis of what occurred and why it matters to the industry",
      "impactOnRole": "Why this strategic news is a positive tailwind for candidates interviewing for ${jobTitle || 'this role'}"
    },
    {
      "title": "Second headline or major strategic initiative",
      "date": "Recent",
      "source": "VentureBeat / Official Release",
      "summary": "Summary of partnership, platform upgrade, or market expansion",
      "impactOnRole": "How this impacts hiring velocity or team mission"
    },
    {
      "title": "Third headline or culture/growth milestone",
      "date": "Recent",
      "source": "Company Newsroom / GitHub / Industry Report",
      "summary": "Summary of milestone",
      "impactOnRole": "What it signals for long-term career stability and learning"
    }
  ],
  "employeeReviews": {
    "overallRating": 4.4,
    "recommendToFriendPercent": 88,
    "ceoApprovalPercent": 93,
    "cultureAndValuesRating": 4.6,
    "workLifeBalanceRating": 4.5,
    "pros": [
      "Authentic async work model with minimal calendar meetings and deep work blocks",
      "Generous remote setup stipends ($2,500+) and annual learning allowances",
      "High psychological safety and transparent, documented internal decision-making",
      "Strong work-life boundaries with recommended minimum vacation days"
    ],
    "cons": [
      "Asynchronous collaboration requires high self-discipline and exceptional written clarity",
      "Global timezone distribution means PR code reviews may have delayed turnaround cycles",
      "Fast-moving product roadmap can lead to shifting priorities across quarters"
    ],
    "verdictSummary": "Highly rated by remote professionals who prize autonomy, written asynchronous communication, and meritocratic output over corporate politics."
  },
  "salaryBenchmarks": {
    "roleTitle": "${jobTitle || 'Senior Software Engineer'}",
    "seniority": "${seniorityLevel || 'Senior'}",
    "percentile25": 142000,
    "median": 165000,
    "percentile75": 185000,
    "percentile90": 205000,
    "currency": "USD",
    "typicalEquity": "$35,000 - $65,000 / yr annualized RSU/ISO stock grant with 4-year vesting",
    "annualBonusOrPerks": "10-15% performance bonus, $2,500 home office budget, 100% healthcare coverage",
    "marketDataSource": "Levels.fyi, Carta Total Comp, Radford Technology Survey 2024-2025 Benchmarks",
    "analysis": "Compensation at ${companyName} for ${jobTitle || 'this role'} ranks in the top quartile (75th-90th percentile) among remote-first tech employers, offering transparent leveling formulas and resilient equity upside."
  },
  "interviewInsights": {
    "difficulty": "Moderate to High (3.4 / 5.0)",
    "typicalProcess": [
      "Stage 1: 30-min Recruiter Screen & Remote Readiness Assessment",
      "Stage 2: 60-min Technical Architecture & System Design Discussion",
      "Stage 3: Async Take-Home RFC or Real-World Pair Programming",
      "Stage 4: Cross-Functional Team & Values Alignment Conversation"
    ],
    "timeline": "2 to 3 weeks average from initial screen to formal offer",
    "insiderAdvice": "Focus heavily on written clarity, async problem solving, and concrete business metrics. Mention how you document trade-offs in RFCs."
  }
}
Respond with ONLY the valid JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json({ research: parsed });
  } catch (error: any) {
    console.error('Error fetching company research:', error);
    return res.status(500).json({
      error: error.message || 'Failed to research company.',
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
