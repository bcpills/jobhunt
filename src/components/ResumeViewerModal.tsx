import React, { useState } from 'react';
import { X, Copy, Check, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { CandidateProfile } from '../types';
import { cleanCandidateName, cleanTitle } from '../utils/clientResumeParser';

interface ResumeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile | null;
  onUpdateResumeText: (newText: string) => void;
}

export const ResumeViewerModal: React.FC<ResumeViewerModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateResumeText,
}) => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    if (profile?.extractedResumeText) {
      setText(profile.extractedResumeText);
    }
  }, [profile]);

  if (!isOpen || !profile) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAndReanalyze = () => {
    onUpdateResumeText(text);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full h-[88vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">Ingested Resume Profile</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {cleanCandidateName(profile.name)} · {cleanTitle(profile.title)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              {isEditing ? 'Cancel' : 'Edit Text'}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {isEditing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={22}
              className="w-full font-mono text-xs p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          ) : (
            <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-50/70 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {text}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {text.length} characters parsed
          </span>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSaveAndReanalyze}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-xl shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Save & Re-Match</span>
              </button>
            ) : (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-750 shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
