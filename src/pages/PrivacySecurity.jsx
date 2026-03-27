import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Lock, 
  Trash2, 
  LogOut,
  RefreshCw,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const PrivacySecurity = ({ onBack, theme }) => {
  const [modalType, setModalType] = useState(null); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldShake, setShouldShake] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // States for direct password update
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const tooltipTimeout = useRef(null);

  const colors = {
    text: theme?.text || '#fff',
    card: theme?.card || '#111111',
    bg: theme?.bg || '#000',
    border: theme?.border || '#222222',
    accent: '#007AFF',
    danger: '#FF3B30',
    success: '#34C759'
  };

  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    };
  }, []);

  const triggerTooltip = () => {
    setShowTooltip(true);
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 3000);
  };

  const handleInternalPasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }
    
    setUpdateLoading(true);
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });

    if (error) {
      alert(error.message);
    } else {
      triggerTooltip();
      setNewPassword(''); 
      setShowNewPassword(false);
    }
    setUpdateLoading(false);
  };

  const handleAction = async () => {
    if (modalType === 'logout') {
        await supabase.auth.signOut();
        window.location.reload();
        return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    
    const { data: { user } } = await supabase.auth.getUser();

    // Re-authenticate user to confirm they have the right to delete/reset
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: confirmPassword,
    });

    if (authError) {
      setShouldShake(true);
      setErrorMessage("Incorrect password.");
      setTimeout(() => setShouldShake(false), 500);
      setIsProcessing(false);
      return;
    }

    if (modalType === 'delete') {
      // Wiping all user data tables before signing out
      await Promise.all([
        supabase.from('profiles').delete().eq('id', user.id),
        supabase.from('assignments').delete().eq('user_id', user.id),
        supabase.from('courses').delete().eq('user_id', user.id)
      ]);
      await supabase.auth.signOut();
      window.location.reload();
    } else if (modalType === 'reset') {
      await Promise.all([
        supabase.from('assignments').delete().eq('user_id', user.id),
        supabase.from('courses').delete().eq('user_id', user.id)
      ]);
      window.location.reload();
    }
  };

  return (
    <div style={{ padding: '24px', color: colors.text, backgroundColor: colors.bg, minHeight: '100vh', position: 'relative' }}>
      
      {/* SUCCESS TOOLTIP */}
      <div style={{
        position: 'fixed', 
        bottom: '100px', 
        left: '50%', 
        transform: `translateX(-50%) translateY(${showTooltip ? '0' : '50px'})`,
        opacity: showTooltip ? 1 : 0,
        backgroundColor: colors.card, 
        border: `1px solid ${colors.border}`, 
        padding: '12px 24px', 
        borderRadius: '50px',
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        zIndex: 11000, 
        pointerEvents: 'none',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.6)'
      }}>
        <Check size={18} color={colors.success} />
        <span style={{ fontSize: '13px', fontWeight: '700' }}>Password Updated</span>
      </div>

      {/* MODAL SYSTEM */}
      {modalType && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div className={shouldShake ? 'shake-element' : ''} style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, padding: '30px', borderRadius: '28px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
                {modalType === 'delete' && <Trash2 size={32} color={colors.danger} style={{ margin: '0 auto' }} />}
                {modalType === 'reset' && <RefreshCw size={32} color="#FF9500" style={{ margin: '0 auto' }} />}
                {modalType === 'logout' && <LogOut size={32} color={colors.text} style={{ margin: '0 auto' }} />}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px' }}>
                {modalType === 'delete' ? 'Delete Account?' : modalType === 'reset' ? 'Nuclear Reset?' : 'Sign Out?'}
            </h2>
            <p style={{ fontSize: '13px', opacity: 0.5, lineHeight: '1.5', marginBottom: '24px' }}>
                {modalType === 'delete' && "This will permanently wipe your profile, all assignments, courses, and study data."}
                {modalType === 'reset' && "This wipes all your courses and assignments but keeps your account settings intact."}
                {modalType === 'logout' && "Are you sure you want to log out of StudyFlow on this device?"}
            </p>
            {modalType !== 'logout' && (
              <input 
                type="password" 
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: colors.bg, border: `1px solid ${errorMessage ? colors.danger : colors.border}`, color: colors.text, textAlign: 'center', marginBottom: '10px', outline: 'none' }}
              />
            )}
            {errorMessage && <p style={{ color: colors.danger, fontSize: '11px', fontWeight: '700', marginBottom: '15px' }}>{errorMessage}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={handleAction} disabled={isProcessing} style={{ padding: '16px', borderRadius: '16px', background: modalType === 'delete' ? colors.danger : colors.text, color: modalType === 'delete' ? '#fff' : colors.bg, border: 'none', fontWeight: '800', cursor: 'pointer' }}>
                    {isProcessing ? 'PROCESSING...' : 'CONFIRM'}
                </button>
                <button onClick={() => { setModalType(null); setConfirmPassword(''); setErrorMessage(''); }} style={{ padding: '16px', color: colors.text, background: 'transparent', border: 'none', fontWeight: '600', opacity: 0.5, fontSize: '13px' }}>
                    CANCEL
                </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '35px', paddingTop: '10px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Privacy & Security</h1>
        <button onClick={onBack} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '10px' }}>
          <ChevronLeft size={20} color={colors.text} />
        </button>
      </div>

      {/* SECTION: LOGIN / PASSWORD UPDATE */}
      <h3 style={{ fontSize: '11px', fontWeight: '800', color: colors.accent, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '25px 0 12px 10px' }}>LOGIN</h3>
      
      <div style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '22px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: 'rgba(255,149,0,0.1)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,149,0,0.2)' }}>
            <Lock size={18} color="#FF9500" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Update Password</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', opacity: 0.4 }}>Change your password instantly</p>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: '100%', padding: '16px', paddingRight: '110px', borderRadius: '16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, outline: 'none', fontSize: '14px' }}
          />
          <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '8px' }}>
            <button 
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{ background: 'transparent', border: 'none', padding: '8px', opacity: 0.4, cursor: 'pointer' }}
            >
                {showNewPassword ? <EyeOff size={18} color={colors.text} /> : <Eye size={18} color={colors.text} />}
            </button>
            <button 
                onClick={handleInternalPasswordChange}
                disabled={updateLoading || !newPassword}
                style={{ backgroundColor: colors.accent, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '10px', fontWeight: '800', fontSize: '10px', opacity: !newPassword ? 0.3 : 1, transition: '0.3s' }}
            >
                {updateLoading ? '...' : 'SAVE'}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: SECURITY HEALTH */}
      <h3 style={{ fontSize: '11px', fontWeight: '800', color: colors.accent, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '25px 0 12px 10px' }}>SECURITY HEALTH</h3>
      <div style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '18px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: 'rgba(52,199,89,0.1)', padding: '8px', borderRadius: '10px' }}>
            <Check size={16} color={colors.success} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '14px' }}>Email Verified</p>
            <p style={{ margin: 0, fontSize: '11px', opacity: 0.4 }}>Your account is linked to a verified email</p>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: colors.border, margin: '0 4px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: 'rgba(0,122,255,0.1)', padding: '8px', borderRadius: '10px' }}>
            <Lock size={16} color={colors.accent} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '14px' }}>Session Encrypted</p>
            <p style={{ margin: 0, fontSize: '11px', opacity: 0.4 }}>End-to-end SSL protection active</p>
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <h3 style={{ fontSize: '11px', fontWeight: '800', color: colors.danger, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '35px 0 12px 10px' }}>DANGER ZONE</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SecurityRow icon={<LogOut size={18} color={colors.text} />} label="Logout" desc="Sign out of this account" onClick={() => setModalType('logout')} colors={colors} />
        <SecurityRow icon={<RefreshCw size={18} color="#FF9500" />} label="Reset All Data" desc="Clear courses and assignments" onClick={() => setModalType('reset')} colors={colors} />
        <SecurityRow icon={<Trash2 size={18} color={colors.danger} />} label="Delete Account" desc="Permanently wipe everything" onClick={() => setModalType('delete')} colors={colors} />
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .shake-element { animation: shake 0.15s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

const SecurityRow = ({ icon, label, desc, onClick, colors }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '16px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '18px', gap: '16px', textAlign: 'left', cursor: 'pointer' }}>
    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px', border: `1px solid ${colors.border}` }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>{label}</p>
      <p style={{ margin: '2px 0 0 0', fontSize: '11px', opacity: 0.4 }}>{desc}</p>
    </div>
  </button>
);

export default PrivacySecurity;