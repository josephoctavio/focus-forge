import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Zap, MapPin, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

const Home = ({ theme, darkMode, userName, stats, todayClasses, loading, refreshData }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Helper: Format 24h to 12h (e.g., 14:30 -> 02:30 PM)
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  // --- Network Monitoring ---
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getProgressColor = (percent, total) => {
    if (total === 0) return '#007AFF'; 
    if (percent < 35) return '#FF3B30'; 
    if (percent < 75) return '#FFCC00'; 
    return '#34C759'; 
  };

  const currentColor = getProgressColor(stats.percentage, stats.totalTasks);

  const hour = new Date().getHours();
  let greeting = 'Welcome back';
  if (hour >= 5 && hour < 12) greeting = 'Good morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17 && hour < 22) greeting = 'Good evening';
  else greeting = 'Late night study';

  const fullDateStr = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', month: 'short', day: 'numeric' 
  }).format(new Date()).toUpperCase();

  // --- SKELETON LOADING UI (Only shows on initial App boot) ---
  if (loading && stats.totalTasks === 0) {
    return (
      <div style={{ padding: '15px', backgroundColor: theme?.bg, minHeight: '100vh' }}>
        <div className="skeleton" style={{ width: '150px', height: '20px', borderRadius: '4px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ width: '100px', height: '12px', borderRadius: '4px', marginBottom: '25px' }} />
        <div className="skeleton" style={{ width: '100%', height: '140px', borderRadius: '24px', marginBottom: '15px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div className="skeleton" style={{ height: '80px', borderRadius: '20px' }} />
          <div className="skeleton" style={{ height: '80px', borderRadius: '20px' }} />
        </div>
        <style>{`
          .skeleton { 
            background: ${darkMode ? '#1A1A1A' : '#E1E1E1'};
            background-image: linear-gradient(90deg, transparent, ${darkMode ? '#222' : '#F0F0F0'}, transparent);
            background-size: 200px 100%;
            background-repeat: no-repeat;
            animation: shimmer 1.5s infinite linear;
          }
          @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '15px', paddingBottom: '100px', color: theme?.text, backgroundColor: theme?.bg }}>
      
      {/* 1. WELCOME SECTION + NETWORK INDICATOR */}
      <header style={{ marginBottom: '20px', textAlign: 'left', marginTop: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.3px', margin: 0, display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <span style={{ whiteSpace: 'nowrap', opacity: 0.8 }}>{greeting},</span>
            {userName && (
              <span style={{ color: '#007AFF', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                {userName}
              </span>
            )}
          </h1>
          <p style={{ color: darkMode ? '#777' : '#666', margin: 0, fontSize: '12px', fontWeight: '700' }}>
            {stats.totalTasks > 0 ? (
              <>You have <span style={{ color: '#007AFF' }}>{stats.totalTasks - stats.completedTasks} tasks</span> remaining.</>
            ) : (
              "Nothing pending for today."
            )}
          </p>
        </div>

        {/* STATUS INDICATOR (RIGHT SIDE) */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          padding: '6px 10px', 
          backgroundColor: isOnline ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
          borderRadius: '50px',
          border: `1px solid ${isOnline ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 59, 48, 0.2)'}`
        }}>
          <div style={{ 
            width: '6px', height: '6px', borderRadius: '50%', 
            backgroundColor: isOnline ? '#34C759' : '#FF3B30',
            animation: isOnline ? 'pulseGreen 2s infinite' : 'none'
          }} />
          <span style={{ fontSize: '9px', fontWeight: '900', color: isOnline ? '#34C759' : '#FF3B30' }}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </header>

      {/* 2. PROGRESS CARD */}
      <div style={{ 
        backgroundColor: theme?.card, padding: '22px', borderRadius: '24px', border: `1.5px solid ${theme?.border}`,
        marginBottom: '15px', boxShadow: `0 8px 25px ${currentColor}10`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Zap size={12} color={currentColor} fill={currentColor} />
              <span style={{ fontSize: '9px', fontWeight: '800', color: darkMode ? '#777' : '#555', letterSpacing: '1px' }}>STATUS</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', margin: 0, color: theme?.text }}>
                {stats.totalTasks > 0 ? `${stats.percentage}%` : "ALL CLEAR"}
            </h2>
            <p style={{ color: darkMode ? '#777' : '#555', fontWeight: '700', fontSize: '11px', margin: 0 }}>
              {stats.totalTasks > 0 ? "Completion Rate" : "Everything is done"}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', fontWeight: '900', color: currentColor }}>
                {stats.totalTasks > 0 ? `${stats.completedTasks}/${stats.totalTasks}` : <CheckCircle2 size={18} />}
              </span>
          </div>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: darkMode ? '#111' : '#F0F0F0', borderRadius: '10px', marginTop: '18px', overflow: 'hidden' }}>
          <div style={{ width: stats.totalTasks > 0 ? `${stats.percentage}%` : '0%', height: '100%', backgroundColor: currentColor, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>
      </div>

      {/* 3. QUICK STATS BOXES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
          <div style={{ backgroundColor: theme.card, padding: '16px', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
            <BookOpen size={16} color="#5856D6" />
            <h3 style={{ fontSize: '18px', fontWeight: '900', margin: '6px 0 2px 0' }}>{stats.courses}</h3>
            <p style={{ fontSize: '8px', fontWeight: '800', color: darkMode ? '#777' : '#555', textTransform: 'uppercase', margin: 0 }}>Courses</p>
          </div>
          <div style={{ backgroundColor: theme.card, padding: '16px', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
            <Clock size={16} color="#FF9500" />
            <h3 style={{ fontSize: '18px', fontWeight: '900', margin: '6px 0 2px 0' }}>{stats.totalTasks}</h3>
            <p style={{ fontSize: '8px', fontWeight: '800', color: darkMode ? '#777' : '#555', textTransform: 'uppercase', margin: 0 }}>Assignments</p>
          </div>
      </div>

      {/* 4. TODAY'S SCHEDULE SECTION */}
      <div style={{ marginBottom: '10px', padding: '0 5px' }}>
        <h3 style={{ fontSize: '10px', fontWeight: '900', color: theme?.text, letterSpacing: '0.5px', margin: 0 }}>
          TODAY'S SCHEDULE <span style={{ color: '#007AFF', fontWeight: '900' }}>— {fullDateStr}</span>
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {todayClasses.length > 0 ? (
          todayClasses.map((item) => (
            <div key={item.id} style={{ padding: '16px', backgroundColor: theme.card, borderRadius: '20px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '3px', height: '30px', backgroundColor: item.courses?.color || '#333', borderRadius: '10px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: theme.text, marginBottom: '2px' }}>{item.courses?.name || 'Unknown Subject'}</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#777', fontWeight: '700' }}><Clock size={10} color="#007AFF" /> {formatTime(item.start_time)}</div>
                  {item.location && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#777', fontWeight: '700' }}><MapPin size={10} color="#FF2D55" /> {item.location}</div>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '25px 20px', textAlign: 'center', border: `1.5px dashed ${theme.border}`, borderRadius: '20px', opacity: 0.8 }}>
            <p style={{ color: darkMode ? '#777' : '#666', fontSize: '11px', fontWeight: '800', margin: 0 }}>NO CLASSES TODAY</p>
          </div>
        )}
      </div>

      {/* Manual Refresh if needed (Handled by refreshData prop) */}
      {!isOnline && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
           <button onClick={refreshData} style={{ background: 'none', border: 'none', color: '#007AFF', fontWeight: '800', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto' }}>
             <RefreshCw size={14} /> REFRESH DATA
           </button>
        </div>
      )}

      <style>{`
        @keyframes pulseGreen {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Home;