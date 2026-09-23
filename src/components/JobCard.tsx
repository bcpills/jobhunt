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
  Briefcase
} from 'lucide-react';

interface JobCardProps {
  job: JobOpening;
  onTailorResume: (job: JobOpening) => void;
  onGenerateCoverLetter: (job: JobOpening) => void;
  onViewDetails: (job: JobOpening) => void;
  onResearchCompany: (job: JobOpening) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onTailorResume,
  onGenerateCoverLetter,
  onViewDetails,
  onResearchCompany,
}) => {
  const [showAlgorithmDetails, setShowAlgorithmDetails] = useState(false);

  // Determine match color styling based on overall composite score
  const isHighMatch = job.matchScore >= 88;
  const isModerateMatch = job.matchScore >= 78 && job.matchScore < 88;

  const trajectoryScore = job.trajectoryFitScore ?? Math.min(96, Math.max(80, job.matchScore + 1));
  const cultureScore = job.cultureFitScore ?? Math.min(97, Math.max(82, job.matchScore + 2));
  const skillScore = job.skillOverlapScore ?? Math.min(95, Math.max(78, job.matchScore - 1));

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Top bar: Company, Remote Indicator & Quick Research Link */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {job.company}
                </h4>
                {/* Direct quick-access button to company research */}
                <button
                  onClick={() => onResearchCompany(job)}
                  title={`Research ${job.company} size, news, Glassdoor reviews & salary bands`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100 px-1.5 py-0.5 rounded transition-colors"
                >
                  <Building2 className="w-3 h-3" />
                  <span>Research</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{job.location}</span>
                <span aria-hidden="true">·</span>
                <span className="text-indigo-700 font-medium">{job.workArrangement}</span>
              </div>
            </div>
          </div>

          {/* Overall Match Score Badge */}
          <div className="text-right shrink-0">
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                isHighMatch
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                  : isModerateMatch
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/80'
              }`}
            >
              <span>{job.matchScore}% Match</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{job.matchTier}</p>
          </div>
        </div>

        {/* Job Title & Salary */}
        <div className="mt-3.5">
          <h3
            onClick={() => onViewDetails(job)}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer leading-snug"
          >
            {job.title}
          </h3>
          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-xs font-semibold text-slate-700">
              {job.salary}
            </p>
            <button
              onClick={() => onResearchCompany(job)}
              className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              View Salary Benchmarks &rarr;
            </button>
          </div>
        </div>

        {/* Advanced Algorithm Multi-Factor Fit Matrix */}
        <div className="mt-3 pt-3 border-t border-slate-100/90">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1.5">
            <span className="text-slate-700">Matching Algorithm Breakdown</span>
            <button
              onClick={() => setShowAlgorithmDetails(!showAlgorithmDetails)}
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 text-[11px]"
            >
              <span>{showAlgorithmDetails ? 'Hide analysis' : 'Deep breakdown'}</span>
              {showAlgorithmDetails ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="bg-slate-50 border border-slate-200/70 rounded-md p-1.5">
              <span className="text-slate-400 block font-medium">Trajectory</span>
              <strong className="text-slate-800 text-xs font-bold">{trajectoryScore}%</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200/70 rounded-md p-1.5">
              <span className="text-slate-400 block font-medium">Culture Fit</span>
              <strong className="text-indigo-700 text-xs font-bold">{cultureScore}%</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200/70 rounded-md p-1.5">
              <span className="text-slate-400 block font-medium">Skill Depth</span>
              <strong className="text-emerald-700 text-xs font-bold">{skillScore}%</strong>
            </div>
          </div>

          {/* Expanded Algorithm Insights */}
          {showAlgorithmDetails && (
            <div className="mt-2.5 p-2.5 bg-indigo-50/40 rounded-lg border border-indigo-100/80 space-y-2 text-xs animate-in slide-in-from-top-1 duration-150">
              {job.careerTrajectoryAnalysis && (
                <div className="text-slate-700">
                  <div className="flex items-center gap-1 font-bold text-slate-900 text-[11px]">
                    <TrendingUp className="w-3 h-3 text-indigo-600" />
                    <span>Career Trajectory Fit:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {job.careerTrajectoryAnalysis}
                  </p>
                </div>
              )}

              {job.cultureFitDetails && (
                <div className="text-slate-700 pt-1 border-t border-indigo-100/60">
                  <div className="flex items-center gap-1 font-bold text-slate-900 text-[11px]">
                    <Award className="w-3 h-3 text-indigo-600" />
                    <span>Inferred Culture Alignment:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    <strong className="text-slate-800">{job.cultureFitDetails.companyStage}:</strong> {job.cultureFitDetails.alignmentNotes || job.cultureFitDetails.operatingStyle}
                  </p>
                </div>
              )}

              {job.skillOverlapDetails && job.skillOverlapDetails.matchedCore && (
                <div className="text-slate-700 pt-1 border-t border-indigo-100/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Core Technical Overlap:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.skillOverlapDetails.matchedCore.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="bg-white text-slate-700 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Why You Can Get This Job */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Why your background fits:</span>
          </div>
          <ul className="space-y-1">
            {(job.matchReasoning || []).slice(0, 2).map((reason, idx) => (
              <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold leading-none mt-1">✓</span>
                <span className="line-clamp-2">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prep Tip / Gap (if any) */}
        {job.skillGaps && job.skillGaps.length > 0 && (
          <div className="mt-2.5 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{job.skillGaps[0]}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="bg-slate-50/90 px-4 sm:px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Quick Access Button to Research Page */}
          <button
            onClick={() => onResearchCompany(job)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="Open comprehensive company research dossier"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Company Intel</span>
          </button>

          <button
            onClick={() => onViewDetails(job)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors px-1"
          >
            Specs
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Cover Letter Button */}
          <button
            onClick={() => onGenerateCoverLetter(job)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="Generate custom tailored cover letter"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Cover Letter</span>
          </button>

          {/* Primary Action: Tailor Resume */}
          <button
            onClick={() => onTailorResume(job)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-lg transition-all shadow-xs"
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
