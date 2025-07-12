import React, { useState, useRef, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import ChatInput from "../components/ChatInput";
import CircularProgress from '@mui/material/CircularProgress';
import ChatMessage from "../components/ChatMessage";
import { connectSocket, disconnectSocket, sendMessage, onStreamResponse, offStreamResponse } from "../services/api";

export default function NotebookBot({ mode, setMode }) {
  const [selectedSegment, setSelectedSegment] = useState(4);
  const [messages, setMessages] = useState([]);
  const [notebookFile, setNotebookFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    connectSocket();
    onStreamResponse((data) => {
      // Only handle bot messages, user messages are already added in handleSend
      if (data.role === 'bot') {
        setMessages(prev => {
          const updated = [...prev];
          const lastMessage = updated[updated.length - 1];
          if (lastMessage && lastMessage.role === 'bot') {
            lastMessage.text = data.content;
            lastMessage.isStreaming = !data.is_complete;
          } else {
            const newMessage = {
              id: Date.now() + Math.random(),
              role: data.role,
              text: data.content,
              botType: data.bot_type,
              isStreaming: !data.is_complete
            };
            updated.push(newMessage);
          }
          return updated;
        });
      }
    });
    return () => {
      offStreamResponse();
      disconnectSocket();
    };
  }, []);

  const handleSend = async (input) => {
    if (!input.trim() || !notebookFile) return;
    // Add user message immediately to the chat
    const userMessage = {
      id: Date.now() + Math.random(),
      role: 'user',
      text: input,
      botType: 'notebook'
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    await sendMessage('notebook', input, notebookFile);
    setLoading(false);
  };

  const handleFileUpload = (file) => {
    setNotebookFile(file);
    setMessages([]); // Optionally clear chat on new file
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const renderedMessages = useMemo(() => (
    !notebookFile ? (
      <div className="chat-empty">Please upload a Notebook file to start chatting.</div>
    ) : messages.length === 0 ? (
      <div className="chat-empty">Start asking questions about your Notebook!</div>
    ) : (
      messages.map((msg) => (
        <ChatMessage 
          key={msg.id} 
          role={msg.role} 
          text={msg.text} 
          isStreaming={msg.isStreaming}
        />
      ))
    )
  ), [messages, notebookFile]);

  return (
    <div className="app-layout">
      <Sidebar selectedSegment={selectedSegment} onSegmentSelect={setSelectedSegment} mode={mode} setMode={setMode} />
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <TopNavBar selectedSegment={selectedSegment} onSegmentSelect={setSelectedSegment} mode={mode} setMode={setMode} />
        {notebookFile && (
          <div className="chatgpt-input-file-info" style={{ margin: '16px 0 0 0' }}>
            <span>Selected file: {notebookFile.name}</span>
          </div>
        )}
        <div className="chat-window" style={{ flex: 1, position: 'relative' }}>
          <div className="chat-messages">
            {renderedMessages}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                <CircularProgress size={32} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={{ position: 'sticky', bottom: 0, background: 'transparent', zIndex: 10 }}>
            <ChatInput 
              onSend={handleSend} 
              onFileUpload={handleFileUpload} 
              disabled={!notebookFile || loading}
              placeholder="Ask me about your Jupyter Notebook..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
