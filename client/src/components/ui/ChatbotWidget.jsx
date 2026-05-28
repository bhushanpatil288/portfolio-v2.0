import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, RefreshCw, User, Download, ExternalLink } from 'lucide-react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi there! 👋 I am Bhushan's AI assistant. Ask me anything about his skills, development projects, MCA journey, or download his resume!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBadge, setShowBadge] = useState(true);

  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Hide floating reminder badge once opened
  useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
    }
  }, [isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    if (!textToSend) {
      setInputValue('');
    }

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: text });
      
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: data.reply,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error('Failed to fetch AI reply');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Sorry, I had trouble processing that request. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `⚠️ ${errMsg}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: "Hi there! 👋 I am Bhushan's AI assistant. Ask me anything about his skills, development projects, MCA journey, or download his resume!",
        timestamp: new Date()
      }
    ]);
  };

  // Helper to render markdown links like [Bhushan's Resume](url)
  const renderMessageContent = (text) => {
    if (!text) return '';
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const [fullMatch, label, url] = match;
      const matchIndex = match.index;

      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      parts.push(
        <a
          key={url + matchIndex}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors mx-1"
        >
          {label}
          <ExternalLink size={12} className="inline" />
        </a>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const suggestions = [
    { label: '🚀 Skills Stack', query: 'What is Bhushan\'s technical skills stack?' },
    { label: '📂 Projects', query: 'Show me some of the projects Bhushan has built.' },
    { label: '🎓 MCA Details', query: 'Tell me about Bhushan\'s MCA education and pivot.' },
    { label: '📄 Resume', query: 'How can I download Bhushan\'s resume?' }
  ];

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
      
      {/* Floating reminder badge */}
      <AnimatePresence>
        {showBadge && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 3, duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="mb-3 mr-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:border-blue-400 dark:hover:border-blue-800 transition-all flex items-center gap-1.5 animate-pulse"
          >
            <Sparkles size={12} className="text-blue-500" />
            <span>Ask my AI Assistant!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-3.5 rounded-full shadow-lg text-white border transition-all duration-300 ${
          isOpen
            ? 'bg-slate-600 hover:bg-slate-700 border-slate-500/20'
            : 'bg-blue-600 hover:bg-blue-700 border-blue-500/20'
        }`}
        aria-label="Toggle AI assistant chat"
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[520px] sm:h-[580px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl flex flex-col overflow-hidden z-40"
          >
            
            {/* Header */}
            <div className="p-4 bg-blue-900 dark:bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-blue-800 dark:bg-slate-900 border border-blue-700 dark:border-slate-800">
                  <Bot size={22} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-wide">Bhushan's Assistant</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-[10px] text-blue-200 dark:text-slate-400 font-medium">Ready to assist</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.sender === 'bot' && (
                    <div className="p-1 rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 self-start mt-0.5">
                      <Bot size={12} className="text-slate-600 dark:text-slate-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 text-sm rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">
                      {renderMessageContent(msg.text)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start items-center gap-2">
                  <div className="p-1 rounded-md bg-slate-200 dark:bg-slate-800 self-start mt-0.5 animate-pulse">
                    <Bot size={12} className="text-slate-400" />
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce duration-300 delay-75"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce duration-300 delay-150"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce duration-300 delay-300"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions Chips */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug.query)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white border border-slate-200/50 dark:border-slate-700/50 active:scale-95 transition-all"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Footer Input Box */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                placeholder="Ask about skills, work history..."
                className="flex-grow px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !inputValue.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send size={16} />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default ChatbotWidget;
