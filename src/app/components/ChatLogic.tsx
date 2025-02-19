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
  // const [suggestions, setSuggestions] = useState<string[]>([]); // commented out
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
      setPreviousChats((prevChats) => [...prevChats, currentChatHistory]);
    }
    setCurrentChatHistory([]);
    setError(null);
    await startSession();
  };

  // Improved Base64 encode/decode functions with error handling
  const encodeBase64 = (data: string) => {
    try {
      return btoa(unescape(encodeURIComponent(data)));
    } catch (error) {
      console.error('Error encoding data:', error);
      return '';
    }
  };

  const decodeBase64 = (data: string) => {
    try {
      // Check if the string is valid base64
      if (!isValidBase64(data)) {
        throw new Error('Invalid base64 string');
      }
      return decodeURIComponent(escape(atob(data)));
    } catch (error) {
      console.error('Error decoding data:', error);
      return '';
    }
  };

  // Helper function to check if a string is valid base64
  const isValidBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (_) {
      return false;
    }
  };

  // Save chat history to localStorage with error handling
  const saveChatHistory = (chatHistory: Message[]) => {
    try {
      const encodedHistory = chatHistory.map((message) => ({
        ...message,
        content: encodeBase64(message.content),
      }));
      localStorage.setItem('chatHistory', JSON.stringify(encodedHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Load chat history from localStorage with error handling
  const loadChatHistory = useCallback(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (!savedHistory) return;

      const parsedHistory = JSON.parse(savedHistory);
      if (!Array.isArray(parsedHistory)) {
        throw new Error('Invalid chat history format');
      }

      const decodedHistory: Message[] = parsedHistory.map((message: Message) => {
        try {
          return {
            ...message,
            content: message.content ? decodeBase64(message.content) : '',
          };
        } catch (error) {
          console.error('Error decoding message:', error);
          return {
            ...message,
            content: 'Error loading message',
          };
        }
      });

      setCurrentChatHistory(decodedHistory);
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Clear invalid data from localStorage
      localStorage.removeItem('chatHistory');
      setCurrentChatHistory([]);
    }
  }, [decodeBase64]);

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

      // if (response.data.suggestions?.length) {
      //   setSuggestions(response.data.suggestions);
      // }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      setError(errorMessage);
      setCurrentChatHistory((prev) => [...prev, { role: "error", content: errorMessage }]);
    } finally {
      setIsSending(false);
      setMessage("");
    }
  };

  // Comment out fetch suggestions function
  /*
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
  */

  // Simplify handleInputChange
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    // fetchSuggestions(newMessage); // commented out
  };

  return {
    message,
    setMessage,
    isButtonEnabled: !!message.trim(),
    currentChatHistory,
    previousChats,
    error,
    isSending,
    sendMessage,
    // suggestions, // commented out
    // fetchSuggestions, // commented out
    handleInputChange,
    citations,
    setCitations,
    startSession,
    startNewChat,
  };
}
