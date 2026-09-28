import React, { useState } from 'react';
import {
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  X,
  Sparkles,
  Database,
  ArrowRight,
  Globe
} from 'lucide-react';

interface NetlifyAuthHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostname: string;
  projectId: string;
  consoleUrl: string;
  onUseLocalStorageMode: () => void;
}

export const NetlifyAuthHelpModal: React.FC<NetlifyAuthHelpModalProps> = ({
  isOpen,
  onClose,
  hostname,
  projectId,
  consoleUrl,
  onUseLocalStorageMode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentHost = hostname || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentHost);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-amber-50/80 dark:bg-amber-950/30 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Authorize Netlify Domain in Firebase
              </h2>
              <p className="text-xs text-amber-900/80 dark:text-amber-200 mt-0.5">
                Google OAuth requires newly deployed domains to be added to Authorized Domains.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Current Domain Box with One-Click Copy */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              Your Current Netlify Domain:
            </label>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
              <code className="text-xs sm:text-sm font-mono font-bold text-indigo-700 dark:text-indigo-400 flex-1 truncate select-all">
                {currentHost}
              </code>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3 Step Quick Resolution */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Quick 30-Second Fix in Firebase Console</span>
            </h3>
            <ol className="space-y-2 text-slate-600 dark:text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                Open{' '}
                <a
                  href={consoleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-indigo-600 dark:text-indigo-400 underline inline-flex items-center gap-1"
                >
                  Firebase Authentication Settings
                  <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                (Project: <span className="font-mono text-[11px] font-semibold">{projectId}</span>).
              </li>
              <li>
                Scroll down to the <strong className="text-slate-800 dark:text-slate-100">Authorized domains</strong> section and click <strong className="text-slate-800 dark:text-slate-100">Add domain</strong>.
              </li>
              <li>
                Paste <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono text-[11px] text-indigo-600 dark:text-indigo-300 font-bold">{currentHost}</code> and click <strong className="text-slate-800 dark:text-slate-100">Save</strong>.
              </li>
            </ol>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              ✓ Once saved, Google Sign-In on Netlify activates immediately without redeploying!
            </p>
          </div>

          {/* Instant Offline Storage Fallback */}
          <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-slate-900 dark:text-white">
                Want to save your resume right now?
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              You can enable Local Browser Session mode. Your uploaded resume, target salary, state eligibility, and marked applied jobs will be saved securely in your browser's persistent storage right away.
            </p>
            <button
              onClick={() => {
                onUseLocalStorageMode();
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
            >
              <span>Enable Browser Storage Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <a
            href={consoleUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <span>Open Firebase Settings</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
