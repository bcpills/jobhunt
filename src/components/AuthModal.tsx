import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import {
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  parseAuthError,
  AuthErrorDetails
} from '../services/firebase';

export type AuthMode = 'signin' | 'signup' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onSuccess?: () => void;
  onContinueGuest?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
  onContinueGuest
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<AuthErrorDetails | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync initialMode when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorDetails(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorDetails({
        code: 'validation/empty-email',
        userFriendlyMessage: 'Please enter your email address.'
      });
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      try {
        await resetPassword(cleanEmail);
        setSuccessMessage(`Password reset link sent to ${cleanEmail}. Please check your inbox.`);
      } catch (err: any) {
        setErrorDetails(parseAuthError(err));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorDetails({
        code: 'validation/empty-password',
        userFriendlyMessage: 'Please enter your password.'
      });
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setErrorDetails({
          code: 'validation/short-password',
          userFriendlyMessage: 'Password must be at least 6 characters long.'
        });
        return;
      }
      if (password !== confirmPassword) {
        setErrorDetails({
          code: 'validation/password-mismatch',
          userFriendlyMessage: 'Passwords do not match. Please re-enter.'
        });
        return;
      }

      setIsLoading(true);
      try {
        await signUpWithEmail(cleanEmail, password, displayName.trim());
        setSuccessMessage('Account created successfully!');
        if (onSuccess) onSuccess();
        onClose();
      } catch (err: any) {
        setErrorDetails(parseAuthError(err));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign In
      setIsLoading(true);
      try {
        await signInWithEmail(cleanEmail, password);
        if (onSuccess) onSuccess();
        onClose();
      } catch (err: any) {
        setErrorDetails(parseAuthError(err));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="auth-modal-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                {mode === 'signin' && 'Sign In to JobHunta'}
                {mode === 'signup' && 'Create Your Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {mode === 'signin' && 'Enter your email and password to access your synced resume & jobs.'}
                {mode === 'signup' && 'Sign up with email to sync your tailored resumes and applications.'}
                {mode === 'forgot' && 'We’ll email you instructions to reset your password.'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mode Switcher Tabs for Sign In vs Sign Up */}
          {mode !== 'forgot' && (
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorDetails(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorDetails(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {errorDetails && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl space-y-2">
              <div className="flex items-start gap-2 text-rose-800 dark:text-rose-300 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span>{errorDetails.userFriendlyMessage}</span>
              </div>

              {errorDetails.isProviderDisabled && errorDetails.providerSettingsUrl && (
                <div className="pt-2 border-t border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-700 dark:text-rose-300 space-y-2">
                  <p>
                    To enable Email/Password logins in Firebase, enable <strong>Email/Password</strong> under Firebase Console Authentication Providers.
                  </p>
                  <a
                    href={errorDetails.providerSettingsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold underline hover:text-rose-900 dark:hover:text-rose-100"
                  >
                    <span>Open Firebase Auth Providers</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Input: Display Name (Sign Up only) */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label
                htmlFor="signup-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Your Name <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Taylor"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Input: Email */}
          <div className="space-y-1">
            <label
              htmlFor="auth-email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Input: Password (Sign In and Sign Up) */}
          {mode !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorDetails(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Input: Confirm Password (Sign Up only) */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label
                htmlFor="auth-confirm-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 min-h-[44px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : mode === 'signin' ? (
              'Sign In'
            ) : mode === 'signup' ? (
              'Create Account'
            ) : (
              'Send Reset Link'
            )}
          </button>

          {/* Switch back from Forgot Password */}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorDetails(null);
                setSuccessMessage(null);
              }}
              className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
            >
              ← Back to Sign In
            </button>
          )}

          {/* Offline / Browser Storage Fallback Option */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                if (onContinueGuest) {
                  onContinueGuest();
                }
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>Continue in Browser Storage (no login required)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
