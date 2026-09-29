import React, { useState, useMemo } from 'react';
import { TailoredResume, JobOpening, CandidateProfile, ResumeStyleId, RESUME_STYLES } from '../types';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  Printer,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  RefreshCw,
  FileDown,
  Loader2,
  FileCheck2,
  Eye,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { getJobPostingUrl } from '../utils/clientResumeParser';
import {
  exportTailoredResumePdf,
  exportTailoredResumeDocx,
  cleanCandidateName,
  extractContactLine,
  sanitizeResumeMarkdown,
  parseResumeContent
} from '../utils/documentExporter';
import { ResumeStylePicker } from './ResumeStylePicker';
import { FormattedResumePreview } from './FormattedResumePreview';

interface TailorResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tailoredResume: TailoredResume | null;
  job: JobOpening | null;
  profile?: CandidateProfile | null;
  isLoading: boolean;
  onRetry?: () => void;
}

export const TailorResumeModal: React.FC<TailorResumeModalProps> = ({
  isOpen,
  onClose,
  tailoredResume,
  job,
  profile,
  isLoading,
  onRetry,
}) => {
  const [activeTab, setActiveTab] = useState<'diff' | 'full' | 'print'>('diff');
  const [selectedStyle, setSelectedStyle] = useState<ResumeStyleId>('modern');
  const [copied, setCopied] = useState(false);
  const [editableMarkdown, setEditableMarkdown] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Update markdown buffer when tailoredResume changes with sanitized executive header
  React.useEffect(() => {
    if (tailoredResume?.fullMarkdown) {
      const cleanName = cleanCandidateName(profile?.name || 'Joseph Thomas');
      const contact = extractContactLine(profile, profile?.extractedResumeText);
      const sanitized = sanitizeResumeMarkdown(tailoredResume.fullMarkdown, cleanName, contact);
      setEditableMarkdown(sanitized);
    }
  }, [tailoredResume, profile]);

  const currentStyleDef = RESUME_STYLES.find((s) => s.id === selectedStyle) || RESUME_STYLES[0];

  const parsedResumeData = useMemo(() => {
    if (!tailoredResume || !job) return null;
    return parseResumeContent({
      tailoredResume,
      job,
      profile,
      editedMarkdown: editableMarkdown,
      styleId: selectedStyle,
    });
  }, [tailoredResume, job, profile, editableMarkdown, selectedStyle]);

  if (!isOpen || !job) return null;

  const handleCopy = () => {
    if (!editableMarkdown) return;
    navigator.clipboard.writeText(editableMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportPdf = async () => {
    if (!tailoredResume || !job) return;
    setIsExportingPdf(true);
    try {
      await exportTailoredResumePdf({
        tailoredResume,
        job,
        profile,
        editedMarkdown: editableMarkdown,
        styleId: selectedStyle,
      });
      setExportNotice(`✓ Tailored ${currentStyleDef.name} PDF resume exported successfully!`);
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
    if (!tailoredResume || !job) return;
    setIsExportingDocx(true);
    try {
      await exportTailoredResumeDocx({
        tailoredResume,
        job,
        profile,
        editedMarkdown: editableMarkdown,
        styleId: selectedStyle,
      });
      setExportNotice(`✓ Tailored ${currentStyleDef.name} Word (.docx) resume exported successfully!`);
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('DOCX export error:', err);
      setExportNotice('Failed to generate DOCX. Please try again.');
      setTimeout(() => setExportNotice(null), 3500);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!editableMarkdown) return;
    const blob = new Blob([editableMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tailored_Resume_${job.company.replace(/\s+/g, '_')}_${job.title.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setExportNotice('Downloaded Markdown (.md) file');
    setTimeout(() => setExportNotice(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 flex items-center justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                Tailored Resume for {job.title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>Target Company: <strong className="text-slate-800 dark:text-slate-200">{job.company}</strong></span>
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
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin" />
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Tailoring Resume to {job.company}'s Requirements...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Aligning work experience bullets with target responsibilities, integrating key technical competencies, and sharpening achievement metrics.
              </p>
            </div>
          </div>
        )}

        {/* Empty / Error Fallback */}
        {!isLoading && !tailoredResume && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Could Not Generate Tailored Resume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We encountered an issue communicating with the AI tailoring engine. You can retry with a single click.
              </p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Resume Tailoring</span>
              </button>
            )}
          </div>
        )}

        {/* Loaded Content */}
        {!isLoading && tailoredResume && (
          <>
            {/* Impact Metric & Strategy Banner */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-2xs font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Original: {tailoredResume.matchScoreBefore}%</span>
                  <ArrowRight className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{tailoredResume.matchScoreAfter}% ATS Alignment</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800 p-0.5 rounded-lg border border-indigo-200/60 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`px-2.5 sm:px-3 py-1 rounded-md font-medium text-xs transition-colors ${
                    activeTab === 'diff' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Experience Diff
                </button>
                <button
                  onClick={() => setActiveTab('print')}
                  className={`px-2.5 sm:px-3 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 ${
                    activeTab === 'print' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Formatted Resume</span>
                </button>
                <button
                  onClick={() => setActiveTab('full')}
                  className={`px-2.5 sm:px-3 py-1 rounded-md font-medium text-xs transition-colors ${
                    activeTab === 'full' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Markdown Editor
                </button>
              </div>
            </div>

            {/* Notification Notice Toast if any */}
            {exportNotice && (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800 px-6 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{exportNotice}</span>
                </div>
                <button
                  onClick={() => setExportNotice(null)}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 text-xs"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: Diff & Strategy */}
              {activeTab === 'diff' && (
                <div className="space-y-6">
                  {/* Strategy Notes */}
                  {tailoredResume.tailoringStrategyNotes && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Tailoring Strategy for this Opening</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        {tailoredResume.tailoringStrategyNotes.map((note, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ATS Keywords Integrated */}
                  {tailoredResume.atsKeywordsAdded && tailoredResume.atsKeywordsAdded.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Target Keywords Injected from Job Description
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {tailoredResume.atsKeywordsAdded.map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 px-2.5 py-0.5 rounded-md flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Targeted Summary */}
                  {tailoredResume.targetedSummary && (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-800/50 space-y-1.5">
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        Tailored Executive Summary
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                        {tailoredResume.targetedSummary}
                      </p>
                    </div>
                  )}

                  {/* Experience Bullet Comparisons */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Elevated Work Experience & Key Achievements
                    </h4>

                    {(tailoredResume.tailoredExperience || []).map((exp, expIdx) => (
                      <div key={expIdx} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/40">
                        <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {exp.role} · {exp.company}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{exp.dates}</span>
                        </div>

                        <div className="p-4 space-y-3">
                          {exp.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="space-y-1.5 text-xs">
                              {b.original && (
                                <div className="text-slate-400 dark:text-slate-500 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Original</span>
                                  <span>{b.original}</span>
                                </div>
                              )}
                              <div className="text-slate-800 dark:text-slate-200 pl-3 border-l-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/30 py-1.5 rounded-r">
                                <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 block flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" /> Tailored Achievement
                                </span>
                                <span className="font-medium text-slate-900 dark:text-white">{b.tailored}</span>
                                {b.rationale && (
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                                    Why it converts: {b.rationale}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Full Resume Markdown Editor */}
              {activeTab === 'full' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Directly edit any section before downloading</span>
                    <button
                      onClick={handleCopy}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied' : 'Copy All'}</span>
                    </button>
                  </div>
                  <textarea
                    value={editableMarkdown}
                    onChange={(e) => setEditableMarkdown(e.target.value)}
                    rows={20}
                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              )}

              {/* TAB 3: Formatted Resume / ATS Document View */}
              {activeTab === 'print' && (
                <div className="space-y-4">
                  {/* Style Picker Toolbar */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800">
                    <ResumeStylePicker
                      selectedStyle={selectedStyle}
                      onSelectStyle={(id) => setSelectedStyle(id)}
                      compact={false}
                      showDescription={true}
                    />
                  </div>

                  {/* Formatted Paper Preview */}
                  {parsedResumeData ? (
                    <div className="py-1">
                      <FormattedResumePreview
                        data={parsedResumeData}
                        styleId={selectedStyle}
                      />
                    </div>
                  ) : (
                    <div className="printable-resume max-w-2xl mx-auto bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 font-serif leading-relaxed text-xs">
                      <div className="text-center pb-4 border-b border-slate-200 space-y-1">
                        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-slate-900">
                          {cleanCandidateName(profile?.name || 'Joseph Thomas')}
                        </h1>
                        <p className="text-xs text-slate-600 font-sans">
                          {extractContactLine(profile, profile?.extractedResumeText)}
                        </p>
                      </div>
                      <div className="mt-4 whitespace-pre-line text-slate-800">
                        {editableMarkdown}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Toolbar - Mobile Friendly Sticky Stack */}
            <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="hidden sm:inline">Tailored for {job.company}</span>
                <span className="hidden sm:inline">·</span>
                <button
                  onClick={() => setActiveTab('print')}
                  className="font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 group"
                  title="Click to switch resume layout style"
                >
                  <span>Style:</span>
                  <strong className="underline decoration-slate-300 dark:decoration-slate-600 underline-offset-2 group-hover:text-indigo-600">
                    {currentStyleDef.name}
                  </strong>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-end">
                <button
                  onClick={handleCopy}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                  title="Copy full text"
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
                  onClick={handlePrint}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                  title="Print Resume"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Print</span>
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                  title="Download Markdown"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>.md</span>
                </button>

                {/* PRIMARY 1: Export Word .docx */}
                <button
                  onClick={handleExportDocx}
                  disabled={isExportingDocx || isExportingPdf}
                  className="flex-1 sm:flex-initial min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-950 bg-white dark:bg-slate-800 border border-blue-300/80 dark:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 rounded-xl transition-all shadow-2xs disabled:opacity-50"
                  title={`Export Word (.docx) formatted in ${currentStyleDef.name}`}
                >
                  {isExportingDocx ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 tracking-wide">
                      DOCX
                    </span>
                  )}
                  <span>Export Word</span>
                </button>

                {/* PRIMARY 2: Export PDF */}
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

          </>
        )}
      </div>
    </div>
  );
};
