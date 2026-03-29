import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisplayProps {
  expression: string;
  result: string;
}

export const Display: React.FC<DisplayProps> = ({ expression, result }) => {
  return (
    <div className="display-container glass" style={{
      padding: '24px',
      marginBottom: '20px',
      textAlign: 'right',
      minHeight: '140px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>
      <div className="expression" style={{
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        marginBottom: '8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {expression || "0"}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={result}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="display-value"
          style={{
            fontSize: '3rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            wordBreak: 'break-all',
            lineHeight: '1'
          }}
        >
          {result || "0"}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
