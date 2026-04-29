import React, { useState } from 'react';
import { ChevronLeft, MessageCircle, Mail, Lightbulb, ChevronDown, ChevronUp, X } from 'lucide-react';

const HelpCenter = ({ theme, setActiveTab }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Sample FAQs - Feel free to edit these to match your app's actual features
  const faqs = [
    {
      q: "How do I add a new course?",
      a: "Navigate to the Course Manager tab from the Profile page and tap the 'Add Course' button to set up your subjects."
    },
    {
      q: "Can I use Focus Forge offline?",
      a: "Focus Forge requires an internet connection to keep your data synced and secure in the cloud. However, you can still view your cached tasks and schedules while offline; any new changes will sync once you're back online. 🛜"
    },
    {
      q: "How do I change my theme or accent color?",
      a: "Head over to the Settings page. From there, you can toggle Dark Mode and choose your preferred accent color."
    },
        {
      q: "How can i support ?", 
      a: "We appreciate the support! You can help us grow by sharing the app with friends, leaving feedback to help us improve, or choosing to contribute financially. Every bit helps keep the project running and accessible to everyone. 💓"
    },
    {
      q: "Is Focus Forge free to use ?",
      a: "Yes, Focus Forge is completely free! You have full access to every feature without any hidden fees or paywalls. Financial support is entirely optional and goes toward keeping the project running."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', animation: 'fadeIn 0.4s ease' }}>
      
      {/* Header Area */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px' 
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '0' }}>Help Center</h1>
          <p style={{ color: theme.muted, fontSize: '14px', marginTop: '4px' }}>How can we help you today?</p>
        </div>
        
        {/* Back Button Aligned to the Right */}
        <button 
          onClick={() => setActiveTab('profile')} // Or wherever it should go back to (e.g., 'config')
          style={{ 
            backgroundColor: theme.card, 
            border: `1px solid ${theme.border}`, 
            color: theme.text, 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer' 
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Direct Support Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Direct Support</h2>
        <p style={{ color: theme.muted, fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>
          Contact us about ideas or feedback, we really appreciate it! We're here to help you get the most out of Focus Forge.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* WhatsApp Card */}
          <a 
            href="https://wa.me/2349129403453" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '16px', 
              backgroundColor: theme.card, padding: '16px', borderRadius: '16px', 
              border: `1px solid ${theme.border}`, textDecoration: 'none', color: theme.text,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div style={{ backgroundColor: '#25D36622', padding: '12px', borderRadius: '12px' }}>
              <MessageCircle size={24} color="#25D366" />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>Chat on WhatsApp</h3>
              <p style={{ margin: 0, color: theme.muted, fontSize: '13px' }}>+234 912 940 3453</p>
            </div>
          </a>

          {/* Email Card */}
          <a 
            href="mailto:deltrynstudios@gmail.com?subject=Focus%20Forge%20Support"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '16px', 
              backgroundColor: theme.card, padding: '16px', borderRadius: '16px', 
              border: `1px solid ${theme.border}`, textDecoration: 'none', color: theme.text,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div style={{ backgroundColor: `${theme.accent}22`, padding: '12px', borderRadius: '12px' }}>
              <Mail size={24} color={theme.accent} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>Email Us</h3>
              <p style={{ margin: 0, color: theme.muted, fontSize: '13px' }}>deltrynstudios@gmail.com</p>
            </div>
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{ 
                backgroundColor: theme.card, 
                border: `1px solid ${theme.border}`, 
                borderRadius: '16px', 
                overflow: 'hidden' 
              }}
            >
              <button 
                onClick={() => toggleFaq(index)}
                style={{ 
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '16px', backgroundColor: 'transparent', border: 'none', 
                  color: theme.text, textAlign: 'left', cursor: 'pointer', fontWeight: '600', fontSize: '15px'
                }}
              >
                {faq.q}
                {openFaqIndex === index ? <ChevronUp size={20} color={theme.muted} /> : <ChevronDown size={20} color={theme.muted} />}
              </button>
              
              {openFaqIndex === index && (
                <div style={{ padding: '0 16px 16px 16px', color: theme.muted, fontSize: '14px', lineHeight: '1.6' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Idea Suggestion / Missing Feature Section */}
      <div style={{ 
        backgroundColor: `${theme.accent}11`, 
        border: `1px dashed ${theme.accent}55`, 
        borderRadius: '20px', 
        padding: '24px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ backgroundColor: theme.card, padding: '12px', borderRadius: '50%', marginBottom: '16px', display: 'inline-block' }}>
          <Lightbulb size={28} color={theme.accent} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0' }}>Missing a feature?</h2>
        <p style={{ color: theme.muted, fontSize: '14px', lineHeight: '1.5', margin: '0 0 20px 0', maxWidth: '250px' }}>
          Have an idea that could make Focus Forge even better? We'd love to hear it!
        </p>
        <a 
          href="mailto:deltrynstudios@gmail.com?subject=Idea%20suggestion"
          style={{ 
            backgroundColor: theme.accent, 
            color: '#FFFFFF', 
            padding: '14px 24px', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            fontWeight: '700', 
            fontSize: '15px',
            display: 'inline-block',
            width: '100%',
            maxWidth: '200px'
          }}
        >
          Suggest an Idea
        </a>
      </div>

    </div>
  );
};

export default HelpCenter;