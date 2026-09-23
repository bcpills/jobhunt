import React, { useState } from 'react';
import { TailoredResume, JobOpening } from '../types';
import { X, Sparkles, Copy, Check, Download, Printer, ArrowRight, CheckCircle2, TrendingUp, FileText } from 'lucide-react';

interface TailorResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tailoredResume: TailoredResume | null;
  job: JobOpening | null;
  isLoading: boolean;
}

export const TailorResumeModal: React.FC<TailorResumeModalProps> = ({
  isOpen,
  onClose,
  tailoredResume,
  job,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'diff' | 'full' | 'print'>('diff');
  const [copied, setCopied] = useState(false);
  const [editableMarkdown, setEditableMarkdown] = useState('');

  // Update markdown buffer when tailoredResume changes
  React.useEffect(() => {
    if (tailoredResume) {
      setEditableMarkdown(tailoredResume.fullMarkdown);
    }
  }, [tailoredResume]);

  if (!isOpen || !job) return null;

  const handleCopy = () => {
    if (!editableMarkdown) return;
    navigator.clipboard.writeText(editableMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-100 text-indigo-700">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tailored Resume for {job.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Company: <strong className="text-slate-800">{job.company}</strong> · {job.workArrangement}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-slate-800">
                Tailoring Resume to {job.company}'s Requirements...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Aligning work experience bullets with the Google XYZ formula, injecting target ATS keywords, and optimizing executive summary.
              </p>
            </div>
          </div>
        )}

        {/* Loaded Content */}
        {!isLoading && tailoredResume && (
          <>
            {/* Impact Metric & Strategy Banner */}
            <div className="px-6 py-3 bg-indigo-50/60 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-indigo-200 shadow-2xs font-semibold">
                  <span className="text-slate-500">Original Match: {tailoredResume.matchScoreBefore}%</span>
                  <ArrowRight className="w-3 h-3 text-indigo-500" />
                  <span className="text-emerald-700 font-bold">{tailoredResume.matchScoreAfter}% ATS Alignment</span>
                </div>

                <span className="text-slate-500 hidden sm:inline">
                  {tailoredResume.atsKeywordsAdded?.length || 0} target ATS keywords integrated
                </span>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-white/80 p-0.5 rounded-lg border border-indigo-200/60">
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`px-3 py-1 rounded-md font-medium text-xs transition-colors ${
                    activeTab === 'diff' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Experience Diff
                </button>
                <button
                  onClick={() => setActiveTab('full')}
                  className={`px-3 py-1 rounded-md font-medium text-xs transition-colors ${
                    activeTab === 'full' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Full Resume Text
                </button>
                <button
                  onClick={() => setActiveTab('print')}
                  className={`px-3 py-1 rounded-md font-medium text-xs transition-colors ${
                    activeTab === 'print' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ATS Document View
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: Diff & Strategy */}
              {activeTab === 'diff' && (
                <div className="space-y-6">
                  {/* Strategy Notes */}
                  {tailoredResume.tailoringStrategyNotes && (
                    <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Tailoring Strategy for this Opening</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {tailoredResume.tailoringStrategyNotes.map((note, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ATS Keywords Integrated */}
                  {tailoredResume.atsKeywordsAdded && tailoredResume.atsKeywordsAdded.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Target Keywords Injected from Job Description
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {tailoredResume.atsKeywordsAdded.map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Targeted Summary */}
                  {tailoredResume.targetedSummary && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-1.5">
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                        Tailored Executive Summary
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed font-serif">
                        {tailoredResume.targetedSummary}
                      </p>
                    </div>
                  )}

                  {/* Experience Bullet Comparisons */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Elevated Work Experience (Google XYZ Formula)
                    </h4>

                    {(tailoredResume.tailoredExperience || []).map((exp, expIdx) => (
                      <div key={expIdx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">
                            {exp.role} · {exp.company}
                          </span>
                          <span className="text-[11px] text-slate-500">{exp.dates}</span>
                        </div>

                        <div className="p-4 space-y-3">
                          {exp.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="space-y-1.5 text-xs">
                              {b.original && (
                                <div className="text-slate-400 pl-3 border-l-2 border-slate-200">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Original</span>
                                  <span>{b.original}</span>
                                </div>
                              )}
                              <div className="text-slate-800 pl-3 border-l-2 border-indigo-600 bg-indigo-50/20 py-1.5 rounded-r">
                                <span className="text-[10px] uppercase font-bold text-indigo-700 block flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" /> Tailored (High-Impact XYZ)
                                </span>
                                <span className="font-medium text-slate-900">{b.tailored}</span>
                                {b.rationale && (
                                  <p className="text-[11px] text-slate-500 mt-1 italic">
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

              {/* TAB 2: Full Editable Markdown */}
              {activeTab === 'full' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      You can edit any line directly below before copying or exporting.
                    </span>
                    <span>{editableMarkdown.length} characters</span>
                  </div>
                  <textarea
                    value={editableMarkdown}
                    onChange={(e) => setEditableMarkdown(e.target.value)}
                    rows={20}
                    className="w-full font-mono text-xs p-4 rounded-xl border border-slate-200 bg-slate-50/40 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 leading-relaxed"
                  />
                </div>
              )}

              {/* TAB 3: ATS Print View */}
              {activeTab === 'print' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs text-slate-500">
                      Clean, single-column ATS typography optimized for ATS parsers and hiring managers.
                    </span>
                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / Save as PDF</span>
                    </button>
                  </div>

                  <div className="p-8 bg-white border border-slate-300 rounded-xl shadow-xs font-serif text-slate-900 max-w-2xl mx-auto space-y-4 printable-resume">
                    <div className="text-center pb-3 border-b border-slate-200 space-y-1">
                      <h2 className="text-2xl font-bold tracking-tight font-sans text-slate-900">
                        {editableMarkdown.split('\n')[0]?.replace(/^#*\s*/, '') || 'Candidate Resume'}
                      </h2>
                      <p className="text-xs text-slate-600 font-sans">
                        Target Position: {job.title} · {job.company}
                      </p>
                    </div>

                    <div className="text-xs leading-relaxed font-sans space-y-3 whitespace-pre-line text-slate-800">
                      {editableMarkdown}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Toolbar */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Ready to submit to {job.company}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Formatted Resume</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Download (.md)</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
