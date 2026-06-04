/**import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { googleProvider, auth, db } from "../../firebase";

import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // create user if doesn't exist
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: "consumer",
          createdAt: new Date().toISOString(),
        });
      }

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      return setError("Fill all fields");
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.role === "admin") {
          navigate("/admin-profile", { replace: true });
        } else if (userData.role === "vendor") {
          navigate("/vendor-profile", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      setError("Login failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bric font-semibold">
          Welcome back
        </h2>
        <p className="text-white/50 text-sm mt-1 font-montserrat">
          Login to continue
        </p>
      </div>

      <button
        className="w-full py-3 rounded-xl bg-white text-black flex items-center justify-center gap-2 hover:bg-white/90 transition"
        onClick={handleGoogleAuth}
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-white/30 text-xs font-montserrat">
        <div className="flex-1 h-px bg-white/10" />
        OR
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <input
        type="email"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 outline-none font-montserrat"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 outline-none font-montserrat"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`w-full py-3 rounded-xl transition-all font-semibold font-montserrat flex items-center justify-center gap-2
        ${
          loading
            ? "bg-orange-400 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      {error && (
        <div className="text-red-400 text-sm font-montserrat bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {error}
        </div>
      )}

      <p className="text-center text-sm text-white/50">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-orange-500">
          Sign up
        </Link>
      </p>
    </div>
  );
}**/



import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../../firebase";
import { setDoc } from "firebase/firestore";


import { signInWithEmailAndPassword } from "firebase/auth";

import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      // if new user → create profile
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: "consumer", // default role
          createdAt: new Date().toISOString(),
          emailVerified: user.emailVerified,
        });
      }
  
      // redirect
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  

  const handleLogin = async () => {
    setError("");
  
    if (!email || !password) {
      return setError("Fill all fields");
    }
  
    setLoading(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      const user = userCredential.user;
  
      await user.reload();
  
      if (!user.emailVerified) {
        await signOut(auth);
        setLoading(false);
        return setError("Please verify your email before logging in.");
      }
  
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const userData = userSnap.data();
  
        if (userData.role === "admin") {
          navigate("/admin-profile", { replace: true });
        } else if (userData.role === "vendor") {
          navigate("/vendor-profile", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
  
    } catch (error) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-3xl font-bric font-semibold">
          Welcome back
        </h2>
        <p className="text-white/50 text-sm mt-1 font-montserrat">
          Login to continue
        </p>
      </div>

      <button className="w-full py-3 rounded-xl bg-white text-black flex items-center justify-center gap-2 hover:bg-white/90 transition" onClick={handleGoogleAuth}>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-white/30 text-xs font-montserrat">
        <div className="flex-1 h-px bg-white/10" />
        OR
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <input
        type="email"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 outline-none font-montserrat"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 outline-none font-montserrat"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`w-full py-3 rounded-xl transition-all font-semibold font-montserrat flex items-center justify-center gap-2
        ${loading ? "bg-orange-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      {error && (
        <div className="text-red-400 text-sm font-montserrat bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {error}
        </div>
      )}

      <p className="text-center text-sm text-white/50">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-orange-500">
          Sign up
        </Link>
      </p>

    </div>
  );
}