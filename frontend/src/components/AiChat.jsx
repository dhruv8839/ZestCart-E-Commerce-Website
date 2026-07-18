import { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your AI Shopping Assistant (powered by Gemini 2.5 Flash). How can I help you find the perfect product today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    const currentInput = input;
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: `I can help you search for "${currentInput}". We have amazing products in that category!` }
      ]);
    }, 1000);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-elevated transition-all hover:scale-110"
        aria-label="Open AI Shopping Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-full max-w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:right-6 sm:w-[380px]"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 to-brand-800 px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-100" />
                <h3 className="font-bold">AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full bg-white/20 p-1 hover:bg-white/30 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 rounded-bl-none dark:bg-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft transition hover:bg-brand-700"
              >
                <Send className="h-4 w-4 ml-1" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
