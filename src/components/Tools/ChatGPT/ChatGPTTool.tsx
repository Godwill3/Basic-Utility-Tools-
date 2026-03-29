import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Trash2, Zap, Brain, User, Bot, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const MOCK_GPT_RESPONSES = [
  "As an AI model simulated in this Tool Hub, I can assist you with understanding complex topics or generating creative content. How can I help today?",
  "I've processed your input. In a live environment, I would provide a GPT-4o level analysis. For this simulation, I can demonstrate my advanced markdown and response logic.",
  "That's a great question! For a production version, I would deep-dive into the data. Here in the Hub, I'm ready to assist with your high-level inquiries.",
  "I'm currently operating in 'Free Simulation Mode' to ensure you can use this interface without an API key. What would you like to discuss next?",
];

const GPT_CODE_MOCK = "```typescript\n// Professional GPT-4o Simulated Output:\ninterface ProjectConfig {\n  name: string;\n  version: string;\n  isProduction: boolean;\n}\n\nconst hubConfig: ProjectConfig = {\n  name: 'Midnight Tool Hub',\n  version: '2.0.0',\n  isProduction: true\n};\n```";

export const ChatGPTTool: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are ChatGPT, a large language model trained by OpenAI.');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load from localStorage (ChatGPT persists history)
  useEffect(() => {
    const savedMsg = localStorage.getItem('procalc_chatgpt_history');
    const savedPrompt = localStorage.getItem('procalc_chatgpt_system_prompt');

    if (savedMsg) setMessages(JSON.parse(savedMsg));
    if (savedPrompt) setSystemPrompt(savedPrompt);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('procalc_chatgpt_history', JSON.stringify(messages));
    localStorage.setItem('procalc_chatgpt_system_prompt', systemPrompt);
  }, [messages, systemPrompt]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const getMockResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();
    if (lower.includes('code') || lower.includes('how to')) return `I can certainly help with that. Here is a simulated GPT-4o code block: ${GPT_CODE_MOCK}`;
    if (lower.includes('hello') || lower.includes('hi')) return "Hello! I'm ChatGPT, your simulated AI companion. I'm part of this high-performance Tool Hub. How can I assist you today?";
    if (lower.includes('weather')) return "I'm a simulated AI and don't have real-time satellite access, but you can use the 'Weather Forecast' tool in your sidebar for live global updates!";
    
    return MOCK_GPT_RESPONSES[Math.floor(Math.random() * MOCK_GPT_RESPONSES.length)];
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate GPT-4o thinking time
    setTimeout(() => {
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: getMockResponse(input) 
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1200);
  };

  const clearChat = () => {
    if (window.confirm('Clear your ChatGPT conversation history?')) {
      setMessages([]);
    }
  };

  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('```')) {
        return <code key={i} style={{ 
          display: 'block', 
          background: 'rgba(0,0,0,0.4)', 
          padding: '16px', 
          borderRadius: '12px', 
          margin: '12px 0', 
          fontFamily: 'monospace', 
          fontSize: '0.85rem', 
          color: '#10a37f',
          border: '1px solid rgba(255,255,255,0.05)' 
        }}>{line.replace(/```/g, '')}</code>;
      }
      if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.4rem', fontWeight: '800', margin: '16px 0', color: '#10a37f' }}>{line.slice(2)}</h1>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>{line.slice(2)}</li>;
      
      return <p key={i} style={{ marginBottom: '10px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>{line}</p>;
    });
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: '40px',
      height: 'calc(100vh - 120px)',
      maxHeight: '800px'
    }}>
      {/* --- Chat Window (Left) --- */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        gap: '24px'
      }}>
        {/* Messages Screen */}
        <div className="glass" style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid rgba(255,255,255,0.05)',
          scrollBehavior: 'smooth'
        }} ref={scrollRef}>
          {messages.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.2)',
              gap: '24px',
              textAlign: 'center'
            }}>
              <div style={{ padding: '30px', borderRadius: '50%', background: 'rgba(16, 163, 127, 0.05)', border: '1px solid rgba(16, 163, 127, 0.1)' }}>
                <MessageCircle size={64} style={{ color: '#10a37f', opacity: 0.5 }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>ChatGPT Workbench</h3>
              <p style={{ fontWeight: '500', maxWidth: '300px', lineHeight: '1.5' }}>Ask ChatGPT anything. This simulator uses GPT-4o logic for high-fidelity responses.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: msg.role === 'user' ? '#10a37f' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0,
                  boxShadow: msg.role === 'user' ? '0 0 20px rgba(16, 163, 127, 0.2)' : 'none'
                }}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className="glass" style={{
                  padding: '20px 24px',
                  background: msg.role === 'user' ? 'rgba(16, 163, 127, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: msg.role === 'user' ? '1px solid rgba(16, 163, 127, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                  maxWidth: '75%',
                  fontSize: '0.95rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                  {parseMarkdown(msg.content)}
                </div>
              </motion.div>
            ))
          )}
          {loading && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 size={20} className="spin" color="#10a37f" />
               </div>
               <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', fontWeight: '600', letterSpacing: '0.5px' }}>GENERATING RESPONSE...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={sendMessage} style={{ position: 'relative' }}>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Type a message to initiate GPT-4o simulation..."
            className="glass"
            style={{
              width: '100%',
              padding: '20px 70px 20px 24px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: 'white',
              outline: 'none',
              fontSize: '1rem',
              resize: 'none',
              height: '70px',
              fontFamily: 'inherit'
            }}
          />
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={loading || !input.trim()}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#10a37f',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              color: 'white',
              cursor: 'pointer',
              opacity: (loading || !input.trim()) ? 0.3 : 1
            }}
          >
            <Send size={20} />
          </motion.button>
        </form>
      </div>

      {/* --- Sidebar (Right) --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10a37f' }}>
            <Sparkles size={24} />
            <span style={{ fontWeight: '800', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>GPT SIMULATOR</span>
          </div>

          <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
            Enjoy the full ChatGPT experience in <strong>Free Mode</strong>. This tool simulates GPT-4o responses locally, perfect for workflow testing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
               <Brain size={18} color="#10a37f" />
               <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>GPT-4o Architecture</span>
            </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
               <Zap size={18} color="#10a37f" />
               <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Instant Tokenization</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>System Prompt</label>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="glass"
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.8rem',
                outline: 'none',
                minHeight: '100px',
                resize: 'none',
                lineHeight: '1.4'
              }}
            />
          </div>

          <button 
            onClick={clearChat}
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(255, 59, 48, 0.08)',
              color: '#ff3b30',
              border: '1px solid rgba(255, 59, 48, 0.2)',
              borderRadius: '16px',
              fontSize: '0.9rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '12px'
            }}
          >
            <Trash2 size={20} /> CLEAR HISTORY
          </button>
        </div>

        <div className="glass" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(16, 163, 127, 0.05) 0%, transparent 100%)' }}>
           <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#10a37f', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>PRO TIP</h4>
           <p style={{ fontSize: '0.75rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.3)' }}>
              Persistence is enabled: your ChatGPT discussions are kept in your local storage across sessions.
           </p>
        </div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
