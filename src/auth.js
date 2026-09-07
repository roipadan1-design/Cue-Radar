/**
 * ============================================================================
 * CUE RADAR — Authentication & Google OAuth Service (Firebase Auth)
 * Handles Google Sign-In and caches OAuth access token in memory for Google Drive API.
 * ============================================================================
 */

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google Provider with Workspace Drive Scopes
const provider = new GoogleAuthProvider();
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly"
];

SCOPES.forEach(scope => {
  provider.addScope(scope);
});

// Flag to track ongoing sign-in popup
let isSigningIn = false;

// Memory cache for OAuth access token (never saved in localStorage for security)
let cachedAccessToken = null;
let currentUser = null;

/**
 * Initialize Auth State Listener
 * @param {Function} onAuthChange - Callback when auth state updates: (user, token)
 */
export function initAuth(onAuthChange) {
  return onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user && cachedAccessToken) {
      if (onAuthChange) onAuthChange(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthChange) onAuthChange(user, null);
    }
  });
}

/**
 * Trigger Google Sign-In Popup
 * @returns {Promise<{user: object, accessToken: string}>}
 */
export async function signInWithGoogle() {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential || !credential.accessToken) {
      throw new Error("Failed to extract Google Drive OAuth access token from authentication result.");
    }

    cachedAccessToken = credential.accessToken;
    currentUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error("[CUE RADAR Auth] Sign in failed:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
}

/**
 * Retrieve cached in-memory access token
 */
export function getAccessToken() {
  return cachedAccessToken;
}

/**
 * Retrieve current Firebase user
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Sign out user and clear in-memory credentials
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    cachedAccessToken = null;
    currentUser = null;
  } catch (error) {
    console.error("[CUE RADAR Auth] Sign out error:", error);
  }
}
