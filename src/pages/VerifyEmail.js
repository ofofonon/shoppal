import { useState } from "react";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const resendEmail = async () => {
    setLoading(true);
    setMessage("");

    try {
      const user = auth.currentUser;

      if (!user) {
        setMessage("No user found. Please login again.");
        setLoading(false);
        return;
      }

      await sendEmailVerification(user);

      setMessage("Verification email sent again. Check your inbox.");
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setMessage("Failed to resend email. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] text-white px-6 font-montserrat">

      <div className="max-w-md w-full bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden">

        <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-500/10 blur-[120px] rounded-full" />

        <div className="text-5xl mb-4">📩</div>

        <h1 className="text-3xl font-bold font-bric">
          Check Your Inbox
        </h1>

        <p className="text-white/60 mt-3 text-sm">
          We’ve sent a verification link to your email.  
          Please verify your account before logging in. Check your spam folder too
        </p>

        <button
          onClick={resendEmail}
          disabled={loading}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold"
        >
          {loading ? "Sending..." : "Resend Email"}
        </button>

        {message && (
          <p className="text-sm text-white/60 mt-4">{message}</p>
        )}

      </div>

    </div>
  );
}