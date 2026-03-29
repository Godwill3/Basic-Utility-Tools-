import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Palette, Copy, RefreshCw, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ColorTool: React.FC = () => {
  const [hex, setHex] = useState('#00d2ff');
  const pickerRef = useRef<HTMLInputElement>(null);
  const [rgb, setRgb] = useState('rgb(0, 210, 255)');
  const [hsl, setHsl] = useState('hsl(191, 100%, 50%)');
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  // --- Conversion Logic ---
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const updateFromHex = (newHex: string) => {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(newHex)) return;
    setHex(newHex);
    const rgbRes = hexToRgb(newHex);
    if (rgbRes) {
      setRgb(`rgb(${rgbRes.r}, ${rgbRes.g}, ${rgbRes.b})`);
      const hslRes = rgbToHsl(rgbRes.r, rgbRes.g, rgbRes.b);
      setHsl(`hsl(${hslRes.h}, ${hslRes.s}%, ${hslRes.l}%)`);
    }
  };

  const generatePalette = useCallback(() => {
    const newPalette = Array.from({ length: 5 }, () => 
      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    );
    setPalette(newPalette);
  }, []);

  useEffect(() => {
    generatePalette();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        generatePalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generatePalette]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
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
          <Palette size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>ColorTool</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Converter Section */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass"
           style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>Converter</h2>
          
          <ColorInput label="HEX" value={hex} onChange={updateFromHex} onCopy={() => handleCopy(hex)} isCopied={copied === hex} />
          <ColorInput label="RGB" value={rgb} readOnly onCopy={() => handleCopy(rgb)} isCopied={copied === rgb} />
          <ColorInput label="HSL" value={hsl} readOnly onCopy={() => handleCopy(hsl)} isCopied={copied === hsl} />

          <div 
            onClick={() => pickerRef.current?.click()}
            style={{
              position: 'relative',
              width: '100%',
              height: '100px',
              borderRadius: '16px',
              background: hex,
              marginTop: '12px',
              boxShadow: `0 10px 30px ${hex}33`,
              border: '2px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <motion.div 
               whileHover={{ opacity: 1 }}
               initial={{ opacity: 0 }}
               style={{
                 position: 'absolute',
                 inset: 0,
                 background: 'rgba(0,0,0,0.3)',
                 backdropFilter: 'blur(4px)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 color: 'white',
                 fontWeight: '600',
                 fontSize: '0.9rem'
               }}
            >
              Click to Pick
            </motion.div>
            <input 
              ref={pickerRef}
              type="color" 
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />
          </div>
        </motion.div>

        {/* Palette Section */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass"
           style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Palette</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Press SPACE to Refresh</div>
          </div>

          <div style={{ display: 'flex', height: '180px', gap: '8px', borderRadius: '16px', overflow: 'hidden' }}>
            {palette.map((color: string, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ flex: 1.5 }}
                onClick={() => handleCopy(color)}
                style={{
                  flex: 1,
                  background: color,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '12px',
                  position: 'relative',
                  transition: 'flex 0.3s'
                }}
              >
                 <span style={{
                   fontSize: '0.7rem',
                   fontWeight: '700',
                   color: 'white',
                   textShadow: '0 0 5px rgba(0,0,0,0.5)',
                   transform: 'rotate(-90deg)',
                   marginBottom: '20px'
                 }}>
                   {copied === color ? 'COPIED' : color.toUpperCase()}
                 </span>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePalette}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              border: '1px solid var(--glass-border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontWeight: '600'
            }}
          >
            <RefreshCw size={18} />
            Generate New
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

const ColorInput = ({ label, value, onChange, readOnly, onCopy, isCopied }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{label}</label>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '4px 12px',
      border: '1px solid var(--glass-border)'
    }}>
      <input 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          color: 'white',
          padding: '10px 0',
          outline: 'none',
          fontFamily: 'monospace',
          fontSize: '1rem'
        }}
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onCopy}
        style={{ background: 'none', border: 'none', color: isCopied ? '#00c853' : 'var(--text-secondary)', cursor: 'pointer' }}
      >
        {isCopied ? <Check size={18} /> : <Copy size={18} />}
      </motion.button>
    </div>
  </div>
);
