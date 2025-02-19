import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import Firebase auth


interface LoginFormProps {
  setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
  startSession: () => void; // Accept the startSession function as a prop
}

const LoginForm = ({ setLoginOpen, startSession }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginOpen(false);
      startSession();
    } catch (error: unknown) {
      // Handle error properly
      console.error("Login error:", error instanceof Error ? error.message : "Unknown error");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg w-full"
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  );
};

export default LoginForm;
