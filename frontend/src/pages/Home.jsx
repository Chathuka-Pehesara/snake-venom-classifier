import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, ShieldCheck, UploadCloud, Cpu, Clock, Zap,
  TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, ImageOff
} from 'lucide-react';

const API = 'http://localhost:5002/api';

/* ── Stat card ─────────────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accent }) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }}
    className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
  >
    <div style={{ width: 48, height: 48, borderRadius: '1rem', background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={22} color={accent} />
    </div>
    <div>
      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  </motion.div>
);

/* ── Confidence bar ────────────────────────────────────────────────────────── */
const ConfBar = ({ value, color }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value * 100), 100); return () => clearTimeout(t); }, [value]);
  return (
    <div className="conf-bar-track">
      <div className="conf-bar-fill" style={{ width: `${width}%`, background: color }} />
    </div>
  );
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [flash, setFlash] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchHistory = useCallback(async () => {
    try { const r = await axios.get(`${API}/recent`); setHistory(r.data); } catch {}
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const predict = async () => {
    if (!file) return;
    setLoading(true); setResult(null); setError(null);
    const fd = new FormData(); fd.append('file', file);
    try {
      const { data } = await axios.post(`${API}/predict`, fd);
      setResult(data);
      setFlash(data.is_venomous ? 'venomous' : 'safe');
      setTimeout(() => setFlash(null), 2800);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.error || 'Connection failed. Check if AI backend is running.');
    } finally { setLoading(false); }
  };

  const reset = () => { setFile(null); setPreview(null); setResult(null); setError(null); };

  const venomousCount = history.filter(h => h.is_venomous).length;
  const safeCount = history.filter(h => !h.is_venomous).length;

  return (
    <>
      {/* ── Flash overlay ── */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className={`screen-alert ${flash}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="alert-body">
              {flash === 'venomous' ? <ShieldAlert size={100} /> : <ShieldCheck size={100} />}
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginTop: '1rem', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                {flash === 'venomous' ? 'DANGER: VENOMOUS' : 'STATUS: SAFE'}
              </h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.85, marginTop: '0.5rem' }}>
                {flash === 'venomous' ? 'Maintain safe distance. Seek medical help immediately.' : 'Non-venomous specimen identified.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '3rem' }}
      >
        <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="status-dot" style={{ width: 8, height: 8 }} />
          AI Prediction Engine · Active
        </div>
        <h1 className="section-title">
          Snake Venom Detection<br />
          <span style={{ color: 'var(--primary)', opacity: 1 }}>Powered by Deep Learning.</span>
        </h1>
        <p className="section-sub">
          Upload any snake photo for instant AI-powered venom classification. Our neural network analyzes scale patterns and morphology in milliseconds.
        </p>
      </motion.div>

      {/* ── Stats row ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}
      >
        <StatCard icon={TrendingUp} label="Total Scans" value={history.length} accent="var(--primary)" />
        <StatCard icon={ShieldAlert} label="Venomous Detected" value={venomousCount} accent="var(--danger)" />
        <StatCard icon={ShieldCheck} label="Safe Identified" value={safeCount} accent="var(--primary)" />
      </motion.div>

      {/* ── Main grid ── */}
      <div className="home-grid fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem', alignItems: 'start' }}>

        {/* Left: Scanner */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text)' }}>Specimen Scanner</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Upload a clear photo of the snake for instant classification.</p>

          {/* Upload zone */}
          {!preview ? (
            <label
              className="upload-zone"
              style={{ height: 320, cursor: 'pointer' }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              style={{
                height: 320, cursor: 'pointer',
                borderColor: dragOver ? 'var(--primary)' : undefined,
                background: dragOver ? 'var(--primary-glow)' : undefined
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '1rem', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <UploadCloud size={30} color="var(--primary-dark)" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.4rem' }}>Drop image here</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>or <span style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>click to browse</span></div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.75rem' }}>JPG, PNG, WEBP supported</div>
              <input type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
            </label>
          ) : (
            <div style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', height: 320 }}>
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={reset} style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', backdropFilter: 'blur(8px)' }}>
                <ImageOff size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Change
              </button>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={predict}
            disabled={!file || loading}
            style={{ width: '100%', marginTop: '1.25rem', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading
              ? <><RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</>
              : <><Zap size={18} /> Run AI Prediction</>
            }
          </button>

          {/* Error */}
          {error && (
            <div style={{ marginTop: '1rem', padding: '0.9rem 1rem', background: '#fef2f2', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'flex-start', border: '1px solid #fecaca' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} /> {error}
            </div>
          )}

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: 'var(--radius)', border: `2px solid ${result.is_venomous ? 'var(--danger)' : 'var(--primary)'}`, background: result.is_venomous ? '#fff5f5' : '#f0fdf4', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.06 }}>
                  {result.is_venomous ? <ShieldAlert size={120} /> : <ShieldCheck size={120} />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: result.is_venomous ? 'var(--danger)' : 'var(--primary-dark)', marginBottom: '0.3rem' }}>AI Classification Result</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{result.prediction}</div>
                  </div>
                  <span className={`badge ${result.is_venomous ? 'badge-venomous' : 'badge-safe'}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                    {result.is_venomous ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                    {result.is_venomous ? 'Dangerous' : 'Safe'}
                  </span>
                </div>

                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  <span>Confidence Level</span>
                  <span style={{ color: result.is_venomous ? 'var(--danger)' : 'var(--primary-dark)', fontWeight: 700 }}>
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <ConfBar value={result.confidence} color={result.is_venomous ? 'var(--danger)' : 'var(--primary)'} />

                {result.is_uncertain && (
                  <div style={{ marginTop: '1rem', padding: '0.65rem 1rem', background: '#fffbeb', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#92400e', fontWeight: 600, border: '1px solid #fde68a', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <AlertTriangle size={14} /> Low confidence – please consult an expert for confirmation.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Recent scans */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Recent scans panel */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                <Clock size={16} color="var(--primary)" /> Recent Scans
              </h3>
              <button onClick={fetchHistory} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
                <RefreshCw size={14} />
              </button>
            </div>
            {history.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-sm)' }}>
                No scans yet. Run your first prediction above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {history.map((item, i) => (
                  <motion.div
                    key={item.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: item.is_venomous ? 'var(--danger)' : 'var(--primary)', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>{item.prediction}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: item.is_venomous ? 'var(--danger)' : 'var(--primary-dark)' }}>{(item.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Tips card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--text)' }}>⚠️ Quick Safety Tips</h3>
            {[
              { icon: '🦺', tip: 'Wear high-cut boots in tall grass or jungle.' },
              { icon: '🔦', tip: 'Use a torch when walking at night outdoors.' },
              { icon: '📏', tip: 'Keep 6+ feet distance from any snake you see.' },
              { icon: '🚫', tip: 'Never attempt to handle or provoke a snake.' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{t.icon}</span>
                {t.tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
