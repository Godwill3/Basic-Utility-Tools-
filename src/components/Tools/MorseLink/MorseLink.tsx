import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MessageSquare, Play, Volume2, Share2, CornerDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const morseMap: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': '/'
};

const reverseMorseMap = Object.entries(morseMap).reduce((acc, [key, val]) => {
  acc[val] = key;
  return acc;
}, {} as Record<string, string>);

export const MorseLink: React.FC = () => {
  const [text, setText] = useState('SOS');
  const [morse, setMorse] = useState('... / --- / ...');
  const [activeMode, setActiveMode] = useState<'text2morse' | 'morse2text'>('text2morse');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChar, setActiveChar] = useState(-1);

  const encode = (str: string) => {
    return str.toUpperCase().split('').map(char => morseMap[char] || '?').join(' ');
  };

  const decode = (code: string) => {
    return code.split(' ').map(char => reverseMorseMap[char] || '?').join('');
  };

  useEffect(() => {
    if (activeMode === 'text2morse') {
      setMorse(encode(text));
    } else {
      setText(decode(morse));
    }
  }, [text, morse, activeMode]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setActiveMode('text2morse');
    setText(e.target.value);
  };

  const handleMorseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setActiveMode('morse2text');
    setMorse(e.target.value);
  };

  const playMorse = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    const sequence = morse.split('');
    
    for (let i = 0; i < sequence.length; i++) {
      setActiveChar(i);
      const char = sequence[i];
      const duration = char === '.' ? 100 : char === '-' ? 300 : 200;
      await new Promise(r => setTimeout(r, duration));
      setActiveChar(-1);
      await new Promise(r => setTimeout(r, 100));
    }
    
    setIsPlaying(false);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
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
          <MessageSquare size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>MorseLink</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Editor Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Plain Text</label>
            <textarea 
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text..."
              className="glass"
              style={{
                width: '100%',
                height: '100px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'white',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                outline: 'none',
                resize: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.2rem',
                borderLeft: activeMode === 'text2morse' ? '4px solid var(--accent-color)' : '1px solid var(--glass-border)'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
             <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                <CornerDownLeft size={24} />
             </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Morse Code</label>
            <textarea 
              value={morse}
              onChange={handleMorseChange}
              placeholder="... --- ..."
              className="glass"
              style={{
                width: '100%',
                height: '100px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'white',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                outline: 'none',
                resize: 'none',
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                letterSpacing: '2px',
                borderLeft: activeMode === 'morse2text' ? '4px solid #ff4b2b' : '1px solid var(--glass-border)'
              }}
            />
          </div>
        </div>

        {/* Visual Playback */}
        <div style={{
           width: '100%',
           height: '12px',
           background: 'rgba(255,255,255,0.05)',
           borderRadius: '6px',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           overflow: 'hidden',
           gap: '4px',
           padding: '0 12px'
        }}>
           {morse.split('').map((char, i) => (
             <motion.div
               key={i}
               animate={{
                 width: char === '/' ? '1px' : char === ' ' ? '2px' : '4px',
                 height: char === ' ' || char === '/' ? '0px' : (activeChar === i ? '12px' : '6px'),
                 backgroundColor: activeChar === i ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)',
                 opacity: char === ' ' || char === '/' ? 0 : 1
               }}
               style={{ borderRadius: '2px' }}
             />
           ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '16px' }}>
           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={playMorse}
             disabled={isPlaying}
             style={{
               flex: 1,
               padding: '16px',
               borderRadius: '16px',
               background: isPlaying ? 'rgba(0, 210, 255, 0.2)' : 'var(--accent-color)',
               color: isPlaying ? 'var(--accent-color)' : 'black',
               border: 'none',
               fontWeight: '700',
               cursor: isPlaying ? 'default' : 'pointer',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '10px'
             }}
           >
             {isPlaying ? <Volume2 size={24} /> : <Play size={24} />}
             {isPlaying ? 'Playing...' : 'Visual Playback'}
           </motion.button>
           
           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => navigator.clipboard.writeText(morse)}
             style={{
               width: '56px',
               borderRadius: '16px',
               background: 'rgba(255, 255, 255, 0.05)',
               color: 'white',
               border: '1px solid var(--glass-border)',
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center'
             }}
           >
             <Share2 size={24} />
           </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
