import { useState } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../../firebase";
import { getDoc } from "firebase/firestore";


import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

export default function Signup() {

  const [searchParams] = useSearchParams();
  const roleFromURL = searchParams.get("role");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState(
    roleFromURL === "vendor" ? "vendor" : "consumer"
  );

  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const toggleRole = (value) => setRole(value);

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

  const handleSignup = async () => {
    setError("");

    if (!name || !email || !password) {
      return setError("Please fill all fields");
    }

    if (!accepted) {
      return setError("Accept terms first");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔥 IMPORTANT: send verification BEFORE continuing app flow
      await sendEmailVerification(user, {
        url: "https://ofofonon.github.io/shoppal/#/login"
      });
      

      // store user (DO NOT assume verified yet)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role,
        address: null,
        cart: [],
        createdAt: new Date().toISOString(),
        status: "pending_verification",
        notifications: [],
        lastLogin: new Date().toISOString(),
        shopConnected: false,
        emailVerified: false
      });

      await auth.signOut();
      navigate("/verify", { replace: true });

      setLoading(false);

      // send user to verify page
     

    } catch (error) {
      setLoading(false);

      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Email already exists");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters");
          break;
        default:
          setError(error.message);
      }
    }
  };

  return (
    <div className="space-y-3 font-montserrat">

      <button className="w-full py-3 rounded-xl bg-white text-black flex items-center justify-center gap-2 hover:bg-white/90 transition" onClick={handleGoogleAuth}>
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-white/30 text-xs font-montserrat">
        <div className="flex-1 h-px bg-white/10" />
        OR
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <h2 className="text-3xl font-bric font-semibold">
        Create account
      </h2>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10" />

      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10" />

      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
        type="password"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10" />

      <div className="flex items-center gap-2 text-xs text-white/50">
        <input type="checkbox" className="bg-ornage-500 text-black" checked={accepted} onChange={() => setAccepted(!accepted)} />
        I agree to the <span className="text-orange-500">Terms and Conditions</span>
      </div>

      <button
        onClick={handleSignup}
        className="w-full py-3 rounded-xl bg-orange-500 text-white"
      >
        {loading ? "Creating..." : "Create account"}
      </button>

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      <p className="text-center text-sm text-white/50">
        Already have an account? <Link to="/login" className="text-orange-500">Login</Link>
      </p>

    </div>
  );
}