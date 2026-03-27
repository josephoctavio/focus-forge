import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Trash2, Clock, MapPin, Edit2, X, AlertTriangle, ChevronDown, CheckCircle2, CalendarDays, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const ScheduleManager = ({ setActiveTab, theme, darkMode, courses, timetable, loading, refreshData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Day Selection Logic
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [activeDay, setActiveDay] = useState(days[new Date().getDay() - 1] || 'Monday');

  // Form States
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  
  // Validation States
  const [errors, setErrors] = useState({ course: false });
  const [shouldShake, setShouldShake] = useState(false);

  // UX States
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2500);
  };

  const handleSave = async () => {
    if (!selectedCourse) {
      setErrors({ course: true });
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }

    setFormLoading(true);
    const payload = { 
      course_id: selectedCourse.id, 
      day_of_week: activeDay, 
      start_time: time || "08:00", 
      location: location.trim() 
    };

    const { error } = editingId 
      ? await supabase.from('timetable').update(payload).eq('id', editingId)
      : await supabase.from('timetable').insert([payload]);

    if (!error) {
      showToast(editingId ? "Schedule Updated" : "Class Added");
      refreshData();
      resetForm();
    }
    setFormLoading(false);
  };

  const confirmDelete = (id, name) => {
    setModalConfig({
      isOpen: true,
      title: "Remove Class?",
      message: `Remove ${name} from your ${activeDay} schedule?`,
      onConfirm: async () => {
        const { error } = await supabase.from('timetable').delete().eq('id', id);
        if (!error) {
          showToast("Class Removed", "delete");
          refreshData();
        }
        setModalConfig({ ...modalConfig, isOpen: false });
      }
    });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setSelectedCourse(courses.find(c => c.id === item.course_id));
    setActiveDay(item.day_of_week);
    setTime(item.start_time);
    setLocation(item.location || '');
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedCourse(null);
    setTime('');
    setLocation('');
    setIsFormOpen(false);
    setIsCourseDropdownOpen(false);
    setIsDayDropdownOpen(false);
    setErrors({ course: false });
  };

  const currentClasses = useMemo(() => 
    timetable.filter(t => t.day_of_week === activeDay),
    [timetable, activeDay]
  );

  const SkeletonItem = () => (
    <div className="skeleton" style={{ height: '85px', borderRadius: '24px', marginBottom: '15px' }} />
  );

  return (
    <div style={{ padding: '24px', backgroundColor: theme.bg, minHeight: '100vh', color: theme.text, paddingBottom: '120px' }}>
      
      {/* TOAST & MODAL */}
      {toast.show && (
        <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', backgroundColor: toast.type === 'delete' ? '#FF3B30' : '#34C759', color: '#fff', padding: '14px 24px', borderRadius: '50px', zIndex: 10001, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'slideUpToast 0.3s ease-out' }}>
          {toast.type === 'delete' ? <Trash2 size={16}/> : <CheckCircle2 size={16} />} {toast.message.toUpperCase()}
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setActiveTab('profile')} style={{ background: theme.card, border: `1px solid ${theme.border}`, padding: '10px', borderRadius: '14px', color: theme.text, display: 'flex' }}><ArrowLeft size={20} /></button>
          <h2 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>TIMETABLE</h2>
        </div>
        <button onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)} style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: isFormOpen ? theme.card : theme.accent, color: '#fff', border: isFormOpen ? `1px solid ${theme.border}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          {isFormOpen ? <X size={22} style={{ color: theme.text }} /> : <Plus size={22} />}
        </button>
      </div>

      {/* DAY PICKER */}
      {!isFormOpen && (
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '24px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {days.map(d => (
            <button key={d} onClick={() => setActiveDay(d)} style={{
              padding: '14px 22px', borderRadius: '18px', border: 'none',
              backgroundColor: activeDay === d ? theme.accent : theme.card,
              color: activeDay === d ? '#fff' : (darkMode ? '#555' : '#888'),
              fontWeight: '800', fontSize: '13px', whiteSpace: 'nowrap',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: activeDay === d ? 'none' : `1px solid ${theme.border}`,
              boxShadow: activeDay === d ? `0 8px 20px ${theme.accent}44` : 'none'
            }}>
              {d.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* FORM */}
      {isFormOpen && (
        <div className={shouldShake ? 'shake' : ''} style={{ backgroundColor: theme.card, padding: '28px', borderRadius: '32px', border: `1px solid ${theme.border}`, marginBottom: '30px', animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ fontSize: '10px', fontWeight: '900', color: theme.accent, letterSpacing: '1.5px', marginBottom: '24px' }}>
            {editingId ? 'MODIFY CLASS' : 'ASSIGN NEW CLASS'}
          </h2>

          <div style={{ marginBottom: '18px', position: 'relative' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', opacity: 0.4, marginBottom: '10px', display: 'block' }}>SELECT COURSE</label>
            <div onClick={() => { setIsCourseDropdownOpen(!isCourseDropdownOpen); setIsDayDropdownOpen(false); }} style={{ padding: '18px', borderRadius: '16px', backgroundColor: theme.bg, border: `1px solid ${errors.course ? '#FF3B30' : theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ fontWeight: '700', opacity: selectedCourse ? 1 : 0.3 }}>{selectedCourse ? selectedCourse.name : 'Choose course...'}</span>
              <ChevronDown size={20} style={{ opacity: 0.4 }} />
            </div>
            {isCourseDropdownOpen && (
              <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '18px', zIndex: 100, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                {courses.map(c => (
                  <div key={c.id} onClick={() => { setSelectedCourse(c); setIsCourseDropdownOpen(false); setErrors({course:false}); }} style={{ padding: '16px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c.color }} />
                    <span style={{ fontWeight: '800', fontSize: '14px' }}>{c.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: '10px', fontWeight: '900', opacity: 0.4, marginBottom: '10px', display: 'block' }}>DAY</label>
              <div onClick={() => { setIsDayDropdownOpen(!isDayDropdownOpen); setIsCourseDropdownOpen(false); }} style={{ padding: '18px', borderRadius: '16px', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>{activeDay.slice(0,3)}</span>
                <ChevronDown size={16} style={{ opacity: 0.4 }} />
              </div>
              {isDayDropdownOpen && (
                <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '18px', zIndex: 100 }}>
                  {days.map(d => (
                    <div key={d} onClick={() => { setActiveDay(d); setIsDayDropdownOpen(false); }} style={{ padding: '14px', borderBottom: `1px solid ${theme.border}`, fontWeight: '800', fontSize: '13px', textAlign: 'center' }}>{d}</div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', opacity: 0.4, marginBottom: '10px', display: 'block' }}>TIME</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: '100%', padding: '18px', borderRadius: '16px', backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, fontWeight: '700', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', opacity: 0.4, marginBottom: '10px', display: 'block' }}>LOCATION</label>
            <input type="text" maxLength={25} placeholder="e.g. Science Lab" value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: '18px', borderRadius: '16px', backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, fontWeight: '700', boxSizing: 'border-box' }} />
          </div>

          <button onClick={handleSave} disabled={formLoading} style={{ width: '100%', padding: '18px', borderRadius: '18px', backgroundColor: theme.accent, color: '#fff', border: 'none', fontWeight: '900', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {formLoading ? <Loader2 className="spin" size={20} /> : (editingId ? 'UPDATE CLASS' : 'CONFIRM CLASS')}
          </button>
        </div>
      )}

      {/* LIST */}
      {!isFormOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            [1, 2, 3].map(i => <SkeletonItem key={i} />)
          ) : currentClasses.length > 0 ? (
            currentClasses.map(item => (
              <div key={item.id} style={{ backgroundColor: theme.card, borderRadius: '28px', border: `1px solid ${theme.border}`, padding: '22px', display: 'flex', alignItems: 'center', gap: '18px', position: 'relative', overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: item.courses?.color, boxShadow: `0 0 15px ${item.courses?.color}66` }} />
                <div style={{ flex: 1, paddingLeft: '6px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '900', color: item.courses?.color, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.courses?.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '900' }}><Clock size={18} color={theme.accent} strokeWidth={2.5} /> {item.start_time.slice(0, 5)}</div>
                    {item.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', opacity: 0.4 }}><MapPin size={16} strokeWidth={2.5} /> {item.location}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => startEdit(item)} style={{ background: theme.bg, border: 'none', color: theme.text, opacity: 0.4, padding: '12px', borderRadius: '14px' }}><Edit2 size={18} /></button>
                  <button onClick={() => confirmDelete(item.id, item.courses?.name)} style={{ background: 'rgba(255,59,48,0.1)', border: 'none', color: '#FF3B30', padding: '12px', borderRadius: '14px' }}><Trash2 size={18} /></button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ height: '45vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.15 }}>
              <CalendarDays size={72} strokeWidth={1} style={{ marginBottom: '16px' }} />
              <p style={{ fontWeight: '900', fontSize: '13px', letterSpacing: '2px' }}>FREE DAY</p>
            </div>
          )}
        </div>
      )}

      {modalConfig.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, padding: '32px', borderRadius: '32px', maxWidth: '340px', width: '100%', textAlign: 'center', border: `1px solid ${theme.border}`, animation: 'scaleUp 0.2s ease' }}>
            <AlertTriangle color="#FF3B30" size={36} style={{ marginBottom: '18px' }}/>
            <h3 style={{ fontWeight: '900', fontSize: '20px', marginBottom: '10px' }}>{modalConfig.title}</h3>
            <p style={{ opacity: 0.5, fontSize: '14px', lineHeight: '1.6', marginBottom: '28px' }}>{modalConfig.message}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: theme.border, color: theme.text, border: 'none', fontWeight: '800' }}>CANCEL</button>
              <button onClick={modalConfig.onConfirm} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: '#FF3B30', color: '#fff', border: 'none', fontWeight: '800' }}>REMOVE</button>
            </div>
          </div>
        </div>
      )}

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
        .shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUpToast { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  );
};

export default ScheduleManager;