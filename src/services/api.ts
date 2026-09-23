import { CandidateProfile, JobOpening, TailoredResume, CoverLetter, CompanyResearchData } from '../types';

export async function convertDocumentToPlainText(params: {
  fileBase64: string;
  mimeType: string;
  fileName: string;
}): Promise<{ plainText: string; source: string; note?: string }> {
  const response = await fetch('/api/resume/convert-to-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to convert document to plain text.');
  }

  return await response.json();
}

export async function analyzeResume(params: {
  resumeText?: string;
  fileBase64?: string;
  mimeType?: string;
  fileName?: string;
}): Promise<CandidateProfile> {
  const response = await fetch('/api/resume/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze resume.');
  }

  const data = await response.json();
  return data.profile;
}

export async function findRemoteJobs(params: {
  profile: CandidateProfile;
  filters?: {
    seniority?: string;
    region?: string;
    targetRole?: string;
  };
  customQuery?: string;
}): Promise<JobOpening[]> {
  const response = await fetch('/api/jobs/find', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to pull remote jobs.');
  }

  const data = await response.json();
  return data.jobs || [];
}

export async function tailorResumeToRole(params: {
  originalResumeText: string;
  candidateProfile: CandidateProfile;
  job: JobOpening;
}): Promise<TailoredResume> {
  const response = await fetch('/api/jobs/tailor-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to tailor resume.');
  }

  const data = await response.json();
  return data.tailoredResume;
}

export async function generateCoverLetter(params: {
  originalResumeText: string;
  candidateProfile: CandidateProfile;
  job: JobOpening;
  preferences?: {
    tone?: string;
    length?: string;
    customNotes?: string;
  };
}): Promise<CoverLetter> {
  const response = await fetch('/api/jobs/generate-cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate cover letter.');
  }

  const data = await response.json();
  return data.coverLetter;
}

export async function fetchCompanyResearch(params: {
  companyName: string;
  jobTitle?: string;
  seniorityLevel?: string;
  companyDomain?: string;
}): Promise<CompanyResearchData> {
  const response = await fetch('/api/company/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to retrieve company intelligence.');
  }

  const data = await response.json();
  return data.research;
}

