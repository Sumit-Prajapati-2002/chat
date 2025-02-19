import React, { ChangeEvent, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import useChatLogic from "./ChatLogic";
import { motion } from "framer-motion";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import SideBar from "./SideBar";

// Define proper type instead of any
interface ChatHistoryItem {
  role: "user" | "bot" | "error";
  content: string;
}

const ChatPanel = () => {
  const {
    message,
    setMessage,
    isButtonEnabled,
    currentChatHistory,
    error,
    isSending,
    sendMessage,
    citations,
    startNewChat
  } = useChatLogic();

  const [chatHistoryList, setChatHistoryList] = useState<ChatHistoryItem[][]>([]);
  const [currentChatIndex, setCurrentChatIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setChatHistoryList(JSON.parse(savedHistory));
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistoryList.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistoryList));
    }
  }, [chatHistoryList]);

  // Handle starting a new chat
  const handleNewChat = () => {
    if (currentChatIndex !== null) {
      const newChatHistory = [...chatHistoryList];
      newChatHistory.push(currentChatHistory);
      setChatHistoryList(newChatHistory);
    }
    setMessage("");
    setCurrentChatIndex(null);
    startNewChat();
  };

  // Handle deleting previous chat
  const handleDeleteChat = (index: number) => {
    const updatedChatHistoryList = chatHistoryList.filter((_, i) => i !== index);
    setChatHistoryList(updatedChatHistoryList);
    setCurrentChatIndex(null);
  };

  // Handle switching between chats
  const handleSwitchChat = (index: number) => {
    setCurrentChatIndex(index);
  };

  // Simplify input change handler to remove suggestion fetching
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
  };

  // Handle sending the message with simulated backend processing wait time
  const handleSendMessage = async (message: string) => {
    setIsProcessing(true); // Set processing state while sending message
    await sendMessage(message); // Simulate the backend processing time
    setIsProcessing(false); // Reset processing state once message is sent
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(message); // Use the new message sending method
    }
  };

  return (
    <>
      {/* Left Sidebar */}
      <motion.div
        className="w-80 md:w-1/4 shrink-0 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-xl overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-4 flex flex-col space-y-6">
          <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faCommentDots} className="text-blue-400" />
            New Chat
          </h3>

          <button
            onClick={handleNewChat}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Start New Chat
          </button>

          <div className="mt-6 text-sm text-gray-400">
            <h4 className="font-semibold text-gray-200">Previous Chats</h4>
            <ul className="space-y-2 mt-2">
              {chatHistoryList.map((chat, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-gray-200">{`Chat ${idx + 1}`}</span>
                  <button
                    onClick={() => handleSwitchChat(idx)}
                    className="text-blue-400 hover:underline"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDeleteChat(idx)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Chat Assistant */}
      <motion.div
        className="flex-1 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 shadow-2xl border border-gray-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-200">Chat Assistant</h2>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-900/80 rounded-xl p-4 shadow-inner border border-gray-700/30 mb-4">
            <div className="flex flex-col space-y-4">
              {(currentChatIndex !== null && Array.isArray(chatHistoryList[currentChatIndex])
                ? chatHistoryList[currentChatIndex]
                : currentChatHistory || []
              ).map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl shadow-lg break-words
                      ${msg.role === "user" ? "bg-blue-900 text-gray-100 border border-blue-700/50" : "bg-gray-800 text-gray-100 border border-gray-700/50"}`}
                  >
                    {msg.role === "bot" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                  </div>
                </div>
              ))}
              {error && <p className="text-red-400 mt-2 px-4 py-2 bg-red-900/20 rounded-lg">{error}</p>}
            </div>
          </div>

          <div className="flex flex-col space-y-4 mt-auto">
            <div className="relative">
              <textarea
                className="w-full p-3 pr-12 bg-gray-900/80 text-gray-200 rounded-xl resize-none shadow-lg border border-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all duration-300"
                placeholder="Type a message..."
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={2}
                style={{ minHeight: "60px", maxHeight: "120px" }}
              />
              <button
                onClick={() => handleSendMessage(message)}
                disabled={!isButtonEnabled || isSending || isProcessing}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg shadow-lg transition-all duration-300
                  ${isButtonEnabled && !isSending && !isProcessing ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-lg" />
                {isProcessing && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <ClipLoader color="white" size={20} />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Sidebar */}
      <motion.div
        className="w-80 md:w-1/4 shrink-0 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-xl overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SideBar citations={citations} />
      </motion.div>
    </>
  );
};

export default ChatPanel;
