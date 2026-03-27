import React from 'react';
import { Sun, Moon } from 'lucide-react';

const Header = ({ title, showThemeToggle, darkMode, setDarkMode, theme }) => {
  // Enhanced transparency for that high-end glass look
  const bgColor = theme?.card?.startsWith('#') 
    ? `${theme.card}CC` // CC = 80% opacity for better blur visibility
    : 'rgba(0, 0, 0, 0.8)';

  return (
    <header className="mobile-header" style={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'env(safe-area-inset-top) 20px 0 20px', // Handles mobile notches
      height: '72px', // Taller header feels more spacious/premium
      backgroundColor: bgColor,
      backdropFilter: 'blur(20px) saturate(180%)', 
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: `1px solid ${theme?.border || 'rgba(255,255,255,0.1)'}`,
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'background-color 0.3s ease'
    }}>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 className="page-title" style={{ 
          color: theme?.text, 
          fontSize: '22px', 
          fontWeight: '900', 
          letterSpacing: '-1px', 
          margin: 0,
          textTransform: 'capitalize'
        }}>
          {title}
        </h1>
        {/* Subtle decorative line under title */}
        <div style={{ 
          width: '20px', 
          height: '3px', 
          backgroundColor: theme?.accent || '#007AFF', 
          borderRadius: '10px',
          marginTop: '2px'
        }} />
      </div>
      
      {showThemeToggle && (
        <button 
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle Theme"
          style={{ 
            background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', 
            border: `1px solid ${theme?.border}`, 
            borderRadius: '14px', 
            padding: '6px 14px',
            color: theme?.text,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            outline: 'none'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {darkMode ? (
            <Sun size={14} strokeWidth={3} color={theme?.accent || '#FFCC00'} /> 
          ) : (
            <Moon size={14} strokeWidth={3} color="#666" />
          )}
          
          <span style={{ 
            fontSize: '10px', 
            fontWeight: '900',
            letterSpacing: '1.2px',
            opacity: 0.8
          }}>
            {darkMode ? 'LIGHT' : 'DARK'}
          </span>
        </button>
      )}
    </header>
  );
};

export default Header;