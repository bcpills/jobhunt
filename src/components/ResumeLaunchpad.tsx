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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Realistic Remote Hiring · State Eligibility Matching</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find Remote Jobs You Can <span className="text-indigo-600 underline decoration-indigo-200">Actually Land</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload your resume. We match state-specific remote requirements and filter for achievable, realistic salaries so you never waste time on unachievable roles.
        </p>
      </div>

      {/* Main Intake Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('upload');
                setErrorMessage(null);
              }}
              disabled={isAnalyzing || isConvertingToText}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload Document (PDF / DOCX)
            </button>
            <button
              onClick={() => {
                setActiveTab('paste');
                setErrorMessage(null);
              }}
              disabled={isAnalyzing || isConvertingToText}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'paste'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paste Resume Text {pastedText ? `(${pastedText.length} chars)` : ''}
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-5 p-3.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-indigo-600 bg-indigo-50/60 ring-4 ring-indigo-100'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
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
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {selectedFile ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    ) : (
                      <UploadCloud className="w-7 h-7 text-indigo-600" />
                    )}
                  </div>

                  <div>
                    {selectedFile ? (
                      <>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {(selectedFile.size / 1024).toFixed(1)} KB · Ready to match
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-slate-900">
                          Click to upload or drag & drop your resume
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          PDF, DOCX, DOC, TXT, or Markdown (up to 25MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Upload */}
              {selectedFile && (
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handleProcessFile}
                    disabled={isAnalyzing || isExtractingLocal}
                    className="w-full sm:flex-1 py-3 px-5 text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-60"
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
                    className="w-full sm:w-auto py-3 px-4 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    title="Inspect or edit extracted text before searching"
                  >
                    {isConvertingToText ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                    ) : (
                      <FileCode className="w-4 h-4 text-slate-500" />
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Paste Resume or Work History:
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your resume, job summary, skills, or LinkedIn text here..."
                  rows={10}
                  className="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono leading-relaxed text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 bg-slate-50/40"
                />
              </div>

              <button
                onClick={handleProcessPastedText}
                disabled={isAnalyzing || !pastedText.trim()}
                className="w-full py-3 px-5 text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
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
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
            {/* Where User Lives (State Filter) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Where do you live? (Home State)</span>
              </label>
              <p className="text-[11px] text-slate-500 leading-snug">
                Many remote companies only hire in specific states. Setting your state filters for state-specific remote jobs you are actually eligible for.
              </p>
              <select
                value={userState}
                onChange={(e) => setUserState(e.target.value)}
                className="w-full text-xs font-medium py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-slate-800 cursor-pointer shadow-2xs"
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
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Target Salary (Realistic & Achievable)</span>
              </label>
              <p className="text-[11px] text-slate-500 leading-snug">
                Keep job matches grounded in realistic market rates. Avoids out-of-reach salaries.
              </p>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSalaryTier('achievable')}
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border transition-all ${
                    salaryTier === 'achievable'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  $45k - $75k
                  <span className="block text-[9px] font-normal opacity-90">Achievable</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSalaryTier('mid')}
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border transition-all ${
                    salaryTier === 'mid'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  $60k - $90k
                  <span className="block text-[9px] font-normal opacity-90">Mid-Range</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSalaryTier('senior')}
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border transition-all ${
                    salaryTier === 'senior'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
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
                    className="w-1/2 p-1.5 text-xs border border-slate-200 rounded-md bg-white"
                  />
                  <span className="text-slate-400 text-xs">to</span>
                  <input
                    type="number"
                    value={customMaxSalary}
                    onChange={(e) => setCustomMaxSalary(Number(e.target.value))}
                    placeholder="Max ($)"
                    className="w-1/2 p-1.5 text-xs border border-slate-200 rounded-md bg-white"
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
