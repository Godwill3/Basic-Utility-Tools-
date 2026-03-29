import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calculator, NotepadText, ShieldCheck, Ruler, Clock, Palette, 
  CheckCircle, User, DollarSign, MessageSquare, Braces, Edit3, 
  QrCode, Cloud, Globe, Compass, Sparkles 
} from 'lucide-react';

const categories = [
  {
    name: 'UTILITIES',
    tools: [
      { name: 'ProCalc', path: '/calculator', icon: Calculator, color: 'var(--color-calc)' },
      { name: 'NotesPad', path: '/notes', icon: NotepadText, color: 'var(--color-notes)' },
      { name: 'PassGen', path: '/passgen', icon: ShieldCheck, color: 'var(--color-pass)' },
      { name: 'UnitX', path: '/units', icon: Ruler, color: 'var(--color-units)' },
      { name: 'Chrono', path: '/chrono', icon: Clock, color: 'var(--color-chrono)' },
      { name: 'ColorTool', path: '/colors', icon: Palette, color: 'var(--color-colors)' },
    ]
  },
  {
    name: 'HEALTH & FINANCE',
    tools: [
      { name: 'TaskFlow', path: '/tasks', icon: CheckCircle, color: 'var(--color-tasks)' },
      { name: 'BodyMetric', path: '/bmi', icon: User, color: 'var(--color-bmi)' },
      { name: 'TipMaster', path: '/tips', icon: DollarSign, color: 'var(--color-tips)' },
    ]
  },
  {
    name: 'DEVELOPER',
    tools: [
      { name: 'ChatGPT', path: '/chatgpt', icon: MessageSquare, color: '#10a37f' },
      { name: 'Claude AI', path: '/claude', icon: Sparkles, color: '#af52de' },
      { name: 'JSONSync', path: '/json', icon: Braces, color: 'var(--color-json)' },
      { name: 'MarkEdit', path: '/markdown', icon: Edit3, color: 'var(--color-mark)' },
      { name: 'QRBox', path: '/qr', icon: QrCode, color: 'var(--color-qr)' },
    ]
  },
  {
    name: 'ENVIRONMENT',
    tools: [
      { name: 'Weather', path: '/weather', icon: Cloud, color: 'var(--color-weather)' },
      { name: 'WorldClock', path: '/worldclock', icon: Globe, color: 'var(--color-world)' },
      { name: 'Compass', path: '/compass', icon: Compass, color: 'var(--color-compass)' },
    ]
  }
];

export const Sidebar: React.FC = () => {
  return (
    <div style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      borderRight: '1px solid var(--glass-border)',
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(20px)',
      padding: '32px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div style={{ padding: '0 12px', marginBottom: '8px' }}>
        <h1 style={{ 
          fontSize: '1.4rem', 
          fontWeight: '800', 
          fontFamily: 'Outfit, sans-serif',
          letterSpacing: '-0.5px'
        }}>
          BasicTools<span style={{ color: 'var(--accent-color)' }}>.com</span>
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {categories.map((cat) => (
          <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: '700', 
              color: 'rgba(255,255,255,0.3)', 
              letterSpacing: '1px',
              padding: '0 12px'
            }}>
              {cat.name}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {cat.tools.map((tool) => (
                <NavLink
                  key={tool.path}
                  to={tool.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'all 0.2s',
                  })}
                  className={({ isActive }) => isActive ? 'active-nav' : ''}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: tool.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: `0 4px 12px ${tool.color}44`
                  }}>
                    <tool.icon size={18} />
                  </div>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    {tool.name}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .active-nav {
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};
