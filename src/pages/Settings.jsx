import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Moon, 
  Sun,
  Bell, 
  Smartphone, 
  HelpCircle, 
  Mail, 
  RefreshCcw, 
  ShieldCheck, 
  ArrowLeft,
  Palette
} from 'lucide-react';

const Settings = ({ setActiveTab, theme, darkMode, toggleTheme, onUpdateAccent, onRefreshData }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);

  const ACCENT_OPTIONS = [
    { name: 'Classic Blue', value: '#007AFF' },
    { name: 'Royal Purple', value: '#AF52DE' },
    { name: 'Electric Pink', value: '#FF2D55' },
    { name: 'Vibrant Orange', value: '#FF9500' },
    { name: 'Emerald', value: '#34C759' },
    { name: 'Crimson', value: '#FF3B30' },
    { name: 'Midnight', value: '#2C2C2E' },
  ];

  const handleRefreshApp = () => {
    setIsRefreshing(true);
    
    // Simulate network delay, then call the parent's refresh function if it exists
    setTimeout(() => {
      if (typeof onRefreshData === 'function') {
        onRefreshData();
      }
      setIsRefreshing(false); // Close the overlay smoothly
    }, 2000); 
  };

  const handleReportBug = () => {
    window.location.href = "mailto:deltrynstudios@gmail.com?subject= Focus Forge ";
  };

  const SectionHeader = ({ title }) => (
    <h3 style={{ 
      fontSize: '11px', 
      fontWeight: '900', 
      color: theme.accent, 
      textTransform: 'uppercase', 
      letterSpacing: '2px',
      margin: '30px 0 12px 10px',
      opacity: 0.8
    }}>
      {title}
    </h3>
  );

  return (
    <div style={{ padding: '24px', color: theme.text, backgroundColor: theme.bg, minHeight: '100vh', position: 'relative' }}>
      
      {/* REFRESH OVERLAY */}
      {isRefreshing && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: theme.bg, zIndex: 10000,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '24px', animation: 'fadeIn 0.4s ease'
        }}>
          <div style={{ 
            padding: '30px', borderRadius: '40px', backgroundColor: theme.card,
            boxShadow: `0 20px 60px ${theme.accent}22`, border: `1px solid ${theme.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <RefreshCcw size={48} color={theme.accent} className="spin-icon" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: '900', fontSize: '15px', letterSpacing: '1.5px', margin: '0 0 8px 0' }}>OPTIMIZING</p>
            <p className="pulse-text" style={{ fontWeight: '600', fontSize: '12px', margin: 0 }}>Syncing your campus flow...</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '35px', paddingTop: '10px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Settings</h1>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{ 
            background: theme.card, border: `1px solid ${theme.border}`, 
            borderRadius: '16px', padding: '12px', cursor: 'pointer', color: theme.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s ease'
          }}
          className="back-btn"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* ACCOUNT & SECURITY */}
      <SectionHeader title="Account" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SettingItem 
            icon={<ShieldCheck size={18} color="#34C759" />} 
            label="Privacy & Security" 
            theme={theme} 
            onClick={() => setActiveTab('privacy-security')}
        />
      </div>

      {/* APPEARANCE & THEME */}
      <SectionHeader title="Appearance" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <SettingItem 
          icon={darkMode ? <Moon size={18} color="#FF9500" /> : <Sun size={18} color="#FFCC00" />} 
          label={darkMode ? "Dark Mode" : "Light Mode"} 
          theme={theme} 
          hasToggle 
          active={darkMode} 
          onToggle={toggleTheme} 
        />

        {/* ACCENT COLOR PICKER WITH DROPDOWN */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Main Toggle Row */}
          <div 
            onClick={() => setShowAccentPicker(!showAccentPicker)}
            style={{ 
              display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: theme.card, 
              border: `1px solid ${theme.border}`, 
              borderRadius: showAccentPicker ? '22px 22px 0 0' : '22px', 
              gap: '16px', cursor: 'pointer', transition: 'all 0.2s ease',
              borderBottom: showAccentPicker ? 'none' : `1px solid ${theme.border}`
            }}
          >
            <div style={{ 
              backgroundColor: `${theme.text}05`, padding: '10px', borderRadius: '14px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}`
            }}>
              <Palette size={18} color={theme.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: '800', fontSize: '15px', color: theme.text }}>Accent Color</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', opacity: 0.4, fontWeight: '600', color: theme.text }}>Personalize your theme</p>
            </div>
            {showAccentPicker ? <ChevronUp size={18} style={{ opacity: 0.3, color: theme.text }} /> : <ChevronDown size={18} style={{ opacity: 0.3, color: theme.text }} />}
          </div>

          {/* Expandable Color List */}
          <div style={{ 
            maxHeight: showAccentPicker ? '100px' : '0px', 
            opacity: showAccentPicker ? 1 : 0, 
            overflow: 'hidden', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
          }}>
            <div style={{ 
              backgroundColor: theme.card, 
              border: `1px solid ${theme.border}`, 
              borderTop: 'none',
              borderRadius: '0 0 22px 22px', 
              padding: '16px 20px',
              display: 'flex', gap: '16px', overflowX: 'auto'
            }} className="hide-scrollbar">
              {ACCENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdateAccent(opt.value)}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: opt.value,
                    border: theme.accent === opt.value ? `2px solid ${theme.bg}` : 'none',
                    outline: theme.accent === opt.value ? `2px solid ${opt.value}` : 'none',
                    boxShadow: theme.accent === opt.value ? `0 4px 12px ${opt.value}66` : 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: theme.accent === opt.value ? 'scale(1.15)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PREFERENCES */}
      <SectionHeader title="Notifications" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SettingItem 
          icon={<Bell size={18} color="#FF3B30" />} 
          label="Push Notifications" 
          desc="Class reminders coming soon" 
          theme={theme} 
          disabled
        />
      </div>

      {/* SUPPORT */}
      <SectionHeader title="Support" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SettingItem 
            icon={<Mail size={18} color="#5856D6" />} 
            label="Contact Developers ✉️" 
            onClick={handleReportBug}
            theme={theme} 
        />
        <SettingItem 
            icon={<HelpCircle size={18} color="#8E8E93" />} 
            label="Help Center" 
            theme={theme} 
            onClick={() => setActiveTab('help-center')} 
        />
        <SettingItem 
            icon={<RefreshCcw size={18} color="#AF52DE" />} 
            label="Refresh App" 
            desc="Fix sync issues"
            onClick={handleRefreshApp}
            theme={theme} 
        />
      </div>

      {/* ABOUT */}
      <SectionHeader title="About" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SettingItem icon={<Smartphone size={18} color="#8E8E93" />} label="App Version" desc="v2.4.0 (Build 102)" theme={theme} hideArrow />
      </div>

      <div style={{ height: '120px' }} />

      <style>{`
        .back-btn:active { transform: scale(0.92); }
        .setting-row { transition: transform 0.1s ease, filter 0.2s ease, background-color 0.2s ease; }
        .setting-row:active { transform: scale(0.97); }
        .setting-row:hover:not([style*="opacity: 0.4"]) { filter: brightness(1.05); } 
        
        .toggle-switch { width: 46px; height: 26px; background-color: #333; border-radius: 50px; position: relative; cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .toggle-knob { width: 20px; height: 20px; background-color: white; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        .toggle-active .toggle-knob { left: 23px; }
        .toggle-active { background-color: #34C759; }
        
        .spin-icon { animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        /* New UI Improvement: Pulse animation for loading text */
        .pulse-text { animation: pulseOpacity 1.5s infinite ease-in-out; }
        @keyframes pulseOpacity { 
          0%, 100% { opacity: 0.4; } 
          50% { opacity: 1; } 
        }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const SettingItem = ({ icon, label, desc, theme, hasToggle, active, onToggle, onClick, hideArrow, disabled }) => {
  return (
    <div 
      className="setting-row" 
      onClick={!hasToggle && !disabled ? onClick : undefined}
      style={{ 
        display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: theme.card, 
        border: `1px solid ${theme.border}`, borderRadius: '22px', gap: '16px',
        cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1
      }}
    >
      <div style={{ 
        backgroundColor: `${theme.text}05`, padding: '10px', borderRadius: '14px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}`
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: '800', fontSize: '15px', color: theme.text }}>{label}</p>
        {desc && <p style={{ margin: '2px 0 0 0', fontSize: '11px', opacity: 0.4, fontWeight: '600', color: theme.text }}>{desc}</p>}
      </div>
      {hasToggle ? (
        <div onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`toggle-switch ${active ? 'toggle-active' : ''}`}>
          <div className="toggle-knob" />
        </div>
      ) : (
        !hideArrow && <ChevronRight size={18} style={{ opacity: 0.15, color: theme.text }} />
      )}
    </div>
  );
};

export default Settings;