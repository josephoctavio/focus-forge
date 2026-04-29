import React, { useState } from 'react';
import { ArrowLeft, BookPlus, CalendarDays, CheckCircle2, Rocket, Sparkles } from 'lucide-react';

const Tutorial = ({ theme, setActiveTab }) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const steps = [
    {
      title: "1. Add Courses",
      description: "Your courses are the foundation. Add them first so the Forge can track your specific subjects and credits.",
      icon: <BookPlus size={24} color={theme.accent} />,
      actionLabel: "GO TO COURSES",
      action: () => setActiveTab('course-manager'),
      stepColor: theme.accent,
      delay: '0.1s'
    },
    {
      title: "2. Set Schedule",
      description: "Map your weekly classes and labs. A clear visual schedule ensures you never miss a session or a deadline.",
      icon: <CalendarDays size={24} color="#FF9500" />,
      actionLabel: "OPEN SCHEDULE",
      action: () => setActiveTab('schedule-manager'),
      stepColor: "#FF9500",
      delay: '0.25s'
    },
    {
      title: "3. Track Tasks",
      description: "Log your assignments and projects. Watching your productivity score grow is the ultimate motivation.",
      icon: <CheckCircle2 size={24} color="#34C759" />,
      actionLabel: "VIEW TASKS",
      action: () => setActiveTab('tasks'),
      stepColor: "#34C759",
      delay: '0.4s'
    }
  ];

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setActiveTab('home');
    }, 400); // Small delay for the animation to play
  };

  return (
    <div style={{ 
      position: 'relative',
      padding: '24px', 
      minHeight: '100vh', 
      backgroundColor: theme.bg, 
      color: theme.text,
      paddingBottom: '80px',
      overflow: 'hidden' 
    }}>
      
      {/* AMBIENT BACKGROUND ANIMATIONS */}
      <div className="ambient-blob" style={{ background: theme.accent, top: '-10%', left: '-10%' }} />
      <div className="ambient-blob" style={{ background: '#FF9500', bottom: '10%', right: '-10%', animationDelay: '-5s' }} />
      <div className="ambient-blob" style={{ background: '#AF52DE', top: '40%', left: '50%', animationDelay: '-10s' }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Header */}
        <header className="fade-in-down" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', paddingTop: '10px' }}>
          <button onClick={() => setActiveTab('profile')} style={backButtonStyle(theme)}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ textAlign: 'right' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>TUTORIAL</h1>
            <p style={{ fontSize: '10px', fontWeight: '900', opacity: 0.5, margin: 0, letterSpacing: '1px' }}>FORGE GUIDE</p>
          </div>
        </header>

        {/* Hero Section */}
        <div className="fade-in-up" style={{ marginBottom: '50px', textAlign: 'center', padding: '0 10px' }}>
          <div className="float-slow" style={{ display: 'inline-flex', padding: '16px', background: `${theme.accent}15`, borderRadius: '24px', marginBottom: '20px', border: `1px solid ${theme.accent}30` }}>
            <Sparkles color={theme.accent} size={32} />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 12px 0', letterSpacing: '-1px' }}>
            Master the Forge
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.6, lineHeight: '1.6', margin: '0 auto', maxWidth: '300px', fontWeight: '500' }}>
            Transform your academic chaos into a focused strategy with these three core steps.
          </p>
        </div>

        {/* Steps with Glowing Timeline */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div className="pulse-glow" style={{ 
            position: 'absolute', left: '33px', top: '30px', bottom: '80px', 
            width: '2px', background: `linear-gradient(to bottom, ${theme.accent}, #FF9500, #34C759)`, 
            opacity: 0.5, zIndex: 0, borderRadius: '2px'
          }} />

          {steps.map((step, index) => (
            <div key={index} className="staggered-card" style={{ animationDelay: step.delay, position: 'relative', zIndex: 1, display: 'flex', gap: '20px' }}>
              
              <div className="float-medium" style={{ animationDelay: step.delay, ...iconCircleStyle(theme, step.stepColor) }}>
                {step.icon}
              </div>

              <div style={cardStyle(theme)}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px' }}>{step.title}</h3>
                <p style={{ fontSize: '13px', opacity: 0.6, lineHeight: '1.5', marginBottom: '18px', fontWeight: '500' }}>{step.description}</p>
                
                <button onClick={step.action} style={actionButtonStyle(theme, step.stepColor)}>
                  {step.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Start Button with Launch Effect */}
        <div className="fade-in-up" style={{ marginTop: '50px', animationDelay: '0.6s', animationFillMode: 'both' }}>
          <button 
            onClick={handleLaunch} 
            className={isLaunching ? 'launch-btn' : ''}
            style={primaryButtonStyle(theme, isLaunching)}
          >
            <Rocket size={20} className={isLaunching ? 'rocket-fly' : 'float-fast'} />
            {isLaunching ? 'LAUNCHING...' : 'START FORGING'}
          </button>
        </div>
      </div>

      <style>{`
        .ambient-blob {
          position: absolute; width: 300px; height: 300px; border-radius: 50%;
          filter: blur(100px); opacity: 0.15; animation: orbit 20s linear infinite;
          z-index: 0; pointer-events: none;
        }

        .float-slow { animation: float 6s ease-in-out infinite; }
        .float-medium { animation: float 4s ease-in-out infinite; }
        .float-fast { animation: float 2.5s ease-in-out infinite; }

        .fade-in-down { animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .staggered-card { 
          opacity: 0; transform: translateY(20px) scale(0.95);
          animation: cardPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
        }

        .pulse-glow { animation: pulseOpacity 3s ease-in-out infinite; }

        /* Launch Animation */
        .launch-btn {
          transform: scale(0.9) !important;
          box-shadow: 0 0 40px ${theme.accent} !important;
          transition: all 0.2s ease !important;
        }
        
        .rocket-fly {
          animation: rocketLaunch 0.4s ease-out forwards;
        }

        @keyframes rocketLaunch {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
        }

        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardPop {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

const backButtonStyle = (theme) => ({
  background: theme.card, border: `1px solid ${theme.border}`, 
  color: theme.text, cursor: 'pointer', padding: '12px', borderRadius: '16px',
  display: 'flex', alignItems: 'center', zIndex: 10
});

const iconCircleStyle = (theme, color) => ({
  width: '68px', height: '68px', minWidth: '68px', borderRadius: '24px',
  backgroundColor: theme.bg, border: `2px solid ${color}40`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: `0 8px 24px ${color}15`, zIndex: 2
});

const cardStyle = (theme) => ({
  backgroundColor: theme.card, padding: '24px', borderRadius: '28px',
  border: `1px solid ${theme.border}`, flex: 1, boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'
});

const actionButtonStyle = (theme, color) => ({
  padding: '12px 18px', borderRadius: '14px', backgroundColor: `${color}15`,
  color: color, fontWeight: '800', fontSize: '11px', letterSpacing: '0.5px',
  border: `1px solid ${color}30`, cursor: 'pointer'
});

const primaryButtonStyle = (theme, isLaunching) => ({
  width: '100%', padding: '22px', borderRadius: '24px',
  backgroundColor: theme.text, color: theme.bg,
  fontWeight: '900', fontSize: '14px', letterSpacing: '1px',
  border: 'none', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center', gap: '12px',
  boxShadow: `0 15px 35px rgba(0,0,0,0.2)`,
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
});

export default Tutorial;