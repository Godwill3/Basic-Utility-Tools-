import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit3, Eye, FileText, Layout, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MarkEdit: React.FC = () => {
  const [markdown, setMarkdown] = useState('# Hello Markdown\n\nThis is a live **preview** editor.\n\n### Features\n- Side-by-side view\n- Live conversion\n- Github style styling\n\n```javascript\nconsole.log("Hello World");\n```');
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');

  const parseMarkdown = (md: string) => {
    // Simple basic regex-based parser for demonstration without heavy libraries
    let html = md
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
      .replace(/\n$/gim, '<br />')
      .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/<\/ul>\s?<ul>/gim, '') // Clean up consecutive ULs
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');

    return html;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      padding: '20px',
      height: 'calc(100vh - 120px)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <ChevronLeft size={24} />
          </Link>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Edit3 size={24} color="var(--accent-color)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>MarkEdit</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px' }}>
           {[
             { id: 'edit', icon: Edit3, label: 'Edit' },
             { id: 'split', icon: Layout, label: 'Split' },
             { id: 'preview', icon: Eye, label: 'View' }
           ].map(v => (
             <button
               key={v.id}
               onClick={() => setView(v.id as any)}
               style={{
                 padding: '8px 12px',
                 borderRadius: '8px',
                 background: view === v.id ? 'var(--accent-color)' : 'transparent',
                 color: view === v.id ? 'black' : 'white',
                 border: 'none',
                 cursor: 'pointer',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '6px',
                 fontSize: '0.8rem',
                 fontWeight: '600'
               }}
             >
               <v.icon size={14} />
               {v.label}
             </button>
           ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ 
          height: '100%',
          display: 'grid', 
          gridTemplateColumns: view === 'split' ? '1fr 1fr' : '1fr',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--glass-border)'
        }}
      >
        {/* Editor Pane */}
        {(view === 'edit' || view === 'split') && (
           <div style={{ 
             padding: '24px', 
             borderRight: view === 'split' ? '1px solid var(--glass-border)' : 'none',
             display: 'flex',
             flexDirection: 'column',
             background: 'rgba(0,0,0,0.2)'
           }}>
             <textarea 
               value={markdown}
               onChange={(e) => setMarkdown(e.target.value)}
               spellCheck={false}
               style={{
                 flex: 1,
                 background: 'none',
                 border: 'none',
                 color: 'var(--text-secondary)',
                 fontSize: '1rem',
                 fontFamily: 'monospace',
                 lineHeight: '1.6',
                 outline: 'none',
                 resize: 'none'
               }}
             />
           </div>
        )}

        {/* Preview Pane */}
        {(view === 'preview' || view === 'split') && (
           <div style={{ 
             padding: '40px',
             background: 'rgba(255,255,255,0.03)',
             overflowY: 'auto',
             color: 'white',
             lineHeight: '1.8'
           }}>
             <div 
               className="markdown-preview"
               dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }} 
               style={{
                 fontSize: '1.1rem',
                 fontFamily: 'Inter, sans-serif'
               }}
             />
             
             {/* Global styling for the preview container */}
             <style>{`
                .markdown-preview h1 { font-size: 2rem; border-bottom: 2px solid var(--glass-border); padding-bottom: 0.5rem; margin-top: 0; }
                .markdown-preview h2 { font-size: 1.5rem; margin-top: 2rem; }
                .markdown-preview h3 { font-size: 1.25rem; color: var(--accent-color); }
                .markdown-preview p { margin: 1rem 0; color: rgba(255,255,255,0.8); }
                .markdown-preview b { color: white; }
                .markdown-preview u { text-decoration: underline; }
                .markdown-preview pre { background: rgba(0,0,0,0.4); padding: 1.5rem; border-radius: 12px; overflow-x: auto; margin: 1.5rem 0; }
                .markdown-preview code { font-family: 'monospace'; color: #00d2ff; }
                .markdown-preview blockquote { border-left: 4px solid var(--accent-color); padding-left: 1rem; color: rgba(255,255,255,0.6); margin: 2rem 0; font-style: italic; }
                .markdown-preview ul { padding-left: 1.5rem; }
                .markdown-preview li { margin: 0.5rem 0; color: rgba(255,255,255,0.7); }
                .markdown-preview a { color: var(--accent-color); text-decoration: none; }
                .markdown-preview img { max-width: 100%; border-radius: 12px; }
             `}</style>
           </div>
        )}
      </motion.div>
    </div>
  );
};
