import React, { useState } from 'react';
import { JobOpening } from '../types';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Check,
  AlignLeft,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import { getJobPostingUrl } from '../utils/clientResumeParser';

interface JobCardProps {
  job: JobOpening;
  userState?: string;
  isApplied?: boolean;
  onToggleApply?: (job: JobOpening) => void;
  onTailorResume: (job: JobOpening) => void;
  onGenerateCoverLetter: (job: JobOpening) => void;
  onViewDetails: (job: JobOpening) => void;
  onResearchCompany: (job: JobOpening) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  userState = 'NC',
  isApplied = false,
  onToggleApply,
  onTailorResume,
  onGenerateCoverLetter,
  onViewDetails,
  onResearchCompany,
}) => {
  const [showAlgorithmDetails, setShowAlgorithmDetails] = useState(false);

  // Match color styling
  const isStretch = job.matchTier === 'Stretch Role';
  const isHighMatch = job.matchScore >= 88;
  const isModerateMatch = job.matchScore >= 78 && job.matchScore < 88;

  const trajectoryScore = job.trajectoryFitScore ?? Math.min(96, Math.max(80, job.matchScore + 1));
  const cultureScore = job.cultureFitScore ?? Math.min(97, Math.max(82, job.matchScore + 2));
  const skillScore = job.skillOverlapScore ?? Math.min(95, Math.max(78, job.matchScore - 1));

  const isNationwide = job.eligibleStates?.includes('All US') || job.location.includes('All 50 States');
  const isEligibleInState = isNationwide || (userState && job.eligibleStates?.includes(userState));

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all flex flex-col justify-between group overflow-hidden ${
        isApplied
          ? 'border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-200/80 dark:ring-emerald-900/60 shadow-xs'
          : 'border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top bar: Company, Remote Indicator & Quick Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0 border border-slate-700/50">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate">
                  {job.company}
                </h4>
                {/* Direct quick-access button to company research */}
                <button
                  onClick={() => onResearchCompany(job)}
                  title={`Research ${job.company} company intelligence`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-1.5 py-0.5 rounded transition-colors"
                >
                  <Building2 className="w-3 h-3" />
                  <span>Research</span>
                </button>

                {/* Direct link to original job posting */}
                <a
                  href={getJobPostingUrl(job)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={`Open official job posting for ${job.title} at ${job.company}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-1.5 py-0.5 rounded transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                  <span>Posting</span>
                </a>

                {isApplied && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.2 rounded-full">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Applied</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span className="truncate">{job.location}</span>
                <span aria-hidden="true">·</span>
                <span className="text-indigo-700 dark:text-indigo-400 font-medium">{job.workArrangement}</span>
              </div>

              {/* State Eligibility Pill & Stretch Badge */}
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                {isNationwide ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2 py-0.5 rounded">
                    🌐 Nationwide (All 50 States)
                  </span>
                ) : isEligibleInState ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                    🟢 Eligible in {userState}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded">
                    📍 State-Specific
                  </span>
                )}

                {isStretch && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50/90 dark:bg-amber-950/80 border border-amber-300/80 dark:border-amber-800 px-2 py-0.5 rounded">
                    🚀 Stretch Role
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Overall Match Score Badge */}
          <div className="text-right shrink-0">
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                isStretch
                  ? 'bg-amber-100/80 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-2xs'
                  : isHighMatch
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
                  : isModerateMatch
                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800'
                  : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800'
              }`}
            >
              <span>{job.matchScore}% Match</span>
            </div>
            <p className={`text-[11px] mt-0.5 font-semibold flex items-center justify-end gap-1 ${
              isStretch
                ? 'text-amber-700 dark:text-amber-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 font-medium'
            }`}>
              {isStretch && <span>🚀</span>}
              <span>{job.matchTier}</span>
            </p>
          </div>
        </div>

        {/* Job Title & Salary */}
        <div className="mt-3.5">
          <h3
            onClick={() => onViewDetails(job)}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer leading-snug"
          >
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <span>{job.salary}</span>
            </p>
            <div className="flex items-center gap-2">
              <a
                href={getJobPostingUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
                title={`Open official job posting for ${job.title} in a new tab`}
              >
                <span>Job Posting</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
              <button
                onClick={() => onViewDetails(job)}
                className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                View Details &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* JOB DESCRIPTION FIRST: Prominent overview snippet so candidate knows the role */}
        <div className="mt-3 p-3 bg-slate-50/90 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            <AlignLeft className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span>Job Description & Role Summary</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
            {job.description}
          </p>
        </div>

        {/* Why You Can Get This Job */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Why your background fits:</span>
          </div>
          <ul className="space-y-1">
            {(job.matchReasoning || []).slice(0, 2).map((reason, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold leading-none mt-0.5">✓</span>
                <span className="line-clamp-2">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prep Tip / Gap (if any) */}
        {job.skillGaps && job.skillGaps.length > 0 && (
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-amber-50/50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-100 dark:border-amber-900/60 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{job.skillGaps[0]}</span>
          </div>
        )}

        {/* Secondary: Subtle Company Specs & Matching Matrix (Expanded on Demand) */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-600 dark:text-slate-400">Company & Algorithmic Fit</span>
            <button
              onClick={() => setShowAlgorithmDetails(!showAlgorithmDetails)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-0.5 text-[11px] font-medium"
            >
              <span>{showAlgorithmDetails ? 'Hide matrix' : 'Show fit matrix'}</span>
              {showAlgorithmDetails ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {showAlgorithmDetails && (
            <div className="mt-2 p-2.5 bg-indigo-50/40 dark:bg-indigo-950/40 rounded-lg border border-indigo-100/80 dark:border-indigo-900/60 space-y-2 text-xs animate-in slide-in-from-top-1 duration-150">
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-md p-1.5">
                  <span className="text-slate-400 block font-medium">Trajectory</span>
                  <strong className="text-slate-800 dark:text-slate-200 text-xs font-bold">{trajectoryScore}%</strong>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-md p-1.5">
                  <span className="text-slate-400 block font-medium">Culture Fit</span>
                  <strong className="text-indigo-700 dark:text-indigo-400 text-xs font-bold">{cultureScore}%</strong>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-md p-1.5">
                  <span className="text-slate-400 block font-medium">Skill Depth</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">{skillScore}%</strong>
                </div>
              </div>

              {job.careerTrajectoryAnalysis && (
                <div className="text-slate-700 dark:text-slate-300 pt-1 border-t border-indigo-100/60 dark:border-indigo-900/60">
                  <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                    <TrendingUp className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    <span>Career Trajectory:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {job.careerTrajectoryAnalysis}
                  </p>
                </div>
              )}

              {job.cultureFitDetails && (
                <div className="text-slate-700 dark:text-slate-300 pt-1 border-t border-indigo-100/60 dark:border-indigo-900/60">
                  <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                    <Award className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    <span>Inferred Culture ({job.cultureFitDetails.companyStage}):</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {job.cultureFitDetails.alignmentNotes || job.cultureFitDetails.operatingStyle}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer - Mobile Friendly Tap Targets (min 44px) */}
      <div className="bg-slate-50/90 dark:bg-slate-950/70 px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Mark as Applied Button */}
          {onToggleApply && (
            <button
              onClick={() => onToggleApply(job)}
              className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all shadow-2xs active:scale-[0.98] ${
                isApplied
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title={isApplied ? 'Unmark job as applied' : 'Mark as applied for tracking'}
            >
              {isApplied ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Applied</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Mark Applied</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onViewDetails(job)}
            className="min-h-[40px] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-2.5 py-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800"
          >
            Details
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct link to original job posting */}
          <a
            href={getJobPostingUrl(job)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white bg-indigo-50/90 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl transition-all shadow-2xs active:scale-[0.98]"
            title={`Open official job posting for ${job.title} in a new tab`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Job Posting</span>
          </a>

          {/* Cover Letter Button */}
          <button
            onClick={() => onGenerateCoverLetter(job)}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-2xs active:scale-[0.98]"
            title="Generate custom tailored cover letter"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Cover Letter</span>
            <span className="sm:hidden">Letter</span>
          </button>

          {/* Primary Action: Tailor Resume */}
          <button
            onClick={() => onTailorResume(job)}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 active:scale-[0.98] rounded-xl transition-all shadow-xs"
            title="Tailor your resume bullet points and ATS keywords specifically to this role"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Tailor Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};
