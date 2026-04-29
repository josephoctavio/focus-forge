import React, { useEffect, useState } from 'react';
import { ChevronRight, Star, Clock, User, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AdminFeedback = ({ setActiveTab, theme }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    text: theme?.text || '#fff',
    card: theme?.card || '#111111',
    bg: theme?.bg || '#000',
    border: theme?.border || '#222222',
    accent: theme?.accent || '#007AFF',
    muted: theme?.muted || '#888888',
    danger: '#FF3B30'
  };

  const fetchFeedback = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setFeedbacks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this feedback log permanently?")) {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (!error) {
        setFeedbacks(feedbacks.filter(f => f.id !== id));
      } else {
        alert("Error deleting log");
      }
    }
  };

  return (
    <div style={{ padding: '24px', color: colors.text, backgroundColor: colors.bg, minHeight: '100vh' }}>
      {/* Sleeker Header: Title Left, Back Button Right */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '40px', 
        paddingTop: '20px' 
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>
          FEEDBACK LOG
        </h2>
        <button onClick={() => setActiveTab('profile')} style={backButtonStyle(colors)}>
          <ChevronRight size={20} />
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '50px' }}>Loading logs...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {feedbacks.length === 0 && <p style={{ opacity: 0.3, textAlign: 'center' }}>No feedback logs found.</p>}
          {feedbacks.map((f) => (
            <div key={f.id} style={cardStyle(colors)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ padding: '6px', background: `${colors.accent}20`, borderRadius: '8px' }}>
                    <User size={14} color={colors.accent} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '800' }}>{f.user_name.toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < f.rating ? "#FFCC00" : "transparent"} color={i < f.rating ? "#FFCC00" : colors.muted} />
                  ))}
                </div>
              </div>
              
              <p style={{ fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px 0', color: colors.text, opacity: 0.9 }}>
                {f.message}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${colors.border}`, paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.4 }}>
                  <Clock size={12} />
                  <span style={{ fontSize: '11px', fontWeight: '600' }}>
                    {new Date(f.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(f.id)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.muted, padding: '4px' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.danger}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.muted}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const cardStyle = (colors) => ({
  backgroundColor: colors.card,
  padding: '24px',
  borderRadius: '20px',
  border: `1px solid ${colors.border}`,
  transition: 'transform 0.2s ease'
});

const backButtonStyle = (colors) => ({
  background: colors.card, 
  border: `1px solid ${colors.border}`, 
  padding: '12px', 
  borderRadius: '16px', 
  cursor: 'pointer', 
  color: colors.text,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export default AdminFeedback;