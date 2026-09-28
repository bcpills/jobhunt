import React, { useState } from 'react';
import {
  Briefcase,
  UploadCloud,
  RefreshCw,
  RotateCcw,
  MapPin,
  DollarSign,
  Check,
  LogOut,
  Save,
  BookmarkCheck,
  Moon,
  Sun,
  Menu,
  X,
  HardDrive,
  UserCheck
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
  isLocalMode?: boolean;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onSaveResume?: () => void;
  isSavingResume?: boolean;
  resumeSaved?: boolean;
  appliedCount?: number;
  onShowAppliedOnly?: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenUpload,
  isAnalyzing,
  onRefreshJobs,
  isLoadingJobs,
  onStartOver,
  user,
  isLocalMode = false,
  onOpenAuth,
  onSignOut,
  onSaveResume,
  isSavingResume = false,
  resumeSaved = false,
  appliedCount = 0,
  onShowAppliedOnly,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userInitial = (user?.displayName || user?.email || 'U').slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 dark:text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                JobHunta
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wide text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 px-1.5 sm:px-2 py-0.5 rounded">
                Remote Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
              Realistic remote openings · Instant tailoring · Cover letters
            </p>
          </div>
        </div>

        {/* Desktop Navigation & Actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {profile && (
            <>
              {/* Location & Salary Indicators */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{profile.userState || 'Remote (All US)'}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 font-semibold">
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors shadow-2xs"
                  title="View your applied jobs"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                  }`}
                  title={user ? 'Save current resume to your account' : 'Save resume'}
                >
                  {isSavingResume ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                  ) : resumeSaved ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  )}
                  <span>{resumeSaved ? 'Resume Saved' : 'Save Resume'}</span>
                </button>
              )}

              <button
                onClick={onRefreshJobs}
                disabled={isLoadingJobs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors shadow-xs disabled:opacity-50"
                title="Pull fresh remote job opportunities"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingJobs ? 'animate-spin text-indigo-600 dark:text-indigo-400' : ''}`} />
                <span>Refresh</span>
              </button>

              {onStartOver && (
                <button
                  onClick={onStartOver}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 hover:text-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/80 border border-rose-200 dark:border-rose-900/60 rounded-lg transition-colors shadow-xs"
                  title="Clear profile and start over with a fresh resume"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Reset</span>
                </button>
              )}
            </>
          )}

          {/* Switch or Upload Resume Button */}
          <button
            onClick={onOpenUpload}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] rounded-lg transition-all shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{profile ? 'Switch Resume' : 'Upload'}</span>
          </button>
        </div>

        {/* Right side controls: Theme Toggle, User Account / Login, Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Account status: Authenticated Account OR Guest/Local Storage Mode */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {userInitial}
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px] xl:max-w-[140px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-medium">
                    <UserCheck className="w-2.5 h-2.5" />
                    <span>Signed In</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign out of your account"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : isLocalMode ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300"
                title="Your resume and applications are saved in your local browser storage"
              >
                <HardDrive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Browser Mode</span>
              </div>
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-all active:scale-[0.98]"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          {/* User Account Info on Mobile */}
          {user ? (
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {userInitial}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {user.displayName || user.email}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <UserCheck className="w-2.5 h-2.5" />
                    <span>Signed In</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 rounded-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  onOpenAuth('signin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-center text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 rounded-lg shadow-xs"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onOpenAuth('signup');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Create Account
              </button>
            </div>
          )}

          {profile && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{profile.userState || 'Remote'}</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  ${Math.round((profile.targetSalaryMin || 50000) / 1000)}k - $
                  {Math.round((profile.targetSalaryMax || 78000) / 1000)}k
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {appliedCount > 0 && onShowAppliedOnly && (
              <button
                onClick={() => {
                  onShowAppliedOnly();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Applied ({appliedCount})</span>
              </button>
            )}

            {profile && onSaveResume && (
              <button
                onClick={() => {
                  onSaveResume();
                  setMobileMenuOpen(false);
                }}
                disabled={isSavingResume}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl"
              >
                {resumeSaved ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                ) : (
                  <Save className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                )}
                <span>{resumeSaved ? 'Resume Saved' : 'Save Resume'}</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenUpload();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{profile ? 'Switch Resume' : 'Upload Resume'}</span>
            </button>

            {profile && (
              <button
                onClick={() => {
                  onRefreshJobs();
                  setMobileMenuOpen(false);
                }}
                disabled={isLoadingJobs}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingJobs ? 'animate-spin' : ''}`} />
                <span>Refresh Jobs</span>
              </button>
            )}
          </div>

          {profile && onStartOver && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end text-xs">
              <button
                onClick={() => {
                  onStartOver();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Intake</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
