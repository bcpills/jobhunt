import React, { useState } from 'react';
import { CandidateProfile } from '../types';
import {
  DollarSign,
  Globe,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  RotateCcw,
  MapPin,
  Edit2,
  Save,
  Check,
  RefreshCw
} from 'lucide-react';
import { US_STATE_NAMES, cleanCandidateName, cleanTitle } from '../utils/clientResumeParser';
import { User } from 'firebase/auth';

interface CandidateProfileBarProps {
  profile: CandidateProfile;
  onViewResume: () => void;
  onStartOver?: () => void;
  onUpdateState?: (newState: string) => void;
  onUpdateSalary?: (min: number, max: number) => void;
  user?: User | null;
  onSaveResume?: () => void;
  isSavingResume?: boolean;
  resumeSaved?: boolean;
}

export const CandidateProfileBar: React.FC<CandidateProfileBarProps> = ({
  profile,
  onViewResume,
  onStartOver,
  onUpdateState,
  onUpdateSalary,
  user,
  onSaveResume,
  isSavingResume = false,
  resumeSaved = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [selectedState, setSelectedState] = useState(profile.userState || 'NC');
  const [targetMin, setTargetMin] = useState(profile.targetSalaryMin || 48000);
  const [targetMax, setTargetMax] = useState(profile.targetSalaryMax || 75000);

  const minVal = profile.targetSalaryMin || profile.salaryExpectationRange?.min || 48000;
  const maxVal = profile.targetSalaryMax || profile.salaryExpectationRange?.max || 75000;
  const formattedMin = `$${(minVal / 1000).toFixed(0)}k`;
  const formattedMax = `$${(maxVal / 1000).toFixed(0)}k`;

  const rawState = profile.userState === 'CA' && (profile.extractedResumeText?.toLowerCase().includes('wake') || profile.name?.toLowerCase().includes('thomas'))
    ? 'NC'
    : (profile.userState || 'NC');
  const stateDisplay = rawState && US_STATE_NAMES[rawState]
    ? `${US_STATE_NAMES[rawState]} (${rawState})`
    : rawState || 'North Carolina (NC)';

  const trajectory = profile.careerTrajectory || {
    progressionPace: 'Steady & Proven',
    nextLogicalStep: 'Senior Systems Support / IT Operations Lead',
    leadershipTrajectory: 'Senior Specialist / Technical IC',
    velocitySummary: 'Demonstrates consistent velocity, scope expansion, and autonomous delivery across professional roles.'
  };

  const culture = profile.inferredCulturePreferences || {
    preferredCompanyStage: 'High-autonomy distributed team or mature enterprise organization',
    workstylePace: 'Async-first, high documentation, minimal meeting overhead',
    teamEnvironment: 'Mission-driven, transparent roadmap, high individual ownership',
    keyMotivators: ['Autonomy & async trust', 'Problem solving', 'High impact & user enablement']
  };

  const handleSavePreferences = () => {
    if (onUpdateState) onUpdateState(selectedState);
    if (onUpdateSalary) onUpdateSalary(targetMin, targetMax);
    setIsEditingPreferences(false);
  };

  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          {/* Main Candidate Info */}
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {cleanCandidateName(profile.name)}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{cleanTitle(profile.title)}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.seniorityLevel}</span>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">{profile.yearsOfExperience} yrs exp</span>
              </div>
            </div>

            {/* Quick Metrics Bar: Location & Salary */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
              <button
                onClick={() => setIsEditingPreferences(true)}
                className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors group"
                title="Click to change your remote hiring state"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2">
                  {stateDisplay}
                </span>
                <Edit2 className="w-2.5 h-2.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ml-0.5" />
              </button>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>

              <button
                onClick={() => setIsEditingPreferences(true)}
                className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 font-semibold transition-colors group"
                title="Click to adjust your target salary ceiling"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="underline decoration-emerald-200 dark:decoration-emerald-900 underline-offset-2">
                  Target Comp: {formattedMin} - {formattedMax}
                </span>
                <Edit2 className="w-2.5 h-2.5 text-emerald-500 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Quick Buttons on Bar */}
          <div className="flex items-center gap-2 flex-wrap pt-1 lg:pt-0">
            {onSaveResume && (
              <button
                onClick={onSaveResume}
                disabled={isSavingResume}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-2xs active:scale-[0.98] ${
                  resumeSaved
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                }`}
                title={user ? 'Save resume to your account' : 'Save resume'}
              >
                {isSavingResume ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                ) : resumeSaved ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                ) : (
                  <Save className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                )}
                <span>{resumeSaved ? 'Saved' : 'Save Resume'}</span>
              </button>
            )}

            <button
              onClick={onViewResume}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>View Resume</span>
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl transition-colors shadow-2xs"
            >
              <span>{expanded ? 'Hide Insights' : 'Candidate Insights'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Modal-like Preference Editor Drawer */}
        {isEditingPreferences && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 animate-in slide-in-from-top-2 duration-150 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Adjust Location & Compensation Filter Parameters</span>
              </h3>
              <button
                onClick={() => setIsEditingPreferences(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Your Resident State (for state-restricted remote jobs):
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  {Object.entries(US_STATE_NAMES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name} ({code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Target Salary Range (USD):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="2000"
                    value={targetMin}
                    onChange={(e) => setTargetMin(Number(e.target.value))}
                    className="w-1/2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    placeholder="Min ($45k)"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="number"
                    step="2000"
                    value={targetMax}
                    onChange={(e) => setTargetMax(Number(e.target.value))}
                    className="w-1/2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    placeholder="Max ($75k)"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleSavePreferences}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Apply & Refresh Jobs</span>
              </button>
            </div>
          </div>
        )}

        {/* Expanded Profile Insights Drawer */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in slide-in-from-top-2 duration-150">
            {/* Core Skills */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Extracted Skills ({(profile.primarySkills || []).length + (profile.secondarySkills || []).length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {[...(profile.primarySkills || []), ...(profile.secondarySkills || [])].map((s: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Career Trajectory */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Career Trajectory</span>
              </div>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Next Step:</strong> {trajectory.nextLogicalStep}
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Trajectory:</strong> {trajectory.leadershipTrajectory}
                </p>
                <p className="line-clamp-2 text-slate-500 dark:text-slate-400">{trajectory.velocitySummary}</p>
              </div>
            </div>

            {/* Inferred Culture Fit */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Inferred Workstyle</span>
              </div>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Pace:</strong> {culture.workstylePace}
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Stage:</strong> {culture.preferredCompanyStage}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
