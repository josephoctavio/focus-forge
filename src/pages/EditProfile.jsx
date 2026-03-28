import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Home, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { supabase } from '../supabaseClient';

const EditProfile = ({ onBack, theme, profileData, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize state
  const [profile, setProfile] = useState({ 
    full_name: profileData?.full_name || '', 
    matric_no: profileData?.matric_no || ''
  });
  
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    if (profileData) {
      setProfile({
        full_name: profileData.full_name || '',
        matric_no: profileData.matric_no || ''
      });
    }
  }, [profileData]);

  const handleSave = async () => {
    // Validation: Check if name is empty
    if (!profile.full_name.trim()) {
      setError('Name is required');
      return;
    }

    setError(''); // Clear error if validation passes
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error: supabaseError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profile.full_name,
        matric_no: profile.matric_no, 
        updated_at: new Date(),
      });

      if (!supabaseError) {
        setToast({ show: true, message: 'CHANGES SAVED' });
        await refreshData();
        setTimeout(() => {
          setToast({ show: false, message: '' });
          onBack(); 
        }, 1500);
      }
    } catch (e) { 
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Initial logic: updates as user types
  const getInitial = () => {
    return profile.full_name ? profile.full_name.trim().charAt(0).toUpperCase() : '?';
  };

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

      {/* HEADER: Adjusted text size and button positioning */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', paddingTop: '10px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', opacity: 0.9 }}>Profile Settings</h2>
        <button onClick={onBack} style={{ background: theme.card, border: `1px solid ${theme.border}`, padding: '12px', borderRadius: '16px', color: theme.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* INITIAL DISPLAY (Updates Live) */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ 
          width: '120px', height: '120px', borderRadius: '44px', 
          backgroundColor: theme.card, border: `3px solid ${error ? '#FF3B30' : theme.accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 20px 40px rgba(0,122,255,0.1)`, margin: '0 auto',
          transition: 'border-color 0.3s ease'
        }}>
          <span style={{ fontSize: '48px', fontWeight: '900', color: error ? '#FF3B30' : theme.accent }}>
            {getInitial()}
          </span>
        </div>
      </div>

      {/* INPUTS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '30px' }}>
        <div style={inputGroup}>
          <label style={labelStyle}>DISPLAY NAME</label>
          <input 
            value={profile.full_name} 
            onChange={e => {
                setProfile({...profile, full_name: e.target.value});
                if (e.target.value.trim()) setError(''); // Auto-clear error as user types
            }} 
            style={{
                ...inputStyle(theme),
                borderColor: error ? '#FF3B30' : theme.border,
                borderWidth: error ? '1.5px' : '1px'
            }} 
            placeholder="What should we call you?" 
          />
          {error && (
            <span style={{ color: '#FF3B30', fontSize: '11px', fontWeight: '700', marginLeft: '4px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={12} /> {error}
            </span>
          )}
        </div>
        
        <div style={inputGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={labelStyle}>ACCOUNT IDENTIFIER</label>
            <Lock size={10} style={{ opacity: 0.3, marginRight: '4px' }} />
          </div>
          <input 
            value={profile.matric_no} 
            readOnly
            style={{ 
              ...inputStyle(theme), 
              opacity: 0.6, 
              backgroundColor: 'transparent', 
              cursor: 'not-allowed',
              borderStyle: 'dashed' 
            }} 
          />
        </div>
      </div>

      {/* INFO BOX */}
      <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '24px', border: `1px solid ${theme.border}`, display: 'flex', gap: '14px', marginBottom: '35px' }}>
          <AlertCircle size={20} color={theme.accent} style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.5', opacity: 0.7, fontWeight: '600', color: theme.text }}>
              Your Account Identifier is locked to this profile and cannot be changed.
            </p>
            <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.5', opacity: 0.4, fontWeight: '500', color: theme.text }}>
              Updates to your display name will reflect across the app immediately.
            </p>
          </div>
      </div>

      <button onClick={handleSave} disabled={loading} style={saveBtn(theme)}>
        {loading ? <Loader2 className="spin" size={20} /> : <Home size={20} />}
        <span style={{ letterSpacing: '0.5px' }}>{loading ? 'SYNCING...' : 'SAVE CHANGES'}</span>
      </button>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

/* Styles */
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '10px', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px', marginLeft: '4px' };
const inputStyle = (theme) => ({ 
  width: '100%', padding: '18px', backgroundColor: theme.card, 
  border: `1px solid ${theme.border}`, borderRadius: '20px', 
  color: theme.text, fontWeight: '700', outline: 'none', fontSize: '15px',
  transition: 'all 0.2s ease', boxSizing: 'border-box'
});
const saveBtn = (theme) => ({ 
  width: '100%', backgroundColor: theme.accent, color: 'white', 
  padding: '20px', borderRadius: '22px', border: 'none', 
  fontWeight: '900', fontSize: '14px', display: 'flex', 
  alignItems: 'center', justifyContent: 'center', gap: '12px',
  boxShadow: `0 10px 25px ${theme.accent}33`, cursor: 'pointer'
});

export default EditProfile;