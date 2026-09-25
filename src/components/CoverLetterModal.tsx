import React, { useState } from 'react';
import { CoverLetter, JobOpening, CandidateProfile } from '../types';
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
  FileCheck2
} from 'lucide-react';
import { exportCoverLetterPdf, exportCoverLetterDocx } from '../utils/documentExporter';

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
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

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

  const handleExportPdf = async () => {
    if (!coverLetter || !job) return;
    setIsExportingPdf(true);
    try {
      await exportCoverLetterPdf({
        coverLetter,
        job,
        profile,
        editedText: editableText,
      });
      setExportNotice('✓ Nicely formatted Cover Letter PDF exported!');
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
      });
      setExportNotice('✓ Cover Letter Word (.docx) exported!');
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
    link.download = `Cover_Letter_${job.company.replace(/\s+/g, '_')}_${(profile?.name || 'Candidate').replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setExportNotice('Downloaded plain text (.txt) file');
    setTimeout(() => setExportNotice(null), 2500);
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

        {/* Notice Toast */}
        {exportNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs font-semibold text-emerald-800 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>{exportNotice}</span>
            </div>
            <button
              onClick={() => setExportNotice(null)}
              className="text-emerald-600 hover:text-emerald-900 text-xs"
            >
              Dismiss
            </button>
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

        {/* Empty / Error Fallback */}
        {!isLoading && !coverLetter && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-sm font-bold text-slate-800">
                Could Not Generate Cover Letter
              </h3>
              <p className="text-xs text-slate-500">
                The cover letter generation encountered an issue. Click below to regenerate with customized tone settings.
              </p>
            </div>
            <button
              onClick={() => onRegenerate({ tone, length, customNotes })}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate Cover Letter Now</span>
            </button>
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
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>You can edit the letter text directly below before exporting to PDF or Word (.docx).</span>
                <span>{editableText.length} characters</span>
              </div>
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
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              title="Print letter preview"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Plain text fallback */}
            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
              title="Download raw plain text"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>.txt</span>
            </button>

            {/* PRIMARY 1: Export Word (.docx) */}
            <button
              onClick={handleExportDocx}
              disabled={isExportingDocx || isExportingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:text-slate-950 bg-white border border-blue-300/80 hover:bg-blue-50/50 rounded-lg transition-all shadow-2xs disabled:opacity-50"
            >
              {isExportingDocx ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-700 tracking-wide">
                  DOCX
                </span>
              )}
              <span>Export Word (.docx)</span>
            </button>

            {/* PRIMARY 2: Export PDF */}
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf || isExportingDocx}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-xs disabled:opacity-50"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-300" />
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white tracking-wide">
                  PDF
                </span>
              )}
              <span>Export Formatted PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
