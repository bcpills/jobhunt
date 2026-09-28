import React, { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  FileText,
  Sparkles,
  Download,
  Printer,
  Loader2,
  FileCheck2,
  Edit3,
  Eye
} from 'lucide-react';
import { CandidateProfile, ResumeStyleId, RESUME_STYLES } from '../types';
import { cleanCandidateName, cleanTitle } from '../utils/clientResumeParser';
import { ResumeStylePicker } from './ResumeStylePicker';
import { FormattedResumePreview } from './FormattedResumePreview';
import {
  parseProfileToResumeData,
  exportProfileResumePdf,
  exportProfileResumeDocx
} from '../utils/documentExporter';

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
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted');
  const [selectedStyle, setSelectedStyle] = useState<ResumeStyleId>('executive');
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  React.useEffect(() => {
    if (profile?.extractedResumeText) {
      setText(profile.extractedResumeText);
    }
  }, [profile]);

  // Compute parsed structured resume data for formatted preview & export
  const parsedData = useMemo(() => {
    if (!profile) return null;
    return parseProfileToResumeData(profile, text);
  }, [profile, text]);

  if (!isOpen || !profile) return null;

  const currentStyleDef = RESUME_STYLES.find((s) => s.id === selectedStyle) || RESUME_STYLES[0];

  const handleCopy = () => {
    if (!parsedData) return;
    const copyContent = activeTab === 'raw' ? text : `${parsedData.name}\n${parsedData.contactLine}\n\n${parsedData.summary}\n\nSKILLS:\n${parsedData.skills.join(', ')}\n\nEXPERIENCE:\n` +
      parsedData.experiences.map(e => `${e.title} - ${e.company} (${e.dates})\n` + e.bullets.map(b => `• ${b}`).join('\n')).join('\n\n') +
      `\n\nEDUCATION:\n` + parsedData.education.join('\n');
    
    navigator.clipboard.writeText(copyContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAndReanalyze = () => {
    onUpdateResumeText(text);
    setIsEditing(false);
    setActiveTab('formatted');
    setExportNotice('✓ Updated resume text & re-analyzed candidate profile!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleExportPdf = async () => {
    if (!profile) return;
    setIsExportingPdf(true);
    try {
      await exportProfileResumePdf({
        profile,
        styleId: selectedStyle,
        editedText: text,
      });
      setExportNotice(`✓ Exported ${currentStyleDef.name} PDF resume!`);
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
    if (!profile) return;
    setIsExportingDocx(true);
    try {
      await exportProfileResumeDocx({
        profile,
        styleId: selectedStyle,
        editedText: text,
      });
      setExportNotice(`✓ Exported ${currentStyleDef.name} Word (.docx) resume!`);
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('DOCX export error:', err);
      setExportNotice('Failed to generate DOCX. Please try again.');
      setTimeout(() => setExportNotice(null), 3500);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              <FileText className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  Candidate Resume
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Style: {currentStyleDef.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {cleanCandidateName(profile.name)} · {cleanTitle(profile.title)}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab('formatted');
                  setIsEditing(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'formatted'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Formatted View</span>
                <span className="sm:hidden">Format</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('raw');
                  setIsEditing(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'raw'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="hidden sm:inline">Raw / Edit Text</span>
                <span className="sm:hidden">Raw Text</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Export Notification Toast */}
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

        {/* Style Selection Bar (when in Formatted tab) */}
        {activeTab === 'formatted' && (
          <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
            <ResumeStylePicker
              selectedStyle={selectedStyle}
              onSelectStyle={(id) => setSelectedStyle(id)}
              compact={false}
              showDescription={true}
            />
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-100/50 dark:bg-slate-950/40">
          {activeTab === 'formatted' ? (
            parsedData ? (
              <div className="py-2">
                <FormattedResumePreview data={parsedData} styleId={selectedStyle} />
              </div>
            ) : null
          ) : (
            <div className="space-y-3 max-w-3xl mx-auto">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {isEditing ? 'Editing Parsed Content' : 'Raw Extracted Resume Text'}
                </span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Text Directly'}
                </button>
              </div>

              {isEditing ? (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={20}
                  className="w-full font-mono text-xs p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
                />
              ) : (
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                  {text}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>{text.length} characters parsed</span>
            <span>·</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Style: <strong>{currentStyleDef.name}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            {isEditing ? (
              <button
                onClick={handleSaveAndReanalyze}
                className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-xl shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Save & Update</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                  title="Copy full resume text"
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

                {/* Export Word (.docx) */}
                <button
                  onClick={handleExportDocx}
                  disabled={isExportingDocx || isExportingPdf}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-950 bg-white dark:bg-slate-800 border border-blue-300/80 dark:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 rounded-xl transition-all shadow-2xs disabled:opacity-50"
                  title={`Download Word (.docx) formatted in ${currentStyleDef.name}`}
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

                {/* Export PDF */}
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf || isExportingDocx}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-xs disabled:opacity-50"
                  title={`Download PDF formatted in ${currentStyleDef.name}`}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
