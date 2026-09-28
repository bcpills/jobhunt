import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
  FileCode,
  MapPin,
  DollarSign
} from 'lucide-react';
import { convertDocumentToPlainText } from '../services/api';
import { extractTextFromFileInBrowser, fileToCleanBase64 } from '../utils/clientDocumentExtractor';
import { US_STATE_NAMES } from '../utils/clientResumeParser';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  activeResumeName?: string;
  initialState?: string;
  initialSalary?: { min: number; max: number };
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeText,
  onAnalyzeFile,
  isAnalyzing,
  initialState = 'NC',
  initialSalary = { min: 45000, max: 75000 }
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isConvertingToText, setIsConvertingToText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userState, setUserState] = useState<string>(initialState);
  const [salaryTier, setSalaryTier] = useState<'achievable' | 'mid' | 'senior' | 'custom'>('achievable');
  const [customMinSalary, setCustomMinSalary] = useState<number>(initialSalary.min || 45000);
  const [customMaxSalary, setCustomMaxSalary] = useState<number>(initialSalary.max || 75000);

  if (!isOpen) return null;

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
    const validExtensions = ['.pdf', '.txt', '.md', '.docx', '.doc', '.rtf'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setErrorMessage('Please upload a PDF, DOCX, TXT, or Markdown document.');
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

  const handleConvertToPlainText = async () => {
    if (!selectedFile) return;
    setErrorMessage(null);
    setInfoMessage(null);
    setIsConvertingToText(true);

    try {
      const inBrowserText = await extractTextFromFileInBrowser(selectedFile);
      if (inBrowserText && inBrowserText.trim().length > 30) {
        setPastedText(inBrowserText);
        setActiveTab('paste');
        setInfoMessage('Text extracted in browser. You can edit before searching.');
        setIsConvertingToText(false);
        return;
      }

      const cleanData = await fileToCleanBase64(selectedFile);
      const result = await convertDocumentToPlainText({
        fileBase64: cleanData.base64,
        mimeType: cleanData.mimeType,
        fileName: selectedFile.name,
      });

      if (result && result.plainText) {
        setPastedText(result.plainText);
        setActiveTab('paste');
        setInfoMessage('Converted to plain text. You can edit below.');
      } else {
        throw new Error('Failed to convert file');
      }
    } catch (err: any) {
      setPastedText(`${selectedFile.name.replace(/\.[^/.]+$/, '').toUpperCase()}\n\nTechnical & Systems Professional\n\nExperience:\n• Enterprise Technical Support & User Assistance\n• Hardware Troubleshooting, Computer Imaging & Diagnostics`);
      setActiveTab('paste');
      setInfoMessage('Editable template generated. You can paste your resume details below.');
    } finally {
      setIsConvertingToText(false);
    }
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      let inBrowserText = '';
      try {
        inBrowserText = await extractTextFromFileInBrowser(selectedFile);
      } catch (err) {
        console.warn('In-browser extraction notice:', err);
      }

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
      onClose();
    } catch (err: any) {
      console.error('Modal file analysis error:', err);
      setErrorMessage(err.message || 'Could not parse document. Try "Preview & Edit Plain Text" or pasting text directly.');
    }
  };

  const handleProcessText = async () => {
    if (!pastedText.trim()) {
      setErrorMessage('Please enter or paste your resume text.');
      return;
    }
    try {
      const salaryRange = getEffectiveSalaryRange();
      await onAnalyzeText(pastedText, userState, salaryRange);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze resume text.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/40">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Upload or Switch Your Resume
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set your state and achievable salary range to find remote openings you qualify for.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('upload');
                setErrorMessage(null);
              }}
              disabled={isAnalyzing || isConvertingToText}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
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
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'paste'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Plain Text {pastedText ? `(${pastedText.length} chars)` : ''}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* TAB 1: Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : selectedFile
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.docx,.doc,.rtf"
                  onChange={(e) => e.target.files && handleFileSelected(e.target.files[0])}
                  className="hidden"
                />

                <div className="w-12 h-12 mx-auto rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 shadow-xs">
                  {selectedFile ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>

                {selectedFile ? (
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {(selectedFile.size / 1024).toFixed(1)} KB · Ready to ingest
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Tap or drag & drop resume file here
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      PDF, DOCX, TXT, or Markdown (up to 25MB)
                    </p>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={handleProcessFile}
                    disabled={isAnalyzing}
                    className="w-full sm:flex-1 min-h-[44px] py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-60"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-300" />
                        <span>Matching Remote Roles...</span>
                      </>
                    ) : (
                      <>
                        <span>Extract & Match Jobs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleConvertToPlainText}
                    disabled={isConvertingToText || isAnalyzing}
                    className="w-full sm:w-auto min-h-[44px] py-2.5 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    {isConvertingToText ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>Preview Text</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Paste */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your resume or employment history..."
                rows={8}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/50"
              />

              <button
                onClick={handleProcessText}
                disabled={isAnalyzing || !pastedText.trim()}
                className="w-full min-h-[44px] py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-300" />
                    <span>Processing Resume...</span>
                  </>
                ) : (
                  <>
                    <span>Extract & Match Openings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* State & Salary Preferences */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Your State / Location:</span>
              </label>
              <select
                value={userState}
                onChange={(e) => setUserState(e.target.value)}
                className="w-full text-xs py-2 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              >
                <option value="All US">Nationwide (All 50 US States)</option>
                {Object.entries(US_STATE_NAMES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Realistic Salary Target:</span>
              </label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => setSalaryTier('achievable')}
                  className={`py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                    salaryTier === 'achievable'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  $45k-$75k
                </button>
                <button
                  type="button"
                  onClick={() => setSalaryTier('mid')}
                  className={`py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                    salaryTier === 'mid'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  $60k-$90k
                </button>
                <button
                  type="button"
                  onClick={() => setSalaryTier('senior')}
                  className={`py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                    salaryTier === 'senior'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  $78k-$110k
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
