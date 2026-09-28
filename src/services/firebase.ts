import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
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

// Human-friendly error translation for Email/Password Auth
export interface AuthErrorDetails {
  code: string;
  userFriendlyMessage: string;
  isProviderDisabled?: boolean;
  providerSettingsUrl?: string;
}

export function parseAuthError(error: any): AuthErrorDetails {
  const code = error?.code || '';
  const message = error?.message || '';

  if (code === 'auth/operation-not-allowed' || message.includes('operation-not-allowed')) {
    return {
      code,
      userFriendlyMessage: 'Email/Password sign-in is not yet enabled in the Firebase Console.',
      isProviderDisabled: true,
      providerSettingsUrl: `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`
    };
  }

  if (code === 'auth/email-already-in-use') {
    return {
      code,
      userFriendlyMessage: 'An account with this email address already exists. Please sign in instead.'
    };
  }

  if (code === 'auth/invalid-email') {
    return {
      code,
      userFriendlyMessage: 'Please enter a valid email address.'
    };
  }

  if (code === 'auth/weak-password') {
    return {
      code,
      userFriendlyMessage: 'Password should be at least 6 characters long.'
    };
  }

  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/user-not-found') {
    return {
      code,
      userFriendlyMessage: 'Invalid email or password. Please check your credentials and try again.'
    };
  }

  if (code === 'auth/too-many-requests') {
    return {
      code,
      userFriendlyMessage: 'Access temporarily disabled due to many failed login attempts. Please reset your password or try again later.'
    };
  }

  return {
    code,
    userFriendlyMessage: message || 'An error occurred during authentication.'
  };
}

// 1. Sign Up with Email and Password
export async function signUpWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName && cred.user) {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    }
    return cred.user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

// 2. Sign In with Email and Password
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return cred.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

// 3. Password Reset
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

// 4. Sign Out
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
}

// Local Storage Fallback for Offline / Browser Users
const LOCAL_STORAGE_SAVED_RESUME_KEY = 'jobhunta_saved_resume_local';

export function saveResumeLocally(
  profile: CandidateProfile,
  rawText: string,
  fileName: string
): SavedUserResume {
  const data: SavedUserResume = {
    userId: 'local-guest-user',
    email: 'local.candidate@jobhunta.app',
    displayName: profile.name || 'Candidate',
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

// Saved Resume Services in Firestore
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
    displayName: user.displayName || profile.name || user.email?.split('@')[0] || '',
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

// Applied Jobs Services in Firestore
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
