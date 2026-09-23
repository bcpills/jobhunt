import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { SAMPLE_RESUMES, SampleResume } from '../data/sampleResumes';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeText: (text: string) => Promise<void>;
  onAnalyzeFile: (fileBase64: string, mimeType: string, fileName: string) => Promise<void>;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setErrorMessage(null);
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
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;
    setErrorMessage(null);

    const isText = selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md');

    if (isText) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        try {
          await onAnalyzeText(text);
          onClose();
        } catch (err: any) {
          setErrorMessage(err.message || 'Analysis failed. Please check your document or paste text directly.');
        }
      };
      reader.onerror = () => {
        setErrorMessage('Unable to read selected text file. Please try pasting its content.');
      };
      reader.readAsText(selectedFile);
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        try {
          await onAnalyzeFile(base64, selectedFile.type || 'application/pdf', selectedFile.name);
          onClose();
        } catch (err: any) {
          setErrorMessage(
            err.message || 'Analysis failed. Tip: You can also copy and paste your resume text under the "Paste Resume Text" tab.'
          );
        }
      };
      reader.onerror = () => {
        setErrorMessage('Error reading file. Please try pasting the resume text directly.');
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleProcessPaste = async () => {
    if (!pastedText.trim() || pastedText.trim().length < 50) {
      setErrorMessage('Please provide a complete resume with at least your work history, skills, and background.');
      return;
    }
    setErrorMessage(null);
    try {
      await onAnalyzeText(pastedText);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please try again.');
    }
  };

  const handleSelectSample = async (sample: SampleResume) => {
    setErrorMessage(null);
    try {
      await onAnalyzeText(sample.text);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upload or Select Your Resume</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              We extract your skills, achievements, and seniority to unlock realistic remote job matches.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isAnalyzing}
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
              disabled={isAnalyzing}
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
              disabled={isAnalyzing}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'paste'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paste Resume Text
            </button>
            <button
              onClick={() => {
                setActiveTab('samples');
                setErrorMessage(null);
              }}
              disabled={isAnalyzing}
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
                  accept=".pdf,.docx,.txt,.md"
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
                  Supports PDF, DOCX, TXT, or Markdown (up to 15MB)
                </p>
                {selectedFile && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{(selectedFile.size / 1024).toFixed(0)} KB ready to analyze</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Privacy notice: File is processed safely server-side to extract qualifications.
                </span>
                <button
                  onClick={handleProcessFile}
                  disabled={!selectedFile || isAnalyzing}
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
          )}

          {/* TAB 2: Paste Text */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Paste Resume Content
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste plain text of your resume, including professional summary, skills, work history, and education..."
                  rows={10}
                  className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all text-slate-800 placeholder:text-slate-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Characters: {pastedText.length}</span>
                  <span>Words: {pastedText.trim() ? pastedText.trim().split(/\s+/).length : 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
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
