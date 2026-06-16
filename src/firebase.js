// ─────────────────────────────────────────────────────────────────
// Firebase config — replace the values below with your own project
// after following Step 1 in the README.
// ─────────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAubfqWv3MwnNWLZ2bQAvbmbUu47lx9dxA",
  authDomain: "cafe-recipes-b3bcb.firebaseapp.com",
  projectId: "cafe-recipes-b3bcb",
  storageBucket: "cafe-recipes-b3bcb.firebasestorage.app",
  messagingSenderId: "388520962135",
  appId: "1:388520962135:web:c7f03f31c5fb1713201b12"
};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const RECIPES_DOC  = "mara/recipes";
const ADMIN_DOC    = "mara/admin";

export async function dbLoad() {
  try {
    const snap = await getDoc(doc(db, ...RECIPES_DOC.split("/")));
    if (snap.exists()) return snap.data().list || null;
  } catch(_) {}
  return null;
}

export async function dbSave(recipes) {
  try {
    await setDoc(doc(db, ...RECIPES_DOC.split("/")), { list: recipes });
  } catch(_) {}
}

export function dbSubscribe(callback) {
  return onSnapshot(doc(db, ...RECIPES_DOC.split("/")), snap => {
    if (snap.exists()) callback(snap.data().list || []);
  });
}

export async function loadAdminPw() {
  try {
    const snap = await getDoc(doc(db, ...ADMIN_DOC.split("/")));
    if (snap.exists()) return snap.data().hash || null;
  } catch(_) {}
  return null;
}

export async function saveAdminPw(hash) {
  try {
    await setDoc(doc(db, ...ADMIN_DOC.split("/")), { hash });
  } catch(_) {}
}

