import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Copy, RefreshCw, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PassGenTool: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const chars = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    let charPool = '';
    if (options.upper) charPool += chars.upper;
    if (options.lower) charPool += chars.lower;
    if (options.numbers) charPool += chars.numbers;
    if (options.symbols) charPool += chars.symbols;

    if (!charPool) {
      setPassword('Select at least one option');
      return;
    }

    let generated = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        generated += charPool[array[i] % charPool.length];
    }
    
    setPassword(generated);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (password === 'Select at least one option') return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (password === 'Select at least one option') return { label: 'None', color: '#ff4b2b', width: '0%' };
    
    let score = 0;
    if (length > 12) score++;
    if (length > 16) score++;
    if (options.upper) score++;
    if (options.lower) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;

    if (score < 3) return { label: 'Weak', color: '#ff4b2b', width: '33%' };
    if (score < 5) return { label: 'Medium', color: '#ffa000', width: '66%' };
    return { label: 'Strong', color: '#00c853', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
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
          <ShieldCheck size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>PassGen</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Result Area */}
        <div style={{
          position: 'relative',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            wordBreak: 'break-all',
            textAlign: 'center',
            color: password === 'Select at least one option' ? 'var(--text-secondary)' : 'white',
            fontFamily: 'monospace',
            letterSpacing: '1px'
          }}>
            {password}
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={generatePassword}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <RefreshCw size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              style={{ background: 'none', border: 'none', color: copied ? '#00c853' : 'var(--text-secondary)', cursor: 'pointer' }}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Strength Bar */}
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: strength.width, backgroundColor: strength.color }}
            style={{ height: '100%' }}
          />
        </div>
        <div style={{ fontSize: '0.8rem', color: strength.color, textAlign: 'right', marginTop: '-16px' }}>
          {strength.label}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Length</span>
              <span style={{ fontSize: '1rem', fontWeight: '600' }}>{length}</span>
            </div>
            <input 
              type="range" 
              min="8" 
              max="64" 
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-color)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { id: 'upper', label: 'Uppercase' },
              { id: 'lower', label: 'Lowercase' },
              { id: 'numbers', label: 'Numbers' },
              { id: 'symbols', label: 'Symbols' }
            ].map((opt) => (
              <label 
                key={opt.id}
                style={{
                   display: 'flex',
                   alignItems: 'center',
                   gap: '10px',
                   cursor: 'pointer',
                   fontSize: '0.9rem'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={options[opt.id as keyof typeof options]}
                  onChange={(e) => setOptions(prev => ({ ...prev, [opt.id]: e.target.checked }))}
                  style={{ accentColor: 'var(--accent-color)', width: '18px', height: '18px' }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
