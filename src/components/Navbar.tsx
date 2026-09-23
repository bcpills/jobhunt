import React from 'react';
import { Briefcase, UploadCloud, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { CandidateProfile } from '../types';

interface NavbarProps {
  profile: CandidateProfile | null;
  onOpenUpload: () => void;
  onSelectSample: (id: string) => void;
  sampleResumes: Array<{ id: string; name: string; targetRole: string }>;
  isAnalyzing: boolean;
  onRefreshJobs: () => void;
  isLoadingJobs: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenUpload,
  onSelectSample,
  sampleResumes,
  isAnalyzing,
  onRefreshJobs,
  isLoadingJobs,
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
              <span className="font-bold text-lg tracking-tight text-slate-900">RemoteMatch</span>
              <span className="text-[11px] font-medium tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded">
                AI Career Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Realistic remote openings · Role-specific tailoring · Cover letters
            </p>
          </div>
        </div>

        {/* Quick Sample Selector & Upload CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick sample switcher dropdown or buttons */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60">
            <span className="px-2 text-slate-400 font-medium flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Sample:
            </span>
            {sampleResumes.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample.id)}
                disabled={isAnalyzing}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  profile?.name === sample.name
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title={`Load ${sample.name} (${sample.targetRole})`}
              >
                {sample.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {profile && (
            <button
              onClick={onRefreshJobs}
              disabled={isLoadingJobs}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-50"
              title="Pull fresh remote job opportunities"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingJobs ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="hidden sm:inline">Refresh Jobs</span>
            </button>
          )}

          <button
            onClick={onOpenUpload}
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
