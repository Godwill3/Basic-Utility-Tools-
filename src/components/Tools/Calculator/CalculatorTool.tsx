import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Beaker, LayoutGrid, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { History } from './History';
import { evaluateExpression, isOperator } from '../../../utils/mathEngine';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

export const CalculatorTool: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isScientific, setIsScientific] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('procalc_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('procalc_history', JSON.stringify(history));
  }, [history]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'AC') {
      setExpression('');
      setResult('0');
      return;
    }

    if (key === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
      return;
    }

    if (key === '=') {
      if (!expression) return;
      const finalResult = evaluateExpression(expression);
      setResult(finalResult);
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: finalResult
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));
      return;
    }

    if (['sin', 'cos', 'tan', 'log', 'ln', '√', '!'].includes(key)) {
      setExpression(prev => prev + key + '(');
      return;
    }

    setExpression(prev => {
      if (isOperator(key) && isOperator(prev.slice(-1)) && key !== '-') {
        return prev.slice(0, -1) + key;
      }
      return prev + key;
    });
  }, [expression, history]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9]/.test(key)) handleKeyPress(key);
      else if (['+', '-', '*', '/'].includes(key)) {
        const visualKey = key === '*' ? '×' : key === '/' ? '÷' : key;
        handleKeyPress(visualKey);
      }
      else if (key === 'Enter') handleKeyPress('=');
      else if (key === 'Escape') handleKeyPress('AC');
      else if (key === 'Backspace') handleKeyPress('DEL');
      else if (key === '.') handleKeyPress('.');
      else if (key === '^') handleKeyPress('^');
      else if (key === '(' || key === ')') handleKeyPress(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const handleSelectHistory = (item: HistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
    setIsHistoryOpen(false);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      padding: '20px',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 8px'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <ChevronLeft size={24} />
          </Link>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '600', letterSpacing: '0.5px' }}>ProCalc</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => setIsScientific(!isScientific)}
            style={{ background: 'none', border: 'none', color: isScientific ? 'var(--accent-color)' : 'white', cursor: 'pointer' }}
          >
            {isScientific ? <LayoutGrid size={22} /> : <Beaker size={22} />}
          </button>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <HistoryIcon size={22} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <Display expression={expression} result={result} />
        <Keypad onKeyPress={handleKeyPress} isScientific={isScientific} />
      </motion.div>

      <History 
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onClear={() => setHistory([])}
        onSelect={handleSelectHistory}
      />
    </div>
  );
};
