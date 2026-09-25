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
  Briefcase,
  Sparkles,
  Check,
  ShieldCheck
} from 'lucide-react';
import { SAMPLE_RESUMES, SampleResume } from '../data/sampleResumes';
import { convertDocumentToPlainText } from '../services/api';
import { extractTextFromFileInBrowser, fileToCleanBase64 } from '../utils/clientDocumentExtractor';

interface ResumeLaunchpadProps {
  onAnalyzeText: (text: string) => Promise<void>;
  onAnalyzeFile: (fileBase64: string, mimeType: string, fileName: string, clientText?: string) => Promise<void>;
  onSelectSample: (sampleId: string) => void;
  isAnalyzing: boolean;
}

export const ResumeLaunchpad: React.FC<ResumeLaunchpadProps> = ({
  onAnalyzeText,
  onAnalyzeFile,
  onSelectSample,
  isAnalyzing,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isConvertingToText, setIsConvertingToText] = useState(false);
  const [isExtractingLocal, setIsExtractingLocal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // 1. In-browser extraction (works on iOS Safari, Android, Netlify static, and desktop)
      let inBrowserText = '';
      try {
        inBrowserText = await extractTextFromFileInBrowser(selectedFile);
      } catch (err) {
        console.warn('In-browser extraction notice:', err);
      }

      // 2. Clean base64 sanitized of newlines/whitespace (prevents HTTP packet malformed errors)
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
    } catch (err: any) {
      console.error('File analysis error:', err);
      setErrorMessage(
        err.message || 'Could not parse document. Try using "Preview & Edit as Plain Text" or pasting your resume directly.'
      );
    } finally {
      setIsExtractingLocal(false);
    }
  };

  const handleConvertToPlainText = async () => {
    if (!selectedFile) return;
    setErrorMessage(null);
    setInfoMessage(null);
    setIsConvertingToText(true);

    try {
      // 1. In-browser extraction first (instant, runs client-side on Netlify & mobile)
      const browserText = await extractTextFromFileInBrowser(selectedFile);
      if (browserText && browserText.trim().length > 25) {
        setPastedText(browserText.trim());
        setActiveTab('paste');
        setInfoMessage('Document converted to plain text below. Review or edit, then click "Extract & Find Remote Jobs".');
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
        setInfoMessage(result.note || 'Resume text extracted! Review or edit below, then click "Extract & Find Remote Jobs".');
      } else {
        throw new Error('No readable text could be extracted.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Unable to convert automatically. Please paste your resume text directly into the "Paste Resume Text" tab.'
      );
    } finally {
      setIsConvertingToText(false);
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
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please check your text and try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Welcome Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
          <Briefcase className="w-3.5 h-3.5" />
          <span>JobHunta Remote Career Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Drop Your Resume to Start Finding Remote Jobs
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          JobHunta ingests your actual document, parses your real work history & skills, and finds targeted remote IT & engineering opportunities tailored to you.
        </p>
      </div>

      {/* Main Intake Box */}
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
            <button
              onClick={() => {
                setActiveTab('samples');
                setErrorMessage(null);
              }}
              disabled={isAnalyzing || isConvertingToText}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'samples'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Try Sample Profiles
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
            <div className="space-y-5">
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
                    : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/70'
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

                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : 'Drop your resume file here or click to browse'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                  Supports PDF (.pdf), Microsoft Word (.docx, .doc), or Plaintext (.txt, .md) up to 20MB.
                </p>

                {selectedFile && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{(selectedFile.size / 1024).toFixed(0)} KB ready to pull</span>
                  </div>
                )}
              </div>

              {/* Progress Indicator when analyzing */}
              {isAnalyzing && (
                <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-200 text-indigo-900 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                      Ingesting & parsing your resume...
                    </span>
                    <span className="text-indigo-600">Step 1 of 2</span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-1.5 rounded-full w-2/3 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-indigo-700">
                    Extracting work experience, core technologies, and targeting high-affinity remote roles.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Your resume is processed securely and privately.</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {selectedFile && (
                    <button
                      onClick={handleConvertToPlainText}
                      disabled={isConvertingToText || isAnalyzing}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-all"
                    >
                      {isConvertingToText ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Converting...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                          <span>Preview Plain Text</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={handleProcessFile}
                    disabled={!selectedFile || isAnalyzing || isConvertingToText}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                        <span>Pulling Resume...</span>
                      </>
                    ) : (
                      <>
                        <span>Pull Resume & Find Remote Jobs</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Paste Directly */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-900 block">
                    Paste Resume Text
                  </label>
                  <p className="text-xs text-slate-500">
                    Copy and paste your summary, work experience, and skills directly from Word, Google Docs, or LinkedIn.
                  </p>
                </div>
                {pastedText && (
                  <button
                    onClick={() => setPastedText('')}
                    className="text-xs text-slate-400 hover:text-slate-600 underline"
                  >
                    Clear text
                  </button>
                )}
              </div>

              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the full text of your resume here...&#10;&#10;Example:&#10;THOMAS JOE&#10;IT Support Specialist / Desktop Engineer&#10;Skills: Active Directory, ServiceNow, Windows 10/11, Hardware Imaging...&#10;Experience:&#10;• Deployed and configured 200+ remote workstations..."
                rows={12}
                className="w-full text-xs font-mono p-4 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all text-slate-800 placeholder:text-slate-400 leading-relaxed bg-slate-50/40"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  {pastedText.length} characters · {pastedText.trim() ? pastedText.trim().split(/\s+/).length : 0} words
                </span>

                <button
                  onClick={handleProcessPaste}
                  disabled={!pastedText.trim() || isAnalyzing}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                      <span>Pulling Resume...</span>
                    </>
                  ) : (
                    <>
                      <span>Extract & Find Remote Jobs</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Curated Sample Profiles */}
          {activeTab === 'samples' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Try Demo Resumes
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any sample to explore how JobHunta matches remote opportunities, career trajectories, and ATS tailoring:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SAMPLE_RESUMES.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => !isAnalyzing && onSelectSample(sample.id)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 text-left cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {sample.name}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            Demo
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 mt-0.5">{sample.targetRole}</p>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {sample.yearsExp} yrs
                      </span>
                    </div>

                    <div className="mt-2.5 text-xs text-slate-500 line-clamp-2">
                      {sample.text.split('\n').filter((l) => l.trim().length > 35)[0] || sample.targetRole}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{sample.seniority}</span>
                      <span className="font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Load Demo <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
