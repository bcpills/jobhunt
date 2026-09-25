export type SeniorityLevel = 'Junior' | 'Mid-Level' | 'Senior' | 'Staff/Lead' | 'Director/Executive';

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'yearly' | 'hourly';
}

export interface CareerTrajectoryProfile {
  progressionPace: 'Accelerated' | 'Steady & Proven' | 'Pivoting / Expanding';
  nextLogicalStep: string;
  leadershipTrajectory: string;
  velocitySummary: string;
}

export interface InferredCulturePreferences {
  preferredCompanyStage: string; // e.g. "Growth-Stage Scaleup (Series B-D) or Distributed Remote Pioneer"
  workstylePace: string; // e.g. "Async-first, high autonomy, low meeting overhead"
  teamEnvironment: string; // e.g. "Engineering-led, transparent documentation, high ownership"
  keyMotivators: string[];
}

export interface WorkExperienceItem {
  company: string;
  role: string;
  dates: string;
  location?: string;
  bullets: string[];
}

export interface CandidateProfile {
  name: string;
  title: string;
  summary: string;
  seniorityLevel: SeniorityLevel;
  yearsOfExperience: number;
  userState?: string; // e.g. "NC", "North Carolina", "TX", etc.
  userLocation?: string; // e.g. "Raleigh, NC"
  targetSalaryMin?: number;
  targetSalaryMax?: number;
  primarySkills: string[];
  secondarySkills: string[];
  toolsAndTechnologies: string[];
  remoteWorkStrengths: string[];
  salaryExpectationRange: SalaryRange;
  targetJobTitles: string[];
  recommendedIndustries: string[];
  extractedResumeText: string;
  careerTrajectory?: CareerTrajectoryProfile;
  inferredCulturePreferences?: InferredCulturePreferences;
  workExperience?: WorkExperienceItem[];
  educationHistory?: string[];
}

export interface SkillOverlapDetails {
  matchedCore: string[];
  transferableSkills: string[];
  gaps: string[];
}

export interface CultureFitDetails {
  companyStage: string;
  operatingStyle: string;
  alignmentNotes: string;
}

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  companyDomain?: string;
  location: string;
  timezoneRequirement: string;
  workArrangement: string; // e.g. "100% Remote - Async First"
  salary: string;
  matchScore: number; // Multidimensional overall score (0-100)
  matchTier: 'Strong Match' | 'Solid Fit' | 'Stretch Role';
  
  // State-specific remote eligibility
  eligibleStates?: string[]; // e.g. ['NC', 'VA', 'SC', 'GA', 'FL', 'All US']
  stateEligibilityNote?: string; // e.g. "Open to North Carolina and 28 other states" or "Hiring in all 50 states"
  isStateSpecific?: boolean;

  // Advanced Matching Algorithm Multi-Factor Breakdown
  trajectoryFitScore: number; // 0-100 score based on career progression & promotion readiness
  cultureFitScore: number;    // 0-100 score based on startup vs corporate & workstyle alignment
  skillOverlapScore: number;   // 0-100 score based on hard skill depth & technical parity

  careerTrajectoryAnalysis: string; // Why this role fits their career arc
  cultureFitDetails: CultureFitDetails; // In-depth culture & operating alignment
  skillOverlapDetails: SkillOverlapDetails; // Deep skill analysis

  matchReasoning: string[];
  skillGaps: string[];
  description: string;
  keyResponsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  applicantCompetition: 'Low' | 'Moderate' | 'High';
  applyUrl: string;
  source: string;
}

export interface CompanyRecentNews {
  title: string;
  date: string;
  source: string;
  summary: string;
  impactOnRole: string;
}

export interface EmployeeReviewsSummary {
  overallRating: number; // e.g. 4.4 out of 5
  recommendToFriendPercent: number; // e.g. 89%
  ceoApprovalPercent: number; // e.g. 94%
  cultureAndValuesRating: number; // e.g. 4.6
  workLifeBalanceRating: number; // e.g. 4.5
  pros: string[];
  cons: string[];
  verdictSummary: string;
}

export interface IndustrySalaryBenchmarks {
  roleTitle: string;
  seniority: string;
  percentile25: number;
  median: number;
  percentile75: number;
  percentile90: number;
  currency: string;
  typicalEquity: string;
  annualBonusOrPerks: string;
  marketDataSource: string;
  analysis: string;
}

export interface CompanyResearchData {
  companyName: string;
  tagline: string;
  companySize: string; // e.g. "1,800+ employees"
  foundedYear: string;
  headquarters: string;
  fundingStageOrTicker: string; // e.g. "Public (NASDAQ: GTLB)"
  businessModel: string;
  cultureArchetype: string;
  recentNews: CompanyRecentNews[];
  employeeReviews: EmployeeReviewsSummary;
  salaryBenchmarks: IndustrySalaryBenchmarks;
  interviewInsights: {
    difficulty: string; // "Moderate (3.2/5)"
    typicalProcess: string[];
    timeline: string;
    insiderAdvice: string;
  };
}

export interface TailoredBullet {
  original?: string;
  tailored: string;
  rationale: string;
  isHighImpact: boolean;
}

export interface TailoredExperience {
  company: string;
  role: string;
  dates: string;
  bullets: TailoredBullet[];
}

export interface TailoredResume {
  jobId: string;
  jobTitle: string;
  company: string;
  matchScoreBefore: number;
  matchScoreAfter: number;
  targetedSummary: string;
  tailoredExperience: TailoredExperience[];
  highlightedSkills: string[];
  atsKeywordsAdded: string[];
  tailoringStrategyNotes: string[];
  fullMarkdown: string;
}

export interface CoverLetter {
  jobId: string;
  jobTitle: string;
  company: string;
  tone: string;
  subjectLine: string;
  salutation: string;
  opening: string;
  bodyParagraphs: string[];
  callToAction: string;
  signoff: string;
  keyHighlightsUsed: string[];
  fullText: string;
}

export interface JobFilterState {
  searchQuery: string;
  seniority: string;
  minSalary: number;
  maxSalary?: number;
  salaryTier?: 'all' | 'achievable' | 'mid' | 'senior' | 'custom';
  userState?: string; // e.g. "NC", "TX", "All States"
  onlyMyState?: boolean;
  minMatchScore: number;
  region: string;
  sortBy?: 'overallMatch' | 'trajectoryFit' | 'cultureFit' | 'skillOverlap' | 'salaryLowToHigh' | 'salaryHighToLow';
}
