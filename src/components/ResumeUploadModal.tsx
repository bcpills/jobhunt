import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, RefreshCw, FileCode, Check } from 'lucide-react';
import { SAMPLE_RESUMES, SampleResume } from '../data/sampleResumes';
import { convertDocumentToPlainText } from '../services/api';
import { extractTextFromFileInBrowser, fileToCleanBase64 } from '../utils/clientDocumentExtractor';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeText: (text: string) => Promise<void>;
  onAnalyzeFile: (fileBase64: string, mimeType: string, fileName: string, clientText?: string) => Promise<void>;
  isAnalyzing: boolean;
  activeResumeName?: string;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeText,
  onAnalyzeFile,
  isAnalyzing,
  activeResumeName,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isConvertingToText, setIsConvertingToText] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
    const validExtensions = ['.pdf', '.txt', '.md', '.docx', '.doc'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setErrorMessage('Please upload a PDF, DOCX, TXT, or Markdown document.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB limit.');
      return;
    }
    setSelectedFile(file);
    setErrorMessage(null);
    setInfoMessage(null);
  };

  // Turn Uploaded Resume directly into editable Plain Text
  const handleConvertToPlainText = async () => {
    if (!selectedFile) return;
    setErrorMessage(null);
    setInfoMessage(null);
    setIsConvertingToText(true);

    try {
      // 1. In-browser extraction first (instant on Netlify & mobile)
      const browserText = await extractTextFromFileInBrowser(selectedFile);
      if (browserText && browserText.trim().length > 25) {
        setPastedText(browserText.trim());
        setActiveTab('paste');
        setInfoMessage('Document converted to plain text! Review or edit below, then click "Extract & Match Openings".');
        return;
      }

      // 2. Fallback to API text conversion
      const cleanData = await fileToCleanBase64(selectedFile);
      const result = await convertDocumentToPlainText({
        fileBase64: cleanData.base64,
        mimeType: cleanData.mimeType,
        fileName: selectedFile.name,
        clientExtractedText: browserText,
      });

      if (result && result.plainText) {
        setPastedText(result.plainText);
        setActiveTab('paste');
        setInfoMessage(result.note || 'Resume successfully turned into plain text! Review, edit, and click "Extract & Match Openings".');
      } else {
        throw new Error('No text could be extracted.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Could not convert automatically. Please copy and paste your resume text directly into the "Paste Resume Text" tab.'
      );
    } finally {
      setIsConvertingToText(false);
    }
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      // 1. In-browser text extraction first (works on iOS Safari, Android, Netlify static, and desktop)
      let inBrowserText = '';
      try {
        inBrowserText = await extractTextFromFileInBrowser(selectedFile);
      } catch (err) {
        console.warn('In-browser extraction notice:', err);
      }

      // 2. Prepare clean, sanitized base64 (stripped of newlines/whitespace to avoid packet malformed errors)
      let cleanBase64 = '';
      let mime = selectedFile.type || 'application/pdf';
      try {
        const cleanData = await fileToCleanBase64(selectedFile);
        cleanBase64 = cleanData.base64;
        mime = cleanData.mimeType;
      } catch (e) {
        console.warn('Base64 preparation notice:', e);
      }

      // 3. Dispatch analysis with both client-extracted text and clean base64
      await onAnalyzeFile(cleanBase64, mime, selectedFile.name, inBrowserText);
      onClose();
    } catch (err: any) {
      console.error('Document analysis error:', err);
      setErrorMessage(
        err.message || 'Could not read document. Use the "Turn into Plain Text" button or paste text directly.'
      );
    }
  };

  const handleProcessPaste = async () => {
    const trimmed = pastedText.trim();
    if (!trimmed || trimmed.length < 20) {
      setErrorMessage('Please paste your resume text (skills, work experience, or summary).');
      return;
    }
    setErrorMessage(null);
    setInfoMessage(null);
    try {
      await onAnalyzeText(trimmed);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please try again.');
    }
  };

  const handleSelectSample = async (sample: SampleResume) => {
    setErrorMessage(null);
    setInfoMessage(null);
    try {
      await onAnalyzeText(sample.text);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please try again.');
    }
  };

  const handleCopyPastedText = () => {
    if (!pastedText) return;
    navigator.clipboard.writeText(pastedText);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upload or Select Your Resume</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload any document format (PDF, DOCX, TXT) or convert directly into plain text for guaranteed reading.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isAnalyzing || isConvertingToText}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => {
                setActiveTab('upload');
                setErrorMessage(null);
              }}
              disabled={isAnalyzing || isConvertingToText}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload Document (PDF/DOCX)
            </button>
            <button
              onClick={() => {
                setActiveTab('paste');
                setErrorMessage(null);
              }}
              disabled={isAnalyzing || isConvertingToText}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'paste'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plain Text Editor {pastedText ? `(${pastedText.length} chars)` : ''}
            </button>
            <button
              onClick={() => {
                setActiveTab('samples');
                setErrorMessage(null);
              }}
              disabled={isAnalyzing || isConvertingToText}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'samples'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ready Sample Resumes
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">
                  {selectedFile ? selectedFile.name : 'Drop your resume file here or click to browse'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, DOCX, DOC, TXT, or Markdown (up to 15MB)
                </p>
                {selectedFile && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{(selectedFile.size / 1024).toFixed(0)} KB ready to process</span>
                  </div>
                )}
              </div>

              {/* Dedicated "Turn into Plain Text" Action Bar */}
              {selectedFile && (
                <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-amber-950">Having trouble reading complex PDF formatting?</h5>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Convert your document directly into clean, editable plain text so every skill and date is guaranteed readable.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleConvertToPlainText}
                    disabled={isConvertingToText || isAnalyzing}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 disabled:opacity-50 rounded-lg shrink-0 transition-colors shadow-xs"
                  >
                    {isConvertingToText ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Converting...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Turn into Plain Text</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Processed safely server-side.
                </span>
                <div className="flex items-center gap-2">
                  {selectedFile && (
                    <button
                      onClick={handleConvertToPlainText}
                      disabled={isConvertingToText || isAnalyzing}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Convert to Plain Text</span>
                    </button>
                  )}
                  <button
                    onClick={handleProcessFile}
                    disabled={!selectedFile || isAnalyzing || isConvertingToText}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                        <span>Analyzing Resume...</span>
                      </>
                    ) : (
                      <>
                        <span>Extract & Find Jobs</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Paste / Plain Text Editor */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Resume Plain Text Content
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Plain text guarantees 100% reliable matching without PDF font or column encoding issues.
                  </p>
                </div>
                {pastedText && (
                  <button
                    onClick={handleCopyPastedText}
                    className="text-[11px] font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
                  >
                    {copiedStatus ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste plain text of your resume here (Summary, Skills, Work History, Education)...&#10;&#10;Or click 'Upload Document (PDF/DOCX)' then select 'Turn into Plain Text' to populate this automatically."
                  rows={12}
                  className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all text-slate-800 placeholder:text-slate-400 leading-relaxed"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Characters: {pastedText.length}</span>
                  <span>Words: {pastedText.trim() ? pastedText.trim().split(/\s+/).length : 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPastedText('');
                    setInfoMessage(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Clear text
                </button>
                <button
                  onClick={handleProcessPaste}
                  disabled={!pastedText.trim() || isAnalyzing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-sm transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                      <span>Analyzing Resume...</span>
                    </>
                  ) : (
                    <>
                      <span>Extract & Match Openings</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Curated Sample Resumes */}
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-3">
                Select any of our pre-built realistic candidate profiles to instantly explore remote matching, resume tailoring, and cover letter generation:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_RESUMES.map((sample) => {
                  const isActive = activeResumeName === sample.name;
                  return (
                    <div
                      key={sample.id}
                      onClick={() => !isAnalyzing && handleSelectSample(sample)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{sample.name}</h4>
                          <p className="text-xs font-medium text-indigo-700 mt-0.5">{sample.targetRole}</p>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {sample.yearsExp} yrs exp
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-slate-500 line-clamp-2">
                        {sample.text.split('\n').filter((l) => l.trim().length > 30)[1] || sample.targetRole}
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-400">{sample.seniority} Level</span>
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1">
                          Load Profile <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

