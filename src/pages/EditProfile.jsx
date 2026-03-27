import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Home, X, Edit3, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const BASE_URL = "https://hcdgxxcjmamrlojhshxa.supabase.co/storage/v1/object/public/avatars/";

const AVATAR_OPTIONS = [
  { id: 'av1', url: `${BASE_URL}av1.png` },
  { id: 'av2', url: `${BASE_URL}av2.png` },
  { id: 'av3', url: `${BASE_URL}av3.png` },
  { id: 'av4', url: `${BASE_URL}av4.png` },
  { id: 'av5', url: `${BASE_URL}av5.png` },
  { id: 'av6', url: `${BASE_URL}av6.png` },
  { id: 'av7', url: `${BASE_URL}av7.png` },
  { id: 'av8', url: `${BASE_URL}av8.png` },
  { id: 'av9', url: `${BASE_URL}av9.png` },
  { id: 'av10', url: `${BASE_URL}av10.png` },
  { id: 'av11', url: `${BASE_URL}av11.png` },
  { id: 'av12', url: `${BASE_URL}av12.png` },
];

const EditProfile = ({ onBack, theme, profileData, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [showTray, setShowTray] = useState(false);
  const [isClosing, setIsClosing] = useState(false); 
  const [profile, setProfile] = useState({ 
    full_name: profileData?.full_name || '', 
    matric_no: profileData?.matric_no || '', 
    avatar_id: profileData?.avatar_id || 'av1' 
  });
  const [toast, setToast] = useState({ show: false, message: '' });

  // Sync state if profileData changes
  useEffect(() => {
    if (profileData) {
      setProfile({
        full_name: profileData.full_name || '',
        matric_no: profileData.matric_no || '',
        avatar_id: profileData.avatar_id || 'av1'
      });
    }
  }, [profileData]);

  const closeTray = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowTray(false);
      setIsClosing(false);
    }, 300); 
  };

  const handleSave = async () => {
    if (!profile.full_name.trim()) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profile.full_name,
        matric_no: profile.matric_no,
        avatar_id: profile.avatar_id,
        updated_at: new Date(),
      });

      if (!error) {
        setToast({ show: true, message: 'IDENTITY SYNCED' });
        await refreshData(); // Tell App.jsx to fetch the new name/avatar
        setTimeout(() => {
          setToast({ show: false, message: '' });
          onBack(); // Smooth transition back to Profile
        }, 1500);
      }
    } catch (e) { 
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === profile.avatar_id) || AVATAR_OPTIONS[0];

  return (
    <div style={{ padding: '24px', color: theme.text, backgroundColor: theme.bg, minHeight: '100vh', animation: 'fadeIn 0.3s ease' }}>
      
      {/* TOAST */}
      {toast.show && (
        <div style={{ 
          position: 'fixed', top: '40px', left: '50%', transform: 'translateX(-50%)', 
          backgroundColor: '#34C759', color: '#fff', padding: '14px 28px', 
          borderRadius: '50px', zIndex: 10000, fontWeight: '900', fontSize: '12px',
          boxShadow: '0 10px 30px rgba(52, 199, 89, 0.3)', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <CheckCircle2 size={16} /> {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <button onClick={onBack} style={{ background: theme.card, border: `1px solid ${theme.border}`, padding: '10px', borderRadius: '14px', color: theme.text, display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontSize: '13px', fontWeight: '900', letterSpacing: '1.5px', opacity: 0.5 }}>EDIT IDENTITY</h2>
        <div style={{ width: '40px' }} /> {/* Spacer for centering */}
      </div>

      {/* AVATAR DISPLAY */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }} onClick={() => setShowTray(true)}>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '44px', 
            backgroundColor: theme.card, border: `3px solid ${theme.accent}`,
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 20px 40px rgba(0,122,255,0.15)`, cursor: 'pointer'
          }}>
            <img src={currentAvatar.url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ 
            position: 'absolute', bottom: '-5px', right: '-5px', backgroundColor: theme.accent, 
            padding: '10px', borderRadius: '16px', border: `4px solid ${theme.bg}`, color: 'white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <Edit3 size={16} />
          </div>
        </div>
      </div>

      {/* INPUTS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
        <div style={inputGroup}>
          <label style={labelStyle}>DISPLAY NAME</label>
          <input 
            value={profile.full_name} 
            onChange={e => setProfile({...profile, full_name: e.target.value})} 
            style={inputStyle(theme)} 
            placeholder="What should we call you?" 
          />
        </div>
        <div style={inputGroup}>
          <label style={labelStyle}>MATRIC NUMBER</label>
          <input 
            value={profile.matric_no} 
            onChange={e => setProfile({...profile, matric_no: e.target.value})} 
            style={inputStyle(theme)} 
            placeholder="U20XX/0000" 
          />
        </div>
      </div>

      {/* INFO BOX */}
      <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '24px', border: `1px solid ${theme.border}`, display: 'flex', gap: '14px', marginBottom: '35px' }}>
          <AlertCircle size={20} color={theme.accent} style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.5', opacity: 0.7, fontWeight: '600', color: theme.text }}>
              Changing your display name will update your greeting on the Home dashboard instantly.
            </p>
            <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.5', opacity: 0.4, fontWeight: '500', color: theme.text }}>
              Matric numbers are used only for local ID verification.
            </p>
          </div>
      </div>

      <button onClick={handleSave} disabled={loading} style={saveBtn(theme)}>
        {loading ? <Loader2 className="spin" size={20} /> : <Home size={20} />}
        <span style={{ letterSpacing: '0.5px' }}>{loading ? 'SYNCING...' : 'SAVE & RETURN'}</span>
      </button>

      {/* AVATAR TRAY */}
      {showTray && (
        <div 
          style={{...overlayStyle, opacity: isClosing ? 0 : 1, transition: 'opacity 0.3s ease'}} 
          onClick={closeTray}
        >
          <div 
            style={{ 
              ...trayStyle, 
              backgroundColor: theme.card, 
              border: `1px solid ${theme.border}`,
              animation: isClosing ? 'slideDown 0.3s forwards' : 'slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' 
            }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '40px', height: '5px', backgroundColor: theme.border, borderRadius: '10px', margin: '0 auto 20px' }} />
            <div style={trayHeader}>
              <span style={{ fontWeight: '900', fontSize: '14px', letterSpacing: '1px' }}>SELECT CHARACTER</span>
              <button onClick={closeTray} style={{ background: theme.bg, border: 'none', color: theme.text, padding: '8px', borderRadius: '12px', display: 'flex' }}><X size={20} /></button>
            </div>
            
            <div className="hide-scrollbar" style={scrollArea}>
              <div style={iconGrid}>
                {AVATAR_OPTIONS.map(option => (
                  <button 
                    key={option.id}
                    onClick={() => { setProfile({...profile, avatar_id: option.id}); closeTray(); }}
                    style={{
                      ...avatarCircle,
                      borderColor: profile.avatar_id === option.id ? theme.accent : theme.border,
                      backgroundColor: profile.avatar_id === option.id ? `${theme.accent}11` : theme.bg,
                      transform: profile.avatar_id === option.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <img src={option.url} alt="option" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

/* Styles */
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '10px' };
const labelStyle = { fontSize: '10px', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px', marginLeft: '4px' };
const inputStyle = (theme) => ({ 
  width: '100%', padding: '18px', backgroundColor: theme.card, 
  border: `1px solid ${theme.border}`, borderRadius: '20px', 
  color: theme.text, fontWeight: '700', outline: 'none', fontSize: '15px',
  transition: 'border-color 0.2s', boxSizing: 'border-box'
});
const saveBtn = (theme) => ({ 
  width: '100%', backgroundColor: theme.accent, color: 'white', 
  padding: '20px', borderRadius: '22px', border: 'none', 
  fontWeight: '900', fontSize: '14px', display: 'flex', 
  alignItems: 'center', justifyContent: 'center', gap: '12px',
  boxShadow: `0 10px 25px ${theme.accent}33`, cursor: 'pointer'
});
const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' };
const trayStyle = { width: '100%', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', padding: '24px', paddingBottom: '50px', boxSizing: 'border-box' };
const trayHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' };
const scrollArea = { maxHeight: '400px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' };
const iconGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' };
const avatarCircle = { 
  aspectRatio: '1/1', borderRadius: '24px', border: '2px solid', 
  transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', 
  justifyContent: 'center', cursor: 'pointer', padding: 0, outline: 'none'
};

export default EditProfile;