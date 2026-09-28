import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  onSnapshot,
  getDocFromServer,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CandidateProfile, AppliedJobRecord, SavedUserResume } from '../types';

// Initialize Firebase App and Services
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Provider for Google Sign In
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Operation Types for Hardened Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial Boot Connection Probe
export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore client is offline or initializing.');
    }
  }
}

// Execute connection test on module load
testConnection();

export interface AuthDomainDiagnosis {
  isUnauthorizedDomain: boolean;
  currentHostname: string;
  projectId: string;
  consoleUrl: string;
  message: string;
}

export function diagnoseAuthError(error: any): AuthDomainDiagnosis | null {
  const code = error?.code || '';
  const message = error?.message || '';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isUnauthorized = code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain');

  if (isUnauthorized) {
    return {
      isUnauthorizedDomain: true,
      currentHostname: hostname,
      projectId: firebaseConfig.projectId,
      consoleUrl: `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`,
      message: `Your Netlify or custom domain "${hostname}" is not yet in the Firebase Authorized Domains list.`
    };
  }

  return null;
}

// Check redirect result on load (important for mobile & Netlify redirects)
export async function checkRedirectAuthResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      return result.user;
    }
  } catch (err: any) {
    console.warn('Redirect sign-in notice:', err);
    throw err;
  }
  return null;
}

// Google Authentication with Mobile & Popup-Blocker Fallbacks
export async function signInWithGoogle(useRedirectFallbackOnMobile = false): Promise<User> {
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  try {
    if (useRedirectFallbackOnMobile && isMobile) {
      // In mobile web contexts where popups are blocked by OS, use redirect
      await signInWithRedirect(auth, googleProvider);
      // Returns never as the page unloads, but typed as User
      return new Promise(() => {}) as unknown as User;
    }

    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    // If popup was blocked on mobile or desktop, attempt redirect
    if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
      console.warn('Popup blocked by browser, falling back to redirect authentication flow...');
      try {
        await signInWithRedirect(auth, googleProvider);
        return new Promise(() => {}) as unknown as User;
      } catch (redirectErr) {
        console.error('Redirect sign-in error:', redirectErr);
        throw redirectErr;
      }
    }

    console.error('Failed to sign in with Google:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
}

// Local Storage Fallback for Netlify / Offline Users
const LOCAL_STORAGE_SAVED_RESUME_KEY = 'jobhunta_saved_resume_local';

export function saveResumeLocally(
  profile: CandidateProfile,
  rawText: string,
  fileName: string
): SavedUserResume {
  const data: SavedUserResume = {
    userId: 'local-guest-user',
    email: 'local.session@jobhunta.local',
    displayName: profile.name || 'Local Candidate',
    photoURL: '',
    fileName: fileName || 'Uploaded_Resume.pdf',
    rawText: rawText || '',
    profile: profile,
    updatedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem(LOCAL_STORAGE_SAVED_RESUME_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save resume to localStorage:', e);
  }
  return data;
}

export function loadSavedResumeLocally(): SavedUserResume | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SAVED_RESUME_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read saved resume from localStorage:', e);
  }
  return null;
}

// Saved Resume Services
export async function saveResumeToAccount(
  user: User,
  profile: CandidateProfile,
  rawText: string,
  fileName: string
): Promise<void> {
  // Always update local cache first
  saveResumeLocally(profile, rawText, fileName);

  const userDocRef = doc(db, 'users', user.uid);
  const data: SavedUserResume = {
    userId: user.uid,
    email: user.email || '',
    displayName: user.displayName || profile.name || '',
    photoURL: user.photoURL || '',
    fileName: fileName || 'Uploaded_Resume.pdf',
    rawText: rawText || '',
    profile: profile,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

export async function loadSavedResume(userId: string): Promise<SavedUserResume | null> {
  const userDocRef = doc(db, 'users', userId);
  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as SavedUserResume;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${userId}`);
  }
}

// Applied Jobs Services
export async function markJobAsApplied(
  userId: string,
  jobRecord: AppliedJobRecord
): Promise<void> {
  const jobDocRef = doc(db, 'users', userId, 'appliedJobs', jobRecord.jobId);
  const payload = {
    ...jobRecord,
    userId,
    appliedAt: jobRecord.appliedAt || new Date().toISOString(),
    status: jobRecord.status || 'applied'
  };

  try {
    await setDoc(jobDocRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/appliedJobs/${jobRecord.jobId}`);
  }
}

export async function unmarkJobAsApplied(
  userId: string,
  jobId: string
): Promise<void> {
  const jobDocRef = doc(db, 'users', userId, 'appliedJobs', jobId);
  try {
    await deleteDoc(jobDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}/appliedJobs/${jobId}`);
  }
}

export async function getAppliedJobs(userId: string): Promise<Record<string, AppliedJobRecord>> {
  const appliedCol = collection(db, 'users', userId, 'appliedJobs');
  try {
    const querySnapshot = await getDocs(appliedCol);
    const results: Record<string, AppliedJobRecord> = {};
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data() as AppliedJobRecord;
      results[data.jobId] = data;
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/appliedJobs`);
  }
}

export function subscribeToAppliedJobs(
  userId: string,
  onUpdate: (jobs: Record<string, AppliedJobRecord>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const appliedCol = collection(db, 'users', userId, 'appliedJobs');
  return onSnapshot(
    appliedCol,
    snapshot => {
      const results: Record<string, AppliedJobRecord> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as AppliedJobRecord;
        results[data.jobId] = data;
      });
      onUpdate(results);
    },
    error => {
      try {
        handleFirestoreError(error, OperationType.LIST, `users/${userId}/appliedJobs`);
      } catch (e) {
        if (onError && e instanceof Error) onError(e);
      }
    }
  );
}

export { onAuthStateChanged };
