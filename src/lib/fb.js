/*
  Todo lo que viene del SDK de Firebase está aquí, para cargarlo como un archivo aparte.
  - Auth sin popups/redirecciones (solo correo y contraseña): más ligero que getAuth().
  - Firestore "lite": lecturas y escrituras simples, sin tiempo real. Mucho más pequeño.
*/
import { initializeApp } from 'firebase/app'
import {
  initializeAuth, indexedDBLocalPersistence, browserLocalPersistence,
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, sendEmailVerification, updateProfile, EmailAuthProvider,
  reauthenticateWithCredential, updatePassword, deleteUser,
} from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, deleteField } from 'firebase/firestore/lite'

export function init(config) {
  const app = initializeApp(config)
  const auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] })
  auth.languageCode = 'es' // correos de verificación y contraseña en español
  const db = getFirestore(app)
  return {
    auth, db,
    onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
    sendPasswordResetEmail, sendEmailVerification, updateProfile, EmailAuthProvider,
    reauthenticateWithCredential, updatePassword, deleteUser,
    doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, deleteField,
  }
}
