import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, ShieldAlert, ShieldCheck, MapPin, Activity,
  FlaskConical, Globe, Info, Heart, Zap, BookOpen, AlertTriangle,
  Clock, Ruler, Apple, Leaf, RefreshCw, X, ChevronRight
} from 'lucide-react';

const API = 'http://localhost:5002/api';

const RISK_COLORS = {
  Critical: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', glow: 'rgba(185,28,28,0.1)' },
  High:     { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa', glow: 'rgba(194,65,12,0.1)' },
  Medium:   { bg: '#fffbeb', text: '#92400e', border: '#fde68a', glow: 'rgba(146,64,14,0.1)' },
  Low:      { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', glow: 'rgba(22,101,52,0.1)' },
};

const SUGGESTED = [
  'King Cobra', 'Black Mamba', 'Inland Taipan', 'Reticulated Python',
  'Green Tree Python', 'Gaboon Viper', 'Corn Snake', 'Ball Python',
];

function InfoTile({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      padding: '1rem 1.25rem',
      background: 'white',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: '0.4rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      minHeight: '85px',
      justifyContent: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Icon size={14} color={color || 'var(--primary-dark)'} />
        <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{value || '—'}</div>
    </div>
  );
}

export default function SnakeLookup() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  const handleSearch = async (q) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const { data } = await axios.post(`${API}/snake-lookup`, { query: searchQuery.trim() });
      if (!data.found) {
        setError(data.message || 'No snake found for that query.');
      } else {
        setResult(data);
        setHistory(prev => {
          const updated = [searchQuery.trim(), ...prev.filter(h => h.toLowerCase() !== searchQuery.trim().toLowerCase())];
          return updated.slice(0, 6);
        });
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 429) {
        const retryAfter = err?.response?.data?.retryAfter || '60s';
        setError(`⏳ Gemini AI quota temporarily exhausted. Please wait ${retryAfter} and try again. (Free-tier limit reached)`);
      } else {
        setError(err?.response?.data?.error || 'Something went wrong. Make sure the web backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const riskStyle = result ? (RISK_COLORS[result.riskLevel] || RISK_COLORS.Low) : null;

  return (
    <>
      {/* ── Hero Header ── */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="section-eyebrow">
          <Sparkles size={13} /> AI-Powered Snake Intelligence
        </div>
        <h1 className="section-title">
          Snake <span>Lookup</span>
        </h1>
        <p className="section-sub" style={{ margin: '0.75rem auto 0' }}>
          Search any snake species by common or scientific name. Get comprehensive details powered by Google Gemini AI.
        </p>
      </div>

      {/* ── Search Box ── */}
      <div className="fade-up delay-1" style={{ maxWidth: 680, margin: '0 auto 3rem' }}>
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
          onFocus={() => {}}
        >
          <div style={{ paddingLeft: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Search size={20} />
          </div>
          <input
            ref={inputRef}
            id="snake-lookup-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. King Cobra, Ophiophagus hannah, Black Mamba..."
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: '1.05rem',
              fontFamily: 'Inter, sans-serif', color: 'var(--text)',
              background: 'transparent', padding: '0.85rem 0.5rem',
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResult(null); setError(''); inputRef.current?.focus(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}
            >
              <X size={18} />
            </button>
          )}
          <button
            id="snake-lookup-search-btn"
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.75rem', borderRadius: 'var(--radius-sm)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? <RefreshCw size={16} className="spin" /> : <Search size={16} />}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Suggested Searches */}
        <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, alignSelf: 'center' }}>Try:</span>
          {SUGGESTED.map(s => (
            <button
              key={s}
              onClick={() => { setQuery(s); handleSearch(s); }}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: '99px', padding: '0.35rem 0.85rem',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                color: 'var(--text-muted)', transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary-dark)'; e.target.style.background = 'var(--primary-glow)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; e.target.style.background = 'var(--surface-2)'; }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Searches ── */}
      {history.length > 0 && !result && !loading && !error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 680, margin: '0 auto 3rem', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}
        >
          <div style={{ padding: '0.75rem 1.25rem', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            Recent Searches
          </div>
          {history.map((h, i) => (
            <button key={i} onClick={() => { setQuery(h); handleSearch(h); }}
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 500, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={14} color="var(--text-muted)" /> {h}
              </span>
              <ChevronRight size={14} color="var(--text-muted)" />
            </button>
          ))}
        </motion.div>
      )}

      {/* ── Loading State ── */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '5rem 0' }}
          >
            <div style={{ width: 80, height: 80, margin: '0 auto 1.5rem', background: 'var(--primary-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--primary)' }}>
              <Sparkles size={36} color="var(--primary-dark)" style={{ animation: 'pulse-dot 1.5s infinite' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Consulting Gemini AI...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Fetching comprehensive species data for <strong>"{query}"</strong></p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error State ── */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '3rem 2rem', background: '#fff5f5', borderRadius: 'var(--radius-lg)', border: '1px solid #fecaca' }}
          >
            <AlertTriangle size={40} color="var(--danger)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.5rem' }}>Not Found</h3>
            <p style={{ color: '#7f1d1d', fontSize: '0.95rem' }}>{error}</p>
            <button onClick={() => { setError(''); setQuery(''); }} className="btn" style={{ marginTop: '1.25rem', padding: '0.7rem 1.5rem', background: 'var(--danger)', color: 'white', borderRadius: 'var(--radius-sm)' }}>
              Try Another Search
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Result Card ── */}
      <AnimatePresence>
        {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fade-up"
              style={{ maxWidth: 900, margin: '0 auto' }}
            >
              {/* Top Hero Banner */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  background: `linear-gradient(135deg, ${riskStyle.glow}, var(--primary-glow))`,
                  border: `1.5px solid ${riskStyle.border}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
              {/* Background Decoration */}
              <div style={{ position: 'absolute', right: '-2rem', top: '-2rem', width: 180, height: 180, borderRadius: '50%', background: riskStyle.glow, opacity: 0.5 }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${result.classification === 'Venomous' ? 'badge-venomous' : 'badge-safe'}`}>
                      {result.classification === 'Venomous' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                      {result.classification}
                    </span>
                    <span style={{ background: riskStyle.bg, color: riskStyle.text, border: `1px solid ${riskStyle.border}` }} className="badge">
                      {result.riskLevel} Risk
                    </span>
                    {result.conservationStatus && (
                      <span className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#4338ca', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <Leaf size={11} /> {result.conservationStatus}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '2.5rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.4rem' }}>
                    {result.commonName}
                  </h2>
                  <div style={{ fontSize: '1rem', color: 'var(--primary-dark)', fontWeight: 700 }}>{result.scientificName}</div>
                  <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Family: {result.family}</div>
                </div>

                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{ textAlign: 'right', flexShrink: 0 }}
                >
                  <div className="hover-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', border: '1px solid rgba(255,255,255,0.5)', transition: 'all 0.3s' }}>
                    <Sparkles size={16} className="spin-slow" color="var(--primary-dark)" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Powered by Gemini AI</span>
                  </div>
                </motion.div>
              </div>
              </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* ── Key Stats ── */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}
              >
                <InfoTile icon={FlaskConical} label="Venom Type" value={result.venomType} color={result.classification === 'Venomous' ? 'var(--danger)' : 'var(--primary-dark)'} />
                <InfoTile icon={ShieldAlert} label="Risk Level" value={result.riskLevel} color={riskStyle.text} />
                <InfoTile icon={MapPin} label="Primary Habitat" value={result.habitat} />
                <InfoTile icon={Globe} label="Region" value={result.geographicRange} />
                <InfoTile icon={Ruler} label="Avg. Length" value={result.averageLength} />
                <InfoTile icon={Clock} label="Lifespan" value={result.lifespan} />
              </motion.div>

              {/* ── Main Info Grid ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {/* Behavior */}
                <div style={{
                  background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  padding: '1.75rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column'
                }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
                    <Activity size={15} /> Behavior & Temperament
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>{result.behavior}</p>
                  {result.lookalikes && (
                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                      <div style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>⚠️ Commonly Confused With</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 600 }}>{result.lookalikes}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Facts */}
                <div style={{
                  background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  padding: '1.75rem', boxShadow: 'var(--shadow-sm)'
                }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
                    <BookOpen size={15} /> Interesting Facts
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(result.interestingFacts || []).map((fact, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 24, height: 24, background: 'var(--primary-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary-dark)' }}>{i + 1}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── First Aid Steps ── */}
              {result.firstAidSteps && result.firstAidSteps.length > 0 && (
                <div style={{
                  background: result.classification === 'Venomous' ? 'linear-gradient(135deg, #fff5f5, #fee2e2)' : 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: `1.5px solid ${result.classification === 'Venomous' ? '#fecaca' : '#bbf7d0'}`,
                  borderRadius: 'var(--radius)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: result.classification === 'Venomous' ? 'var(--danger)' : 'var(--primary-dark)' }}>
                      <Heart size={16} /> Emergency First Aid Protocol
                    </h3>
                    {result.classification === 'Venomous' && (
                      <div style={{ background: 'var(--danger)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.35rem 0.85rem', borderRadius: '99px', letterSpacing: '0.05em', boxShadow: '0 4px 12px var(--danger-glow)' }}>
                        URGENT MEDICAL ATTENTION REQUIRED
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {result.firstAidSteps.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', borderRadius: 'var(--radius-sm)', padding: '1.1rem 1.25rem', border: '1px solid rgba(255,255,255,0.6)' }}>
                        <div style={{ width: 32, height: 32, background: result.classification === 'Venomous' ? 'var(--danger)' : 'var(--primary-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'white' }}>{i + 1}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── New Search Prompt ── */}
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Want to look up another species?
                </p>
                <button
                  onClick={() => { setResult(null); setQuery(''); setError(''); setTimeout(() => inputRef.current?.focus(), 100); }}
                  className="btn btn-primary"
                  style={{ padding: '0.85rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                >
                  <Search size={16} /> New Search
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty State (initial) ── */}
      {!result && !loading && !error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}
        >
          <div style={{ width: 90, height: 90, margin: '0 auto 1.5rem', background: 'var(--primary-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(16,185,129,0.2)' }}>
            <Search size={38} color="var(--primary-dark)" style={{ opacity: 0.6 }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Search any snake species</h3>
          <p style={{ maxWidth: 420, margin: '0 auto', lineHeight: 1.6 }}>
            Enter a common name like "King Cobra" or a scientific name like "Ophiophagus hannah" to get comprehensive AI-generated information.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: FlaskConical, label: 'Venom Info' },
              { icon: Heart, label: 'First Aid' },
              { icon: BookOpen, label: 'Facts & Habitat' },
              { icon: Globe, label: 'Global Range' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 44, height: 44, background: 'var(--surface-2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                  <Icon size={20} color="var(--primary-dark)" />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
