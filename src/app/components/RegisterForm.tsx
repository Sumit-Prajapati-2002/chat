// components/RegisterForm.tsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import Firebase auth

interface RegisterFormProps {
  setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const RegisterForm = ({ setLoginOpen }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoginOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred during registration";
      setErrorMessage(message);
      console.error("Registration error:", message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
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
        onClick={handleRegister}
        disabled={loading}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg w-full"
      >
        {loading ? "Loading..." : "Register"}
      </button>
    </div>
  );
};

export default RegisterForm;
