import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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

// Google Authentication
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
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

// Saved Resume Services
export async function saveResumeToAccount(
  user: User,
  profile: CandidateProfile,
  rawText: string,
  fileName: string
): Promise<void> {
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
