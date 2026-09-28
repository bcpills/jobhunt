import React from 'react';
import {
  Briefcase,
  UploadCloud,
  RefreshCw,
  RotateCcw,
  MapPin,
  DollarSign,
  CloudCheck,
  Check,
  LogOut,
  Save,
  BookmarkCheck
} from 'lucide-react';
import { CandidateProfile } from '../types';
import { User } from 'firebase/auth';

interface NavbarProps {
  profile: CandidateProfile | null;
  onOpenUpload: () => void;
  isAnalyzing: boolean;
  onRefreshJobs: () => void;
  isLoadingJobs: boolean;
  onStartOver?: () => void;
  user: User | null;
  onSignInGoogle: () => void;
  onSignOutGoogle: () => void;
  onSaveResume?: () => void;
  isSavingResume?: boolean;
  resumeSaved?: boolean;
  appliedCount?: number;
  onShowAppliedOnly?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenUpload,
  isAnalyzing,
  onRefreshJobs,
  isLoadingJobs,
  onStartOver,
  user,
  onSignInGoogle,
  onSignOutGoogle,
  onSaveResume,
  isSavingResume = false,
  resumeSaved = false,
  appliedCount = 0,
  onShowAppliedOnly,
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
              <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
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

              {/* Applied Jobs Counter Shortcut */}
              {appliedCount > 0 && onShowAppliedOnly && (
                <button
                  onClick={onShowAppliedOnly}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
                  title="View your applied jobs"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Applied ({appliedCount})</span>
                </button>
              )}

              {/* Save Resume Button */}
              {onSaveResume && (
                <button
                  onClick={onSaveResume}
                  disabled={isSavingResume}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-2xs ${
                    resumeSaved
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                  }`}
                  title={user ? 'Save current resume to your Google account' : 'Sign in with Google to save resume'}
                >
                  {isSavingResume ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  ) : resumeSaved ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  <span>{resumeSaved ? 'Resume Saved' : 'Save Resume'}</span>
                </button>
              )}

              <button
                onClick={onRefreshJobs}
                disabled={isLoadingJobs}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-50"
                title="Pull fresh remote job opportunities"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingJobs ? 'animate-spin text-indigo-600' : ''}`} />
                <span>Refresh Jobs</span>
              </button>

              {onStartOver && (
                <button
                  onClick={onStartOver}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-lg transition-colors shadow-xs"
                  title="Clear profile and start over with a fresh resume"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Start Over</span>
                </button>
              )}
            </>
          )}

          {/* Change or Upload Resume Button */}
          <button
            onClick={onOpenUpload}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] rounded-lg transition-all shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
            <span>{profile ? 'Switch Resume' : 'Upload'}</span>
          </button>

          {/* Google Account Section */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-8 h-8 rounded-full border border-slate-300 object-cover shadow-2xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {(user.displayName || user.email || 'U').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-800 truncate max-w-[120px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400">Google Account</div>
                </div>
              </div>

              <button
                onClick={onSignOutGoogle}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Sign out of Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInGoogle}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-all active:scale-[0.98]"
              title="Sign in with your Google account to save your resume and applied jobs"
            >
              {/* Google Colored Logo SVG */}
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.39 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.61 1.26 6.58l4.02 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
