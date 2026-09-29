import React, { useState } from 'react';
import { JobOpening, CandidateProfile } from '../types';
import { SalaryBenchmarkChart } from './SalaryBenchmarkChart';
import { getJobPostingUrl } from '../utils/clientResumeParser';
import {
  X,
  ExternalLink,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building2,
  Gift,
  TrendingUp,
  Award,
  Layers,
  BookmarkCheck,
  Check
} from 'lucide-react';

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobOpening | null;
  candidateProfile?: CandidateProfile | null;
  userState?: string;
  isApplied?: boolean;
  onToggleApply?: (job: JobOpening) => void;
  onTailorResume: (job: JobOpening) => void;
  onGenerateCoverLetter: (job: JobOpening) => void;
  onResearchCompany: (job: JobOpening) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  isOpen,
  onClose,
  job,
  candidateProfile,
  userState = 'NC',
  isApplied = false,
  onToggleApply,
  onTailorResume,
  onGenerateCoverLetter,
  onResearchCompany,
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'companySpecs'>('description');

  if (!isOpen || !job) return null;

  const trajectoryScore = job.trajectoryFitScore ?? Math.min(96, Math.max(80, job.matchScore + 1));
  const cultureScore = job.cultureFitScore ?? Math.min(97, Math.max(82, job.matchScore + 2));
  const skillScore = job.skillOverlapScore ?? Math.min(95, Math.max(78, job.matchScore - 1));

  const isNationwide = job.eligibleStates?.includes('All US') || job.location.includes('All 50 States');
  const isEligibleInState = isNationwide || (userState && job.eligibleStates?.includes(userState));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {job.company}
              </span>
              <button
                onClick={() => onResearchCompany(job)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 px-2 py-0.5 rounded transition-colors"
                title="Open company research dossier"
              >
                <Building2 className="w-3 h-3" />
                <span>Research Company</span>
              </button>

              {/* Direct link to original job posting */}
              <a
                href={getJobPostingUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200/90 dark:border-indigo-800 px-2 py-0.5 rounded transition-colors"
                title="Open official job posting in a new tab"
              >
                <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>Job Posting</span>
              </a>

              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800">
                {job.matchScore}% Match ({job.matchTier})
              </span>

              {/* Applied Indicator Badge */}
              {isApplied && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Applied</span>
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {job.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300 pt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {job.location}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{job.salary}</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-indigo-700 dark:text-indigo-400 font-medium">{job.workArrangement}</span>
            </div>

            {/* State Eligibility Note */}
            <div className="pt-1 flex items-center gap-2">
              {isNationwide ? (
                <span className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-medium">
                  🌐 Nationwide Remote: Open to all 50 US States
                </span>
              ) : isEligibleInState ? (
                <span className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded font-medium">
                  🟢 Eligible for Remote Work in {userState} · {job.stateEligibilityNote || 'Open to your state'}
                </span>
              ) : (
                <span className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded font-medium">
                  📍 State-Specific Remote: {job.stateEligibilityNote || (job.eligibleStates ? `Eligible in ${job.eligibleStates.join(', ')}` : 'Restricted states')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Link to Job Posting */}
            <a
              href={getJobPostingUrl(job)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xs"
              title="Open official job posting on company site in a new tab"
            >
              <span>Job Posting</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {onToggleApply && (
              <button
                onClick={() => onToggleApply(job)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isApplied
                    ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title={isApplied ? 'Click to unmark as applied' : 'Mark this job as applied for'}
              >
                {isApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Applied ✓</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Mark Applied</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher: Job Description First! */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'description'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Job Description & Role</span>
          </button>
          <button
            onClick={() => setActiveTab('companySpecs')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'companySpecs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Company Specs & Fit</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 sm:space-y-6">
          {activeTab === 'description' ? (
            <>
              {/* PRIMARY VIEW: Job Description & Qualifications First */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Job Description & Overview</span>
                  </h3>
                  <a
                    href={getJobPostingUrl(job)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
                    title="Open original job posting in a new tab"
                  >
                    <span>Original Posting</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Core Responsibilities */}
              {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    Core Responsibilities
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
                    {job.keyResponsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-2 shrink-0" />
                        <span className="leading-normal">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements & Qualifications */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    Requirements & Qualifications
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
                    {job.requirements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-2 shrink-0" />
                        <span className="leading-normal">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fit & Gap Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Why You Are Qualified</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {(job.matchReasoning || []).map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Preparation & Focus Points</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {(job.skillGaps || ['Review their primary public documentation before interview stage']).map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* SECONDARY VIEW: Company Specs & Algorithmic Fit */}
              <div className="space-y-6">
                {/* 3-Pillar Score Cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  <div className="p-3 sm:p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Career Trajectory
                    </span>
                    <strong className="text-xl sm:text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 mt-1 block">
                      {trajectoryScore}%
                    </strong>
                  </div>

                  <div className="p-3 sm:p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Culture Fit
                    </span>
                    <strong className="text-xl sm:text-2xl font-extrabold text-blue-700 dark:text-blue-400 mt-1 block">
                      {cultureScore}%
                    </strong>
                  </div>

                  <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Skill Depth
                    </span>
                    <strong className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 block">
                      {skillScore}%
                    </strong>
                  </div>
                </div>

                {/* Salary Benchmark */}
                <div className="bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    Salary Benchmark vs Market
                  </h4>
                  <SalaryBenchmarkChart
                    job={job}
                    candidateProfile={candidateProfile}
                  />
                </div>

                {/* Company Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Remote Policy & State Rules</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{job.workArrangement}</p>
                    <p className="text-slate-500 dark:text-slate-400">{job.stateEligibilityNote || 'Eligible in designated remote states'}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Experience Level & Hierarchy</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{candidateProfile?.seniorityLevel || job.matchTier || 'Mid-Level / Specialist'}</p>
                    <p className="text-slate-500 dark:text-slate-400">Aligned with realistic candidate skill profile</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Mobile-Friendly Sticky Action Buttons */}
        <div className="p-3 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                onClose();
                onResearchCompany(job);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200/80 dark:border-indigo-800 px-3 py-2 rounded-xl transition-colors min-h-[40px]"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Company Dossier</span>
            </button>

            <a
              href={getJobPostingUrl(job)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white bg-indigo-50/90 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/90 dark:border-indigo-800 px-3 py-2 rounded-xl transition-colors min-h-[40px]"
              title="Open official job posting in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Open Job Posting</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onGenerateCoverLetter(job);
              }}
              className="flex-1 sm:flex-initial min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Cover Letter</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTailorResume(job);
              }}
              className="flex-1 sm:flex-initial min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Tailor Resume</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
