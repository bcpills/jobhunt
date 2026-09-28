import React from 'react';
import { ResumeStyleId, RESUME_STYLES, ResumeStyleDefinition } from '../types';
import { Briefcase, Sparkles, BookOpen, Minus, Cpu, Check } from 'lucide-react';

interface ResumeStylePickerProps {
  selectedStyle: ResumeStyleId;
  onSelectStyle: (styleId: ResumeStyleId) => void;
  className?: string;
  showDescription?: boolean;
  compact?: boolean;
}

const STYLE_ICONS: Record<ResumeStyleId, React.FC<{ className?: string }>> = {
  executive: Briefcase,
  modern: Sparkles,
  ivy: BookOpen,
  minimal: Minus,
  technical: Cpu,
};

export const ResumeStylePicker: React.FC<ResumeStylePickerProps> = ({
  selectedStyle,
  onSelectStyle,
  className = '',
  showDescription = true,
  compact = false,
}) => {
  const currentStyleDef = RESUME_STYLES.find((s) => s.id === selectedStyle) || RESUME_STYLES[0];

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label and Tag */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <span>Format & Visual Style</span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            (Select layout style)
          </span>
        </span>
        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
          {currentStyleDef.name}
        </span>
      </div>

      {/* Style Chips Selector */}
      <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'} gap-2`}>
        {RESUME_STYLES.map((style: ResumeStyleDefinition) => {
          const isSelected = style.id === selectedStyle;
          const Icon = STYLE_ICONS[style.id] || Sparkles;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`min-h-[44px] p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group active:scale-[0.98] ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: isSelected ? style.accentColor : undefined,
                      color: isSelected ? '#FFFFFF' : undefined,
                    }}
                  >
                    <Icon className={`w-3 h-3 ${!isSelected ? 'text-slate-500 dark:text-slate-400' : ''}`} />
                  </div>
                  <span
                    className={`text-xs font-bold truncate ${
                      isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {style.name}
                  </span>
                </div>

                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {style.tag}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: style.accentColor }}
                  title={`Accent: ${style.accentColor}`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Style Description Banner */}
      {showDescription && currentStyleDef && (
        <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between gap-2 animate-in fade-in duration-150">
          <p className="line-clamp-2">
            <strong className="text-slate-900 dark:text-slate-200 font-semibold">{currentStyleDef.name}:</strong>{' '}
            {currentStyleDef.description}
          </p>
          <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {currentStyleDef.fontFamily === 'serif' ? 'Serif Font' : 'Sans Font'}
          </span>
        </div>
      )}
    </div>
  );
};
