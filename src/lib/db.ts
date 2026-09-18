import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  philosophicalIdentity: string | null;
  createdAt: any;
  lastLogin: any;
}

/**
 * Ensures a user document exists in the 'users' collection when they log in.
 * If it doesn't exist, it creates a base profile.
 * If it does, it updates the lastLogin timestamp.
 */
export const ensureUserDocument = async (user: User): Promise<void> => {
  if (!user || !user.uid) return;

  const userRef = doc(db, "users", user.uid);
  try {
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Create new user profile
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        philosophicalIdentity: null, // To be set by the personality test
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };
      await setDoc(userRef, newProfile);
      console.log("Created new user profile in Firestore");
    } else {
      // Update last login
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
      console.log("Updated user last login");
    }
  } catch (error) {
    console.error("Error ensuring user document:", error);
    throw error;
  }
};

/**
 * Saves the result of the Philosophical Personality Test to the user's profile.
 * @param uid The user's Firebase UID
 * @param identity The resulting identity (e.g., "The Cosmic Observer")
 */
export const savePhilosophicalIdentity = async (uid: string, identity: string): Promise<void> => {
  if (!uid) throw new Error("User ID is required to save identity");
  if (!identity) throw new Error("Identity string is required");

  const userRef = doc(db, "users", uid);
  try {
    await updateDoc(userRef, {
      philosophicalIdentity: identity,
      updatedAt: serverTimestamp(),
    });
    console.log(`Saved identity '${identity}' for user ${uid}`);
  } catch (error) {
    console.error("Error saving philosophical identity:", error);
    throw error;
  }
};

/**
 * Fetches the user's profile, including their philosophical identity.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) return null;

  const userRef = doc(db, "users", uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

