import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  return (
    <div style={{
      padding: '40px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '80px',
      alignItems: 'center'
    }}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', maxWidth: '800px' }}
      >
        <h1 style={{
          fontSize: '4.5rem',
          fontWeight: '900',
          fontFamily: 'Outfit, sans-serif',
          letterSpacing: '-2px',
          marginBottom: '24px',
          lineHeight: '1.1',
          background: 'linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.4) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          One Workspace.<br />16+ Professional Tools.
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.25rem',
          lineHeight: '1.6',
          fontWeight: '500'
        }}>
          Welcome to the ultimate utility suite. Navigate via the sidebar to access high-precision calculators, developer tools, and environmental utilities.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '40px' }}>
          <Link to="/calculator" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 210, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '16px 32px',
                borderRadius: '12px',
                background: 'var(--accent-color)',
                color: 'black',
                border: 'none',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              Launch ProCalc <ArrowRight size={20} />
            </motion.button>
          </Link>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        width: '100%'
      }}>
        <FeatureCard
          icon={Zap}
          title="Blazing Fast"
          desc="Built for speed with real-time reactive updates and instant results."
        />
        <FeatureCard
          icon={Shield}
          title="Privacy First"
          desc="All data is stored locally on your device. No cloud tracking, ever."
        />
        <FeatureCard
          icon={Globe}
          title="Universal"
          desc="150+ Currencies, Global Weather, and every World Clock imaginable."
        />
      </section>

      {/* Statistics / Status */}
      <section className="glass" style={{
        width: '100%',
        padding: '40px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <Stat label="Total Tools" val="16+" />
        <Stat label="Integration" val="Active" />
        <Stat label="Performance" val="99.9%" />
        <Stat label="Design" val="Professional" />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--accent-color)'
    }}>
      <Icon size={24} />
    </div>
    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', fontFamily: 'Outfit' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>{desc}</p>
  </div>
);

const Stat = ({ label, val }: any) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'Outfit', color: 'white' }}>{val}</div>
    <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', marginTop: '4px' }}>{label}</div>
  </div>
);
