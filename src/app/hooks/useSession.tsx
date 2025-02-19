'use client';

import { useState } from "react";
import axios from "axios";
import { error } from "console";

const API_URL = "http://23.132.28.30:8000"; // Base URL

export default function useChatLogic() {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const startSession = async () => {
    try {
      const response = await axios.get(`${API_URL}/start-session`);
  
      // Handle response correctly
      if (response.data.user_id) {
        localStorage.setItem('user_id', response.data.user_id); // Store user_id in localStorage
        console.log("Session started with user_id:", response.data.user_id);
      } else {
        console.error("No user_id returned from the backend.");
      }
    } catch (error: unknown) {
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
      } else {
        console.error("Error starting session:", error.message);
      }
    }
  };

  // Send message and receive a response from the backend
  const sendMessage = async (message: string) => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setChatHistory((prev) => [...prev, { role: "user", content: message }]);

    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.post(
        `${API_URL}/ask`,
        { question: message },
        { headers: { "User-ID": userId || "" } } // Pass user_id instead of session_id
      );
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: response.data.response || "No response from bot." },
      ]);

      if (response.data.suggestions?.length) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error: unknown) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      setError(errorMessage);
      setChatHistory((prev) => [...prev, { role: "error", content: errorMessage }]);
    } finally {
      setIsSending(false);
      setMessage(""); // Clear message input after sending
    }
  };

  // Fetch suggestions based on user input (auto-fetch on message change)
  const fetchSuggestions = async (input: string) => {
    if (input.trim() === "") {
      setSuggestions([]); // Clear suggestions when input is empty
      return;
    }

    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.get(`${API_URL}/ask`, {
        params: { query: input },
        headers: { "User-ID": userId || "" },
      });

      if (response.data.suggestions) {
        setSuggestions(response.data.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]); // Handle error
    }
  };

  // Upload a file to the backend for indexing
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'User-ID': userId || '', // Pass user_id here as well
        },
      });
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Get a specific file from the backend by its name
  const getFile = async (fileName: string) => {
    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.get(`${API_URL}/files/${fileName}`, {
        headers: { "User-ID": userId || "" },
      });
      console.log("File retrieved successfully:", response.data);
    } catch (error) {
      console.error("Error retrieving file:", error);
    }
  };

  return {
    message,
    setMessage,
    isButtonEnabled: !!message.trim(),
    chatHistory,
    error,
    isSending,
    sendMessage,
    suggestions,
    fetchSuggestions,
    uploadFile,
    getFile,
  };
}
