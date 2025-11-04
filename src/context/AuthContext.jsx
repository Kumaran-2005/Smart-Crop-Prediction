import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, firebaseReady } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const ensureAuth = () => {
    if (!firebaseReady || !auth) {
      throw new Error('Authentication is not available in this environment. Configure Firebase to enable auth.');
    }
  };

  const signup = async (email, password) => {
    ensureAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create user document in Firestore
    if (db) {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        createdAt: new Date(),
        predictionsCount: 0,
      });
    }

    // Update total users count
    await updateUserStats('totalUsers', 1);

    return userCredential;
  };

  const login = async (email, password) => {
    ensureAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await updateUserStats('totalLogins', 1);
    return userCredential;
  };

  const logout = () => {
    setIsAdmin(false);
    if (!firebaseReady || !auth) return Promise.resolve();
    return signOut(auth);
  };

  const adminLogin = (password) => {
    if (password === '111111111') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const updateUserStats = async (field, value) => {
    if (!db) return;
    try {
      const statsRef = doc(db, 'stats', 'general');
      await updateDoc(statsRef, {
        [field]: increment(value),
      });
    } catch (error) {
      // If document doesn't exist, create it
      const statsRef = doc(db, 'stats', 'general');
      await setDoc(
        statsRef,
        {
          [field]: value,
          totalPredictions: 0,
          totalUsers: 0,
          totalLogins: 0,
        },
        { merge: true }
      );
    }
  };

  // Accepts prediction details as argument
  const recordPrediction = async (predictionDetails) => {
    if (currentUser) {
      if (!db) return;
      // Update user's prediction count
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        predictionsCount: increment(1),
      });

      // Save prediction details in 'predictions' collection
      await addDoc(collection(db, 'predictions'), {
        userId: currentUser.uid,
        ...predictionDetails,
        timestamp: serverTimestamp(),
      });

      // Update global prediction count
      await updateUserStats('totalPredictions', 1);
    }
  };

  // Google login moved inside provider so it has access to auth/db and guards
  const googleLogin = async () => {
    ensureAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Create user document in Firestore if new user
    if (db) {
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          createdAt: new Date(),
          predictionsCount: 0,
        });
        await updateUserStats('totalUsers', 1);
      }
      await updateUserStats('totalLogins', 1);
    }
    return result;
  };

  useEffect(() => {
    // If auth isn't initialized, skip listener and render logged-out UI
    if (!firebaseReady || !auth) {
      setCurrentUser(null);
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    authAvailable: !!(firebaseReady && auth),
    signup,
    login,
    logout,
    adminLogin,
    recordPrediction,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
