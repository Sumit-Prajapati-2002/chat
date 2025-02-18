import React, { ChangeEvent, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import useChatLogic from "./ChatLogic";
import { motion } from "framer-motion";
import SideBar from "./SideBar";

interface ChatPanelProps {
  setUploadedFilePath: React.Dispatch<React.SetStateAction<string>>;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ setUploadedFilePath }) => {
  const {
    message,
    setMessage,
    isButtonEnabled,
    chatHistory,
    error,
    isSending,
    sendMessage,
    suggestions,
    fetchSuggestions,
    citations,
    setCitations,
  } = useChatLogic();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    sendMessage(suggestion);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    if (chatHistory.length > 0) {
      fetchSuggestions(newMessage);
    }
  };

  return (
    <>
      <motion.div
        className="flex-1 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 shadow-2xl border border-gray-700/50">
          <h2 className="text-xl font-bold text-gray-200 px-2 mb-4">Chat Assistant</h2>
          <div className="flex-1 overflow-y-auto bg-gray-900/80 rounded-xl p-4 shadow-inner border border-gray-700/30 mb-4">
            <div className="flex flex-col space-y-4">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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
            {suggestions.length > 0 && (
              <div className="bg-gray-900/80 rounded-xl shadow-lg border border-gray-700/30">
                <div className="flex flex-wrap gap-2 p-3">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="text-gray-200 text-sm bg-gray-800/50 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-300 border border-gray-700/30"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="relative">
              <textarea
                className="w-full p-3 pr-12 bg-gray-900/80 text-gray-200 rounded-xl resize-none shadow-lg border border-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all duration-300"
                placeholder="Type a message..."
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={2}
                style={{ minHeight: '60px', maxHeight: '120px' }}
              />
              <button
                onClick={() => sendMessage(message)}
                disabled={!isButtonEnabled || isSending}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg shadow-lg transition-all duration-300
                  ${isButtonEnabled && !isSending ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-lg" />
                {isSending && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <ClipLoader color="white" size={20} />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="w-96 shrink-0 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-xl overflow-hidden"
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