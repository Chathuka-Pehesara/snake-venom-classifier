import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, ShieldCheck, MapPin, Activity, FlaskConical, Globe, Info, RefreshCw, Plus, Edit2, X, Image as ImageIcon, ZoomIn, ZoomOut, Maximize2, Sparkles } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5002/api';

const RISK_BADGE = {
  Critical: 'badge-critical',
  High:     'badge-high',
  Medium:   'badge-medium',
  Low:      'badge-low',
};

export default function Database() {
  const [snakes, setSnakes] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [habitatFilter, setHabitatFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '', scientificName: '', type: 'Venomous', venomType: '', habitat: '',
    region: '', riskLevel: 'Low', behavior: '', facts: '', image: '',
    imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0, useCustomFraming: false
  });
  const [zoomImg, setZoomImg] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const fetchSnakes = async () => {
    setLoading(true);
    try { const { data } = await axios.get(`${API}/snakes`); setSnakes(data); }
    catch { console.error('DB fetch failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSnakes(); }, []);
  
  // Scroll Lock
  useEffect(() => {
    if (formOpen || selected || zoomImg) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [formOpen, selected, zoomImg]);

  const handleOpenForm = (snake = null) => {
    if (snake) {
      setEditing(snake.id);
      setFormData({ 
        ...snake,
        imageZoom: snake.imageZoom || 1,
        imageOffsetX: snake.imageOffsetX || 0,
        imageOffsetY: snake.imageOffsetY || 0
      });
    } else {
      setEditing(null);
      setFormData({
        name: '', scientificName: '', type: 'Venomous', venomType: '', habitat: '',
        region: '', riskLevel: 'Low', behavior: '', facts: '', image: '',
        imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0, useCustomFraming: false
      });
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/snakes/${editing}`, formData);
      } else {
        await axios.post(`${API}/snakes`, formData);
      }
      setFormOpen(false);
      fetchSnakes();
    } catch (err) { console.error('Save failed', err); }
  };

  const habitats = ['All', ...new Set(snakes.flatMap(s => s.habitat.split(',').map(h => h.trim())))];

  const filtered = snakes.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.scientificName?.toLowerCase().includes(q);
    const matchType = typeFilter === 'All' || s.type === typeFilter;
    const matchHab = habitatFilter === 'All' || s.habitat.includes(habitatFilter);
    return matchSearch && matchType && matchHab;
  });

  return (
    <>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: '2.5rem', textAlign: 'center', position: 'relative' }}>
        <div className="section-eyebrow"><Info size={13} /> Species Encyclopedia</div>
        <h1 className="section-title">Snake <span>Database</span></h1>
        <p className="section-sub" style={{ margin: '0.75rem auto 0' }}>
          Browse {snakes.length} documented species. Learn habitats, behaviors, venom types, and risk levels.
        </p>
        <button 
          onClick={() => handleOpenForm()}
          className="btn btn-primary" 
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
        >
          <Plus size={18} /> Add New Species
        </button>
      </div>

      {/* Filters */}
      <div className="fade-up delay-1" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input className="input-field" placeholder="Search by name or scientific name..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.75rem' }} />
        </div>
        <select className="input-field" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ flex: '0 1 180px' }}>
          <option value="All">All Types</option>
          <option value="Venomous">Venomous</option>
          <option value="Non-Venomous">Non-Venomous</option>
        </select>
        <select className="input-field" value={habitatFilter} onChange={e => setHabitatFilter(e.target.value)} style={{ flex: '0 1 200px' }}>
          {habitats.slice(0, 12).map((h, i) => <option key={i} value={h}>{h === 'All' ? 'All Habitats' : h}</option>)}
        </select>

        <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
          Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {snakes.length}
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <RefreshCw size={40} className="spin" color="var(--primary)" style={{ opacity: 0.5 }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Syncing species records...</p>
        </div>
      ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="fade-up delay-2"
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((snake, i) => (
                <motion.div
                  key={snake.id}
                  layout
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.02,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
                }}
                className="snake-card premium-card hover-lift"
                style={{ cursor: 'pointer', transformStyle: 'preserve-3d' }}
                onClick={() => setSelected(snake)}
              >
                {/* Image Section */}
                <div className="snake-card-img-wrapper">
                    <img
                      src={snake.image}
                      alt={snake.name}
                      className="card-main-img"
                      style={{ 
                        objectFit: snake.useCustomFraming ? 'contain' : 'cover',
                        transform: snake.useCustomFraming 
                          ? `translate(${snake.imageOffsetX || 0}px, ${snake.imageOffsetY || 0}px) scale(${snake.imageZoom || 1})`
                          : 'none',
                        transformOrigin: 'center center'
                      }}
                    />
                  <div className="card-image-overlay" />
                  
                  {/* Action Buttons */}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenForm(snake); }}
                      className="btn" 
                      style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.3)' }}
                      title="Edit Species"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setZoomImg(snake.image); setZoomLevel(1); }}
                      className="btn" 
                      style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.3)' }}
                      title="Zoom Image"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>
                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 2 }}>
                    <motion.span
                      initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.04 }}
                      className={`badge ${snake.type === 'Venomous' ? 'badge-venomous' : 'badge-safe'}`}
                      style={{ backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                    >
                      {snake.type === 'Venomous' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                      {snake.type}
                    </motion.span>
                  </div>

                  <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 2 }}>
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 + i * 0.04 }}
                      className={`badge ${RISK_BADGE[snake.riskLevel] || 'badge-low'}`}
                      style={{ backdropFilter: 'blur(12px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                    >
                      {snake.riskLevel} Risk
                    </motion.span>
                  </div>

                  {/* Hover Detail Indicator */}
                  <div className="view-more-indicator">
                    <Search size={18} /> Full Profile
                  </div>
                </div>

                {/* Body Section */}
                <div className="snake-card-body">
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h3 className="snake-card-name gradient-text">{snake.name}</h3>
                    <div style={{ fontSize: '0.88rem', color: 'var(--primary-dark)', fontWeight: 700, opacity: 0.85 }}>{snake.scientificName}</div>
                  </div>

                  <div style={{ display: 'grid', gap: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                    <div className="snake-info-row">
                      <div className="info-icon-box"><MapPin size={13} /></div>
                      <span><strong style={{ color: 'var(--text)' }}>Habitat:</strong> {snake.habitat.split(',')[0]}</span>
                    </div>
                    <div className="snake-info-row">
                      <div className="info-icon-box"><FlaskConical size={13} /></div>
                      <span><strong style={{ color: 'var(--text)' }}>Venom:</strong> {snake.venomType}</span>
                    </div>
                    <div className="snake-info-row">
                      <div className="info-icon-box"><Globe size={13} /></div>
                      <span><strong style={{ color: 'var(--text)' }}>Region:</strong> {snake.region}</span>
                    </div>
                  </div>

                  <div className="premium-insight-box">
                    <div className="insight-label">
                      <Activity size={11} /> Expert Insight
                    </div>
                    <p className="insight-text">
                      {snake.facts.length > 100 ? `${snake.facts.substring(0, 100)}...` : snake.facts}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}
            >
              <div style={{ width: 80, height: 80, background: 'var(--surface-2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Search size={32} opacity={0.3} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>No Species Found</h3>
              <p style={{ marginTop: '0.5rem' }}>Try adjusting your filters or search terms.</p>
              <button onClick={() => { setSearch(''); setTypeFilter('All'); setHabitatFilter('All'); }} className="btn" style={{ marginTop: '1.5rem', color: 'var(--primary-dark)', fontWeight: 700 }}>Clear all filters</button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Species Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(16px)' }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 40, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ 
                background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', 
                maxWidth: 850, width: '100%', maxHeight: '92vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 50px 100px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {/* Scrollable Content Container */}
              <div style={{ overflowY: 'auto', flex: 1, position: 'relative' }} className="custom-scrollbar">
                
                {/* Hero Header with Image */}
                <div style={{ height: 380, position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={selected.image} 
                    alt={selected.name} 
                    style={{ 
                      width: '100%', height: '100%', 
                      objectFit: selected.useCustomFraming ? 'contain' : 'cover',
                      background: '#000',
                      transform: selected.useCustomFraming 
                        ? `translate(${selected.imageOffsetX || 0}px, ${selected.imageOffsetY || 0}px) scale(${selected.imageZoom || 1})`
                        : 'none',
                    }} 
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)' }} />
                  
                  {/* Floating Controls */}
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => { setZoomImg(selected.image); setZoomLevel(1); }} className="btn" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                      <Maximize2 size={18} />
                    </button>
                    <button onClick={() => setSelected(null)} className="btn" style={{ background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: 'white', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                      <X size={20} />
                    </button>
                  </div>

                  <div style={{ position: 'absolute', bottom: '2rem', left: '2.5rem', right: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                      <span className={`badge ${selected.type === 'Venomous' ? 'badge-venomous' : 'badge-safe'}`} style={{ border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                        {selected.type === 'Venomous' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />} {selected.type}
                      </span>
                      <span className={`badge ${RISK_BADGE[selected.riskLevel]}`} style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                        {selected.riskLevel} Risk
                      </span>
                    </div>
                    <h2 style={{ color: 'white', fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{selected.name}</h2>
                    <div style={{ color: 'var(--primary-light)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.02em', fontStyle: 'italic' }}>{selected.scientificName}</div>
                  </div>
                </div>

                {/* Report Body */}
                <div style={{ padding: '2.5rem' }}>
                  
                  {/* Grid Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                    {[
                      { label: 'Venom Profile', value: selected.venomType, icon: FlaskConical },
                      { label: 'Primary Region', value: selected.region, icon: Globe },
                      { label: 'Documented Habitat', value: selected.habitat, icon: MapPin },
                      { label: 'Activity Level', value: 'High', icon: Activity },
                    ].map(({ label, value, icon: Icon }, i) => (
                      <div key={i} style={{ padding: '1.25rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon size={14} color="var(--primary-dark)" />
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{label}</span>
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Descriptions */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                    <div>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                        <Info size={16} /> Behavior & Temperament
                      </h4>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>{selected.behavior}</p>
                    </div>
                    <div>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                        <Sparkles size={16} /> Species Intelligence
                      </h4>
                      <div style={{ background: 'var(--primary-glow)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--primary)' }}>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{selected.facts}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ padding: '2rem 2.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setFormOpen(true); setEditing(selected.id); setFormData(selected); setSelected(null); }} className="btn" style={{ background: 'white', border: '1px solid var(--border)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <Edit2 size={16} /> Edit Record
                  </button>
                  <button onClick={() => setSelected(null)} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Close Report</button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Lightbox / Zoom Modal */}
      <AnimatePresence>
        {zoomImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.95)', 
              zIndex: 1000, display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' 
            }}
            onClick={() => setZoomImg(null)}
          >
            {/* Top Toolbar */}
            <div 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '1rem', zIndex: 1010 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  className="btn" style={{ background: 'transparent', color: 'white', padding: '0.5rem' }}
                >
                  <ZoomOut size={20} />
                </button>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(4, prev + 0.25))}
                  className="btn" style={{ background: 'transparent', color: 'white', padding: '0.5rem' }}
                >
                  <ZoomIn size={20} />
                </button>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />
                <button 
                  onClick={() => setZoomLevel(1)}
                  className="btn" style={{ background: 'transparent', color: 'white', padding: '0.5rem', fontSize: '0.75rem', fontWeight: 800 }}
                >
                  RESET
                </button>
              </div>
              <button 
                onClick={() => setZoomImg(null)}
                className="btn" style={{ background: 'var(--danger)', color: 'white', padding: '0.5rem', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Image Container */}
            <div 
              style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: zoomLevel > 1 ? 'grab' : 'default' }}
              onWheel={(e) => {
                if (e.deltaY < 0) setZoomLevel(p => Math.min(4, p + 0.1));
                else setZoomLevel(p => Math.max(0.5, p - 0.1));
              }}
            >
              <motion.img
                drag={zoomLevel > 1}
                dragConstraints={{ left: -500 * zoomLevel, right: 500 * zoomLevel, top: -500 * zoomLevel, bottom: 500 * zoomLevel }}
                initial={{ scale: 0.8 }}
                animate={{ scale: zoomLevel }}
                src={zoomImg}
                alt="Zoomed View"
                style={{ 
                  maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', 
                  boxShadow: '0 30px 100px rgba(0,0,0,0.5)', borderRadius: '1rem' 
                }}
                onClick={e => e.stopPropagation()}
              />
            </div>

            {/* Bottom Info */}
            <div style={{ position: 'absolute', bottom: '2rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 500 }}>
              Use <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Scroll</kbd> or buttons to zoom • Drag to pan when zoomed
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(12px)' }}
            onClick={() => setFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 40, opacity: 0 }}
              className="card custom-scrollbar"
              style={{ maxWidth: 900, width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: 0, border: '1px solid rgba(255,255,255,0.1)', background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Form Header */}
              <div style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '1.75rem 2.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
                    {editing ? 'Update Species Record' : 'Document New Species'}
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', fontWeight: 500 }}>
                    Ensure all scientific data is accurate before saving to the database.
                  </p>
                </div>
                <button onClick={() => setFormOpen(false)} style={{ background: 'var(--surface-2)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '2.5rem' }}>
                
                {/* ── SECTION 1: Identity & Media ── */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 32, height: 32, background: 'var(--primary-glow)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon size={16} color="var(--primary-dark)" />
                    </div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-dark)', margin: 0 }}>
                      Identity & Media
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="input-label">Image Source URL</label>
                      <div style={{ position: 'relative' }}>
                        <ImageIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input className="input-field" style={{ paddingLeft: '2.75rem' }} placeholder="Unsplash or direct image URL..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required />
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Common Name</label>
                      <input className="input-field" placeholder="e.g. King Cobra" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="input-label">Scientific Name</label>
                      <input className="input-field" placeholder="e.g. Ophiophagus hannah" value={formData.scientificName} onChange={e => setFormData({ ...formData, scientificName: e.target.value })} required />
                    </div>
                  </div>

                  {formData.image && (
                    <div style={{ marginTop: '1.5rem', background: 'var(--surface-2)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)' }}>Media Framing</h4>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Toggle custom framing to manually adjust crop and zoom.</p>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 700 }}>
                          <input 
                            type="checkbox" 
                            checked={formData.useCustomFraming} 
                            onChange={e => setFormData({ ...formData, useCustomFraming: e.target.checked })} 
                            style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                          />
                          Custom Framing
                        </label>
                      </div>

                      {formData.useCustomFraming ? (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div style={{ width: 320, height: 180, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#000', position: 'relative', border: '2px solid var(--primary)' }}>
                            <motion.img 
                              drag
                              dragMomentum={false}
                              onDrag={(e, info) => {
                                setFormData(prev => ({
                                  ...prev,
                                  imageOffsetX: prev.imageOffsetX + info.delta.x,
                                  imageOffsetY: prev.imageOffsetY + info.delta.y
                                }));
                              }}
                              src={formData.image} 
                              style={{ 
                                width: '100%', height: '100%', objectFit: 'contain', cursor: 'move',
                                transform: `translate(${formData.imageOffsetX}px, ${formData.imageOffsetY}px) scale(${formData.imageZoom})`
                              }} 
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 250 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <label className="input-label" style={{ margin: 0 }}>Zoom Level</label>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{Math.round(formData.imageZoom * 100)}%</span>
                            </div>
                            <input 
                              type="range" min="0.1" max="5" step="0.01" 
                              value={formData.imageZoom || 1} 
                              onChange={e => setFormData({ ...formData, imageZoom: parseFloat(e.target.value) })}
                              style={{ width: '100%', accentColor: 'var(--primary)', marginBottom: '1rem' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button type="button" onClick={() => setFormData({ ...formData, imageZoom: 1.5, imageOffsetX: 0, imageOffsetY: 0 })} className="btn" style={{ flex: 1, fontSize: '0.7rem', padding: '0.5rem', background: 'white', border: '1px solid var(--border)' }}>Fill Frame</button>
                              <button type="button" onClick={() => setFormData({ ...formData, imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0 })} className="btn" style={{ flex: 1, fontSize: '0.7rem', padding: '0.5rem', background: 'white', border: '1px solid var(--border)' }}>Reset</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                          <ShieldCheck size={16} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Auto-fit enabled: The system will automatically crop and center the image.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── SECTION 2: Classification & Habitat ── */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 32, height: 32, background: 'var(--primary-glow)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FlaskConical size={16} color="var(--primary-dark)" />
                    </div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-dark)', margin: 0 }}>
                      Classification & Biosafety
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div>
                      <label className="input-label">Classification</label>
                      <select className="input-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                        <option value="Venomous">Venomous</option>
                        <option value="Non-Venomous">Non-Venomous</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Risk Level</label>
                      <select className="input-field" value={formData.riskLevel} onChange={e => setFormData({ ...formData, riskLevel: e.target.value })}>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Venom Type</label>
                      <input className="input-field" placeholder="e.g. Neurotoxic, Hemotoxic" value={formData.venomType} onChange={e => setFormData({ ...formData, venomType: e.target.value })} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <div>
                      <label className="input-label">Primary Region</label>
                      <input className="input-field" placeholder="e.g. South and Southeast Asia" value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })} required />
                    </div>
                    <div>
                      <label className="input-label">Habitat (comma separated)</label>
                      <input className="input-field" placeholder="e.g. Forests, Bamboo Thickets" value={formData.habitat} onChange={e => setFormData({ ...formData, habitat: e.target.value })} required />
                    </div>
                  </div>
                </div>

                {/* ── SECTION 3: Detailed Profile ── */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 32, height: 32, background: 'var(--primary-glow)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Activity size={16} color="var(--primary-dark)" />
                    </div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-dark)', margin: 0 }}>
                      Detailed Profiles
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label className="input-label">Behavior & Temperament</label>
                      <textarea className="input-field" rows={3} placeholder="Describe typical behavior, defensive postures, etc..." value={formData.behavior} onChange={e => setFormData({ ...formData, behavior: e.target.value })} required />
                    </div>
                    <div>
                      <label className="input-label">Key Scientific Facts</label>
                      <textarea className="input-field" rows={3} placeholder="Include interesting facts, unique traits, or conservation status..." value={formData.facts} onChange={e => setFormData({ ...formData, facts: e.target.value })} required />
                    </div>
                  </div>
                </div>

                {/* Form Footer */}
                <div style={{ marginTop: '3rem', padding: '1.5rem 0 0', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '1.1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <ShieldCheck size={20} />
                    {editing ? 'Update Species Record' : 'Commit to Database'}
                  </button>
                  <button type="button" onClick={() => setFormOpen(false)} className="btn" style={{ flex: 1, padding: '1.1rem', background: 'var(--surface-2)', color: 'var(--text)' }}>
                    Discard
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
