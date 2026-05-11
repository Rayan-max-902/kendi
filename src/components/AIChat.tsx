import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Bot, User, Sparkles } from "lucide-react";
import { askAI } from "../services/geminiService";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "ai", text: "Salam ! Je suis l'assistant Al Kendi. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Prepare history for API
    const history = messages
      .filter(m => m.id !== "1") // Skip initial welcome message if you want, or include it as assistant
      .map(m => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.text }]
      }));

    const aiResponse = await askAI(input, history);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", text: aiResponse || "Je n'ai pas pu générer de réponse." };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[80vh] bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-display font-black uppercase tracking-tighter text-lg leading-tight">Al Kendi Assistant</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Intelligence Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scroll-smooth bg-slate-50/30"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === "user" ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <div className={cn(
                    "p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                    msg.role === "user" 
                      ? "bg-primary text-white rounded-tr-none shadow-primary/10" 
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="self-start flex gap-2 items-center p-5 bg-white border border-slate-100 rounded-3xl rounded-tl-none shadow-sm">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-50 flex gap-3 items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-4 bg-primary text-white rounded-2xl hover:bg-primary-hover disabled:opacity-50 transition-all active:scale-95 shadow-xl shadow-primary/20"
              >
                <Send size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] shadow-[0_20px_40px_-8px_rgba(0,0,0,0.3)] flex items-center justify-center relative group overflow-hidden border border-white/10"
      >
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={32} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex flex-col items-center">
              <MessageSquare size={32} className="text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
        )}
      </motion.button>
    </div>
  );
}
