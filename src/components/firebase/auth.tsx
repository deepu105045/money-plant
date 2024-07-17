import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from './firebaseConfig';
import firebase from 'firebase/app';



// Google Sign-In
export const signInWithGoogle = async (): Promise<any> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Email/Password Sign-Up
export const signUpWithEmailPassword = async (email: string, password: string): Promise<any> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Email/Password Sign-In
export const signInWithEmailPassword = async (email: string, password: string): Promise<any> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Sign Out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export const createUser = async (email: string, password: string, username: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created:', user);

    // Set the display name
    await updateProfile(user, {
      displayName: username
    });

    console.log('Display name set to:', username);
    console.log('User created:', user);

    // Additional user setup can be done here (e.g., storing user info in Firestore)
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


