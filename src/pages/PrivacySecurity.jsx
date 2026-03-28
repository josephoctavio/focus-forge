import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Trash2, 
  LogOut,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  ShieldAlert
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const PrivacySecurity = ({ onBack, theme }) => {
  const [modalType, setModalType] = useState(null); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldShake, setShouldShake] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const tooltipTimeout = useRef(null);

  useEffect(() => {
    return () => { if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current); };
  }, []);

  const triggerTooltip = () => {
    setShowTooltip(true);
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 3000);
  };

  const handleInternalPasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    
    setUpdateLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

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
    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (modalType === 'logout') {
        await supabase.auth.signOut();
        window.location.reload();
        return;
      }

      // 1. RE-AUTHENTICATION
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: confirmPassword,
      });

      if (authError) {
        setShouldShake(true);
        setErrorMessage("Verification failed. Please check your password.");
        setTimeout(() => setShouldShake(false), 500);
        setIsProcessing(false);
        return;
      }

      // 2. DATA WIPING LOGIC
      if (modalType === 'delete') {
        await Promise.all([
          supabase.from('assignments').delete().eq('user_id', user.id),
          supabase.from('courses').delete().eq('user_id', user.id),
          supabase.from('timetable').delete().eq('user_id', user.id),
          supabase.from('profiles').delete().eq('id', user.id)
        ]);
        await supabase.auth.signOut();
        window.location.reload();
      } 
      
      else if (modalType === 'reset') {
        // WIPES DATA + RESETS THEME TO DEFAULT BLUE & DARK MODE
        await Promise.all([
          supabase.from('assignments').delete().eq('user_id', user.id),
          supabase.from('courses').delete().eq('user_id', user.id),
          supabase.from('timetable').delete().eq('user_id', user.id),
          supabase.from('profiles').update({ 
            theme_color: '#007AFF', 
            dark_mode: true 
          }).eq('id', user.id)
        ]);
        window.location.reload(); // Reload to apply factory settings
      }

    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '24px', color: theme.text, backgroundColor: theme.bg, minHeight: '100vh' }}>
      
      {/* SUCCESS TOOLTIP */}
      <div style={{
        position: 'fixed', bottom: '110px', left: '50%', 
        transform: `translateX(-50%) translateY(${showTooltip ? '0' : '50px'})`,
        opacity: showTooltip ? 1 : 0,
        backgroundColor: theme.card, border: `1px solid ${theme.border}`, 
        padding: '14px 28px', borderRadius: '50px',
        display: 'flex', alignItems: 'center', gap: '12px', zIndex: 11000, 
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <div style={{ background: '#34C759', borderRadius: '50%', padding: '4px' }}>
          <Check size={14} color="#fff" />
        </div>
        <span style={{ fontSize: '14px', fontWeight: '800' }}>Security Updated</span>
      </div>

      {/* MODAL SYSTEM */}
      {modalType && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div className={shouldShake ? 'shake-element' : ''} style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, padding: '32px', borderRadius: '32px', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
                {modalType === 'delete' && <ShieldAlert size={40} color={theme.danger} style={{ margin: '0 auto' }} />}
                {modalType === 'reset' && <RefreshCw size={40} color="#FF9500" style={{ margin: '0 auto' }} />}
                {modalType === 'logout' && <LogOut size={40} color={theme.text} style={{ margin: '0 auto' }} />}
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '12px' }}>
                {modalType === 'delete' ? 'Delete Account?' : modalType === 'reset' ? 'Nuclear Reset?' : 'Sign Out?'}
            </h2>
            <p style={{ fontSize: '14px', opacity: 0.5, lineHeight: '1.6', marginBottom: '28px' }}>
                {modalType === 'delete' && "Everything—courses, tasks, and your profile—will be erased forever. This cannot be undone."}
                {modalType === 'reset' && "All your courses and tasks will be wiped, and your theme will reset to default blue."}
                {modalType === 'logout' && "Ready to head out? You'll need to sign back in to access your flow."}
            </p>
            
            {modalType !== 'logout' && (
              <input 
                type="password" 
                placeholder="Enter password to verify"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '18px', borderRadius: '18px', backgroundColor: theme.bg, border: `1px solid ${errorMessage ? theme.danger : theme.border}`, color: theme.text, textAlign: 'center', marginBottom: '12px', outline: 'none', fontWeight: '600' }}
              />
            )}
            
            {errorMessage && <p style={{ color: theme.danger, fontSize: '12px', fontWeight: '700', marginBottom: '15px' }}>{errorMessage}</p>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={handleAction} disabled={isProcessing} style={{ padding: '18px', borderRadius: '18px', background: modalType === 'delete' ? theme.danger : theme.text, color: modalType === 'delete' ? '#fff' : theme.bg, border: 'none', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px' }}>
                    {isProcessing ? 'VERIFYING...' : 'PROCEED'}
                </button>
                <button onClick={() => { setModalType(null); setConfirmPassword(''); setErrorMessage(''); }} style={{ padding: '12px', color: theme.text, background: 'transparent', border: 'none', fontWeight: '700', opacity: 0.4, fontSize: '13px' }}>
                    CANCEL
                </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px', paddingTop: '10px' }}>
        <button onClick={onBack} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '12px', color: theme.text, cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>Privacy & Security</h1>
      </div>

      {/* SECTION: PASSWORD */}
      <h3 style={{ fontSize: '11px', fontWeight: '900', color: theme.accent, textTransform: 'uppercase', letterSpacing: '2px', margin: '25px 0 15px 10px' }}>Authentication</h3>
      
      <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: `${theme.accent}15`, padding: '12px', borderRadius: '14px' }}>
            <Lock size={20} color={theme.accent} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: '800', fontSize: '16px' }}>Security Key</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.4 }}>Update your login credentials</p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <input 
            type={showNewPassword ? "text" : "password"}
            placeholder="Set new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: '100%', padding: '18px', paddingRight: '100px', borderRadius: '18px', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.text, outline: 'none', fontSize: '15px', fontWeight: '600' }}
          />
          <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button 
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{ background: 'transparent', border: 'none', padding: '10px', opacity: 0.4, cursor: 'pointer' }}
            >
                {showNewPassword ? <EyeOff size={18} color={theme.text} /> : <Eye size={18} color={theme.text} />}
            </button>
            <button 
                onClick={handleInternalPasswordChange}
                disabled={updateLoading || !newPassword}
                style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '900', fontSize: '11px', opacity: !newPassword ? 0.3 : 1, cursor: 'pointer' }}
            >
                {updateLoading ? '...' : 'SAVE'}
            </button>
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <h3 style={{ fontSize: '11px', fontWeight: '900', color: theme.danger, textTransform: 'uppercase', letterSpacing: '2px', margin: '40px 0 15px 10px' }}>Danger Zone</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SecurityRow icon={<LogOut size={18} color={theme.text} />} label="Sign Out" desc="Log out of all sessions" onClick={() => setModalType('logout')} theme={theme} />
        <SecurityRow icon={<RefreshCw size={18} color="#FF9500" />} label="Nuclear Reset" desc="Wipe courses & tasks + Default theme" onClick={() => setModalType('reset')} theme={theme} />
        <SecurityRow icon={<Trash2 size={18} color={theme.danger} />} label="Delete Account" desc="Permanent data destruction" onClick={() => setModalType('delete')} theme={theme} />
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .shake-element { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        .security-btn { transition: all 0.2s ease; }
        .security-btn:active { transform: scale(0.96); opacity: 0.8; }
      `}</style>
    </div>
  );
};

const SecurityRow = ({ icon, label, desc, onClick, theme }) => (
  <button className="security-btn" onClick={onClick} style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '20px', backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '24px', gap: '16px', textAlign: 'left', cursor: 'pointer', color: theme.text }}>
    <div style={{ backgroundColor: `${theme.text}05`, padding: '12px', borderRadius: '14px', border: `1px solid ${theme.border}` }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontWeight: '800', fontSize: '15px' }}>{label}</p>
      <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.4, fontWeight: '500' }}>{desc}</p>
    </div>
  </button>
);

export default PrivacySecurity;