import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color?: string;
  isComingSoon?: boolean;
  layout?: 'grid' | 'list';
}

export const ToolCard: React.FC<ToolCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  path, 
  color = 'var(--accent-color)',
  isComingSoon = false,
  layout = 'grid'
}) => {
  const isList = layout === 'list';

  const content = (
    <motion.div
      whileHover={isComingSoon ? {} : { scale: isList ? 1.01 : 1.05, x: isList ? 8 : 0, y: isList ? 0 : -8 }}
      whileTap={isComingSoon ? {} : { scale: 0.98 }}
      className="glass"
      style={{
        padding: isList ? '20px 24px' : '32px',
        height: '100%',
        display: 'flex',
        flexDirection: isList ? 'row' : 'column',
        alignItems: isList ? 'center' : 'flex-start',
        gap: isList ? '24px' : '20px',
        cursor: isComingSoon ? 'default' : 'pointer',
        opacity: isComingSoon ? 0.6 : 1,
        transition: 'border 0.3s ease, background 0.3s ease',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (!isComingSoon) {
          e.currentTarget.style.border = `1px solid ${color}`;
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
      }}
    >
      <div style={{
        width: isList ? '48px' : '56px',
        height: isList ? '48px' : '56px',
        borderRadius: '16px',
        background: `rgba(${color === 'var(--accent-color)' ? '0, 210, 255' : '255, 75, 43'}, 0.1)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: color,
        flexShrink: 0
      }}>
        <Icon size={isList ? 24 : 28} />
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ 
          fontSize: isList ? '1.2rem' : '1.5rem', 
          fontWeight: '600', 
          marginBottom: isList ? '2px' : '8px',
          fontFamily: 'Outfit, sans-serif'
        }}>{title}</h3>
        <p style={{ 
          fontSize: isList ? '0.85rem' : '0.95rem', 
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          display: isList ? '-webkit-box' : 'block',
          WebkitLineClamp: isList ? 1 : undefined,
          WebkitBoxOrient: isList ? 'vertical' : undefined,
          overflow: isList ? 'hidden' : 'visible'
        }}>{description}</p>
      </div>

      {isList && !isComingSoon && (
        <div style={{ color: 'rgba(255,255,255,0.2)' }}>
           <ChevronRight size={20} />
        </div>
      )}

      {isComingSoon && (
        <span style={{
          position: 'absolute',
          top: '20px',
          right: '-30px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          padding: '4px 30px',
          fontSize: '0.7rem',
          transform: 'rotate(45deg)',
          fontWeight: '700',
          letterSpacing: '1px',
          display: isList ? 'none' : 'block'
        }}>SOON</span>
      )}
    </motion.div>
  );

  return isComingSoon ? content : <Link to={path} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>{content}</Link>;
};
