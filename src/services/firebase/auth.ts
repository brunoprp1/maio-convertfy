import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { User } from '../../types/firebase';

export const signUp = async (email: string, password: string, name: string, role: 'admin' | 'client') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    // Create user document in Firestore
    const userData: Omit<User, 'id'> = {
      email,
      name,
      role,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data() as User;
    return { user: userCredential.user, userData };
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) return null;

  return { ...userDoc.data(), id: user.uid } as User;
};

export const updateUserEmail = async (currentPassword: string, newEmail: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  try {
    // Re-authenticate user before updating email
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update email in Firebase Auth
    await firebaseUpdateEmail(user, newEmail);

    // Update email in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      email: newEmail,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  try {
    // Re-authenticate user before updating password
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password in Firebase Auth
    await firebaseUpdatePassword(user, newPassword);

    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};