import React from 'react';
import { JobOpening, CandidateProfile } from '../types';
import { SalaryBenchmarkChart } from './SalaryBenchmarkChart';
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
  Layers
} from 'lucide-react';

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobOpening | null;
  candidateProfile?: CandidateProfile | null;
  userState?: string;
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
  onTailorResume,
  onGenerateCoverLetter,
  onResearchCompany,
}) => {
  if (!isOpen || !job) return null;

  const trajectoryScore = job.trajectoryFitScore ?? Math.min(96, Math.max(80, job.matchScore + 1));
  const cultureScore = job.cultureFitScore ?? Math.min(97, Math.max(82, job.matchScore + 2));
  const skillScore = job.skillOverlapScore ?? Math.min(95, Math.max(78, job.matchScore - 1));

  const isNationwide = job.eligibleStates?.includes('All US') || job.location.includes('All 50 States');
  const isEligibleInState = isNationwide || (userState && job.eligibleStates?.includes(userState));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {job.company}
              </span>
              <button
                onClick={() => onResearchCompany(job)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded transition-colors"
                title="Open company research dossier"
              >
                <Building2 className="w-3 h-3" />
                <span>Research Company</span>
              </button>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                {job.matchScore}% Match ({job.matchTier})
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold text-slate-800">{job.salary}</span>
              <span className="text-slate-300">·</span>
              <span className="text-indigo-700 font-medium">{job.workArrangement}</span>
            </div>

            {/* State Eligibility Note */}
            <div className="pt-1.5 flex items-center gap-2">
              {isNationwide ? (
                <span className="text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded font-medium">
                  🌐 Nationwide Remote: Open to all 50 US States
                </span>
              ) : isEligibleInState ? (
                <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-medium">
                  🟢 Eligible for Remote Work in {userState} · {job.stateEligibilityNote || 'Open to your state'}
                </span>
              ) : (
                <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded font-medium">
                  📍 State-Specific Remote: {job.stateEligibilityNote || (job.eligibleStates ? `Eligible in ${job.eligibleStates.join(', ')}` : 'Restricted states')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Advanced Job Matching Algorithm Breakdown Card */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Personalized Algorithm Matching Matrix
                </h4>
              </div>
              <span className="text-[11px] font-bold text-indigo-700">
                Composite Fit: {job.matchScore}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="bg-white border border-indigo-100/90 rounded-lg p-2.5 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Career Trajectory</span>
                <span className="text-sm font-extrabold text-slate-900 block mt-0.5">{trajectoryScore}%</span>
                <span className="text-[10px] text-indigo-600">Promotion Scope</span>
              </div>
              <div className="bg-white border border-indigo-100/90 rounded-lg p-2.5 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Culture & Workstyle</span>
                <span className="text-sm font-extrabold text-indigo-700 block mt-0.5">{cultureScore}%</span>
                <span className="text-[10px] text-indigo-600">Async / Autonomy</span>
              </div>
              <div className="bg-white border border-indigo-100/90 rounded-lg p-2.5 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Skill Parity</span>
                <span className="text-sm font-extrabold text-emerald-700 block mt-0.5">{skillScore}%</span>
                <span className="text-[10px] text-emerald-600">Production Tech</span>
              </div>
            </div>

            {/* Trajectory & Culture Explanations */}
            <div className="space-y-2 pt-1 text-xs text-slate-700">
              {job.careerTrajectoryAnalysis && (
                <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-indigo-100/60">
                  <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Career Trajectory Alignment:</strong>
                    <span className="text-slate-600">{job.careerTrajectoryAnalysis}</span>
                  </div>
                </div>
              )}

              {job.cultureFitDetails && (
                <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-indigo-100/60">
                  <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Inferred Culture Alignment ({job.cultureFitDetails.companyStage}):</strong>
                    <span className="text-slate-600">
                      {job.cultureFitDetails.alignmentNotes || job.cultureFitDetails.operatingStyle}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recharts Salary Benchmark Visualization */}
          <SalaryBenchmarkChart job={job} candidateProfile={candidateProfile} />

          {/* Fit & Gap Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Why You Are Qualified</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(job.matchReasoning || []).map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Preparation & Focus Points</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(job.skillGaps || ['Review their primary public documentation before interview stage']).map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Role Overview & Team Context
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Core Responsibilities
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {job.keyResponsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Requirements & Qualifications
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {job.requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-slate-500" />
                <span>Remote Perks & Benefits</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onResearchCompany(job);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Full Company Dossier</span>
            </button>

            <a
              href={job.applyUrl || `https://www.google.com/search?q=${encodeURIComponent(`${job.company} ${job.title} remote careers`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>Search Official Careers</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onGenerateCoverLetter(job);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Generate Cover Letter</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTailorResume(job);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Tailor Resume to Role</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
