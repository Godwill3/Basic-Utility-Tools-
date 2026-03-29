import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Braces, Copy, FileJson, Check, AlertTriangle, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JSONSync: React.FC = () => {
  const [input, setInput] = useState('{"name":"ProCalc","version":1.0,"features":["Calculator","Notes","UnitX"]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJSON = (indent: number = 2) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '32px'
      }}>
        <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <ChevronLeft size={24} />
        </Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Braces size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>JSONSync</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
         {/* Input Section */}
         <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass"
           style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
         >
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>INPUT</span>
              <button 
                onClick={() => setInput('')}
                style={{ background: 'none', border: 'none', color: '#ff4b2b', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Clear
              </button>
           </div>
           
           <textarea 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder='Paste JSON here...'
             spellCheck={false}
             style={{
               flex: 1,
               minHeight: '350px',
               background: 'rgba(255, 255, 255, 0.02)',
               border: '1px solid var(--glass-border)',
               borderRadius: '16px',
               color: 'white',
               padding: '16px',
               fontFamily: 'monospace',
               fontSize: '0.9rem',
               outline: 'none',
               resize: 'none'
             }}
           />

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => formatJSON(2)}
                style={{
                   padding: '12px',
                   borderRadius: '12px',
                   background: 'var(--accent-color)',
                   color: 'black',
                   border: 'none',
                   fontWeight: '700',
                   cursor: 'pointer'
                }}
              >
                Beautify
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={minifyJSON}
                style={{
                   padding: '12px',
                   borderRadius: '12px',
                   background: 'rgba(255,255,255,0.05)',
                   color: 'white',
                   border: '1px solid var(--glass-border)',
                   fontWeight: '700',
                   cursor: 'pointer'
                }}
              >
                Minify
              </motion.button>
           </div>
         </motion.div>

         {/* Output Section */}
         <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass"
           style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '500px' }}
         >
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>OUTPUT</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                {output && (
                   <button 
                     onClick={handleCopy}
                     style={{ background: 'none', border: 'none', color: copied ? 'var(--accent-color)' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                   >
                     {copied ? <Check size={14} /> : <Copy size={14} />}
                     <span style={{ fontSize: '0.8rem' }}>{copied ? 'Copied' : 'Copy'}</span>
                   </button>
                )}
              </div>
           </div>

           <div style={{
             flex: 1,
             background: 'rgba(0,0,0,0.2)',
             borderRadius: '16px',
             border: `1px solid ${error ? 'rgba(255, 75, 43, 0.3)' : 'var(--glass-border)'}`,
             padding: '16px',
             overflow: 'auto',
             fontFamily: 'monospace',
             fontSize: '0.9rem',
             position: 'relative'
           }}>
              {error ? (
                <div style={{ color: '#ff4b2b', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={18} />
                      <span style={{ fontWeight: '700' }}>Invalid JSON</span>
                   </div>
                   <div style={{ background: 'rgba(255, 75, 43, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                      {error}
                   </div>
                </div>
              ) : (
                <pre style={{ margin: 0, color: 'var(--accent-color)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                   {output || 'Output will appear here...'}
                </pre>
              )}
              
              {!output && !error && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.1 }}>
                   <FileJson size={80} />
                </div>
              )}
           </div>

           <div style={{
             display: 'flex',
             gap: '12px',
             background: 'rgba(255,255,255,0.03)',
             padding: '12px',
             borderRadius: '12px',
             fontSize: '0.8rem',
             color: 'var(--text-secondary)'
           }}>
              <Terminal size={14} />
              <span>Validate and clean your data instantly</span>
           </div>
         </motion.div>
      </div>
    </div>
  );
};
