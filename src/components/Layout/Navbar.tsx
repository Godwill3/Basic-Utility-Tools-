import React from 'react';
import { motion } from 'framer-motion';
import { Home, Calculator, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/calculator', icon: Calculator, label: 'Calculator' },
  ];

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '800px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 1000,
      borderRadius: '32px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          background: 'var(--accent-color)',
          boxShadow: '0 0 10px var(--accent-color)'
        }} />
        <Link to="/" style={{ 
          textDecoration: 'none', 
          color: 'white', 
          fontWeight: '700',
          fontSize: '1.2rem',
          fontFamily: 'Outfit, sans-serif'
        }}>TOOLHUB</Link>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isActive ? 'var(--accent-color)' : 'white',
                  background: isActive ? 'rgba(0, 210, 255, 0.1)' : 'transparent',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'background 0.2s, color 0.2s'
                }}
              >
                <item.icon size={18} />
                <span style={{ display: 'block' }}>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
         <motion.button 
          whileHover={{ rotate: 15 }}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
         >
           <Settings size={20} />
         </motion.button>
      </div>
    </nav>
  );
};
