import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, RotateCcw } from 'lucide-react';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

interface HistoryProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}

export const History: React.FC<HistoryProps> = ({ 
  history, 
  isOpen, 
  onClose, 
  onClear, 
  onSelect 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 100
            }}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '320px',
              maxWidth: '85%',
              background: '#1a1a2e',
              borderLeft: '1px solid var(--glass-border)',
              zIndex: 101,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>History</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
              {history.length === 0 ? (
                <div style={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  color: 'var(--text-secondary)',
                  gap: '12px'
                }}>
                  <RotateCcw size={48} opacity={0.2} />
                  <p>No calculations yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02, x: -5 }}
                      onClick={() => onSelect(item)}
                      style={{
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        border: '1px solid transparent',
                        transition: 'border 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    >
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px', textAlign: 'right' }}>
                        {item.expression} =
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '600', textAlign: 'right' }}>
                        {item.result}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {history.length > 0 && (
              <button 
                onClick={onClear}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: 'rgba(255, 75, 43, 0.1)',
                  color: '#ff4b2b',
                  border: '1px solid rgba(255, 75, 43, 0.2)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <Trash2 size={18} />
                Clear All
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
