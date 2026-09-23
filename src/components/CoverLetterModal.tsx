import React, { useState } from 'react';
import { CoverLetter, JobOpening, CandidateProfile } from '../types';
import { X, FileText, Copy, Check, Download, RefreshCw, Sparkles, Printer, Sliders } from 'lucide-react';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  coverLetter: CoverLetter | null;
  job: JobOpening | null;
  profile: CandidateProfile | null;
  isLoading: boolean;
  onRegenerate: (preferences: { tone: string; length: string; customNotes?: string }) => void;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({
  isOpen,
  onClose,
  coverLetter,
  job,
  profile,
  isLoading,
  onRegenerate,
}) => {
  const [tone, setTone] = useState('Professional & Confident');
  const [length, setLength] = useState('Balanced (~350 words)');
  const [customNotes, setCustomNotes] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState('');

  React.useEffect(() => {
    if (coverLetter) {
      setEditableText(coverLetter.fullText);
    }
  }, [coverLetter]);

  if (!isOpen || !job) return null;

  const handleCopy = () => {
    if (!editableText) return;
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!editableText) return;
    const blob = new Blob([editableText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${job.company.replace(/\s+/g, '_')}_${(profile?.name || 'Candidate').replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-100 text-indigo-700">
                <FileText className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Cover Letter for {job.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Company: <strong className="text-slate-800">{job.company}</strong> · {job.workArrangement}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                showPreferences
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Customize Tone</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customization Drawer / Panel */}
        {showPreferences && (
          <div className="p-4 bg-indigo-50/40 border-b border-indigo-100/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in slide-in-from-top-2 duration-150">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tone & Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Professional & Confident">Professional & Confident</option>
                <option value="Modern & Concise">Modern & Concise</option>
                <option value="High-Impact & Direct">High-Impact & Direct</option>
                <option value="Warm & Mission-Driven">Warm & Mission-Driven</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Concise (~250 words)">Concise (~250 words)</option>
                <option value="Balanced (~350 words)">Balanced (~350 words)</option>
                <option value="Comprehensive (~450 words)">Comprehensive (~450 words)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Custom Highlight</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. emphasize async leadership..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
                <button
                  onClick={() => onRegenerate({ tone, length, customNotes })}
                  disabled={isLoading}
                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 shrink-0"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-slate-800">
                Crafting High-Conversion Cover Letter...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Formulating strong opening hook for {job.company}, mapping your proven wins to their exact requirements, and emphasizing remote async execution.
              </p>
            </div>
          </div>
        )}

        {/* Content Viewer */}
        {!isLoading && coverLetter && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Highlights Used Card */}
            {coverLetter.keyHighlightsUsed && coverLetter.keyHighlightsUsed.length > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Evidence Weaved Into Letter:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {coverLetter.keyHighlightsUsed.map((h, i) => (
                    <span key={i} className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Editable Letter Viewer */}
            <div className="relative">
              <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                rows={18}
                className="w-full font-serif text-sm leading-relaxed p-6 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRegenerate({ tone, length, customNotes })}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Letter</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-300" />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
