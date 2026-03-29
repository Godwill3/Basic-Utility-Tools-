import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Copy, Trash2, Check, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotesPadTool: React.FC = () => {
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('procalc_notes');
    if (saved) setContent(saved);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('procalc_notes', content);
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your notes?')) {
      setContent('');
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <ChevronLeft size={24} />
          </Link>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <FileText size={20} color="var(--accent-color)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>NotesPad</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '10px 16px',
              color: copied ? '#00c853' : 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem'
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            style={{
              background: 'rgba(255, 75, 43, 0.1)',
              border: '1px solid rgba(255, 75, 43, 0.2)',
              borderRadius: '12px',
              padding: '10px 16px',
              color: '#ff4b2b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem'
            }}
          >
            <Trash2 size={18} />
            Clear
          </motion.button>
        </div>
      </div>

      {/* Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{
          padding: '24px',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.03)'
        }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your notes here..."
          style={{
            width: '100%',
            flex: 1,
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            fontFamily: 'Inter, sans-serif',
            resize: 'none',
            outline: 'none'
          }}
        />
        
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          gap: '24px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          <span>Words: <strong>{wordCount}</strong></span>
          <span>Characters: <strong>{charCount}</strong></span>
          <span style={{ marginLeft: 'auto' }}>All changes saved automatically</span>
        </div>
      </motion.div>
    </div>
  );
};
