import React from 'react';
import { Briefcase, UploadCloud, RefreshCw, RotateCcw, MapPin, DollarSign } from 'lucide-react';
import { CandidateProfile } from '../types';

interface NavbarProps {
  profile: CandidateProfile | null;
  onOpenUpload: () => void;
  isAnalyzing: boolean;
  onRefreshJobs: () => void;
  isLoadingJobs: boolean;
  onStartOver?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenUpload,
  isAnalyzing,
  onRefreshJobs,
  isLoadingJobs,
  onStartOver,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <Briefcase className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">JobHunta</span>
              <span className="text-[11px] font-bold tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded">
                Remote Job Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Sourcing realistic remote openings · Instant tailoring · Cover letters
            </p>
          </div>
        </div>

        {/* Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {profile && (
            <>
              {/* Location & Salary Indicators */}
              <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
                <span className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{profile.userState || 'Remote (All US)'}</span>
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-0.5 text-emerald-700 font-semibold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>
                    ${Math.round((profile.targetSalaryMin || profile.salaryExpectationRange?.min || 50000) / 1000)}k - $
                    {Math.round((profile.targetSalaryMax || profile.salaryExpectationRange?.max || 78000) / 1000)}k
                  </span>
                </span>
              </div>

              <button
                onClick={onRefreshJobs}
                disabled={isLoadingJobs}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-50"
                title="Pull fresh remote job opportunities"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingJobs ? 'animate-spin text-indigo-600' : ''}`} />
                <span className="hidden sm:inline">Refresh Jobs</span>
              </button>

              {onStartOver && (
                <button
                  onClick={onStartOver}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-lg transition-colors shadow-xs"
                  title="Clear profile and start over with a fresh resume"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Start Over</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={onOpenUpload}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-lg transition-all shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-indigo-300" />
            <span>{profile ? 'Change Resume' : 'Upload Resume'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
