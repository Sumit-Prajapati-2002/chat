'use client';

import { useState, useEffect } from "react";
import axios from "axios";

// API base URL
const API_URL = "http://23.132.28.30:8000"; 

export default function useChatLogic() {
  const [message, setMessage] = useState<string>(""); // Store user input
  const [chatHistory, setChatHistory] = useState<any[]>([]); // Store chat history
  const [isSending, setIsSending] = useState<boolean>(false); // Track sending state
  const [error, setError] = useState<string | null>(null); // Store any errors
  const [suggestions, setSuggestions] = useState<string[]>([]); // Store suggestions
  const [citations, setCitations] = useState<string[]>([]); // Store citations

  // Start session function (connects to backend API)
  const startSession = async () => {
    try {
      const response = await axios.get(`${API_URL}/start-session`);
      if (response.data.user_id) {
        localStorage.setItem('user_id', response.data.user_id); // Store user_id in localStorage
        console.log("Session started with user_id:", response.data.user_id);
      } else {
        console.error("No user_id returned from the backend.");
      }
    } catch (error: any) {
      console.error("Error starting session:", error);
    }
  };

  // Base64 encode function
  const encodeBase64 = (data: string) => {
    return btoa(unescape(encodeURIComponent(data))); // Encode data to Base64
  };

  // Base64 decode function
  const decodeBase64 = (data: string) => {
    return decodeURIComponent(escape(atob(data))); // Decode data from Base64
  };

  // Function to save chat history to localStorage in Base64 format
  const saveChatHistory = (chatHistory: any[]) => {
    const encodedHistory = chatHistory.map((message) => ({
      ...message,
      content: encodeBase64(message.content), // Encode each message content in Base64
    }));
    localStorage.setItem('chatHistory', JSON.stringify(encodedHistory));
  };

  // Function to load chat history from localStorage
  const loadChatHistory = () => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        // Parse and decode each message's content from Base64
        const decodedHistory = JSON.parse(savedHistory).map((message: any) => ({
          ...message,
          content: decodeBase64(message.content), // Decode each message content from Base64
        }));
        setChatHistory(decodedHistory);
      } catch (error) {
        console.error("Error loading chat history:", error); // Optionally log error
      }
    }
  };

  // Function to send message and receive a response from the backend
  const sendMessage = async (message: string) => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setChatHistory((prev) => [...prev, { role: "user", content: message }]);

    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.post(
        `${API_URL}/ask`,
        { question: message },
        { headers: { "User-ID": userId || "" } }
      );
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: response.data.response || "No response from bot." },
      ]);
      setCitations(response.data.citations || []);

      // Save bot response to localStorage (encoded in Base64)
      const botMessage = response.data.response || "No response from bot.";
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: botMessage },
      ]);

      // Save both user and bot messages to localStorage (encoded)
      saveChatHistory([...chatHistory, { role: "user", content: message }, { role: "bot", content: botMessage }]);

      if (response.data.suggestions?.length) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      setError(errorMessage);
      setChatHistory((prev) => [...prev, { role: "error", content: errorMessage }]);
    } finally {
      setIsSending(false);
      setMessage(""); // Clear input after sending
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
        params: { query: input }, // Send input as query parameter
        headers: { "User-ID": userId || "" },
      });

      if (response.data.suggestions) {
        setSuggestions(response.data.suggestions); // Set suggestions from response
      } else {
        setSuggestions([]); // Clear suggestions if no data
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]); // Handle error and clear suggestions
    }
  };

  // Trigger suggestions on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage); // Update message state
    fetchSuggestions(newMessage); // Fetch suggestions based on the input
  };

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory(); // Load chat history from localStorage when the component mounts
  }, []);

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
    handleInputChange, // Input change handler for triggering suggestions
    citations,
    setCitations,
    startSession, // Add startSession here to be passed down to LoginForm
  };
}
