import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QABot from "./pages/QABot";
import PDFBot from "./pages/PDFBot";
import ExcelBot from "./pages/ExcelBot";
import NotebookBot from "./pages/NotebookBot";

export default function App({ mode, setMode }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage mode={mode} setMode={setMode} />} />
        <Route path="/qa" element={<QABot mode={mode} setMode={setMode} />} />
        <Route path="/pdf" element={<PDFBot mode={mode} setMode={setMode} />} />
        <Route path="/excel" element={<ExcelBot mode={mode} setMode={setMode} />} />
        <Route path="/notebook" element={<NotebookBot mode={mode} setMode={setMode} />} />
      </Routes>
    </Router>
  );
}
