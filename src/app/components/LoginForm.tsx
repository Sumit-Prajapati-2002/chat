import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import Firebase auth


interface LoginFormProps {
  setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
  startSession: () => void; // Accept the startSession function as a prop
}

const LoginForm: React.FC<LoginFormProps> = ({ setLoginOpen, startSession }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError(""); // Reset previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password); // Firebase login
      setLoginOpen(false); // Close the modal on success
      startSession(); // Start the session after successful login
    } catch (error: unknown) {
      setError("Failed to log in. Please check your credentials.");
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
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
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
