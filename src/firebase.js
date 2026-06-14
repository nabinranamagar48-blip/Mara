import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALmUZxDIr9-LusaUKTeJf3G7tEvZxr7Ck",
  authDomain: "marabarista-2dc5f.firebaseapp.com",
  projectId: "marabarista-2dc5f",
  storageBucket: "marabarista-2dc5f.firebasestorage.app",
  messagingSenderId: "801746918557",
  appId: "1:801746918557:web:dae87c6ee7514dd5e9c874"
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
