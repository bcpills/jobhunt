import React, { useState } from 'react';
import { X, Copy, Check, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { CandidateProfile } from '../types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-slate-200/80 text-slate-700">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Ingested Resume Profile</h2>
              <p className="text-xs text-slate-500">
                {profile.name} · {profile.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-white border border-slate-200 rounded-lg"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Text'}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {isEditing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={22}
              className="w-full font-mono text-xs p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            />
          ) : (
            <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
              {text}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {text.length} characters parsed
          </span>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSaveAndReanalyze}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Save & Re-Match Jobs</span>
              </button>
            ) : (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
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
