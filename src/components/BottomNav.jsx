import React from 'react';
import { Home, ClipboardList, User } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab, theme }) => {
  const navItems = [
    { id: 'home', icon: <Home size={22} />, label: 'Home' },
    { id: 'tasks', icon: <ClipboardList size={22} />, label: 'Tasks' },
    { id: 'profile', icon: <User size={22} />, label: 'Profile' }
  ];

  const accentColor = theme?.accent || '#007AFF';

  return (
    <nav style={{ 
      display: 'flex', 
      width: '100%', 
      height: '75px', // Fixed height to feel substantial
      backgroundColor: theme?.card || '#111111', // Solid color to match your screenshot
      alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom)', // Space for iPhone home bar
      borderTop: `1px solid ${theme?.border || '#222222'}`,
      zIndex: 1000
    }}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            {/* THE BLUE CAPSULE FROM YOUR SCREENSHOT */}
            <div style={{
              position: 'absolute',
              top: '12px', // Adjusted to center it better
              width: '48px',
              height: '34px',
              backgroundColor: isActive ? `${accentColor}15` : 'transparent',
              borderRadius: '14px',
              transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 0
            }} />

            <div style={{ 
              transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
              color: isActive ? accentColor : '#555555', // Greyed out when inactive
              transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              zIndex: 1,
              marginBottom: '4px'
            }}>
              {React.cloneElement(item.icon, { 
                strokeWidth: isActive ? 2.5 : 2,
              })}
            </div>

            <span style={{ 
              fontSize: '10px', 
              fontWeight: '800', 
              letterSpacing: '0.5px',
              color: isActive ? accentColor : '#555555',
              zIndex: 1,
              transition: '0.3s'
            }}>
              {item.label.toUpperCase()}
            </span>

            {/* DOT INDICATOR AT THE VERY BOTTOM */}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: '8px',
                width: '4px',
                height: '4px',
                backgroundColor: accentColor,
                borderRadius: '50%',
                boxShadow: `0 0 10px ${accentColor}`,
                animation: 'popIn 0.3s ease-out'
              }} />
            )}
          </button>
        );
      })}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        button:active {
          transform: scale(0.95);
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;