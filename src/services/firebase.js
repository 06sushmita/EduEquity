import { initializeApp } from 'firebase/app'
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile,
} from 'firebase/auth'
import {
  getFirestore, collection, addDoc, query,
  where, getDocs, onSnapshot, serverTimestamp,
} from 'firebase/firestore'

const firebaseEnvMap = {
  apiKey:            'VITE_FIREBASE_API_KEY',
  authDomain:        'VITE_FIREBASE_AUTH_DOMAIN',
  projectId:         'VITE_FIREBASE_PROJECT_ID',
  storageBucket:     'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId:             'VITE_FIREBASE_APP_ID',
}

const firebaseConfig = Object.fromEntries(
  Object.entries(firebaseEnvMap).map(([configKey, envKey]) => [
    configKey,
    import.meta.env[envKey]?.trim(),
  ])
)

const missingFirebaseEnvVars = Object.entries(firebaseEnvMap)
  .filter(([configKey]) => !firebaseConfig[configKey])
  .map(([, envKey]) => envKey)

if (missingFirebaseEnvVars.length) {
  throw new Error(
    `Missing Firebase environment variables: ${missingFirebaseEnvVars.join(', ')}. ` +
    'Copy .env.example to .env and restart the Vite dev server.'
  )
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// ── Auth ──────────────────────────────────────────────────────────────────

export const loginWithGoogle  = () => signInWithPopup(auth, googleProvider)
export const loginWithEmail   = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)
export const registerWithEmail = async (name, email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: name })
  return cred
}
export const logout      = () => signOut(auth)
export const onAuthChange = (cb) => onAuthStateChanged(auth, cb)

// ── Results (teacher → student) ───────────────────────────────────────────

const sortNewestFirst = (docs) =>
  docs.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? (a.createdAt ? new Date(a.createdAt).getTime() : 0)
    const tb = b.createdAt?.toMillis?.() ?? (b.createdAt ? new Date(b.createdAt).getTime() : 0)
    return tb - ta
  })

// Write a result document to Firestore.
// Always normalises studentEmail to lowercase so queries match reliably.
export const saveResult = (data) =>
  addDoc(collection(db, 'results'), {
    ...data,
    studentEmail: (data.studentEmail ?? '').toLowerCase().trim(),
    createdAt: serverTimestamp(),
  })

// ── Real-time listeners ───────────────────────────────────────────────────
// These return an unsubscribe function — call it on component unmount.
// The callback receives the sorted array every time Firestore updates,
// so the UI stays in sync without any manual refresh.

/**
 * Subscribe to all results for a given student email.
 * @param {string}   email  — student's email address
 * @param {Function} onData — called with sorted results array on every change
 * @param {Function} onErr  — called with Error on permission / network failure
 * @returns {Function} unsubscribe
 */
export const subscribeResultsByStudentEmail = (email, onData, onErr) => {
  const q = query(
    collection(db, 'results'),
    where('studentEmail', '==', email.toLowerCase().trim())
  )
  return onSnapshot(
    q,
    (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      onData(sortNewestFirst(docs))
    },
    onErr
  )
}

/**
 * Subscribe to all results saved by a given teacher.
 * @param {string}   teacherId — teacher's Firebase Auth UID
 * @param {Function} onData    — called with sorted results array on every change
 * @param {Function} onErr     — called with Error on permission / network failure
 * @returns {Function} unsubscribe
 */
export const subscribeResultsByTeacher = (teacherId, onData, onErr) => {
  const q = query(
    collection(db, 'results'),
    where('teacherId', '==', teacherId)
  )
  return onSnapshot(
    q,
    (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      onData(sortNewestFirst(docs))
    },
    onErr
  )
}

// ── One-shot helpers (kept for backwards compatibility) ───────────────────

export const getResultsByStudentEmail = async (email) => {
  const q = query(
    collection(db, 'results'),
    where('studentEmail', '==', email.toLowerCase().trim())
  )
  const snap = await getDocs(q)
  return sortNewestFirst(snap.docs.map(d => ({ id: d.id, ...d.data() })))
}

export const getResultsByTeacher = async (teacherId) => {
  const q = query(
    collection(db, 'results'),
    where('teacherId', '==', teacherId)
  )
  const snap = await getDocs(q)
  return sortNewestFirst(snap.docs.map(d => ({ id: d.id, ...d.data() })))
}

// ── Legacy helpers (kept for existing hooks) ──────────────────────────────

export const saveEvaluation = (uid, d) =>
  addDoc(collection(db, 'evaluations'), { userId: uid, ...d, createdAt: serverTimestamp() })

export const saveScholarship = (uid, d) =>
  addDoc(collection(db, 'scholarships'), { userId: uid, ...d, createdAt: serverTimestamp() })

export const getUserEvaluations = async (uid) => {
  const snap = await getDocs(query(collection(db, 'evaluations'), where('userId', '==', uid)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getUserScholarships = async (uid) => {
  const snap = await getDocs(query(collection(db, 'scholarships'), where('userId', '==', uid)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}