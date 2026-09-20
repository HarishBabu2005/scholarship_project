import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const QUICK_PROMPTS = [
  "🎓 Find scholarships for me",
  "📄 What documents are required?",
  "📌 How do I track application status?",
  "💰 Show high-value schemes",
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I am **VidyaBot**, your AI Scholarship Advisor.\n\nAsk me anything about scholarship eligibility, required documents, deadlines, or how to apply!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/ai/chat", {
        message: query,
      });

      if (response.data && response.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: response.data.reply,
            source: response.data.source,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Sorry, I ran into an error processing your request. Please try again.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error("Chatbot API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Could not connect to VidyaBot backend server. Make sure your server is running on port 5000.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to format basic markdown (bold, bullet lists, newlines)
  const renderFormattedText = (rawText) => {
    const lines = rawText.split("\n");
    return lines.map((line, lineIdx) => {
      // Bold replacement regex
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const lineContent = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={lineIdx} style={{ display: "block", minHeight: line === "" ? "8px" : "auto" }}>
          {lineContent}
        </span>
      );
    });
  };

  return (
    <div style={styles.container}>
      {/* Expanded Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={styles.botAvatar}>🤖</div>
              <div>
                <div style={styles.headerTitle}>VidyaBot AI</div>
                <div style={styles.headerSubtitle}>
                  <span style={styles.statusDot}></span> Live Scholarship Advisor
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setMessages([{
                  sender: "bot",
                  text: "Chat cleared! How else can I assist you?",
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }])}
                title="Clear Chat"
                style={styles.iconBtn}
              >
                🗑️
              </button>
              <button onClick={() => setIsOpen(false)} title="Close Chat" style={styles.iconBtn}>
                ✖
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div style={styles.messagesContainer}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.sender === "bot" && <div style={styles.msgAvatar}>🤖</div>}
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(msg.sender === "user" ? styles.userBubble : styles.botBubble),
                  }}
                >
                  <div style={styles.messageText}>{renderFormattedText(msg.text)}</div>
                  <div style={styles.timestamp}>{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ ...styles.messageWrapper, justifyContent: "flex-start" }}>
                <div style={styles.msgAvatar}>🤖</div>
                <div style={{ ...styles.messageBubble, ...styles.botBubble, display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={styles.typingDot}></span>
                  <span style={{ ...styles.typingDot, animationDelay: "0.2s" }}></span>
                  <span style={{ ...styles.typingDot, animationDelay: "0.4s" }}></span>
                  <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "6px" }}>VidyaBot is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={styles.quickPromptsContainer}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                style={styles.promptChip}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div style={styles.inputContainer}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask VidyaBot about eligibility, documents..."
              rows={1}
              style={styles.textarea}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{
                ...styles.sendBtn,
                opacity: loading || !input.trim() ? 0.5 : 1,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              }}
            >
              🚀
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} style={styles.toggleBtn}>
        <span style={{ fontSize: "24px" }}>{isOpen ? "✖" : "💬"}</span>
        {!isOpen && (
          <span style={styles.badgeContainer}>
            <span style={styles.badgePulse}></span>
            <span style={styles.badgeText}>VidyaBot AI</span>
          </span>
        )}
      </button>
    </div>
  );
};

// Inline Styles with modern Glassmorphism aesthetics
const styles = {
  container: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    borderRadius: "50px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #4f46e5 100%)",
    color: "#ffffff",
    border: "none",
    boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  badgeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: "600",
  },
  badgePulse: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.7)",
  },
  badgeText: {
    letterSpacing: "0.5px",
  },
  chatWindow: {
    position: "absolute",
    bottom: "75px",
    right: "0",
    width: "380px",
    height: "520px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    animation: "fadeIn 0.25s ease-out",
  },
  header: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    color: "#ffffff",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  botAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: "16px",
  },
  headerSubtitle: {
    fontSize: "12px",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
  },
  iconBtn: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    color: "#cbd5e1",
    borderRadius: "8px",
    padding: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
  messagesContainer: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    backgroundColor: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  messageWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  msgAvatar: {
    fontSize: "18px",
    marginBottom: "4px",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: "10px 14px",
    borderRadius: "16px",
    fontSize: "13.5px",
    lineHeight: "1.45",
  },
  botBubble: {
    backgroundColor: "#ffffff",
    color: "#1e293b",
    borderBottomLeftRadius: "4px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.03)",
  },
  userBubble: {
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    borderBottomRightRadius: "4px",
  },
  messageText: {
    wordBreak: "break-word",
  },
  timestamp: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "4px",
    textAlign: "right",
  },
  quickPromptsContainer: {
    display: "flex",
    gap: "6px",
    overflowX: "auto",
    padding: "8px 12px",
    backgroundColor: "#f1f5f9",
    borderTop: "1px solid #e2e8f0",
  },
  promptChip: {
    whiteSpace: "nowrap",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "20px",
    padding: "5px 10px",
    fontSize: "11.5px",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.15s ease",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e2e8f0",
    gap: "8px",
  },
  textarea: {
    flex: 1,
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "8px 12px",
    fontSize: "13px",
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
  },
  sendBtn: {
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },
  typingDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    display: "inline-block",
  },
};

export default AIChatbot;
