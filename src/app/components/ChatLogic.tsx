import { useState, useEffect, useCallback } from "react";
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
  const [previousChats, setPreviousChats] = useState<Message[][]>([]); // Store previous chats
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [citations, setCitations] = useState<string[]>([]);

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
  const startNewChat = async () => {
    if (currentChatHistory.length > 0) {
      // Save current chat to previous chats before starting a new one
      setPreviousChats((prevChats) => [...prevChats, currentChatHistory]);
    }
    setCurrentChatHistory([]); // Reset current chat history
    setError(null); // Clear any previous errors
    setSuggestions([]); // Clear suggestions
    await startSession(); // Start a new session with the server
  };

  // Base64 encode/decode functions
  const encodeBase64 = (data: string) => btoa(unescape(encodeURIComponent(data)));
  const decodeBase64 = (data: string) => decodeURIComponent(escape(atob(data)));

  // Save chat history to localStorage
  const saveChatHistory = (chatHistory: Message[]) => {
    const encodedHistory = chatHistory.map((message) => ({
      ...message,
      content: encodeBase64(message.content),
    }));
    localStorage.setItem('chatHistory', JSON.stringify(encodedHistory));
  };

  // Load chat history from localStorage
  const loadChatHistory = useCallback(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const decodedHistory: Message[] = JSON.parse(savedHistory).map((message: Message) => ({
          ...message,
          content: decodeBase64(message.content),
        }));
        setCurrentChatHistory(decodedHistory);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    }
  }, []);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  // Send message function
  const sendMessage = async (message: string) => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setCurrentChatHistory((prev) => [...prev, { role: "user", content: message }]);

    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.post(
        `${API_URL}/ask`,
        { question: message },
        { headers: { "User-ID": userId || "" } }
      );
      
      const botMessage = response.data.response || "No response from bot.";
      setCitations(response.data.citations || []);

      setCurrentChatHistory((prevChatHistory) => {
        const updatedHistory: Message[] = [...prevChatHistory, { role: "bot", content: botMessage }];
        saveChatHistory(updatedHistory);
        return updatedHistory;
      });

      if (response.data.suggestions?.length) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      setError(errorMessage);
      setCurrentChatHistory((prev) => [...prev, { role: "error", content: errorMessage }]);
    } finally {
      setIsSending(false);
      setMessage("");
    }
  };

  // Fetch suggestions
  const fetchSuggestions = async (input: string) => {
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.get(`${API_URL}/ask`, {
        params: { query: input },
        headers: { "User-ID": userId || "" },
      });
      
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    fetchSuggestions(newMessage);
  };

  return {
    message,
    setMessage,
    isButtonEnabled: !!message.trim(),
    currentChatHistory,
    previousChats, // Return previous chats for display
    error,
    isSending,
    sendMessage,
    suggestions,
    fetchSuggestions,
    handleInputChange,
    citations,
    setCitations,
    startSession,
    startNewChat, // New function to start a new chat while keeping old chats
  };
}
