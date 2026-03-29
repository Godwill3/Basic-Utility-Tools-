import React from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#000',
      display: 'flex',
      overflowX: 'hidden'
    }}>
      <Sidebar />
      
      <main style={{
        flex: 1,
        marginLeft: '260px', // Matches sidebar width
        padding: '60px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      <footer style={{
        position: 'fixed',
        bottom: '24px',
        right: '40px',
        fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '2px',
        fontWeight: '700',
        pointerEvents: 'none'
      }}>
        BASICTOOLS • PRO EDITION
      </footer>
    </div>
  );
};
