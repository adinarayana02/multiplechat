import React, { useState, useRef, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import ChatInput from "../components/ChatInput";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TableChartIcon from '@mui/icons-material/TableChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChatMessage from "../components/ChatMessage";
import { connectSocket, disconnectSocket, sendMessage, onStreamResponse, offStreamResponse } from "../services/api";

export default function ExcelBot({ mode, setMode }) {
  const [selectedSegment, setSelectedSegment] = useState(3);
  const [messages, setMessages] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
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

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setExcelFile(e.target.files[0]);
      setMessages([]); // Optionally clear chat on new file
    }
  };

  const handleSend = async (input) => {
    if (!input.trim() || !excelFile) return;
    // Add user message immediately to the chat
    const userMessage = {
      id: Date.now() + Math.random(),
      role: 'user',
      text: input,
      botType: 'excel'
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    await sendMessage('excel', input, excelFile);
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const renderedMessages = useMemo(() => (
    !excelFile ? (
      <div className="chat-empty">Please upload an Excel file to start chatting.</div>
    ) : messages.length === 0 ? (
      <div className="chat-empty">Start asking questions about your Excel file!</div>
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
  ), [messages, excelFile]);

  return (
    <div className="app-layout">
      <Sidebar selectedSegment={selectedSegment} onSegmentSelect={setSelectedSegment} mode={mode} setMode={setMode} />
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <TopNavBar selectedSegment={selectedSegment} onSegmentSelect={setSelectedSegment} mode={mode} setMode={setMode} />
        <Box sx={{ px: 4, pt: 3, pb: 1, bgcolor: 'background.default', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<TableChartIcon />}
            color={excelFile ? 'success' : 'primary'}
            sx={{ borderRadius: 2 }}
          >
            {excelFile ? excelFile.name : 'Upload Excel'}
            <input type="file" accept=".xlsx,.xls" hidden onChange={handleFileUpload} />
          </Button>
          {excelFile && <Typography color="text.secondary">Excel file uploaded. Ask your questions below.</Typography>}
        </Box>
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
              disabled={!excelFile || loading}
              placeholder="Ask me to analyze your Excel data..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
