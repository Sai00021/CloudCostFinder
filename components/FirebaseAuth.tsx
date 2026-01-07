import React, { useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};

/* Prevent Firebase re-initialization */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/* ================= COMPONENT ================= */
interface FirebaseAuthProps {
  onLogin: (user: any) => void;
}

export const FirebaseAuth: React.FC<FirebaseAuthProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      onLogin({
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar:
          user.photoURL ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            user.displayName || "User"
          )}`,
        role: "Cloud Engineer",
        provider: "google",
      });
    } catch (error) {
      console.error(error);
      alert("Google Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        className="w-5 h-5"
        alt="Google"
      />
      {isLoading ? "Signing in..." : "Continue with Google Cloud"}
    </button>
  );
};
