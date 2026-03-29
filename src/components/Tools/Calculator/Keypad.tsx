import React from 'react';
import { motion } from 'framer-motion';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  isScientific: boolean;
}

const buttons = [
  { label: 'AC', type: 'function', color: 'var(--btn-important)' },
  { label: 'DEL', type: 'function', color: 'var(--btn-important)' },
  { label: '%', type: 'operator' },
  { label: '÷', type: 'operator' },
  { label: '7', type: 'number' },
  { label: '8', type: 'number' },
  { label: '9', type: 'number' },
  { label: '×', type: 'operator' },
  { label: '4', type: 'number' },
  { label: '5', type: 'number' },
  { label: '6', type: 'number' },
  { label: '-', type: 'operator' },
  { label: '1', type: 'number' },
  { label: '2', type: 'number' },
  { label: '3', type: 'number' },
  { label: '+', type: 'operator' },
  { label: '0', type: 'number', gridArea: 'span 1 / span 1' },
  { label: '.', type: 'number' },
  { label: '=', type: 'operator', gridArea: 'span 1 / span 2', background: 'var(--accent-gradient)' },
];

const scientificButtons = [
  { label: 'sin', type: 'scientific' },
  { label: 'cos', type: 'scientific' },
  { label: 'tan', type: 'scientific' },
  { label: '^', type: 'scientific' },
  { label: 'log', type: 'scientific' },
  { label: 'ln', type: 'scientific' },
  { label: '√', type: 'scientific' },
  { label: '!', type: 'scientific' },
  { label: '(', type: 'scientific' },
  { label: ')', type: 'scientific' },
  { label: 'π', type: 'scientific' },
  { label: 'e', type: 'scientific' },
];

export const Keypad: React.FC<KeypadProps> = ({ onKeyPress, isScientific }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isScientific ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)',
      gap: '12px',
      width: '100%'
    }}>
      {isScientific && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          gridColumn: '1 / -1',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          {scientificButtons.map((btn) => (
            <KeyButton key={btn.label} btn={btn} onClick={() => onKeyPress(btn.label)} />
          ))}
        </div>
      )}
      {buttons.map((btn) => (
        <KeyButton 
          key={btn.label} 
          btn={btn} 
          onClick={() => onKeyPress(btn.label)} 
          gridArea={btn.gridArea} 
          customBg={btn.background}
          customColor={btn.color}
        />
      ))}
    </div>
  );
};

const KeyButton = ({ btn, onClick, gridArea, customBg, customColor }: any) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: 'var(--btn-hover)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        gridArea: gridArea,
        padding: '20px',
        fontSize: '1.2rem',
        fontWeight: '500',
        borderRadius: '16px',
        border: 'none',
        background: customBg || 'var(--btn-bg)',
        color: customColor || 'var(--text-primary)',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {btn.label}
    </motion.button>
  );
};
