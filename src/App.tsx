import React, { useState, useMemo } from 'react';
import { CandidateProfile, JobOpening, JobFilterState, TailoredResume, CoverLetter, CompanyResearchData } from './types';
import { DEFAULT_REMOTE_JOBS } from './data/defaultJobs';
import { analyzeResume, findRemoteJobs, tailorResumeToRole, generateCoverLetter, fetchCompanyResearch } from './services/api';
import { generateClientSideJobs } from './utils/clientResumeParser';
import { parseSalaryRange } from './utils/salary';
import { Navbar } from './components/Navbar';
import { CandidateProfileBar } from './components/CandidateProfileBar';
import { JobFilterBar } from './components/JobFilterBar';
import { JobCard } from './components/JobCard';
import { ResumeUploadModal } from './components/ResumeUploadModal';
import { TailorResumeModal } from './components/TailorResumeModal';
import { CoverLetterModal } from './components/CoverLetterModal';
import { JobDetailModal } from './components/JobDetailModal';
import { ResumeViewerModal } from './components/ResumeViewerModal';
import { CompanyResearchModal } from './components/CompanyResearchModal';
import { ResumeLaunchpad } from './components/ResumeLaunchpad';
import { Briefcase, RefreshCw, AlertCircle, CheckCircle2, RotateCcw, UploadCloud, FileText } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [filters, setFilters] = useState<JobFilterState>({
    searchQuery: '',
    seniority: 'All',
    minSalary: 0,
    maxSalary: 0,
    userState: 'All States',
    onlyMyState: false,
    minMatchScore: 0,
    region: 'All Regions',
    sortBy: 'overallMatch',
  });

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isResumeViewerOpen, setIsResumeViewerOpen] = useState(false);
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [isJobDetailModalOpen, setIsJobDetailModalOpen] = useState(false);
  const [isCompanyResearchModalOpen, setIsCompanyResearchModalOpen] = useState(false);

  // Active items
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [companyResearchData, setCompanyResearchData] = useState<CompanyResearchData | null>(null);

  // Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isLoadingResearch, setIsLoadingResearch] = useState(false);

  // Status banners / error alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset / Start Over with clean state
  const handleStartOver = () => {
    setProfile(null);
    setJobs([]);
    setSelectedJob(null);
    setTailoredResume(null);
    setCoverLetter(null);
    setCompanyResearchData(null);
    setFilters({
      searchQuery: '',
      seniority: 'All',
      minSalary: 0,
      maxSalary: 0,
      userState: 'All States',
      onlyMyState: false,
      minMatchScore: 0,
      region: 'All Regions',
      sortBy: 'overallMatch',
    });
    setErrorMessage(null);
    showToast('Started over with a clean slate. Ready for your resume.');
  };

  // 1. Analyze Resume from Text
  const handleAnalyzeText = async (
    text: string,
    state?: string,
    salary?: { min: number; max: number }
  ) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const extractedProfile = await analyzeResume({
        resumeText: text,
        userState: state,
        targetSalaryMin: salary?.min,
        targetSalaryMax: salary?.max,
      });

      const effectiveState = state || extractedProfile.userState || 'NC';
      extractedProfile.userState = effectiveState;
      if (salary?.min) extractedProfile.targetSalaryMin = salary.min;
      if (salary?.max) extractedProfile.targetSalaryMax = salary.max;

      setProfile(extractedProfile);
      setFilters((prev) => ({
        ...prev,
        userState: effectiveState,
        maxSalary: salary?.max || 0,
      }));

      showToast(`Resume ingested! Sourcing realistic remote jobs for ${extractedProfile.name}...`);
      await fetchJobsForProfile(extractedProfile, effectiveState, salary);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Failed to analyze resume.');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Analyze Resume from File Base64
  const handleAnalyzeFile = async (
    fileBase64: string,
    mimeType: string,
    fileName: string,
    clientText?: string,
    state?: string,
    salary?: { min: number; max: number }
  ) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const extractedProfile = await analyzeResume({
        resumeText: clientText,
        fileBase64,
        mimeType,
        fileName,
        userState: state,
        targetSalaryMin: salary?.min,
        targetSalaryMax: salary?.max,
      });

      const effectiveState = state || extractedProfile.userState || 'NC';
      extractedProfile.userState = effectiveState;
      if (salary?.min) extractedProfile.targetSalaryMin = salary.min;
      if (salary?.max) extractedProfile.targetSalaryMax = salary.max;

      setProfile(extractedProfile);
      setFilters((prev) => ({
        ...prev,
        userState: effectiveState,
        maxSalary: salary?.max || 0,
      }));

      showToast(`Ingested ${fileName}! Sourcing realistic remote jobs for ${extractedProfile.name}...`);
      await fetchJobsForProfile(extractedProfile, effectiveState, salary);
    } catch (err: any) {
      console.error('File analysis error:', err);
      setErrorMessage(err.message || 'Failed to analyze resume file.');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. Fetch Jobs for Profile (runs advanced multi-dimensional matching algorithm)
  const fetchJobsForProfile = async (
    targetProfile: CandidateProfile,
    targetState?: string,
    targetSalary?: { min: number; max: number }
  ) => {
    setIsLoadingJobs(true);
    setErrorMessage(null);

    const activeState = targetState || filters.userState || targetProfile.userState || 'NC';
    const activeMin = targetSalary?.min || filters.minSalary || targetProfile.targetSalaryMin || 48000;
    const activeMax = targetSalary?.max || filters.maxSalary || targetProfile.targetSalaryMax || 78000;

    try {
      const remoteJobs = await findRemoteJobs({
        profile: targetProfile,
        filters: {
          seniority: filters.seniority !== 'All' ? filters.seniority : targetProfile.seniorityLevel,
          region: filters.region !== 'All Regions' ? filters.region : undefined,
          userState: activeState,
          minSalary: activeMin,
          maxSalary: activeMax,
          onlyMyState: filters.onlyMyState,
        },
      });

      if (remoteJobs && remoteJobs.length > 0) {
        setJobs(remoteJobs);
      } else {
        const fallback = generateClientSideJobs(targetProfile, {
          seniority: filters.seniority !== 'All' ? filters.seniority : targetProfile.seniorityLevel,
          region: filters.region !== 'All Regions' ? filters.region : undefined,
          userState: activeState,
          minSalary: activeMin,
          maxSalary: activeMax,
        });
        setJobs(fallback);
      }
    } catch (err: any) {
      console.error('Fetch jobs notice, activating realistic local remote engine:', err);
      const fallbackJobs = generateClientSideJobs(targetProfile, {
        seniority: filters.seniority !== 'All' ? filters.seniority : targetProfile.seniorityLevel,
        region: filters.region !== 'All Regions' ? filters.region : undefined,
        userState: activeState,
        minSalary: activeMin,
        maxSalary: activeMax,
      });
      setJobs(fallbackJobs);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // 4. Tailor Resume Action
  const handleTailorResume = async (job: JobOpening) => {
    if (!profile) return;
    setSelectedJob(job);
    setIsTailorModalOpen(true);
    setIsTailoring(true);
    try {
      const tailored = await tailorResumeToRole({
        originalResumeText: profile.extractedResumeText,
        candidateProfile: profile,
        job,
      });
      setTailoredResume(tailored);
      showToast(`Tailored resume generated for ${job.company}!`);
    } catch (err: any) {
      console.error('Tailor error:', err);
      setErrorMessage('Failed to tailor resume.');
    } finally {
      setIsTailoring(false);
    }
  };

  // 5. Generate Cover Letter Action
  const handleGenerateCoverLetter = async (
    job: JobOpening,
    customPreferences?: { tone?: string; customParagraph?: string }
  ) => {
    if (!profile) return;
    setSelectedJob(job);
    setIsCoverLetterModalOpen(true);
    setIsGeneratingCoverLetter(true);
    try {
      const letter = await generateCoverLetter({
        candidateProfile: profile,
        job,
        tone: customPreferences?.tone,
        customParagraph: customPreferences?.customParagraph,
        companyResearch: companyResearchData,
      });
      setCoverLetter(letter);
      showToast(`Cover letter crafted for ${job.company}!`);
    } catch (err: any) {
      console.error('Cover letter error:', err);
      setErrorMessage('Failed to generate cover letter.');
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // 6. View Details
  const handleViewJobDetails = (job: JobOpening) => {
    setSelectedJob(job);
    setIsJobDetailModalOpen(true);
  };

  // 7. Research Company Intelligence
  const handleResearchCompany = async (job: JobOpening, forceRefresh = false) => {
    setSelectedJob(job);
    setIsCompanyResearchModalOpen(true);
    if (!forceRefresh && companyResearchData && companyResearchData.companyName.toLowerCase() === job.company.toLowerCase()) {
      return;
    }

    setIsLoadingResearch(true);
    try {
      const research = await fetchCompanyResearch({
        companyName: job.company,
        jobTitle: job.title,
        seniorityLevel: profile?.seniorityLevel || 'Mid-Level',
      });
      setCompanyResearchData(research);
    } catch (err: any) {
      console.error('Research error:', err);
    } finally {
      setIsLoadingResearch(false);
    }
  };

  // User State update
  const handleUpdateProfileState = (newState: string) => {
    if (profile) {
      const updated = { ...profile, userState: newState };
      setProfile(updated);
      setFilters((prev) => ({ ...prev, userState: newState }));
      fetchJobsForProfile(updated, newState);
      showToast(`Location updated to ${newState}. Refreshing state-eligible jobs.`);
    }
  };

  // Target Salary update
  const handleUpdateProfileSalary = (min: number, max: number) => {
    if (profile) {
      const updated = { ...profile, targetSalaryMin: min, targetSalaryMax: max };
      setProfile(updated);
      setFilters((prev) => ({ ...prev, minSalary: min, maxSalary: max }));
      fetchJobsForProfile(updated, profile.userState, { min, max });
      showToast(`Target comp updated to $${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k.`);
    }
  };

  // Filtered jobs computation with State-Specific & Achievable Salary Rules
  const filteredJobs = useMemo(() => {
    const activeUserState = filters.userState || profile?.userState || 'NC';

    const list = jobs.filter((job) => {
      // 1. Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesDesc = job.description.toLowerCase().includes(q);
        const matchesSkills = (job.requirements || []).some((r) => r.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesSkills) {
          return false;
        }
      }

      // 2. State-Specific Remote Restriction Filter
      if (filters.onlyMyState || (filters.userState && filters.userState !== 'All States')) {
        const checkState = filters.userState && filters.userState !== 'All States' ? filters.userState : activeUserState;
        const isNationwide =
          job.eligibleStates?.includes('All US') ||
          job.location.toLowerCase().includes('all 50 states') ||
          job.location.toLowerCase().includes('worldwide') ||
          job.location.toLowerCase().includes('anywhere');

        const isStateEligible = job.eligibleStates?.includes(checkState);

        if (!isNationwide && !isStateEligible) {
          return false;
        }
      }

      // 3. Achievable Salary Filter (Maximum Salary Ceiling)
      if (filters.maxSalary && filters.maxSalary > 0) {
        const parsed = parseSalaryRange(job.salary);
        // If the bottom end of the salary is higher than user's ceiling, exclude it!
        if (parsed.min > filters.maxSalary) {
          return false;
        }
      }

      // 4. Seniority
      if (filters.seniority !== 'All') {
        const titleLower = job.title.toLowerCase();
        if (filters.seniority === 'Junior') {
          const isJunior =
            titleLower.includes('junior') ||
            titleLower.includes('associate') ||
            titleLower.includes('tier 1') ||
            titleLower.includes('tier i') ||
            titleLower.includes('entry') ||
            titleLower.includes('assistant');
          if (!isJunior && (titleLower.includes('senior') || titleLower.includes('staff') || titleLower.includes('lead'))) {
            return false;
          }
        } else if (filters.seniority === 'Mid-Level') {
          if (titleLower.includes('staff') || titleLower.includes('principal') || titleLower.includes('director')) {
            return false;
          }
        } else if (filters.seniority === 'Senior') {
          if (!titleLower.includes('senior') && !titleLower.includes('lead') && !titleLower.includes('specialist') && !titleLower.includes('tier 2') && !titleLower.includes('tier ii')) {
            return false;
          }
        }
      }

      // 5. Region
      if (filters.region !== 'All Regions') {
        const locLower = job.location.toLowerCase();
        if (filters.region === 'Worldwide' && !locLower.includes('worldwide') && !locLower.includes('global')) {
          return false;
        }
        if (filters.region === 'US / Americas' && !locLower.includes('us') && !locLower.includes('americas') && !locLower.includes('worldwide') && !locLower.includes('states')) {
          return false;
        }
        if (filters.region === 'EMEA' && !locLower.includes('emea') && !locLower.includes('europe') && !locLower.includes('worldwide')) {
          return false;
        }
      }

      // 6. Min Match Score
      if (filters.minMatchScore > 0 && job.matchScore < filters.minMatchScore) {
        return false;
      }

      return true;
    });

    // Apply sorting
    return [...list].sort((a, b) => {
      if (filters.sortBy === 'salaryLowToHigh') {
        const salA = parseSalaryRange(a.salary).midpoint;
        const salB = parseSalaryRange(b.salary).midpoint;
        return salA - salB;
      }
      if (filters.sortBy === 'salaryHighToLow') {
        const salA = parseSalaryRange(a.salary).midpoint;
        const salB = parseSalaryRange(b.salary).midpoint;
        return salB - salA;
      }
      if (filters.sortBy === 'trajectoryFit') {
        const scoreA = a.trajectoryFitScore ?? a.matchScore;
        const scoreB = b.trajectoryFitScore ?? b.matchScore;
        return scoreB - scoreA;
      }
      if (filters.sortBy === 'cultureFit') {
        const scoreA = a.cultureFitScore ?? a.matchScore;
        const scoreB = b.cultureFitScore ?? b.matchScore;
        return scoreB - scoreA;
      }
      if (filters.sortBy === 'skillOverlap') {
        const scoreA = a.skillOverlapScore ?? a.matchScore;
        const scoreB = b.skillOverlapScore ?? b.matchScore;
        return scoreB - scoreA;
      }
      // Default: overall matchScore
      return b.matchScore - a.matchScore;
    });
  }, [jobs, filters, profile]);

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        profile={profile}
        onOpenUpload={() => setIsUploadOpen(true)}
        isAnalyzing={isAnalyzing}
        onRefreshJobs={() => profile && fetchJobsForProfile(profile)}
        isLoadingJobs={isLoadingJobs}
        onStartOver={handleStartOver}
      />

      {/* Candidate Profile Bar with State & Realistic Comp */}
      {profile && (
        <CandidateProfileBar
          profile={profile}
          onViewResume={() => setIsResumeViewerOpen(true)}
          onStartOver={handleStartOver}
          onUpdateState={handleUpdateProfileState}
          onUpdateSalary={handleUpdateProfileSalary}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Notice:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {!profile ? (
          /* Dedicated Resume Intake Launchpad with State & Realistic Salary Intake */
          <ResumeLaunchpad
            onAnalyzeText={handleAnalyzeText}
            onAnalyzeFile={handleAnalyzeFile}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          /* Active Candidate Dashboard */
          <>
            {/* Resume Ingestion Confirmation & Quick Actions Bar */}
            <div className="mb-6 bg-white border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      Resume Ingested
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">{profile.name}</span>
                    <span className="text-xs text-slate-600 font-medium">· {profile.title}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {profile.seniorityLevel} · {profile.yearsOfExperience} yrs exp · Home State: <strong className="text-slate-800">{profile.userState || 'NC'}</strong> · {jobs.length} realistic remote jobs sourced
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                <button
                  onClick={() => setIsResumeViewerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>View Pulled Resume</span>
                </button>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Upload Different Resume</span>
                </button>
                <button
                  onClick={handleStartOver}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors shadow-2xs"
                  title="Clear profile and start over with clean intake"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Start Over</span>
                </button>
              </div>
            </div>

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Achievable Remote Opportunities ({filteredJobs.length})
                  </h2>
                  {isLoadingJobs && (
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filtered for realistic salaries and verified state eligibility in <strong>{filters.userState || profile.userState || 'your state'}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Upload Custom Resume</span>
                </button>
              </div>
            </div>

            {/* Job Filter Bar */}
            <JobFilterBar
              filters={filters}
              onChange={setFilters}
              totalJobs={jobs.length}
              filteredCount={filteredJobs.length}
              userState={profile.userState || 'NC'}
            />

            {/* Jobs Grid */}
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    userState={profile.userState || filters.userState || 'NC'}
                    onTailorResume={handleTailorResume}
                    onGenerateCoverLetter={(j) => handleGenerateCoverLetter(j)}
                    onViewDetails={handleViewJobDetails}
                    onResearchCompany={handleResearchCompany}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8 space-y-4 shadow-2xs">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">No matching remote openings for these filters</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try switching to "All US States (Nationwide)", widening your salary ceiling, or resetting filters to see all {jobs.length} available roles.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      seniority: 'All',
                      minSalary: 0,
                      maxSalary: 0,
                      userState: 'All States',
                      onlyMyState: false,
                      minMatchScore: 0,
                      region: 'All Regions',
                      sortBy: 'overallMatch',
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>JobHunta · Realistic Remote Matching, State Eligibility & ATS Tailoring</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>State-Specific Remote Engine</span>
            <span>·</span>
            <span>Achievable Compensation Bands</span>
            <span>·</span>
            <span>Google XYZ Formula</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ResumeUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAnalyzeText={handleAnalyzeText}
        onAnalyzeFile={handleAnalyzeFile}
        isAnalyzing={isAnalyzing}
        activeResumeName={profile?.name}
        initialState={profile?.userState || 'NC'}
        initialSalary={{
          min: profile?.targetSalaryMin || 48000,
          max: profile?.targetSalaryMax || 75000,
        }}
      />

      <ResumeViewerModal
        isOpen={isResumeViewerOpen}
        onClose={() => setIsResumeViewerOpen(false)}
        profile={profile}
        onUpdateResumeText={(newText) => handleAnalyzeText(newText, profile?.userState)}
      />

      <TailorResumeModal
        isOpen={isTailorModalOpen}
        onClose={() => setIsTailorModalOpen(false)}
        tailoredResume={tailoredResume}
        job={selectedJob}
        isLoading={isTailoring}
        onRetry={() => selectedJob && handleTailorResume(selectedJob)}
      />

      <CoverLetterModal
        isOpen={isCoverLetterModalOpen}
        onClose={() => setIsCoverLetterModalOpen(false)}
        coverLetter={coverLetter}
        job={selectedJob}
        profile={profile}
        isLoading={isGeneratingCoverLetter}
        onRegenerate={(prefs) => selectedJob && handleGenerateCoverLetter(selectedJob, prefs)}
      />

      <JobDetailModal
        isOpen={isJobDetailModalOpen}
        onClose={() => setIsJobDetailModalOpen(false)}
        job={selectedJob}
        candidateProfile={profile}
        userState={profile?.userState || filters.userState || 'NC'}
        onTailorResume={(job) => {
          setIsJobDetailModalOpen(false);
          handleTailorResume(job);
        }}
        onGenerateCoverLetter={(job) => {
          setIsJobDetailModalOpen(false);
          handleGenerateCoverLetter(job);
        }}
        onResearchCompany={(job) => {
          setIsJobDetailModalOpen(false);
          handleResearchCompany(job);
        }}
      />

      {/* Company Research Intelligence Modal */}
      <CompanyResearchModal
        isOpen={isCompanyResearchModalOpen}
        onClose={() => setIsCompanyResearchModalOpen(false)}
        companyData={companyResearchData}
        job={selectedJob}
        isLoading={isLoadingResearch}
        onRefreshResearch={() => selectedJob && handleResearchCompany(selectedJob, true)}
        onTailorResume={(job) => {
          setIsCompanyResearchModalOpen(false);
          handleTailorResume(job);
        }}
        onGenerateCoverLetter={(job) => {
          setIsCompanyResearchModalOpen(false);
          handleGenerateCoverLetter(job);
        }}
      />
    </div>
  );
}
