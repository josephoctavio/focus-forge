import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, User, ChevronUp, Loader2, AlertCircle, AlertTriangle, BookOpen, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const CourseManager = ({ setActiveTab, theme, darkMode, courses, loading, refreshData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // UX States
  const [error, setError] = useState(null);
  const [shakeKey, setShakeKey] = useState(0); 
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, title: '', message: '', onConfirm: null
  });

  // Form States
  const [courseName, setCourseName] = useState('');
  const [lecturer, setLecturer] = useState('');
  
  const colorsList = ['#007AFF', '#FF9500', '#34C759', '#5856D6', '#FF2D55', '#AF52DE', '#5AC8FA', '#FFCC00'];

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2500);
  };

  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });
  const showConfirm = (title, message, onConfirm) => setModalConfig({ isOpen: true, title, message, onConfirm });

  const toggleForm = () => {
    if (isFormOpen) {
      setError(null);
      setCourseName('');
      setLecturer('');
    }
    setIsFormOpen(!isFormOpen);
  };

  const triggerError = (msg) => {
    setError(msg);
    setShakeKey(prev => prev + 1); 
  };

  const addCourse = async () => {
    const trimmedName = courseName.trim();
    if (!trimmedName) return triggerError("Course Title is required");
    if (!window.navigator.onLine) return triggerError("No internet connection.");
    if (formLoading) return;

    const exists = courses.some(c => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) return triggerError(`"${trimmedName}" already exists.`);

    setFormLoading(true);
    setError(null);
    const randomColor = colorsList[Math.floor(Math.random() * colorsList.length)];

    const { error: dbError } = await supabase.from('courses').insert([
      { name: trimmedName, color: randomColor, lecturer: lecturer.trim() || null }
    ]);

    if (dbError) {
      triggerError("Failed to save. Try again.");
      setFormLoading(false);
    } else {
      showToast("Course Added");
      setCourseName(''); setLecturer(''); setIsFormOpen(false); setFormLoading(false);
      refreshData(); // Updates the Global Brain
    }
  };

  const deleteCourse = (id) => {
    showConfirm("Delete Course?", "This will also affect assignments linked to this course.", async () => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (!error) {
        showToast("Course Deleted", "delete");
        refreshData();
      }
      closeModal();
    });
  };

  // --- SKELETON UI ---
  const SkeletonItem = () => (
    <div className="skeleton" style={{ height: '75px', borderRadius: '20px', marginBottom: '12px' }} />
  );

  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, paddingBottom: '120px' }}>
      
      {/* TOAST */}
      {toast.show && (
        <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', backgroundColor: toast.type === 'delete' ? '#FF3B30' : '#34C759', color: '#fff', padding: '14px 24px', borderRadius: '50px', zIndex: 10001, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'slideUpToast 0.3s ease-out' }}>
          {toast.type === 'delete' ? <Trash2 size={16}/> : <CheckCircle2 size={16} />}
          {toast.message.toUpperCase()}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {modalConfig.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, padding: '30px', borderRadius: '28px', maxWidth: '340px', width: '100%', textAlign: 'center', animation: 'scaleUp 0.2s ease-out' }}>
            <div style={{ backgroundColor: 'rgba(255,59,48,0.1)', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <AlertTriangle color="#FF3B30" size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '10px' }}>{modalConfig.title}</h3>
            <p style={{ opacity: 0.5, fontSize: '14px', marginBottom: '28px', lineHeight: '1.5' }}>{modalConfig.message}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={closeModal} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: theme.border, color: theme.text, border: 'none', fontWeight: '700' }}>CANCEL</button>
              <button onClick={modalConfig.onConfirm} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: '#FF3B30', color: '#fff', border: 'none', fontWeight: '800' }}>DELETE</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '35px', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setActiveTab('profile')} style={{ background: theme.card, border: `1px solid ${theme.border}`, padding: '10px', borderRadius: '14px', color: theme.text, display: 'flex' }}><ArrowLeft size={20} /></button>
          <h2 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>COURSES</h2>
        </div>
        <button onClick={toggleForm} style={{ backgroundColor: isFormOpen ? theme.card : theme.accent, color: isFormOpen ? theme.text : '#fff', border: isFormOpen ? `1px solid ${theme.border}` : 'none', padding: '10px 18px', borderRadius: '14px', fontWeight: '800', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isFormOpen ? <ChevronUp size={16} /> : <Plus size={16} />}
          {isFormOpen ? 'CLOSE' : 'ADD NEW'}
        </button>
      </div>

      {/* FORM */}
      {isFormOpen && (
        <div 
          key={shakeKey} 
          style={{ backgroundColor: theme.card, padding: '24px', borderRadius: '28px', border: `1px solid ${error ? '#FF3B30' : theme.border}`, marginBottom: '32px', animation: error ? 'shake 0.4s both' : 'fadeIn 0.3s ease', boxShadow: `0 10px 40px rgba(0,0,0,${darkMode ? '0.4' : '0.05'})` }}
        >
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '10px', color: error ? '#FF3B30' : theme.text, opacity: 0.5, fontWeight: '900', marginBottom: '10px', display: 'block', letterSpacing: '1px' }}>COURSE TITLE</label>
            <input 
              type="text" 
              placeholder="e.g. MTH 102" 
              value={courseName} 
              onChange={(e) => { setCourseName(e.target.value); if(error) setError(null); }} 
              style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: theme.bg, border: `1px solid ${error ? '#FF3B30' : theme.border}`, color: theme.text, outline: 'none', fontWeight: '600' }} 
            />
            {error && <div style={{ color: '#FF3B30', fontSize: '11px', fontWeight: '800', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14}/> {error.toUpperCase()}</div>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '10px', color: theme.text, opacity: 0.5, fontWeight: '900', marginBottom: '10px', display: 'block', letterSpacing: '1px' }}>LECTURER (OPTIONAL)</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              <input type="text" placeholder="Dr. Jane Doe" value={lecturer} onChange={(e) => setLecturer(e.target.value)} style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.text, outline: 'none', fontWeight: '600' }} />
            </div>
          </div>
          
          <button onClick={addCourse} disabled={formLoading} style={{ width: '100%', backgroundColor: theme.accent, color: '#fff', padding: '16px', borderRadius: '16px', fontWeight: '900', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px' }}>
            {formLoading ? <Loader2 className="spin" size={18} /> : 'SAVE COURSE'}
          </button>
        </div>
      )}

      {/* LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loading ? (
          [1, 2, 3, 4].map(i => <SkeletonItem key={i} />)
        ) : courses.length === 0 && !isFormOpen ? (
          <div style={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
            <BookOpen size={64} strokeWidth={1} style={{ marginBottom: '16px' }} />
            <p style={{ fontWeight: '800', fontSize: '14px', letterSpacing: '1px' }}>NO COURSES ADDED</p>
          </div>
        ) : (
          courses.map(course => (
            <div key={course.id} style={{ padding: '20px', backgroundColor: theme.card, borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${theme.border}`, animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '6px', height: '40px', backgroundColor: course.color, borderRadius: '10px', boxShadow: `0 0 15px ${course.color}44` }} />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: theme.text, letterSpacing: '-0.3px' }}>{course.name}</div>
                  {course.lecturer && <div style={{ fontSize: '12px', color: theme.text, opacity: 0.4, fontWeight: '600', marginTop: '2px' }}>{course.lecturer}</div>}
                </div>
              </div>
              <button onClick={() => deleteCourse(course.id)} style={{ background: 'rgba(255,59,48,0.05)', border: 'none', color: '#FF3B30', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex' }}><Trash2 size={18} /></button>
            </div>
          ))
        )}
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .skeleton { 
          background: ${darkMode ? '#1A1A1A' : '#E1E1E1'};
          background-image: linear-gradient(90deg, transparent, ${darkMode ? '#222' : '#F0F0F0'}, transparent);
          background-size: 200px 100%;
          background-repeat: no-repeat;
          animation: shimmer 1.5s infinite linear;
        }

        @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUpToast { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  );
};

export default CourseManager;