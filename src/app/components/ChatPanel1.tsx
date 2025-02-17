'use client';
import React, { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners'; // Using ClipLoader for a better spinner
import ReactMarkdown from 'react-markdown';
import useChatLogic from './ChatLogic'; // Importing the chat logic hook

// Define types for props
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
    handleSend,
  } = useChatLogic(); // Using the custom hook

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Get the first selected file
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          console.log('File uploaded:', data.filePath);
          // Update the parent component with the uploaded file path
          setUploadedFilePath(data.filePath);
        } else {
          console.error('File upload failed:', data.message);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-lg p-6 flex flex-col space-y-4 shadow-lg ">
      <h2 className="text-lg font-semibold text-white">Chat</h2>

      <div className="flex-grow overflow-y-auto bg-gray-700 rounded-lg p-4 shadow-inner" style={{ minHeight: '400px' }}>
        <div className="flex flex-col space-y-4">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'self-end' : 'self-start'} items-center space-x-2`}>
              <div
                className={`text-white p-3 max-w-xs rounded-xl shadow-md break-words ${
                  msg.role === 'user'
                    ? 'bg-blue-700'
                    : msg.role === 'bot'
                    ? 'bg-gray-600'
                    : 'bg-red-500'
                }`}
              >
                {msg.role === 'bot' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
              </div>
            </div>
          ))}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      <div className="flex space-x-4 mt-auto relative">
        {/* File Upload */}
        <div className="flex items-center space-x-2">
          <label htmlFor="fileUpload" className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-2 px-4 flex items-center space-x-2">
            <FontAwesomeIcon icon={faFileUpload} />
            <span>Upload</span>
          </label>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Textarea and Send Button */}
        <div className="relative flex-grow">
          <textarea
            className="overflow-hidden w-full h-16 p-4 bg-gray-800 text-white rounded-xl resize-none shadow-inner border border-gray-600 focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={handleSend}
            disabled={!isButtonEnabled || isSending}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
              isButtonEnabled && !isSending
                ? 'bg-teal-600 hover:bg-teal-700 text-white'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            {isSending && (
              <div className="absolute inset-0 flex justify-center items-center">
                <ClipLoader color="white" size={24} />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
