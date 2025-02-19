// components/RegisterForm.tsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import Firebase auth

interface RegisterFormProps {
  setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const RegisterForm: React.FC<RegisterFormProps> = ({ setLoginOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError(""); // Reset previous errors
    try {
      await createUserWithEmailAndPassword(auth, email, password); // Firebase register
      setLoginOpen(false); // Close the modal on success
    } catch (error:unknown) {
      setError("Failed to register. Please try again.");
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
