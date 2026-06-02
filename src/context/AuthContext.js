import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut  } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
    
      await firebaseUser.reload();
    
      if (!firebaseUser.emailVerified) {
        await signOut(auth);
    
        setUser(null);
        setRole(null);
        setLoading(false);
    
        return;
      }
    
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);
    
      if (snap.exists()) {
        setUser({
          uid: firebaseUser.uid,
          emailVerified: firebaseUser.emailVerified,
          ...snap.data(),
        });
    
        setRole(snap.data().role);
      }
    
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};