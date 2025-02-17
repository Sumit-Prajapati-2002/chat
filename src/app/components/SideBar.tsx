"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPlus, faLink, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

interface SideBarProps {
  citations: string[];
}

const SideBar: React.FC<SideBarProps> = ({ citations }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loadingCitations, setLoadingCitations] = useState(false);

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const response = await axios.get("http://23.132.28.30:8000/start-session");
        if (response.data?.user_id) {
          setSessionId(response.data.user_id);
          localStorage.setItem("session_id", response.data.user_id);
          console.log("Session started:", response.data.user_id);
        } else {
          console.error("User ID not returned from backend.");
        }
      } catch (error) {
        console.error("Error starting session:", error);
      }
    };

    const storedSessionId = localStorage.getItem("session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      fetchSessionId();
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }
    if (!sessionId) {
      alert("Session ID is missing.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://23.132.28.30:8000/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data", "Session-ID": sessionId } }
      );

      console.log(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4">
        {/* Sources Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faBook} className="text-blue-400" />
            Sources
          </h3>

          <div className="space-y-2">
            {file ? (
              <div className="glassmorphism-dark rounded-lg p-3 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg glassmorphism-dark flex items-center justify-center">
                      <FontAwesomeIcon icon={faBook} className="text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 text-sm font-medium truncate">{file.name}</p>
                    <p className="text-white/60 text-xs mt-1">
                      Added {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => setFile(null)} className="text-red-400 hover:text-red-300 transition-colors rotate-45">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No files added</p>
                <input type="file" id="fileInput" onChange={handleFileChange} className="hidden" accept="application/pdf" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => document.getElementById("fileInput")?.click()} className="mt-4 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg flex items-center gap-2 mx-auto">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Sources</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Citations Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faLink} className="text-green-400" />
            Citations
          </h3>
          {loadingCitations ? (
            <div className="text-center text-gray-400">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
              Loading citations...
            </div>
          ) : citations.length > 0 ? (
            <ul className="space-y-2">
              {citations.map((citation, index) => (
                <li key={index} className="glassmorphism-dark p-3 rounded-lg text-white/80 text-sm">
                  <a href={citation} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {citation}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No citations available</p>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div className="p-4 border-t border-white/5">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleUpload} className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors" disabled={uploading || !file}>
          {uploading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faPlus} />}
          <span>{uploading ? "Uploading..." : "Upload File"}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default SideBar;
