import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BodyMetric: React.FC = () => {
  const [unit, setUnit] = useState<'Metric' | 'Imperial'>('Metric');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('9');

  const calculateBMI = () => {
    let w = parseFloat(weight);
    let h = 0;

    if (unit === 'Metric') {
      h = parseFloat(height) / 100;
    } else {
      w = w * 0.453592; // lbs to kg
      h = (parseFloat(feet) * 12 + parseFloat(inches)) * 0.0254; // inches to meters
    }

    if (isNaN(w) || isNaN(h) || h === 0) return 0;
    return w / (h * h);
  };

  const bmi = calculateBMI();

  const getBMIStatus = (val: number) => {
    if (val === 0) return { label: 'Enter details', color: 'var(--text-secondary)', range: '' };
    if (val < 18.5) return { label: 'Underweight', color: '#00d2ff', range: '< 18.5' };
    if (val < 25) return { label: 'Normal Weight', color: '#00c853', range: '18.5 - 24.9' };
    if (val < 30) return { label: 'Overweight', color: '#ffa000', range: '25 - 29.9' };
    return { label: 'Obese', color: '#ff4b2b', range: '>= 30' };
  };

  const status = getBMIStatus(bmi);

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
          <Ruler size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>BodyMetric</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}
      >
        {/* Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '16px',
        }}>
          {(['Metric', 'Imperial'] as const).map(u => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: unit === u ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                color: unit === u ? 'var(--accent-color)' : 'white',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
            >
              {u}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Weight ({unit === 'Metric' ? 'kg' : 'lbs'})</label>
            <input 
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="glass"
              style={{ padding: '16px', color: 'white', outline: 'none', border: '1px solid var(--glass-border)' }}
            />
          </div>

          {unit === 'Metric' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Height (cm)</label>
              <input 
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="glass"
                style={{ padding: '16px', color: 'white', outline: 'none', border: '1px solid var(--glass-border)' }}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px' }}>
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Feet</label>
                  <input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} className="glass" style={{ padding: '16px', color: 'white' }} />
               </div>
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Inches</label>
                  <input type="number" value={inches} onChange={(e) => setInches(e.target.value)} className="glass" style={{ padding: '16px', color: 'white' }} />
               </div>
            </div>
          )}
        </div>

        {/* Result Area */}
        <div style={{
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          textAlign: 'center'
        }}>
           <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your BMI Score</span>
           <motion.span 
             key={bmi}
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             style={{ fontSize: '3rem', fontWeight: '700', color: status.color, fontFamily: 'Outfit, sans-serif' }}
           >
             {bmi === 0 ? '--' : bmi.toFixed(1)}
           </motion.span>
           <div style={{ fontWeight: '600', color: status.color, fontSize: '1.2rem' }}>{status.label}</div>
           <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Normal range: 18.5 - 24.9</span>
        </div>

        {/* Progress Visual */}
        <div style={{ width: '100%', display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', gap: '2px' }}>
           <div style={{ flex: 18, background: '#00d2ff' }} title="Underweight" />
           <div style={{ flex: 6, background: '#00c853' }} title="Normal" />
           <div style={{ flex: 5, background: '#ffa000' }} title="Overweight" />
           <div style={{ flex: 10, background: '#ff4b2b' }} title="Obese" />
        </div>
      </motion.div>
    </div>
  );
};
