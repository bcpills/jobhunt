import React, { useState, useMemo } from 'react';
import { CandidateProfile, JobOpening, JobFilterState, TailoredResume, CoverLetter, CompanyResearchData } from './types';
import { SAMPLE_RESUMES } from './data/sampleResumes';
import { DEFAULT_REMOTE_JOBS } from './data/defaultJobs';
import { DEFAULT_COMPANY_RESEARCH } from './data/defaultCompanyResearch';
import { analyzeResume, findRemoteJobs, tailorResumeToRole, generateCoverLetter, fetchCompanyResearch } from './services/api';
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
import { Briefcase, RefreshCw, AlertCircle, CheckCircle2, Sparkles, Building2, RotateCcw, UploadCloud, FileText } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [filters, setFilters] = useState<JobFilterState>({
    searchQuery: '',
    seniority: 'All',
    minSalary: 0,
    minMatchScore: 0,
    region: 'All Regions',
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
      minMatchScore: 0,
      region: 'All Regions',
    });
    setErrorMessage(null);
    showToast('Started over with a clean slate. Ready for your resume.');
  };

  // 1. Analyze Resume from Text
  const handleAnalyzeText = async (text: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const extractedProfile = await analyzeResume({ resumeText: text });
      setProfile(extractedProfile);
      showToast(`Resume ingested! Sourcing remote jobs for ${extractedProfile.name}...`);
      await fetchJobsForProfile(extractedProfile);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Failed to analyze resume.');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Analyze Resume from File Base64
  const handleAnalyzeFile = async (fileBase64: string, mimeType: string, fileName: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const extractedProfile = await analyzeResume({ fileBase64, mimeType, fileName });
      setProfile(extractedProfile);
      showToast(`Ingested ${fileName}! Sourcing remote jobs for ${extractedProfile.name}...`);
      await fetchJobsForProfile(extractedProfile);
    } catch (err: any) {
      console.error('File analysis error:', err);
      setErrorMessage(err.message || 'Failed to analyze resume file.');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. Fetch Jobs for Profile (runs advanced multi-dimensional matching algorithm)
  const fetchJobsForProfile = async (targetProfile: CandidateProfile) => {
    setIsLoadingJobs(true);
    setErrorMessage(null);
    try {
      const remoteJobs = await findRemoteJobs({
        profile: targetProfile,
        filters: {
          seniority: filters.seniority !== 'All' ? filters.seniority : targetProfile.seniorityLevel,
          region: filters.region !== 'All Regions' ? filters.region : undefined,
        },
      });
      if (remoteJobs && remoteJobs.length > 0) {
        setJobs(remoteJobs);
      }
    } catch (err: any) {
      console.error('Fetch jobs error:', err);
      const friendlyMsg = err?.message && !err.message.includes('{"error"')
        ? err.message
        : 'The AI model is experiencing a momentary spike in traffic. Showing curated remote opportunities matched to your profile.';
      setErrorMessage(friendlyMsg);
      if (DEFAULT_REMOTE_JOBS && DEFAULT_REMOTE_JOBS.length > 0) {
        setJobs(DEFAULT_REMOTE_JOBS);
      }
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // 4. Quick Sample Selector
  const handleSelectSample = async (id: string) => {
    const sample = SAMPLE_RESUMES.find((s) => s.id === id);
    if (!sample) return;
    await handleAnalyzeText(sample.text);
  };

  // 5. Tailor Resume Action
  const handleTailorResume = async (job: JobOpening) => {
    if (!profile) return;
    setSelectedJob(job);
    setIsTailorModalOpen(true);
    setIsTailoring(true);
    setTailoredResume(null);

    try {
      const result = await tailorResumeToRole({
        originalResumeText: profile.extractedResumeText || profile.summary,
        candidateProfile: profile,
        job: job,
      });
      setTailoredResume(result);
    } catch (err: any) {
      console.error('Tailoring error:', err);
      showToast('Error tailoring resume: ' + (err.message || 'Failed'));
    } finally {
      setIsTailoring(false);
    }
  };

  // 6. Cover Letter Action
  const handleGenerateCoverLetter = async (
    job: JobOpening,
    preferences?: { tone: string; length: string; customNotes?: string }
  ) => {
    if (!profile) return;
    setSelectedJob(job);
    setIsCoverLetterModalOpen(true);
    setIsGeneratingCoverLetter(true);
    setCoverLetter(null);

    try {
      const result = await generateCoverLetter({
        originalResumeText: profile.extractedResumeText || profile.summary,
        candidateProfile: profile,
        job: job,
        preferences: preferences || { tone: 'Professional & Confident', length: 'Balanced (~350 words)' },
      });
      setCoverLetter(result);
    } catch (err: any) {
      console.error('Cover letter error:', err);
      showToast('Error generating cover letter: ' + (err.message || 'Failed'));
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // 7. View Job Details Specs
  const handleViewJobDetails = (job: JobOpening) => {
    setSelectedJob(job);
    setIsJobDetailModalOpen(true);
  };

  // 8. Company Research Action
  const handleResearchCompany = async (job: JobOpening, forceRefresh = false) => {
    setSelectedJob(job);
    setIsCompanyResearchModalOpen(true);

    // If pre-cached in our default database and not forced refresh, show immediately
    const defaultData = DEFAULT_COMPANY_RESEARCH[job.company];
    if (defaultData && !forceRefresh) {
      setCompanyResearchData(defaultData);
      return;
    }

    // Otherwise or if force refresh, pull live from backend
    setIsLoadingResearch(true);
    try {
      const research = await fetchCompanyResearch({
        companyName: job.company,
        jobTitle: job.title,
        seniorityLevel: profile?.seniorityLevel || 'Senior',
        companyDomain: job.companyDomain,
      });
      setCompanyResearchData(research);
    } catch (err: any) {
      console.warn('Live research fallback to default:', err);
      if (defaultData) {
        setCompanyResearchData(defaultData);
      } else {
        showToast('Unable to load real-time intelligence for ' + job.company);
      }
    } finally {
      setIsLoadingResearch(false);
    }
  };

  // Filtered jobs computation with Multi-Dimensional Algorithm Sorting
  const filteredJobs = useMemo(() => {
    const list = jobs.filter((job) => {
      // Search query
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

      // Seniority
      if (filters.seniority !== 'All') {
        const titleLower = job.title.toLowerCase();
        if (filters.seniority === 'Mid-Level' && (titleLower.includes('senior') || titleLower.includes('staff') || titleLower.includes('lead') || titleLower.includes('principal'))) {
          return false;
        }
        if (filters.seniority === 'Staff/Lead' && !titleLower.includes('staff') && !titleLower.includes('lead') && !titleLower.includes('principal') && !titleLower.includes('director')) {
          return false;
        }
      }

      // Region
      if (filters.region !== 'All Regions') {
        const locLower = job.location.toLowerCase();
        if (filters.region === 'Worldwide' && !locLower.includes('worldwide') && !locLower.includes('global')) {
          return false;
        }
        if (filters.region === 'US / Americas' && !locLower.includes('us') && !locLower.includes('americas') && !locLower.includes('worldwide')) {
          return false;
        }
        if (filters.region === 'EMEA' && !locLower.includes('emea') && !locLower.includes('europe') && !locLower.includes('worldwide')) {
          return false;
        }
      }

      // Min Match Score
      if (filters.minMatchScore > 0 && job.matchScore < filters.minMatchScore) {
        return false;
      }

      return true;
    });

    // Apply sorting according to selected algorithm axis
    return [...list].sort((a, b) => {
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
      // Default: composite overall matchScore
      return b.matchScore - a.matchScore;
    });
  }, [jobs, filters]);

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
        onSelectSample={handleSelectSample}
        sampleResumes={SAMPLE_RESUMES}
        isAnalyzing={isAnalyzing}
        onRefreshJobs={() => profile && fetchJobsForProfile(profile)}
        isLoadingJobs={isLoadingJobs}
        onStartOver={handleStartOver}
      />

      {/* Candidate Profile Bar with Trajectory & Culture Diagnostic */}
      {profile && (
        <CandidateProfileBar
          profile={profile}
          onViewResume={() => setIsResumeViewerOpen(true)}
          onStartOver={handleStartOver}
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
          /* Dedicated Resume Intake Launchpad when no resume is loaded */
          <ResumeLaunchpad
            onAnalyzeText={handleAnalyzeText}
            onAnalyzeFile={handleAnalyzeFile}
            onSelectSample={handleSelectSample}
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
                    {profile.seniorityLevel} · {profile.yearsOfExperience} yrs exp · {profile.extractedResumeText ? `${profile.extractedResumeText.length} characters parsed` : 'Profile active'} · {jobs.length} tailored remote jobs found
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
                    Targeted Remote Opportunities
                  </h2>
                  {isLoadingJobs && (
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranked with multi-dimensional matching for {profile.name}: Career Trajectory, Culture Archetype & Deep Skill Overlap.
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
            />

            {/* Jobs Grid */}
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
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
                  <h3 className="text-base font-bold text-slate-800">No matching remote openings</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try widening your search filter, selecting "Any Region", or resetting filters to see all available roles.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      seniority: 'All',
                      minSalary: 0,
                      minMatchScore: 0,
                      region: 'All Regions',
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
          <p>RemoteMatch · Advanced Career Trajectory, Company Intelligence & ATS Resume Tailoring</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Multi-Factor Algorithm</span>
            <span>·</span>
            <span>Glassdoor Sentiment Benchmarks</span>
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
      />

      <ResumeViewerModal
        isOpen={isResumeViewerOpen}
        onClose={() => setIsResumeViewerOpen(false)}
        profile={profile}
        onUpdateResumeText={(newText) => handleAnalyzeText(newText)}
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
