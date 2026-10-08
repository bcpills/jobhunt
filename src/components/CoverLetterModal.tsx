import React, { useState } from 'react';
import { CoverLetter, JobOpening, CandidateProfile, ResumeStyleId, RESUME_STYLES } from '../types';
import {
  X,
  FileText,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sparkles,
  Printer,
  Sliders,
  AlertCircle,
  FileDown,
  Loader2,
  FileCheck2,
  ExternalLink,
  Eye,
  Edit3
} from 'lucide-react';
import { exportCoverLetterPdf, exportCoverLetterDocx, cleanCandidateName } from '../utils/documentExporter';
import { getJobPostingUrl } from '../utils/clientResumeParser';
import { ResumeStylePicker } from './ResumeStylePicker';
import { FormattedCoverLetterPreview } from './FormattedCoverLetterPreview';

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
  const [activeView, setActiveView] = useState<'preview' | 'edit'>('preview');
  const [selectedStyle, setSelectedStyle] = useState<ResumeStyleId>('modern');
  const [tone, setTone] = useState('Professional & Confident');
  const [length, setLength] = useState('Balanced (~350 words)');
  const [customNotes, setCustomNotes] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  React.useEffect(() => {
    if (coverLetter) {
      const candidateName = cleanCandidateName(profile?.name, profile?.extractedResumeText);
      let text = coverLetter.fullText || '';
      // Purge any lingering N/A placeholders in signoff or signature
      text = text
        .replace(/(?:Sincerely|Warm regards|Best regards|Regards|Cheers)[,\s]+N\/A\b/gi, `Sincerely,\n${candidateName}`)
        .replace(/\bN\/A\b/g, candidateName);
      setEditableText(text);
    }
  }, [coverLetter, profile]);

  const currentStyleDef = RESUME_STYLES.find((s) => s.id === selectedStyle) || RESUME_STYLES[0];

  if (!isOpen || !job) return null;

  const handleCopy = () => {
    if (!editableText) return;
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportPdf = async () => {
    if (!coverLetter || !job) return;
    setIsExportingPdf(true);
    try {
      await exportCoverLetterPdf({
        coverLetter,
        job,
        profile,
        editedText: editableText,
        styleId: selectedStyle,
      });
      setExportNotice(`✓ Nicely formatted ${currentStyleDef.name} Cover Letter PDF exported!`);
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('PDF export error:', err);
      setExportNotice('Failed to generate PDF. Please try again.');
      setTimeout(() => setExportNotice(null), 3500);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportDocx = async () => {
    if (!coverLetter || !job) return;
    setIsExportingDocx(true);
    try {
      await exportCoverLetterDocx({
        coverLetter,
        job,
        profile,
        editedText: editableText,
        styleId: selectedStyle,
      });
      setExportNotice(`✓ Word (.docx) Cover Letter formatted in ${currentStyleDef.name} exported!`);
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('DOCX export error:', err);
      setExportNotice('Failed to generate DOCX. Please try again.');
      setTimeout(() => setExportNotice(null), 3500);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!editableText) return;
    const blob = new Blob([editableText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${job.company.replace(/\s+/g, '_')}_${job.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setExportNotice('Downloaded plain text file');
    setTimeout(() => setExportNotice(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                Cover Letter for {job.company}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>Position: <strong className="text-slate-800 dark:text-slate-200">{job.title}</strong></span>
              <span>·</span>
              <span>{job.workArrangement}</span>
              <span>·</span>
              <a
                href={getJobPostingUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
                title="Open original job posting in a new tab"
              >
                <span>Job Posting</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Preferences</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode & Preferences Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-800 p-0.5 rounded-lg border border-indigo-200/60 dark:border-slate-700 shadow-2xs">
            <button
              onClick={() => setActiveView('preview')}
              className={`px-3 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 ${
                activeView === 'preview'
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Document Preview</span>
            </button>
            <button
              onClick={() => setActiveView('edit')}
              className={`px-3 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 ${
                activeView === 'edit'
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Text</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span>Theme:</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-400 bg-white/80 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
              {currentStyleDef.name}
            </span>
          </div>
        </div>

        {/* Preferences Drawer */}
        {showPreferences && (
          <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/60 space-y-3 animate-in slide-in-from-top-2 duration-150 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tone of Voice:</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="Professional & Confident">Professional & Confident</option>
                  <option value="Technical & Metrics-Driven">Technical & Metrics-Driven</option>
                  <option value="Warm & Mission-Aligned">Warm & Mission-Aligned</option>
                  <option value="Concise Executive">Concise Executive</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Letter Length:</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="Short & Punchy (~220 words)">Short & Punchy (~220 words)</option>
                  <option value="Balanced (~350 words)">Balanced (~350 words)</option>
                  <option value="In-Depth Technical (~450 words)">In-Depth Technical (~450 words)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Custom Talking Points or Notes (Optional):</label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g., Emphasize ServiceNow migration or remote troubleshooting"
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  setShowPreferences(false);
                  onRegenerate({ tone, length, customNotes });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-xs"
              >
                Regenerate with Preferences
              </button>
            </div>
          </div>
        )}

        {/* Notice toast */}
        {exportNotice && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800 px-6 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{exportNotice}</span>
            </div>
            <button onClick={() => setExportNotice(null)} className="text-emerald-600 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Crafting tailored cover letter for {job.company}...</p>
          </div>
        )}

        {/* Content Body */}
        {!isLoading && coverLetter && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {activeView === 'preview' ? (
              <div className="space-y-4">
                {/* Theme Picker */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800">
                  <ResumeStylePicker
                    selectedStyle={selectedStyle}
                    onSelectStyle={(id) => setSelectedStyle(id)}
                    compact={false}
                    showDescription={true}
                  />
                </div>

                {/* Document Paper Preview */}
                <div className="py-2">
                  <FormattedCoverLetterPreview
                    text={editableText}
                    job={job}
                    profile={profile}
                    styleId={selectedStyle}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Directly edit the cover letter text (changes preview automatically):</span>
                  <button
                    onClick={handleCopy}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied' : 'Copy All'}</span>
                  </button>
                </div>
                <textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  rows={18}
                  className="w-full font-serif text-xs sm:text-sm leading-relaxed p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRegenerate({ tone, length, customNotes })}
              disabled={isLoading}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
            <button
              onClick={handlePrint}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Print letter preview"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button
              onClick={handleCopy}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadTxt}
              className="min-h-[40px] inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shadow-2xs"
              title="Download raw plain text"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>.txt</span>
            </button>

            <button
              onClick={handleExportDocx}
              disabled={isExportingDocx || isExportingPdf}
              className="flex-1 sm:flex-initial min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-blue-300/80 dark:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 rounded-xl transition-all shadow-2xs disabled:opacity-50"
              title={`Export Word (.docx) formatted in ${currentStyleDef.name}`}
            >
              {isExportingDocx ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 tracking-wide">
                  DOCX
                </span>
              )}
              <span>Export Word</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf || isExportingDocx}
              className="flex-1 sm:flex-initial min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-xs disabled:opacity-50"
              title={`Export PDF formatted in ${currentStyleDef.name}`}
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-300" />
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white tracking-wide">
                  PDF
                </span>
              )}
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
