import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Navigation, Map, Compass as CompassIcon, Locate } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompassTool: React.FC = () => {
  const [heading, setHeading] = useState(0);
  const [isSensorActive, setIsSensorActive] = useState(false);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // Use webkitCompassHeading for iOS, alpha for others
      const h = (e as any).webkitCompassHeading || (360 - (e.alpha || 0));
      if (h !== undefined) {
        setHeading(Math.round(h));
        setIsSensorActive(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const getCardinal = (h: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return directions[Math.round(h / 45)];
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
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
          <CompassIcon size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>Compass</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}
      >
        {/* Cardinal Readout */}
        <div style={{ textAlign: 'center' }}>
           <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>
             Current Heading
           </div>
           <div style={{ fontSize: '4.5rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif', lineHeight: '1' }}>
             {heading}° {getCardinal(heading)}
           </div>
        </div>

        {/* The Compass Dial */}
        <div style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.03)',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,210,255,0.1)'
        }}>
           {/* Center Needle (Stationary, Dial Rotates) */}
           <div style={{
             position: 'absolute',
             width: '2px',
             height: '100%',
             background: 'linear-gradient(to bottom, var(--accent-color) 45%, transparent 45%, transparent 55%, rgba(255,255,255,0.2) 55%)',
             zIndex: 5
           }} />
           
           <motion.div
             animate={{ rotate: -heading }}
             transition={{ type: 'spring', stiffness: 50, damping: 20 }}
             style={{
               position: 'relative',
               width: '100%',
               height: '100%',
               borderRadius: '50%'
             }}
           >
              {/* Cardinal Markers */}
              {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].map((dir, i) => (
                <div key={dir} style={{
                  position: 'absolute',
                  top: '15px',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${i * 45}deg)`,
                  transformOrigin: 'center 135px',
                  fontSize: i % 2 === 0 ? '1.5rem' : '0.9rem',
                  fontWeight: '800',
                  color: dir === 'N' ? 'var(--accent-color)' : (i % 2 === 0 ? 'white' : 'rgba(255,255,255,0.4)')
                }}>
                  {dir}
                </div>
              ))}

              {/* Minute Marks */}
              {[...Array(72)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  width: i % 2 === 0 ? '2px' : '1px',
                  height: i % 18 === 0 ? '12px' : (i % 2 === 0 ? '8px' : '4px'),
                  background: i % 18 === 0 ? 'var(--accent-color)' : 'rgba(255,255,255,0.3)',
                  transform: `translateX(-50%) rotate(${i * 5}deg)`,
                  transformOrigin: 'center 140px'
                }} />
              ))}
           </motion.div>

           {/* Inner Reflection */}
           <div style={{
             position: 'absolute',
             width: '80%',
             height: '80%',
             borderRadius: '50%',
             background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 0%, transparent 70%)',
             pointerEvents: 'none'
           }} />
        </div>

        {/* Status Indicator */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '12px 24px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '30px',
          border: '1px solid var(--glass-border)'
        }}>
           <div style={{ 
             width: '8px', 
             height: '8px', 
             borderRadius: '50%', 
             background: isSensorActive ? '#00c853' : '#ffa000',
             boxShadow: `0 0 10px ${isSensorActive ? '#00c853' : '#ffa000'}`
           }} />
           <span style={{ fontSize: '0.9rem', color: isSensorActive ? 'white' : 'var(--text-secondary)' }}>
             {isSensorActive ? 'Sensor Connected' : 'Sensor Unavailable (Using Mock)'}
           </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
           <Metric icon={Locate} label="Latitude" value="40.7128° N" />
           <Metric icon={Map} label="Longitude" value="74.0060° W" />
        </div>
      </motion.div>
    </div>
  );
};

const Metric = ({ icon: Icon, label, value }: any) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
     <Icon size={16} color="var(--accent-color)" />
     <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</span>
     <span style={{ fontWeight: '600', fontSize: '1.2rem' }}>{value}</span>
  </div>
);
