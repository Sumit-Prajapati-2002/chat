import { useState, useCallback } from "react";
import axios from "axios";

// API base URL
const API_URL = "http://23.132.28.30:8000"; 

type Message = {
  role: "user" | "bot" | "error";
  content: string;
  timestamp?: string;
};

export default function useChatLogic() {
  const [message, setMessage] = useState<string>("");
  const [currentChatHistory, setCurrentChatHistory] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);

  // Send message function
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setCurrentChatHistory((prev) => [...prev, { role: "user", content: message }]);

    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.post(
        `${API_URL}/ask`,
        { question: message },
        { 
          headers: { 
            "User-ID": userId || "",
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data) {
        const botMessage = response.data.response || "No response from bot.";
        setCitations(response.data.citations || []);

        setCurrentChatHistory((prevChatHistory) => {
          const updatedHistory = [...prevChatHistory, { role: "bot" as const, content: botMessage }];
          return updatedHistory;
        });
      } else {
        throw new Error("No response data received");
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      setError(errorMessage);
      setCurrentChatHistory((prev) => [...prev, { role: "error" as const, content: errorMessage }]);
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
      setMessage("");
    }
  }, [isSending, setMessage]);

  // Start session function
  const startSession = async () => {
    try {
      const response = await axios.get(`${API_URL}/start-session`);
      if (response.data.user_id) {
        localStorage.setItem('user_id', response.data.user_id);
        console.log("Session started with user_id:", response.data.user_id);
      } else {
        console.error("No user_id returned from the backend.");
      }
    } catch (error: unknown) {
      console.error("Error starting session:", error);
    }
  };

  // Start a new chat
  const startNewChat = useCallback(() => {
    setCurrentChatHistory([]);
    setError(null);
  }, []);

  return {
    message,
    setMessage,
    isButtonEnabled: !!message.trim(),
    currentChatHistory,
    error,
    isSending,
    sendMessage,
    citations,
    setCitations,
    startSession,
    startNewChat,
  };
}
