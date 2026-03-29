import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Ruler, ArrowRightLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const staticUnits = {
  Length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    inch: 0.0254,
    ft: 0.3048,
    yard: 0.9144,
    mile: 1609.34
  },
  Weight: {
    g: 0.001,
    kg: 1,
    oz: 0.0283495,
    lb: 0.453592
  },
  Time: {
    ms: 0.001,
    sec: 1,
    min: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629800,
    year: 31557600
  },
  Temperature: {
    C: 'C',
    F: 'F',
    K: 'K'
  }
};

type StaticCategory = keyof typeof staticUnits;
type Category = StaticCategory | 'Currency';

export const UnitXTool: React.FC = () => {
  const [category, setCategory] = useState<Category>('Length');
  const [val1, setVal1] = useState('1');
  const [val2, setVal2] = useState('');
  const [unit1, setUnit1] = useState('m');
  const [unit2, setUnit2] = useState('cm');
  
  // Currency State
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await response.json();
      if (data.result === 'success') {
        setRates(data.rates);
        if (category === 'Currency') {
           setUnit1('USD');
           setUnit2('EUR');
        }
      } else {
        throw new Error('Failed to fetch rates');
      }
    } catch (e) {
      setError('Offline: Using base rates');
      setRates({ USD: 1, EUR: 0.92, GBP: 0.79, JPY: 151.4, CNY: 7.23 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category === 'Currency' && Object.keys(rates).length === 0) {
      fetchRates();
    }
  }, [category]);

  const convert = (value: string, from: string, to: string, cat: Category) => {
    if (isNaN(Number(value))) return '';
    const n = Number(value);

    if (cat === 'Temperature') {
      let celsius = 0;
      if (from === 'C') celsius = n;
      else if (from === 'F') celsius = (n - 32) * 5/9;
      else if (from === 'K') celsius = n - 273.15;

      if (to === 'C') return celsius.toFixed(2);
      if (to === 'F') return (celsius * 9/5 + 32).toFixed(2);
      if (to === 'K') return (celsius + 273.15).toFixed(2);
      return '';
    }

    if (cat === 'Currency') {
      if (!rates[from] || !rates[to]) return '...';
      const usdValue = n / rates[from];
      const result = usdValue * rates[to];
      return result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    }

    const data = staticUnits[cat as StaticCategory] as Record<string, number>;
    const baseValue = n * data[from];
    return (baseValue / data[to]).toFixed(4).replace(/\.?0+$/, '');
  };

  useEffect(() => {
    setVal2(convert(val1, unit1, unit2, category));
  }, [val1, unit1, unit2, category, rates]);

  const handleSwap = () => {
    const tempUnit = unit1;
    setUnit1(unit2);
    setUnit2(tempUnit);
    setVal1(val2.replace(/,/g, ''));
  };

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    if (cat === 'Currency') {
        if (Object.keys(rates).length > 0) {
           setUnit1('USD');
           setUnit2('EUR');
        }
    } else {
        const firstUnits = Object.keys(staticUnits[cat as StaticCategory]);
        setUnit1(firstUnits[0]);
        setUnit2(firstUnits[1] || firstUnits[0]);
    }
  };

  const getUnits = () => {
    if (category === 'Currency') return Object.keys(rates);
    return Object.keys(staticUnits[category as StaticCategory]);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '650px',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <ChevronLeft size={24} />
          </Link>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Ruler size={24} color="var(--accent-color)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>UnitX</h1>
          </div>
        </div>
        
        {category === 'Currency' && (
          <motion.button
            whileHover={{ rotate: 180 }}
            onClick={fetchRates}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </motion.button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}
      >
        {/* Category Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '16px',
          gap: '4px',
          overflowX: 'auto'
        }}>
          {['Length', 'Weight', 'Temperature', 'Time', 'Currency'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat as Category)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                background: category === cat ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                color: category === cat ? 'var(--accent-color)' : 'white',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
           <div style={{ 
             display: 'flex', 
             alignItems: 'center', 
             gap: '8px', 
             color: '#ffa000', 
             fontSize: '0.85rem',
             background: 'rgba(255, 160, 0, 0.1)',
             padding: '8px 16px',
             borderRadius: '8px'
           }}>
             <AlertCircle size={14} />
             {error}
           </div>
        )}

        {/* Inputs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative'
        }}>
          {/* Unit 1 */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '20px',
            alignItems: 'center',
            gap: '16px',
            border: '1px solid var(--glass-border)'
          }}>
            <input 
              type="number" 
              value={val1} 
              onChange={(e) => setVal1(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '600',
                outline: 'none',
                width: '60%'
              }}
            />
            <select 
              value={unit1} 
              onChange={(e) => setUnit1(e.target.value)}
              style={{
                background: 'rgba(30, 30, 30, 0.8)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                flex: 1,
                outline: 'none'
              }}
            >
              {getUnits().map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {/* Swap Trigger */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSwap}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--accent-color)',
              color: 'black',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 0 20px rgba(0, 210, 255, 0.5)'
            }}
          >
            <ArrowRightLeft size={20} />
          </motion.button>

          {/* Unit 2 */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '20px',
            alignItems: 'center',
            gap: '16px',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              width: '60%',
              color: 'var(--text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {loading ? '...' : val2 || '0'}
            </div>
            <select 
              value={unit2} 
              onChange={(e) => setUnit2(e.target.value)}
              style={{
                background: 'rgba(30, 30, 30, 0.8)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                flex: 1,
                outline: 'none'
              }}
            >
              {getUnits().map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {category === 'Currency' && (
          <div style={{ 
            textAlign: 'right', 
            fontSize: '0.8rem', 
            color: 'var(--text-secondary)',
            fontStyle: 'italic'
          }}>
            Live rates via exchangerate-api.com
          </div>
        )}
      </motion.div>
    </div>
  );
};
