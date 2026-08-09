"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hi! I'm the **SmartCity AI Assistant**. I can help you report civic issues, check complaint status, or answer any questions about our platform. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await fetch(`${apiUrl}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([...newMessages, { role: "model", content: data.response }]);
      } else {
        throw new Error(data.detail || "Failed to fetch response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        { role: "model", content: "Sorry, I couldn't connect to the server. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button — 3D Bot Icon */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.12, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl flex items-center justify-center z-50 focus:outline-none"
        style={{
          background: "linear-gradient(145deg, #1a2a4a, #0d1b35)",
          boxShadow: "0 0 0 1px rgba(0,229,255,0.3), 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,229,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* 3D Bot Face SVG */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Antenna */}
          <line x1="18" y1="4" x2="18" y2="10" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="18" cy="3" r="2" fill="#00E5FF" style={{ filter: 'drop-shadow(0 0 4px #00E5FF)' }}/>
          {/* Head */}
          <rect x="6" y="10" width="24" height="18" rx="5" fill="url(#botGrad)" stroke="rgba(0,229,255,0.5)" strokeWidth="1"/>
          {/* Eyes */}
          <rect x="10" y="15" width="5" height="5" rx="1.5" fill="#00E5FF" style={{ filter: 'drop-shadow(0 0 3px #00E5FF)' }}/>
          <rect x="21" y="15" width="5" height="5" rx="1.5" fill="#00E5FF" style={{ filter: 'drop-shadow(0 0 3px #00E5FF)' }}/>
          {/* Mouth */}
          <rect x="12" y="23" width="12" height="2.5" rx="1.25" fill="rgba(0,229,255,0.6)"/>
          {/* Ears/Side bolts */}
          <rect x="3" y="15" width="3" height="8" rx="1.5" fill="#1a3a5c" stroke="rgba(0,229,255,0.3)" strokeWidth="0.5"/>
          <rect x="30" y="15" width="3" height="8" rx="1.5" fill="#1a3a5c" stroke="rgba(0,229,255,0.3)" strokeWidth="0.5"/>
          <defs>
            <linearGradient id="botGrad" x1="6" y1="10" x2="30" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1a3a5c"/>
              <stop offset="100%" stopColor="#0d1b35"/>
            </linearGradient>
          </defs>
        </svg>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-[90vw] max-w-sm h-[520px] max-h-[80vh] rounded-2xl overflow-hidden flex flex-col z-50"
            style={{
              background: "rgba(11, 15, 25, 0.92)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(0,229,255,0.2)",
              boxShadow: "0 0 60px rgba(0,229,255,0.1), 0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,229,255,0.12) 0%, rgba(179,0,255,0.08) 100%)",
                borderBottom: "1px solid rgba(0,229,255,0.15)",
              }}
            >
              {/* Shimmer line at top */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-60" />

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(0,229,255,0.25), rgba(179,0,255,0.15))",
                      border: "1px solid rgba(0,229,255,0.3)",
                    }}
                  >
                    <Bot className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#30D158] rounded-full border-2 border-[#0B0F19] shadow-[0_0_6px_#30D158]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">SmartCity AI</h3>
                  <p className="text-[10px] text-[#30D158] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse shadow-[0_0_4px_#30D158]" />
                    Online · Powered by Gemini
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/10 transition-all focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ background: "rgba(255,255,255,0.01)" }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-[rgba(59,130,246,0.2)] border border-[rgba(59,130,246,0.4)]"
                        : "bg-[rgba(0,229,255,0.15)] border border-[rgba(0,229,255,0.3)]"
                    }`}
                  >
                    {msg.role === "user"
                      ? <User className="w-3.5 h-3.5 text-[#3B82F6]" />
                      : <Bot className="w-3.5 h-3.5 text-[#00E5FF]" />
                    }
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                    }`}
                    style={
                      msg.role === "user"
                        ? {
                            background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(30,80,200,0.2))",
                            border: "1px solid rgba(59,130,246,0.4)",
                            color: "white",
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(0,229,255,0.15)",
                            color: "rgba(200,210,240,0.9)",
                          }
                    }
                  >
                    {msg.role === "model" ? (
                      <div className="prose prose-sm max-w-none break-words prose-p:text-[rgba(200,210,240,0.9)] prose-strong:text-[#00E5FF] prose-a:text-[#00E5FF]">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="break-words">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* AI Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-[rgba(0,229,255,0.15)] border border-[rgba(0,229,255,0.3)] flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-[#00E5FF]" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(0,229,255,0.15)",
                    }}
                  >
                    <div className="flex gap-1.5 items-center">
                      <span className="ai-dot" />
                      <span className="ai-dot" />
                      <span className="ai-dot" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="p-3"
              style={{ borderTop: "1px solid rgba(0,229,255,0.1)", background: "rgba(0,0,0,0.2)" }}
            >
              <div
                className="flex items-center gap-2 rounded-xl p-1 pr-1.5 transition-all focus-within:border-[rgba(0,229,255,0.4)]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <input
                  type="text"
                  placeholder="Ask CitySync AI..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none text-white placeholder:text-[var(--color-text-muted)]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#0B0F19] font-bold disabled:opacity-30 transition-all hover:shadow-[0_0_12px_rgba(0,229,255,0.5)]"
                  style={{ background: "linear-gradient(135deg, #00E5FF, #0099CC)" }}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
