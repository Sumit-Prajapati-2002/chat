import { useAuth } from "@/app/context/AuthProvider";
import { useState } from "react";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebaseConfig";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
    setLogoutLoading(false);
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-white">Kanun Ka Kura</h1>
          <div className="flex items-center space-x-4">
            {loading ? (
              <p className="text-white">Loading...</p>
            ) : user ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all duration-300"
                disabled={logoutLoading}
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setLoginOpen(true)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setLoginOpen(true);
                    setIsRegister(true);
                  }}
                  className="px-6 py-2 bg-transparent hover:bg-purple-600/20 text-white border border-purple-500 rounded-lg shadow-lg transition-all duration-300"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isLoginOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setLoginOpen(false)}
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-4 text-center text-purple-600">
              {isRegister ? "Register" : "Login"}
            </h2>

            {isRegister ? (
              <RegisterForm setLoginOpen={setLoginOpen} />
            ) : (
              <LoginForm setLoginOpen={setLoginOpen} startSession={function (): void {
                  throw new Error("Function not implemented.");
                } } />
            )}

            <div className="mt-4 text-center">
              <span
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-600 cursor-pointer"
              >
                {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
              </span>
            </div>

            <button
              onClick={() => setLoginOpen(false)}
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </header>
  );
}
