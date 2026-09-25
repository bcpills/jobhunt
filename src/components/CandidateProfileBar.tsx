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
  Edit2
} from 'lucide-react';
import { US_STATE_NAMES } from '../utils/clientResumeParser';

interface CandidateProfileBarProps {
  profile: CandidateProfile;
  onViewResume: () => void;
  onStartOver?: () => void;
  onUpdateState?: (newState: string) => void;
  onUpdateSalary?: (min: number, max: number) => void;
}

export const CandidateProfileBar: React.FC<CandidateProfileBarProps> = ({
  profile,
  onViewResume,
  onStartOver,
  onUpdateState,
  onUpdateSalary,
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

  const stateDisplay = profile.userState && US_STATE_NAMES[profile.userState]
    ? `${US_STATE_NAMES[profile.userState]} (${profile.userState})`
    : profile.userState || 'All US (Nationwide)';

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
    <section className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Main Candidate Info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {profile.name}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span aria-hidden="true">·</span>
                <span className="text-slate-800 font-semibold">{profile.title}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.seniorityLevel}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.yearsOfExperience} yrs experience</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {profile.summary}
            </p>

            {/* Quick Metadata: Location, Realistic Salary, Arc */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1 text-slate-800 font-medium">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Home State: <strong className="text-indigo-700">{stateDisplay}</strong></span>
              </div>

              <span className="text-slate-300" aria-hidden="true">·</span>

              <div className="flex items-center gap-1 text-slate-800 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Target Comp: <strong className="text-emerald-700">{formattedMin} – {formattedMax} / yr</strong> (Realistic)</span>
              </div>

              <span className="text-slate-300" aria-hidden="true">·</span>

              <button
                onClick={() => setIsEditingPreferences(!isEditingPreferences)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200"
              >
                <Edit2 className="w-3 h-3" />
                <span>Adjust State / Salary</span>
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={onViewResume}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>View Ingested Resume</span>
            </button>

            {onStartOver && (
              <button
                onClick={onStartOver}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors shadow-2xs"
                title="Clear profile and start over"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                <span>Start Over</span>
              </button>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200/70 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{expanded ? 'Hide Insights' : 'Matching Insights'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Quick Edit Location & Salary Form */}
        {isEditingPreferences && (
          <div className="mt-4 p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 animate-in fade-in duration-150">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Adjust Location & Realistic Comp Preferences:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Home State:
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="All US">Nationwide (All 50 US States)</option>
                  {Object.entries(US_STATE_NAMES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name} ({code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Target Min ($/yr):
                </label>
                <input
                  type="number"
                  step="5000"
                  value={targetMin}
                  onChange={(e) => setTargetMin(Number(e.target.value))}
                  className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Target Max / Ceiling ($/yr):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="5000"
                    value={targetMax}
                    onChange={(e) => setTargetMax(Number(e.target.value))}
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <button
                    onClick={handleSavePreferences}
                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shrink-0 shadow-2xs"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Advanced Algorithm Insights */}
        {expanded && (
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-in slide-in-from-top-2 duration-200">
            {/* Career Trajectory Arc */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Career Trajectory Arc</span>
              </div>
              <p className="text-xs text-slate-700 leading-snug">
                <strong className="block text-slate-900 font-semibold">{trajectory.progressionPace} Velocity</strong>
                {trajectory.velocitySummary}
              </p>
              <div className="pt-1 text-[11px] text-indigo-700 font-medium">
                Next: {trajectory.nextLogicalStep}
              </div>
            </div>

            {/* Inferred Culture & Operating Style */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Inferred Culture Fit</span>
              </div>
              <p className="text-xs text-slate-700 leading-snug">
                <strong className="block text-slate-900 font-semibold">{culture.preferredCompanyStage}</strong>
                {culture.workstylePace}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {culture.keyMotivators.map((m, idx) => (
                  <span key={idx} className="bg-white text-[10px] text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Skills */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Core Stack & Parity
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(profile.primarySkills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-slate-700 bg-slate-100/90 px-2 py-0.5 rounded border border-slate-200/60"
                  >
                    {skill}
                  </span>
                ))}
                {(profile.toolsAndTechnologies || []).slice(0, 3).map((tool, idx) => (
                  <span
                    key={`tool-${idx}`}
                    className="text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/50"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Remote Superpowers */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Remote Work Strengths
              </h3>
              <ul className="space-y-1 text-xs text-slate-600">
                {(profile.remoteWorkStrengths || [
                  'Proven asynchronous written documentation and troubleshooting workflows',
                  'High autonomy in distributed, cross-timezone environments',
                  'Proactive communication and user support ownership',
                ]).slice(0, 3).map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
