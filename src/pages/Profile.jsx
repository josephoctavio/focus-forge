import React, { useState } from 'react';
import { 
  BookOpen, 
  Settings, 
  ChevronRight, 
  Clock, 
  UserCog, 
  BarChart3, 
  Info, 
  HelpCircle, 
  MessageSquare,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const Profile = ({ setActiveTab, theme, darkMode, stats, profileData, loading }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const colors = {
    text: theme?.text || '#fff',
    card: theme?.card || '#111111',
    bg: theme?.bg || '#000',
    border: theme?.border || '#222222',
    accent: theme?.accent || '#007AFF',
    muted: theme?.muted || '#888888',
    danger: '#FF3B30'
  };

  const handleLogout = async () => await supabase.auth.signOut();

  const getInitial = () => {
    const name = profileData?.full_name || 'Member';
    return name.charAt(0).toUpperCase();
  };

  if (loading) return <LoadingSkeleton colors={colors} darkMode={darkMode} />;

  return (
    <div style={{ padding: '24px', color: colors.text, backgroundColor: colors.bg, minHeight: '100vh', paddingBottom: '120px' }}>
      
      {/* LOGOUT MODAL */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, padding: '32px', borderRadius: '28px', maxWidth: '300px', width: '85%', textAlign: 'center' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255,59,48,0.1)', borderRadius: '20px' }}>
                <LogOut color={colors.danger} size={32} />
              </div>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Sign Out?</h3>
            <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '24px' }}>Ready to take a break?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handleLogout} style={modalButtonStyle(true)}>LOGOUT</button>
              <button onClick={() => setModalOpen(false)} style={modalButtonStyle(false, colors)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={avatarOuterStyle(colors, darkMode)}>
          <div style={avatarInnerStyle(colors, darkMode)}>
            <span style={avatarTextStyle(colors, darkMode)}>{getInitial()}</span>
          </div>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: '900', margin: '0', letterSpacing: '-0.8px' }}>
          {profileData?.full_name || 'MEMBER'}
        </h2>
        <div style={badgeStyle(colors)}>
           <span style={{ color: colors.accent, fontSize: '10px', fontWeight: '900', letterSpacing: '1px' }}>
            {profileData?.matric_no || 'PREMIUM MEMBER'}
          </span>
        </div>
      </div>

      {/* STATS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
        <StatCard icon={<BarChart3 size={18} color="#5856D6" />} value={stats?.courses || 0} label="Courses" colors={colors} />
        <StatCard icon={<BookOpen size={18} color="#34C759" />} value={stats?.totalTasks || 0} label="Tasks" colors={colors} />
      </div>

      {/* MENU GROUPS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* GROUP 1: ACCOUNT & MANAGEMENT */}
        <section>
          <h4 style={sectionHeaderStyle(colors)}>MANAGEMENT</h4>
          <div style={groupContainerStyle(colors)}>
            <MenuRow icon={<UserCog size={18} />} label="Edit Profile" color="#AF52DE" onClick={() => setActiveTab('edit-profile')} colors={colors} />
            <MenuRow icon={<BookOpen size={18} />} label="Course Manager" color={colors.accent} onClick={() => setActiveTab('course-manager')} colors={colors} />
            <MenuRow icon={<Clock size={18} />} label="My Schedule" color="#FF9500" onClick={() => setActiveTab('schedule-manager')} colors={colors} showBorder={false} />
          </div>
        </section>

        {/* GROUP 2: SYSTEM & SUPPORT */}
        <section>
          <h4 style={sectionHeaderStyle(colors)}>SYSTEM & SUPPORT</h4>
          <div style={groupContainerStyle(colors)}>
            <MenuRow icon={<Settings size={18} />} label="App Settings" color="#8E8E93" onClick={() => setActiveTab('config')} colors={colors} />
            <MenuRow icon={<MessageSquare size={18} />} label="Send Feedback" color="#34C759" onClick={() => setActiveTab('feedback')} colors={colors} />
            <MenuRow icon={<HelpCircle size={18} />} label="App Tutorial" color="#FF2D55" onClick={() => setActiveTab('tutorial')} colors={colors} showBorder={false} />
          </div>
        </section>

        {/* GROUP 3: DEVELOPER (CONDITIONAL) */}
        {profileData?.id === "5e50af0d-dd42-4feb-ba2d-b7b2d8f1a4f0" && (
          <section>
            <h4 style={sectionHeaderStyle(colors)}>ADMIN CONSOLE</h4>
            <div style={groupContainerStyle(colors)}>
              <MenuRow icon={<ShieldCheck size={18} />} label="Feedback Logs" color="#FFCC00" onClick={() => setActiveTab('admin-feedback')} colors={colors} showBorder={false} />
            </div>
          </section>
        )}

        {/* GROUP 4: ABOUT */}
        <section>
          <div style={groupContainerStyle(colors)}>
            <MenuRow icon={<Info size={18} />} label="About Focus Forge" color="#5AC8FA" onClick={() => setActiveTab('about')} colors={colors} showBorder={false} />
          </div>
        </section>
      </div>

      <button onClick={() => setModalOpen(true)} style={logoutButtonStyle}>
        SIGN OUT OF ACCOUNT
      </button>

    </div>
  );
};

