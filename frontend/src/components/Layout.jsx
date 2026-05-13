import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ShieldCheck, Cpu, BookOpen, HeartHandshake, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/',          label: 'AI Scanner',     icon: Cpu },
  { path: '/database',  label: 'Snake Database',  icon: BookOpen },
  { path: '/lookup',    label: 'AI Lookup',       icon: Sparkles },
  { path: '/safety',    label: 'Safety Guide',    icon: HeartHandshake },
  { path: '/contact',   label: 'Feedback',        icon: MessageSquare },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app-root">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          <div className="brand-icon" style={{ 
            width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 12px var(--primary-glow)', border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em', fontFamily: 'Space Grotesk, sans-serif' }}>CP</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <div className="brand-name">
              VenomGuard <span style={{ color: 'var(--primary)', fontWeight: 400 }}>Pro</span>
            </div>
            <div className="brand-tag">
              Advanced Biosafety AI · v2.0
            </div>
          </div>
        </NavLink>

        <div className="nav-links" style={{ position: 'relative' }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
              {pathname === path && (
                <motion.div
                  layoutId="activeNav"
                  className="active-indicator"
                  style={{
                    position: 'absolute', bottom: '-4px', left: '1rem', right: '1rem',
                    height: '3px', background: 'var(--primary)', borderRadius: '2px',
                    boxShadow: '0 2px 10px var(--primary-glow)'
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </div>

        <motion.div 
          className="nav-status"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="status-dot" style={{ boxShadow: '0 0 10px var(--primary-glow)' }} />
          Systems Operational
        </motion.div>
      </nav>

      {/* ── Page ── */}
      <div className="page-content">
        {children}
      </div>

      {/* ── Footer ── */}
      <footer className="footer">
        <span>VenomGuard Pro v2.0</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
        Developed by <span style={{ color: 'var(--primary-light)', marginLeft: '0.3rem' }}>Chathuka Pehesara</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
        <span>AI + Web Backend Architecture</span>
      </footer>
    </div>
  );
}
