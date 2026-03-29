import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, DollarSign, Users, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TipMaster: React.FC = () => {
  const [bill, setBill] = useState('100');
  const [tip, setTip] = useState(15);
  const [people, setPeople] = useState('1');

  const calculateTip = () => {
    const b = parseFloat(bill);
    const p = parseInt(people);
    if (isNaN(b) || isNaN(p) || p <= 0) return { total: 0, perPerson: 0, tipAmount: 0 };
    
    const tipAmount = b * (tip / 100);
    const total = b + tipAmount;
    return {
      total,
      perPerson: total / p,
      tipAmount: tipAmount / p
    };
  };

  const results = calculateTip();

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
          <DollarSign size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>TipMaster</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Bill Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Bill Amount</label>
            <div style={{ position: 'relative' }}>
               <DollarSign size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
               <input 
                 type="number"
                 value={bill}
                 onChange={(e) => setBill(e.target.value)}
                 className="glass"
                 style={{ padding: '16px 16px 16px 44px', color: 'white', outline: 'none', width: '100%' }}
               />
            </div>
          </div>

          {/* People Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Number of People</label>
            <div style={{ position: 'relative' }}>
               <Users size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
               <input 
                 type="number"
                 value={people}
                 onChange={(e) => setPeople(e.target.value)}
                 className="glass"
                 style={{ padding: '16px 16px 16px 44px', color: 'white', outline: 'none', width: '100%' }}
               />
            </div>
          </div>

          {/* Tip Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tip Percentage ({tip}%)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
               {[10, 15, 20, 25].map(t => (
                 <button
                   key={t}
                   onClick={() => setTip(t)}
                   style={{
                     padding: '12px',
                     borderRadius: '12px',
                     background: tip === t ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                     color: tip === t ? 'var(--accent-color)' : 'white',
                     border: 'none',
                     fontWeight: '600',
                     cursor: 'pointer'
                   }}
                 >
                   {t}%
                 </button>
               ))}
               <input 
                 type="number" 
                 placeholder="Custom"
                 onChange={(e) => setTip(parseInt(e.target.value) || 0)}
                 className="glass"
                 style={{ padding: '12px', textAlign: 'center', fontSize: '0.9rem', color: 'white' }}
               />
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{
          marginTop: '12px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(58, 123, 213, 0.1) 100%)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          border: '1px solid rgba(0, 210, 255, 0.2)'
        }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600' }}>Tip Amount</span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>/ person</span>
             </div>
             <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-color)' }}>${results.tipAmount.toFixed(2)}</span>
           </div>

           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600' }}>Total</span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>/ person</span>
             </div>
             <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-color)' }}>${results.perPerson.toFixed(2)}</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
