import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { ChevronLeft, ShieldCheck, Mail, Lock, ShieldAlert } from 'lucide-react';

const PrivacySecurity = ({ onBack, theme }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);

  const triggerTooltip = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email) {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
          // This ensures they go to your live site, not localhost
          redirectTo: `${window.location.origin}/`, 
        });

        if (!error) {
          triggerTooltip();
        } else {
          alert(error.message);
        }
      }
    } catch (err) {
      console.error("Auth Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: theme.bg }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'none', border: 'none', color: theme.text, 
            cursor: 'pointer', padding: '0', marginRight: '15px' 
          }}
        >
          <ChevronLeft size={28} />
        </button>
        <h2 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>Privacy & Security</h2>
      </div>

      {/* SECURITY CARD */}
      <div style={{ 
        backgroundColor: theme.card, 
        borderRadius: '20px', 
        padding: '20px',
        border: `1px solid ${theme.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <ShieldCheck style={{ color: '#34C759', marginRight: '12px' }} />
          <span style={{ fontWeight: '700', fontSize: '18px' }}>Login Protection</span>
        </div>

        <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
          To change your password, we will send a secure magic link to your registered email address.
        </p>

        <button
          onClick={handlePasswordReset}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          <Mail size={20} />
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </div>

      {/* DATA PRIVACY SECTION */}
      <div style={{ marginTop: '30px', padding: '0 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
          <ShieldAlert size={20} style={{ color: '#FF9500' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Data & Privacy</h3>
        </div>
        
        <ul style={{ 
          padding: 0, 
          listStyle: 'none', 
          fontSize: '14px', 
          opacity: 0.8, 
          lineHeight: '2' 
        }}>
          <li>• End-to-end encrypted profile data</li>
          <li>• Secure Supabase authentication</li>
          <li>• No third-party data sharing</li>
          <li>• Instant account data wipe on deletion</li>
        </ul>
      </div>

      {/* TOOLTIP NOTIFICATION */}
      {showTooltip && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#34C759',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '30px',
          fontWeight: '700',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          animation: 'fadeInUp 0.3s ease'
        }}>
          Email Sent! Check your inbox.
        </div>
      )}

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default PrivacySecurity;