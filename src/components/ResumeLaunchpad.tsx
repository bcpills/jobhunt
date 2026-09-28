import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
  FileCode,
  MapPin,
  DollarSign,
  ShieldCheck,
  Building,
  Check
} from 'lucide-react';
import { convertDocumentToPlainText } from '../services/api';
import { extractTextFromFileInBrowser, fileToCleanBase64 } from '../utils/clientDocumentExtractor';
import { US_STATE_NAMES } from '../utils/clientResumeParser';

interface ResumeLaunchpadProps {
  onAnalyzeText: (text: string, state?: string, salary?: { min: number; max: number }) => Promise<void>;
  onAnalyzeFile: (
    fileBase64: string,
    mimeType: string,
    fileName: string,
    clientText?: string,
    state?: string,
    salary?: { min: number; max: number }
  ) => Promise<void>;
  isAnalyzing: boolean;
}

export const ResumeLaunchpad: React.FC<ResumeLaunchpadProps> = ({
  onAnalyzeText,
  onAnalyzeFile,
  isAnalyzing,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isConvertingToText, setIsConvertingToText] = useState(false);
  const [isExtractingLocal, setIsExtractingLocal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User location and salary target states
  const [userState, setUserState] = useState<string>('NC'); // Default to North Carolina or Any US
  const [salaryTier, setSalaryTier] = useState<'achievable' | 'mid' | 'senior' | 'custom'>('achievable');
  const [customMinSalary, setCustomMinSalary] = useState<number>(45000);
  const [customMaxSalary, setCustomMaxSalary] = useState<number>(75000);

  const getEffectiveSalaryRange = () => {
    if (salaryTier === 'achievable') return { min: 45000, max: 75000 };
    if (salaryTier === 'mid') return { min: 60000, max: 90000 };
    if (salaryTier === 'senior') return { min: 78000, max: 110000 };
    return { min: customMinSalary, max: customMaxSalary };
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setErrorMessage(null);
    setInfoMessage(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md', '.rtf'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setErrorMessage('Please upload a PDF, DOCX, DOC, TXT, or Markdown resume file.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25MB limit.');
      return;
    }
    setSelectedFile(file);
    setErrorMessage(null);
    setInfoMessage(null);
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;
    setErrorMessage(null);
    setInfoMessage(null);
    setIsExtractingLocal(true);

    try {
      // 1. In-browser extraction
      let inBrowserText = '';
      try {
        inBrowserText = await extractTextFromFileInBrowser(selectedFile);
      } catch (err) {
        console.warn('In-browser extraction notice:', err);
      }

      // 2. Clean base64 sanitized of newlines/whitespace
      let cleanBase64 = '';
      let mime = selectedFile.type || 'application/pdf';
      try {
        const cleanData = await fileToCleanBase64(selectedFile);
        cleanBase64 = cleanData.base64;
        mime = cleanData.mimeType;
      } catch (e) {
        console.warn('Base64 preparation notice:', e);
      }

      const salaryRange = getEffectiveSalaryRange();
      await onAnalyzeFile(cleanBase64, mime, selectedFile.name, inBrowserText, userState, salaryRange);
    } catch (err: any) {
      console.error('File analysis error:', err);
      setErrorMessage(
        err.message || 'Could not parse document. Try using "Preview & Edit as Plain Text" or pasting your resume directly.'
      );
    } finally {
      setIsExtractingLocal(false);
    }
  };

  const handleConvertToText = async () => {
    if (!selectedFile) return;
    setErrorMessage(null);
    setInfoMessage(null);
    setIsConvertingToText(true);

    try {
      // 1. First attempt in-browser extraction
      const inBrowserText = await extractTextFromFileInBrowser(selectedFile);
      if (inBrowserText && inBrowserText.trim().length > 30) {
        setPastedText(inBrowserText);
        setActiveTab('paste');
        setInfoMessage('Extracted text directly in your browser. Review and customize below!');
        setIsConvertingToText(false);
        return;
      }

      // 2. Fallback to API conversion
      const cleanData = await fileToCleanBase64(selectedFile);
      const result = await convertDocumentToPlainText({
        fileBase64: cleanData.base64,
        mimeType: cleanData.mimeType,
        fileName: selectedFile.name,
      });

      if (result && result.plainText) {
        setPastedText(result.plainText);
        setActiveTab('paste');
        setInfoMessage('Document converted to plain text. You can edit before searching jobs.');
      } else {
        throw new Error('Could not convert file.');
      }
    } catch (err: any) {
      console.warn('Conversion notice:', err);
      setPastedText(`${selectedFile.name.replace(/\.[^/.]+$/, '').toUpperCase()}\n\nTechnical & Systems Professional\n\nExperience:\n• Enterprise Technical Support & User Assistance\n• Hardware Troubleshooting, Computer Imaging & Diagnostics\n• Active Directory, ServiceNow & Asset Lifecycle Management`);
      setActiveTab('paste');
      setInfoMessage('Editable template generated. You can paste your resume details below.');
    } finally {
      setIsConvertingToText(false);
    }
  };

  const handleProcessPastedText = async () => {
    if (!pastedText.trim()) {
      setErrorMessage('Please paste your resume text before proceeding.');
      return;
    }
    const salaryRange = getEffectiveSalaryRange();
    await onAnalyzeText(pastedText, userState, salaryRange);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Realistic Remote Hiring · State Eligibility Matching</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Find Remote Jobs You Can <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-800">Actually Land</span>
        </h1>
        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Upload your resume. We match state-specific remote requirements and filter for achievable, realistic salaries so you never waste time on unachievable roles.
        </p>
      </div>

      {/* Main Intake Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
        {/* Navigation Tabs */}
        <div className="p-2.5 sm:p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('upload');
                setErrorMessage(null);
              }}
              disabled={isAnalyzing || isConvertingToText}
              className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Upload Document
            </button>
            <button
              onClick={() => {
                setActiveTab('paste');
                setErrorMessage(null);
              }}
              disabled={isAnalyzing || isConvertingToText}
              className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'paste'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Paste Text {pastedText ? `(${pastedText.length} chars)` : ''}
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        <div className="p-4 sm:p-6">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-5 p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-800 dark:text-indigo-300 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-5 sm:space-y-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-12 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-4 ring-indigo-100 dark:ring-indigo-900/50'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md,.rtf"
                  onChange={(e) => e.target.files && handleFileSelected(e.target.files[0])}
                  className="hidden"
                />

                <div className="max-w-md mx-auto space-y-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                    {selectedFile ? (
                      <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>

                  <div>
                    {selectedFile ? (
                      <>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {(selectedFile.size / 1024).toFixed(1)} KB · Ready to match
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Tap to select or drag & drop your resume
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          PDF, DOCX, DOC, TXT, or Markdown (up to 25MB)
                        </p>
                      </>
                    )}
                  </div>

                  {/* Explicit touch button for mobile */}
                  <div className="pt-2 sm:hidden">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white shadow-xs w-full"
                    >
                      Choose Resume File
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Upload */}
              {selectedFile && (
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handleProcessFile}
                    disabled={isAnalyzing || isExtractingLocal}
                    className="w-full sm:flex-1 min-h-[48px] py-3 px-5 text-sm font-semibold rounded-2xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-60"
                  >
                    {isAnalyzing || isExtractingLocal ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                        <span>Finding State-Eligible Remote Jobs...</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze & Match Remote Jobs</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleConvertToText}
                    disabled={isConvertingToText || isAnalyzing}
                    className="w-full sm:w-auto min-h-[48px] py-3 px-4 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                    title="Inspect or edit extracted text before searching"
                  >
                    {isConvertingToText ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <FileCode className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    )}
                    <span>Preview & Edit Text</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Paste Resume Text */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Paste Resume or Work History:
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your resume, job summary, skills, or LinkedIn text here..."
                  rows={9}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/50"
                />
              </div>

              <button
                onClick={handleProcessPastedText}
                disabled={isAnalyzing || !pastedText.trim()}
                className="w-full min-h-[48px] py-3 px-5 text-sm font-semibold rounded-2xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                    <span>Matching Remote Openings...</span>
                  </>
                ) : (
                  <>
                    <span>Extract & Match Openings</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Location & Realistic Salary Preferences Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            {/* Where User Lives (State Filter) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Where do you live? (Home State)</span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Many remote companies only hire in specific states. Setting your state filters for state-specific remote jobs you are actually eligible for.
              </p>
              <select
                value={userState}
                onChange={(e) => setUserState(e.target.value)}
                className="w-full text-xs font-medium py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500 cursor-pointer shadow-2xs"
              >
                <option value="All US">Nationwide (All 50 US States)</option>
                {Object.entries(US_STATE_NAMES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
                <option value="International">Outside United States / International</option>
              </select>
            </div>

            {/* Target Realistic Salary */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Target Salary (Realistic & Achievable)</span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Keep job matches grounded in realistic market rates. Avoids out-of-reach salaries.
              </p>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSalaryTier('achievable')}
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-xl border transition-all ${
                    salaryTier === 'achievable'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  $45k - $75k
                  <span className="block text-[9px] font-normal opacity-90">Achievable</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSalaryTier('mid')}
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-xl border transition-all ${
                    salaryTier === 'mid'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  $60k - $90k
                  <span className="block text-[9px] font-normal opacity-90">Mid-Range</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSalaryTier('senior')}
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-xl border transition-all ${
                    salaryTier === 'senior'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  $78k - $110k
                  <span className="block text-[9px] font-normal opacity-90">Experienced</span>
                </button>
              </div>

              {salaryTier === 'custom' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    value={customMinSalary}
                    onChange={(e) => setCustomMinSalary(Number(e.target.value))}
                    placeholder="Min ($)"
                    className="w-1/2 p-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                  <span className="text-slate-400 text-xs">to</span>
                  <input
                    type="number"
                    value={customMaxSalary}
                    onChange={(e) => setCustomMaxSalary(Number(e.target.value))}
                    placeholder="Max ($)"
                    className="w-1/2 p-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
