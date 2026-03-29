import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2, Zap, Brain, User, Bot, Loader2, Info, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MOCK_RESPONSES = [
  "As a simulated version of Claude, I'm here to demonstrate the high-end interface of your Tool Hub. How can I assist you with your projects today?",
  "I've analyzed your request. In a production environment, I would provide a deep-dive response. For this demo, I can showcase my markdown formatting and fast response times.",
  "That's a fascinating question. If I were fully connected to the Anthropic network, I'd provide a detailed breakdown of the latest trends in that area.",
  "I'm currently running in 'Simulated Mode' to provide a free, zero-setup experience. You can interact with me just like a real AI assistant!",
];

const CODE_EXAMPLE = "```javascript\n// Here is a professional code example as requested:\nfunction calculateEfficiency(tasks, hours) {\n  return (tasks.length / hours).toFixed(2);\n}\n\nconsole.log(calculateEfficiency(['Design', 'Dev', 'Test'], 8));\n```";

export const ClaudeAITool: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const getMockResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();
    if (lower.includes('code') || lower.includes('how to')) return `As an AI model, I can certainly help with code organization. ${CODE_EXAMPLE}`;
    if (lower.includes('hello') || lower.includes('hi')) return "Hello! I'm Claude, your simulated AI assistant. I'm part of this high-performance Tool Hub. What's on your mind?";
    if (lower.includes('weather')) return "I'm a simulated AI and don't have a live satellite uplink, but you can check out the 'Weather Forecast' tool in your sidebar for real-time global data!";
    if (lower.includes('calculate') || lower.includes('math')) return "I'm currently simulating AI responses, but for high-precision mathematical operations, I recommend using the 'ProCalc' tool located at the top of your sidebar navigation.";
    
    return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: getMockResponse(input) 
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    if (window.confirm('Start a fresh conversation?')) {
      setMessages([]);
    }
  };

  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('```')) {
        const lang = line.replace(/```/g, '');
        return <code key={i} style={{ 
          display: 'block', 
          background: 'rgba(0,0,0,0.5)', 
          padding: '16px', 
          borderRadius: '12px', 
          margin: '12px 0', 
          fontFamily: 'monospace', 
          fontSize: '0.85rem', 
          color: '#00d2ff',
          border: '1px solid rgba(255,255,255,0.05)' 
        }}>{line.replace(/```/g, '') || (lang ? `${lang}...` : '')}</code>;
      }
      if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.4rem', fontWeight: '800', margin: '16px 0', color: 'var(--accent-color)' }}>{line.slice(2)}</h1>;
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
              <div style={{ padding: '30px', borderRadius: '50%', background: 'rgba(0, 210, 255, 0.03)', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
                <Brain size={64} style={{ color: 'var(--accent-color)', opacity: 0.4 }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>Claude AI Workbench</h3>
                <p style={{ fontWeight: '500', maxWidth: '300px', lineHeight: '1.5' }}>Welcome! This is a high-fidelity AI simulator for your Tool Hub.</p>
              </div>
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
                  background: msg.role === 'user' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: msg.role === 'user' ? 'black' : 'white',
                  flexShrink: 0,
                  boxShadow: msg.role === 'user' ? '0 0 20px rgba(0, 210, 255, 0.2)' : 'none'
                }}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className="glass" style={{
                  padding: '20px 24px',
                  background: msg.role === 'user' ? 'rgba(0, 210, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                  border: msg.role === 'user' ? '1px solid rgba(0, 210, 255, 0.2)' : '1px solid rgba(255,255,255,0.05)',
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
                  <Loader2 size={20} className="spin" color="var(--accent-color)" />
               </div>
               <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', fontWeight: '600', letterSpacing: '0.5px' }}>CLAUDE IS PROCESSING...</span>
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
            placeholder="Type a message to initiate a simulation..."
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
              fontFamily: 'inherit',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
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
              background: 'var(--accent-color)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              color: 'black',
              cursor: 'pointer',
              opacity: (loading || !input.trim()) ? 0.3 : 1
            }}
          >
            <Send size={20} />
          </motion.button>
        </form>

        {error && (
          <div className="glass" style={{ padding: '12px 16px', color: '#ff3b30', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,0,0,0.05)' }}>
            <Info size={16} />
            {error}
          </div>
        )}
      </div>

      {/* --- Sidebar (Right) --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-color)' }}>
            <Sparkles size={24} />
            <span style={{ fontWeight: '800', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>SIMULATED MODE</span>
          </div>

          <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
            This tool is running in <strong>Free Simulation Mode</strong>. You can interact with the Claude AI interface without needing an API key.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
               <Brain size={18} color="var(--accent-color)" />
               <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Claude 3.5 Sonnet</span>
            </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
               <Zap size={18} color="var(--accent-color)" />
               <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>High Performance</span>
            </div>
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
            <Trash2 size={20} /> CLEAR CHAT
          </button>
        </div>

        <div className="glass" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.05) 0%, transparent 100%)' }}>
           <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-color)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>PRO TIP</h4>
           <p style={{ fontSize: '0.75rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.3)' }}>
              Upgrade to the production edition to connect real LLM models via secure cloud proxies.
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
