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
  ShieldAlert,
  AlertCircle
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
  const [inlineError, setInlineError] = useState(''); // New custom error state

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
    setInlineError('');
    
    // Custom Validation Checks
    if (!newPassword || newPassword.length < 8) {
      setInlineError("Password must be at least 8 characters.");
      return;
    }

    setUpdateLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      // Handle the "Same as old password" error specifically
      if (error.message.toLowerCase().includes("new password should be different")) {
        setInlineError("You can't use your current password as the new one.");
      } else {
        setInlineError(error.message);
      }
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
    } else {
      triggerTooltip();
      setNewPassword(''); 
      setShowNewPassword(false);
      setInlineError('');
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
        await Promise.all([
          supabase.from('assignments').delete().eq('user_id', user.id),
          supabase.from('courses').delete().eq('user_id', user.id),
          supabase.from('timetable').delete().eq('user_id', user.id),
          supabase.from('profiles').update({ 
            theme_color: '#007AFF', 
            dark_mode: true 
          }).eq('id', user.id)
        ]);
        window.location.reload();
      }

    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '24px', color: theme.text, backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* SUCCESS TOOLTIP */}
      <div style={{
        position: 'fixed', bottom: '40px', left: '50%', 
        transform: `translateX(-50%) translateY(${showTooltip ? '0' : '100px'})`,
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
                {modalType === 'delete' && "This will erase all your data permanently. This action cannot be undone."}
                {modalType === 'reset' && "All your courses, tasks and schedule will be wiped, and your app will reset back to default."}
                {modalType === 'logout' && "Ready to head out? You'll need to sign back in to access your forge."}
            </p>
            
            {modalType !== 'logout' && (
              <input 
                type="password" 
                placeholder="Enter current password"
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
        <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Privacy & Security</h1>
      </div>

      {/* SECTION: PASSWORD */}
      <h3 style={sectionLabelStyle(theme.accent)}>Authentication</h3>
      
      <div className={shouldShake ? 'shake-element' : ''} style={{ backgroundColor: theme.card, border: `1px solid ${inlineError ? theme.danger : theme.border}`, borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: `${theme.accent}15`, padding: '12px', borderRadius: '14px' }}>
            <Lock size={20} color={theme.accent} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: '800', fontSize: '16px' }}>Update Password</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.4 }}>Choose a strong, unique key</p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <input 
            type={showNewPassword ? "text" : "password"}
            placeholder="Set new password"
            value={newPassword}
            onChange={(e) => {setNewPassword(e.target.value); setInlineError('');}}
            style={{ width: '100%', padding: '18px', paddingRight: '100px', borderRadius: '18px', backgroundColor: theme.bg, border: `1px solid ${inlineError ? theme.danger + '40' : theme.border}`, color: theme.text, outline: 'none', fontSize: '15px', fontWeight: '600' }}
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

        {inlineError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.danger }}>
            <AlertCircle size={14} />
            <span style={{ fontSize: '12px', fontWeight: '700' }}>{inlineError}</span>
          </div>
        )}
      </div>

      {/* SECTION: SESSIONS */}
      <h3 style={sectionLabelStyle(theme.text)}>Sessions</h3>
      <SecurityRow icon={<LogOut size={18} color={theme.text} />} label="Sign Out" desc="Log out of the current session" onClick={() => setModalType('logout')} theme={theme} />

      {/* DANGER ZONE */}
      <h3 style={sectionLabelStyle(theme.danger)}>Danger Zone</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SecurityRow icon={<RefreshCw size={18} color="#FF9500" />} label="Nuclear Reset" desc="Wipe all app data & settings" onClick={() => setModalType('reset')} theme={theme} />
        <SecurityRow icon={<Trash2 size={18} color={theme.danger} />} label="Delete Account" desc="Permanent account destruction" onClick={() => setModalType('delete')} theme={theme} />
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .shake-element { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        .security-btn { transition: all 0.2s ease; }
        .security-btn:active { transform: scale(0.98); opacity: 0.9; }
      `}</style>
    </div>
  );
};

const sectionLabelStyle = (color) => ({
    fontSize: '11px', 
    fontWeight: '900', 
    color: color, 
    textTransform: 'uppercase', 
    letterSpacing: '2px', 
    margin: '35px 0 15px 10px',
    opacity: 0.8
});

const SecurityRow = ({ icon, label, desc, onClick, theme }) => (
  <button className="security-btn" onClick={onClick} style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '20px', backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '24px', gap: '16px', textAlign: 'left', cursor: 'pointer', color: theme.text, marginBottom: '8px' }}>
    <div style={{ backgroundColor: `${theme.text}08`, padding: '12px', borderRadius: '14px', border: `1px solid ${theme.border}` }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontWeight: '800', fontSize: '15px' }}>{label}</p>
      <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.4, fontWeight: '500' }}>{desc}</p>
    </div>
  </button>
);

export default PrivacySecurity;