// --- SUB-COMPONENTS ---

const MenuRow = ({ icon, label, color, onClick, colors, showBorder = true }) => (
  <button 
    onClick={onClick}
    className="menu-row"
    style={{
      display: 'flex', alignItems: 'center', width: '100%', padding: '12px 16px',
      background: 'none', border: 'none', cursor: 'pointer', gap: '14px'
    }}
  >
    <div style={{ 
      backgroundColor: `${color}15`, padding: '8px', borderRadius: '10px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: color 
    }}>
      {icon}
    </div>
    <div style={{ 
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: showBorder ? `1px solid ${colors.border}` : 'none',
      padding: '12px 0', minHeight: '44px'
    }}>
      <span style={{ fontWeight: '600', fontSize: '15px', color: colors.text }}>{label}</span>
      <ChevronRight size={16} style={{ opacity: 0.3, color: colors.text }} />
    </div>
  </button>
);

const StatCard = ({ icon, value, label, colors }) => (
  <div style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '24px', border: `1px solid ${colors.border}` }}>
    <div style={{ marginBottom: '12px' }}>{icon}</div>
    <span style={{ fontSize: '28px', fontWeight: '900', display: 'block', letterSpacing: '-1px' }}>{value}</span>
    <span style={{ fontSize: '11px', fontWeight: '700', opacity: 0.4, textTransform: 'uppercase' }}>{label}</span>
  </div>
);

const LoadingSkeleton = ({ colors, darkMode }) => (
    <div style={{ padding: '20px', backgroundColor: colors.bg, minHeight: '100vh' }}>
        <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: darkMode ? '#111' : '#eee' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ height: '100px', borderRadius: '20px', background: darkMode ? '#111' : '#eee' }} />
            <div style={{ height: '100px', borderRadius: '20px', background: darkMode ? '#111' : '#eee' }} />
        </div>
    </div>
);

// --- STYLES ---

const sectionHeaderStyle = (colors) => ({
  fontSize: '11px', fontWeight: '800', color: colors.muted, 
  letterSpacing: '1px', marginBottom: '10px', paddingLeft: '4px'
});

const groupContainerStyle = (colors) => ({
  backgroundColor: colors.card, borderRadius: '20px', border: `1px solid ${colors.border}`,
  overflow: 'hidden'
});

const avatarOuterStyle = (colors, darkMode) => ({
  width: '110px', height: '110px', borderRadius: '35px', backgroundColor: colors.card,
  display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${colors.border}`,
  margin: '0 auto 20px', boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 20px rgba(0,0,0,0.05)'
});

const avatarInnerStyle = (colors, darkMode) => ({
  width: '85px', height: '85px', borderRadius: '26px', 
  backgroundColor: darkMode ? '#000' : '#fff', border: `1px solid ${colors.border}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
});

const avatarTextStyle = (colors, darkMode) => ({
  fontSize: '38px', fontWeight: '900', color: colors.accent,
  textShadow: darkMode ? `0 0 15px ${colors.accent}66` : 'none'
});

const badgeStyle = (colors) => ({
  display: 'inline-block', marginTop: '12px', padding: '6px 16px', 
  backgroundColor: `${colors.accent}10`, borderRadius: '100px', border: `1px solid ${colors.accent}20`
});

const modalButtonStyle = (isPrimary, colors) => ({
  padding: '16px', borderRadius: '16px', fontWeight: '800', fontSize: '13px', cursor: 'pointer',
  background: isPrimary ? '#FF3B30' : 'transparent', color: isPrimary ? '#fff' : colors.text,
  border: isPrimary ? 'none' : `1px solid ${colors.border}`
});

const logoutButtonStyle = {
  width: '100%', marginTop: '50px', padding: '16px', border: 'none', background: 'transparent',
  color: '#FF3B30', fontWeight: '900', fontSize: '12px', cursor: 'pointer', letterSpacing: '1.2px'
};

export default Profile;