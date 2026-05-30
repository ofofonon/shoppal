import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";

import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

import { useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/", { replace: true }); // or dashboard/profile
      }
      
    });

    return () => unsub();
  }, []);
  

  const handleLogin = async () => {

    setError("");
  
    if (!email || !password) {
      return setError("Fill all fields");
    }


    setLoading(true);

    try {
  
      // LOGIN USER
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
          
      const user = userCredential.user;

      await updateDoc(doc(db, "users", user.uid), {
        lastLogin: new Date().toISOString(),
      });
  
      // GET USER DATA
      const userRef = doc(db, "users", user.uid);

      
  
      const userSnap = await getDoc(userRef);
      
      setLoading(false);
      if (userSnap.exists()) {

        const userData = userSnap.data();
  
        // REDIRECT BASED ON ROLE
        if (userData.role === "admin") {

          // SECURITY LOG
          await updateDoc(
            doc(db, "users", user.uid),
            {
              securityLogs: arrayUnion({
                action: "Admin logged in",
                createdAt:
                  new Date().toISOString(),
              }),
            }
          );
        
          navigate("/admin-profile", {
            replace: true,
          });
        
        } else if (userData.role === "vendor") {
  
          navigate("/vendor-profile" , { replace: true });
  
        } else {
  
          navigate("/" , { replace: true });
  
        }
  
      }
  
    } catch (error) {
      setLoading(false);
      console.log(error);
  
      switch (error.code) {
  
        case "auth/user-not-found":
          setError("No account found");
          break;
  
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
  
        case "auth/invalid-email":
          setError("Invalid email");
          break;
  
        case "auth/invalid-credential":
          setError("Incorrect email or password");
          break;
  
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later");
          break;
  
        case "auth/network-request-failed":
          setError("Network error");
          break;
  
        default:
          setError("Login failed");
  
      }
  
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

      {/* BUTTON */}
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

        {
          loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Logging in...
            </>
          ) : (
            "Login"
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

      {/* GOOGLE */}

      <p className="text-center text-sm text-white/50">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-orange-500">
          Sign up
        </Link>
      </p>

    </div>
  );
}