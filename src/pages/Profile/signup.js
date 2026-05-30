import { useState } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import {
  createUserWithEmailAndPassword
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
    roleFromURL === "vendor"
      ? "vendor"
      : "consumer"
  );
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  

  const toggleRole = (value) => {
    setRole(value);
    console.log("Selected role:", value); // internal only
  };

  

  const handleSignup = async () => {
    setError("");
    console.log("Signup button clicked");
  
    if (!name || !email || !password) {
      return setError("Please fill all fields");;
    }
  
    if (!accepted) {
      return setError("Accept terms first");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
   
  
    try {
  
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
  
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role,
      
        address: null,
        cart: [],
      
        createdAt: new Date().toISOString(),
      
        // NEW
        status: "active",
      
        notifications: [],
      
        lastLogin: new Date().toISOString(),
      
        shopConnected: false,
      });

      setLoading(false);
            // redirect based on role
      if (role === "vendor") {
        navigate("/vendor-profile", { replace: true });
      } 
      if (role === "admin") {
        navigate("/admin-profile", { replace: true });
      }else {
        navigate("/", { replace: true });
      }
      
      console.log("User created successfully", { replace: true });
  
      setError("Account created", { replace: true });
      
  
    } catch (error) {
      setLoading(false);
      console.log(error);
  
      setError(error.message);
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
    
        case "auth/missing-password":
          setError("Password is required");
          break;
    
        case "auth/missing-email":
          setError("Email is required");
          break;
    
        case "auth/operation-not-allowed":
          setError("Email/password sign-up is not enabled in Firebase");
          break;
    
        case "auth/network-request-failed":
          setError("Network error. Check your connection or VPN");
          break;
    
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later");
          break;
    
        case "auth/internal-error":
          setError("Internal error. Please try again");
          break;
    
        default:
          setError(error.message || "Something went wrong");
      }
  
    }
  
  };

  return (
    <div className="space-y-3">

      {/* GOOGLE (TOP) */}
      <button className="w-full py-3 rounded-xl bg-white text-black flex items-center justify-center gap-2 hover:bg-white/90 transition">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      {/* DIVIDER */}
      <div className="flex items-center gap-3 text-white/30 text-xs font-montserrat">
        <div className="flex-1 h-px bg-white/10" />
        OR
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* TITLE */}
      <div>
        <h2 className="text-3xl font-bric font-semibold">
          Create account
        </h2>
        <p className="text-white/50 text-sm mt-1 font-montserrat">
          Join Shoppal in seconds
        </p>
      </div>

      {/* NAME */}
      <input
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 outline-none font-montserrat"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* EMAIL */}
      <input
        type="email"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 outline-none font-montserrat"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* PASSWORD */}
      <input
        type="password"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 outline-none font-montserrat"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* ROLE SLIDER */}
      <div className="relative bg-white/5 border border-white/10 rounded-full p-3 flex items-center text-base overflow-hidden font-montserrat">

        {/* SLIDER BACKGROUND */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1/2 bg-orange-500 rounded-full transition-all duration-300 ${
            role === "vendor" ? "translate-x-full" : "translate-x-0"
          }`}
        />

        {/* CONSUMER */}
        <div
          onClick={() => toggleRole("consumer")}
          className={`w-1/2 text-center z-10 cursor-pointer transition-all ${
            role === "consumer" ? "text-white" : "text-white/40"
          }`}
        >
          Consumer
        </div>

        {/* VENDOR */}
        <div
          onClick={() => toggleRole("vendor")}
          className={`w-1/2 text-center z-10 cursor-pointer transition-all ${
            role === "vendor" ? "text-white" : "text-white/40"
          }`}
        >
          Vendor
        </div>

      </div>

      {/* TERMS */}
      <div className="flex items-center gap-2 text-xs text-white/50 font-montserrat">
        <input
          type="checkbox"
          className="w-4 h-4 accent-orange-500 bg-[#111111]"
          checked={accepted}
          onChange={() => setAccepted(!accepted)}
        />
        <span>I agree to the terms and conditions</span>
      </div>

      {/* CREATE BUTTON */}
      <button className={`w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 transition font-semibold font-montserrat flex items-center justify-center font-montserrat
        ${
          loading
            ? "bg-orange-400 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      onClick={handleSignup}>
        {
    loading ? (
      <>
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin m-1"></div>
        Creating...
      </>
    ) : (
      "Create account"
    )
  }
      </button>

      {
  error && (
    <div className="text-red-400 text-sm font-montserrat bg-red-500/10 border border-red-500/20 rounded-xl p-3">
      {error}
    </div>
  )
}
     

      {/* LOGIN LINK */}
      <p className="text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link to="/login" className="text-orange-500">
          Login
        </Link>
      </p>

    </div>
  );
}