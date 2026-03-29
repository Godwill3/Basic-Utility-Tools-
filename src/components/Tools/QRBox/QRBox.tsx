import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, QrCode, Download, Share2, Type, Link as LinkIcon, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QRBox: React.FC = () => {
  const [input, setInput] = useState('https://google.com');
  const [size, setSize] = useState(250);
  const [qrUrl, setQrUrl] = useState(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://google.com')}`);

  const generateQR = () => {
    if (!input.trim()) return;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(input.trim())}`;
    setQrUrl(url);
  };

  const downloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed', e);
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
        marginBottom: '32px'
      }}>
        <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <ChevronLeft size={24} />
        </Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <QrCode size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>QRBox</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>CONTENT (TEXT OR URL)</label>
            <div style={{ position: 'relative' }}>
               <Globe size={18} style={{ position: 'absolute', left: '16px', top: '16px', opacity: 0.5 }} />
               <textarea 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 className="glass"
                 style={{
                   width: '100%',
                   padding: '16px 16px 16px 44px',
                   background: 'rgba(255, 255, 255, 0.03)',
                   color: 'white',
                   border: '1px solid var(--glass-border)',
                   borderRadius: '16px',
                   outline: 'none',
                   resize: 'none',
                   height: '80px',
                   fontFamily: 'Inter, sans-serif'
                 }}
               />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Size (pixels)</span>
               <span style={{ fontWeight: '600' }}>{size}x{size}</span>
            </div>
            <input 
              type="range"
              min="100"
              max="500"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-color)' }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateQR}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              background: 'var(--accent-color)',
              color: 'black',
              border: 'none',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            Generate QR Code
          </motion.button>
        </div>

        {/* QR Display */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '24px',
          border: '1px solid var(--glass-border)'
        }}>
           <motion.div
             key={qrUrl}
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             style={{
               padding: '16px',
               background: 'white',
               borderRadius: '16px',
               boxShadow: '0 0 40px rgba(0, 210, 255, 0.2)'
             }}
           >
              <img src={qrUrl} alt="QR Code" style={{ width: '100%', display: 'block' }} />
           </motion.div>

           <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadQR}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Download size={18} />
                Download
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigator.clipboard.writeText(input)}
                style={{
                  width: '56px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Share2 size={18} />
              </motion.button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
