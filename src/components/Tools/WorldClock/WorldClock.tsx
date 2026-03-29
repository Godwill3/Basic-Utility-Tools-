import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, Trash2, MapPin, Plus } from 'lucide-react';

interface TimeData {
  id: string;
  city: string;
  zone: string;
  country: string;
}

export const WorldClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [clocks, setClocks] = useState<TimeData[]>([]);
  const [selectedCity, setSelectedCity] = useState<TimeData | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TimeData[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('procalc_clocks');
    if (saved) {
      setClocks(JSON.parse(saved));
    } else {
      setClocks([
        { id: '1', city: 'London', zone: 'Europe/London', country: 'GB' },
        { id: '2', city: 'New York', zone: 'America/New_York', country: 'US' },
        { id: '3', city: 'Tokyo', zone: 'Asia/Tokyo', country: 'JP' }
      ]);
    }
    
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('procalc_clocks', JSON.stringify(clocks));
  }, [clocks]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search)}&count=5&language=en&format=json`);
      const data = await res.json();
      if (data.results) {
        setResults(data.results.map((r: any) => ({
          id: r.id.toString(),
          city: r.name,
          zone: r.timezone,
          country: r.country_code
        })));
      }
    } catch (e) {
      console.error('Search failed', e);
    } finally {
      setLoading(false);
    }
  };

  const addClock = (city: TimeData) => {
    if (clocks.find(c => c.zone === city.zone && c.city === city.city)) return;
    setClocks([...clocks, city]);
    setSearch('');
    setResults([]);
  };

  const removeClock = (id: string) => {
    setClocks(clocks.filter(c => c.id !== id));
    if (selectedCity?.id === id) setSelectedCity(null);
  };

  // Calculate time for selected city
  const displayTime = selectedCity 
    ? new Date(time.toLocaleString('en-US', { timeZone: selectedCity.zone }))
    : time;

  const isActive = (id: string | null) => {
    if (id === null && selectedCity === null) return true;
    return selectedCity?.id === id;
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: '48px',
      minHeight: '80vh'
    }}>
      {/* --- Left Column: Minimalist Focal Point --- */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px'
      }}>
        <div style={{
           position: 'relative',
           padding: '40px',
           background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
           borderRadius: '50%'
        }}>
          <AnalogClock date={displayTime} size={360} />
        </div>
        
        <div style={{ textAlign: 'center' }}>
           <h2 style={{ 
             fontSize: '6.5rem', 
             fontWeight: '800', 
             fontFamily: 'Outfit, sans-serif',
             letterSpacing: '-2px',
             margin: 0,
             lineHeight: '1',
             display: 'flex',
             alignItems: 'baseline',
             justifyContent: 'center'
           }}>
             <span>{displayTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
             <span style={{ fontSize: '2.5rem', color: '#3b82f6', fontWeight: '600' }}>
               :{displayTime.toLocaleTimeString([], { second: '2-digit' })}
             </span>
           </h2>
           <div style={{ 
              marginTop: '20px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '500'
           }}>
             <MapPin size={18} color="#3b82f6" />
             <span>{selectedCity ? selectedCity.city : 'Local Time'}</span>
           </div>
        </div>
      </div>

      {/* --- Right Column: Search & Time Cards --- */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search any global city..."
              className="glass"
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                color: 'white',
                outline: 'none',
                fontSize: '1rem',
              }}
            />
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
          </form>

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="glass"
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  right: 0,
                  background: 'rgba(5, 5, 5, 0.98)',
                  borderRadius: '16px',
                  padding: '8px',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
                }}
              >
                {results.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => addClock(res)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: 'white',
                      cursor: 'pointer',
                      borderRadius: '12px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} color="#3b82f6" />
                      <span style={{ fontWeight: '600' }}>{res.city}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{res.country}</span>
                    </div>
                    <Plus size={16} />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* Local Time Card */}
          <TimeCard
            city="Local"
            country="System"
            time={time}
            active={isActive(null)}
            onClick={() => setSelectedCity(null)}
          />

          <AnimatePresence mode="popLayout">
            {clocks.map((city) => {
              const cityTime = new Date(time.toLocaleString('en-US', { timeZone: city.zone }));
              return (
                <TimeCard
                  key={city.id}
                  city={city.city}
                  country={city.country}
                  time={cityTime}
                  active={isActive(city.id)}
                  onClick={() => setSelectedCity(city)}
                  onDelete={(e: any) => {
                    e.stopPropagation();
                    removeClock(city.id);
                  }}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const TimeCard = ({ city, country, time, active, onClick, onDelete }: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    onClick={onClick}
    className="glass"
    style={{ 
      padding: '20px 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      background: active ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)',
      border: active ? '1px solid #3b82f6' : '1px solid var(--glass-border)',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{city}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{country}</span>
       </div>
       <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
       </span>
    </div>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
       <span style={{ 
          fontSize: '1.4rem', 
          fontWeight: '800', 
          fontFamily: 'Outfit',
          color: active ? '#3b82f6' : 'white'
       }}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
       </span>
       {onDelete && (
         <button 
           onClick={onDelete}
           style={{ background: 'none', border: 'none', color: '#ff3b30', opacity: active ? 0.6 : 0.2, cursor: 'pointer' }}
         >
           <Trash2 size={16} />
         </button>
       )}
    </div>
  </motion.div>
);

const AnalogClock = ({ date, size }: { date: Date, size: number }) => {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();

  const sDeg = (seconds / 60) * 360;
  const mDeg = ((minutes + seconds / 60) / 60) * 360;
  const hDeg = ((hours % 12 + minutes / 60) / 12) * 360;

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: '8px solid rgba(255,255,255,0.02)',
      position: 'relative',
      background: 'rgba(5, 5, 5, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(59, 130, 246, 0.05)'
    }}>
      {/* NO TICK MARKS - Extemely Minimalist */}

      {/* Hour Hand */}
      <motion.div 
        animate={{ rotate: hDeg }}
        style={{
          position: 'absolute',
          bottom: '50%',
          width: '10px',
          height: size * 0.25,
          background: 'white',
          borderRadius: '10px',
          transformOrigin: 'bottom'
        }} 
      />
      
      {/* Minute Hand */}
      <motion.div 
        animate={{ rotate: mDeg }}
        style={{
          position: 'absolute',
          bottom: '50%',
          width: '6px',
          height: size * 0.38,
          background: 'rgba(255,255,255,0.6)',
          borderRadius: '10px',
          transformOrigin: 'bottom'
        }} 
      />
      
      {/* Second Hand */}
      <motion.div 
        animate={{ rotate: sDeg }}
        style={{
          position: 'absolute',
          bottom: '50%',
          width: '2px',
          height: size * 0.45,
          background: '#3b82f6',
          borderRadius: '10px',
          transformOrigin: 'bottom',
          zIndex: 2
        }} 
      />

      {/* Center Pivot */}
      <div style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: '#3b82f6',
        zIndex: 3,
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)'
      }} />
    </div>
  );
};
