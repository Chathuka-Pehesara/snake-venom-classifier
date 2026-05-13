import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

// Brand icons were removed in Lucide v1.0.0, so we define them manually to match Lucide's style
const Github = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const API = 'http://localhost:5002/api';

const FEEDBACK_TYPES = ['General Feedback', 'Incorrect Prediction', 'Feature Request', 'Bug Report', 'Other'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', type: FEEDBACK_TYPES[0], message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post(`${API}/feedback`, form);
      setStatus('success');
      setForm({ name: '', email: '', type: FEEDBACK_TYPES[0], message: '' });
    } catch { setStatus('error'); }
    finally { if (status !== 'success') setTimeout(() => setStatus('idle'), 3000); }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="section-eyebrow"><MessageSquare size={13} /> Get in Touch</div>
        <h1 className="section-title">Share Your <span>Feedback.</span></h1>
        <p className="section-sub" style={{ margin: '0.75rem auto 0' }}>
          Found a misclassification? Have a feature idea? Help us improve VenomGuard Pro — every piece of feedback matters.
        </p>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} 
        animate={status === 'error' ? { x: [-5, 5, -5, 5, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        className="card hover-glow" style={{ padding: '2.5rem', transition: 'box-shadow 0.4s ease' }}
      >
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
              <CheckCircle2 size={56} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            </motion.div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>Thank You!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Your feedback has been received and will help improve the system.</p>
            <button onClick={() => setStatus('idle')} className="btn btn-primary" style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', fontSize: '0.95rem', borderRadius: 'var(--radius-sm)' }}>
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'grid', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                  <User size={14} color="var(--primary)" /> Full Name
                </label>
                <input className="input-field" required placeholder="e.g. Chathuka Pehesara" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                  <Mail size={14} color="var(--primary)" /> Email Address
                </label>
                <input className="input-field" type="email" required placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Feedback Type</label>
              <select className="input-field" value={form.type} onChange={e => set('type', e.target.value)}>
                {FEEDBACK_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                <MessageSquare size={14} color="var(--primary)" /> Message
              </label>
              <textarea
                className="input-field" required rows={5}
                placeholder="Describe your feedback in detail..."
                value={form.message} onChange={e => set('message', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {status === 'error' && (
              <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #fecaca' }}>
                Failed to send. Please try again.
              </div>
            )}

            <button
              type="submit" disabled={status === 'sending'}
              className="btn btn-primary"
              style={{ padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {status === 'sending' ? 'Sending...' : <><Send size={16} /> Send Feedback</>}
            </button>
          </form>
        )}
      </motion.div>

      {/* Developer card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        className="card hover-lift"
        style={{ marginTop: '1.5rem', padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', cursor: 'default' }}
      >
        <div style={{ width: 52, height: 52, borderRadius: '1rem', background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
          👨‍💻
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)' }}>Chathuka Pehesara</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>AI Engineer & Full-Stack Developer · VenomGuard Pro v2.0</div>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', textDecoration: 'none', transition: 'all 0.2s' }}>
            <Github size={14} /> GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, color: '#1d4ed8', textDecoration: 'none', transition: 'all 0.2s' }}>
            <Linkedin size={14} /> LinkedIn
          </a>
        </div>
      </motion.div>
    </div>
  );
}
