import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Play, Pause, RotateCcw, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ChronoTool: React.FC = () => {
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
  
  // Stopwatch State
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swRef = useRef<any>(null);

  // Timer State
  const [timerTotal, setTimerTotal] = useState(60); // seconds
  const [timerRemaining, setTimerRemaining] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [customMin, setCustomMin] = useState(1);
  const [customSec, setCustomSec] = useState(0);
  const timerRef = useRef<any>(null);

  // --- Stopwatch Logic ---
  useEffect(() => {
    if (swRunning) {
      swRef.current = setInterval(() => {
        setSwTime(t => t + 10);
      }, 10);
    } else {
      clearInterval(swRef.current);
    }
    return () => clearInterval(swRef.current);
  }, [swRunning]);

  const formatSw = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    setLaps([swTime, ...laps]);
  };

  const resetSw = () => {
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
  };

  // --- Timer Logic ---
  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimerRemaining(t => Math.max(0, t - 1));
      }, 1000);
    } else if (timerRemaining === 0) {
      setTimerRunning(false);
      clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerRemaining]);

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerRemaining(timerTotal);
  };

  const handleCustomTimeChange = (m: number, s: number) => {
    const total = (m * 60) + s;
    if (total > 0) {
      setTimerTotal(total);
      setTimerRemaining(total);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px'
      }}>
        <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <ChevronLeft size={24} />
        </Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Clock size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>Chrono</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '40px' }}
      >
        {/* Mode Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '16px',
        }}>
          {['stopwatch', 'timer'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: mode === m ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                color: mode === m ? 'var(--accent-color)' : 'white',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Stopwatch Content */}
        {mode === 'stopwatch' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
            <div style={{ 
              fontSize: '4.5rem', 
              fontWeight: '700', 
              fontFamily: 'Outfit, monospace', 
              letterSpacing: '2px',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {formatSw(swTime)}
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
              <ControlButton onClick={resetSw} icon={RotateCcw} color="var(--text-secondary)" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSwRunning(!swRunning)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: swRunning ? 'rgba(255, 75, 43, 0.2)' : 'rgba(0, 210, 255, 0.2)',
                  color: swRunning ? '#ff4b2b' : '#00d2ff',
                  border: `2px solid ${swRunning ? '#ff4b2b' : '#00d2ff'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {swRunning ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: '4px' }} />}
              </motion.button>
              <ControlButton onClick={handleLap} icon={Plus} color="var(--accent-color)" disabled={!swRunning} />
            </div>

            {/* Laps List */}
            <div style={{
              width: '100%',
              maxHeight: '200px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingRight: '8px'
            }}>
              {laps.map((lap, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Lap {laps.length - idx}</span>
                  <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>{formatSw(lap)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timer Content */}
        {mode === 'timer' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
            {/* Timer Display with Ring */}
            <div style={{ position: 'relative', width: '220px', height: '220px' }}>
               <svg width="220" height="220" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle 
                    cx="110" cy="110" r="100" fill="none" stroke="var(--accent-color)" strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray="628"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: 628 - (628 * (timerRemaining / timerTotal)) }}
                    style={{ transformOrigin: 'center', rotate: '-90deg' }}
                  />
               </svg>
               <div style={{
                 position: 'absolute',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%, -50%)',
                 fontSize: '3.5rem',
                 fontWeight: '700',
                 fontFamily: 'Outfit, monospace'
               }}>
                 {formatTimer(timerRemaining)}
               </div>
            </div>

            {/* Timer Inputs & Presets */}
            {!timerRunning && timerRemaining === timerTotal && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%' }}>
                {/* Custom Input Group */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <TimerInput 
                    value={customMin} 
                    onChange={(v: number) => { setCustomMin(v); handleCustomTimeChange(v, customSec); }} 
                    label="Min" 
                  />
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>:</span>
                  <TimerInput 
                    value={customSec} 
                    onChange={(v: number) => { setCustomSec(v); handleCustomTimeChange(customMin, v); }} 
                    label="Sec"
                    max={59}
                  />
                </div>

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {[60, 180, 300, 600].map(s => (
                    <button 
                      key={s} 
                      onClick={() => { 
                        setTimerTotal(s); 
                        setTimerRemaining(s);
                        setCustomMin(Math.floor(s / 60));
                        setCustomSec(s % 60);
                      }}
                      style={{
                        background: timerTotal === s ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                        color: timerTotal === s ? 'var(--accent-color)' : 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {s/60}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '24px' }}>
              <ControlButton onClick={resetTimer} icon={RotateCcw} color="var(--text-secondary)" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTimerRunning(!timerRunning)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: timerRunning ? 'rgba(255, 75, 43, 0.2)' : 'rgba(0, 210, 255, 0.2)',
                  color: timerRunning ? '#ff4b2b' : '#00d2ff',
                  border: `2px solid ${timerRunning ? '#ff4b2b' : '#00d2ff'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {timerRunning ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: '4px' }} />}
              </motion.button>
              <div style={{ width: '56px' }} /> {/* Spacer */}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};


const TimerInput = ({ value, onChange, label, max = 99 }: { value: number, onChange: (v: number) => void, label: string, max?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
    <input 
      type="number"
      min="0"
      max={max}
      value={value.toString().padStart(2, '0')}
      onChange={(e) => {
        const val = Math.min(max, Math.max(0, parseInt(e.target.value) || 0));
        onChange(val);
      }}
      style={{
        width: '70px',
        padding: '12px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: '600',
        outline: 'none',
        fontFamily: 'Outfit, sans-serif'
      }}
    />
    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
  </div>
);

const ControlButton = ({ onClick, icon: Icon, color, disabled }: any) => (
  <motion.button
    whileHover={disabled ? {} : { scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
    whileTap={disabled ? {} : { scale: 0.9 }}
    onClick={onClick}
    disabled={disabled}
    style={{
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.05)',
      color: color,
      border: 'none',
      cursor: disabled ? 'default' : 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disabled ? 0.3 : 1
    }}
  >
    <Icon size={24} />
  </motion.button>
);
