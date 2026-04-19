import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, ShieldAlert, ShieldCheck, Info, Zap, ChevronRight, Activity, Award,
  Clock, Heart, CheckCircle2, AlertTriangle, Shield, MousePointer2
} from 'lucide-react';

const API_URL = "http://localhost:8000";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [flash, setFlash] = useState(null);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const onPredict = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${API_URL}/predict`, formData);
      const data = response.data;
      setResult(data);
      setFlash(data.is_venomous ? 'venomous' : 'safe');
      setTimeout(() => setFlash(null), 3000);

      const newHistoryItem = {
        name: file.name,
        result: data.prediction,
        is_venomous: data.is_venomous,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now()
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 5));
    } catch (err) {
      setError("System connection lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app-container ${flash ? `flash-${flash}` : ''}`} style={{ minHeight: '100vh', padding: '2rem 4rem' }}>
      {flash && (
        <div className={`screen-alert ${flash}`}>
          <div className="alert-content">
            {flash === 'venomous' ? <ShieldAlert size={140} /> : <ShieldCheck size={140} />}
            <h2 style={{ fontSize: '4rem', fontWeight: 900 }}>{flash === 'venomous' ? 'DANGER: VENOMOUS' : 'STATUS: SECURE'}</h2>
            <p style={{ fontSize: '1.5rem', opacity: 0.9 }}>{flash === 'venomous' ? 'Immediate caution advised.' : 'Specimen identified as safe.'}</p>
          </div>
        </div>
      )}

      {/* Modern Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}>
            <div style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '1px' }}>CP</div>
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              VenomGuard <span style={{ color: 'var(--primary)', fontWeight: 400 }}>Pro</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Advanced Biosafety AI</div>
          </div>
        </div>
        <div style={{ background: 'white', padding: '0.6rem 1.2rem', borderRadius: '99px', border: '1px solid var(--border)', display: 'flex', gap: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={14} /> High-Speed Neural Core
          </span>
          <span style={{ color: 'var(--text-muted)', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
            System Status: <span style={{ color: '#10b981' }}>Optimal</span>
          </span>
        </div>
      </nav>

      {/* Main Dashboard */}
      <main style={{ display: 'grid', gridTemplateColumns: 'minmax(600px, 1.4fr) 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Column: Intelligence Hub */}
        <section className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', marginBottom: '1rem', background: 'rgba(5, 150, 105, 0.08)', padding: '0.4rem 1rem', borderRadius: '99px' }}>
              <Award size={14} /> ENVIRONMENTAL SAFETY ENGINE v2.0
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
              Deep Learning for <br />
              <span style={{ color: 'var(--primary)' }}>Public Safety.</span>
            </h1>
            <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '500px', lineHeight: '1.6' }}>
              Bridging the gap between wildlife herpetology and instant digital assessment using neural pattern recognition.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', background: 'white', borderBottom: '4px solid var(--primary-light)' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '1rem', color: 'var(--text-main)' }}>Our Mission</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                Protecting explorers and medical responders by mapping the unique "fingerprints" of scale architecture across 33,000 specimens.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '2rem', background: 'white', borderBottom: '4px solid #cbd5e1' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '1rem', color: 'var(--text-main)' }}>How It Works</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                A custom-tuned neural core scans for critical safety markers—analyzing head geometry and scale patterns in milliseconds.
              </p>
            </div>
          </div>

          {/* Activity & Tips side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.7)' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <Clock size={16} color="var(--primary)"/> Latest Scans
              </h3>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {history.length === 0 ? <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed #e2e8f0', borderRadius: '1rem' }}>No activity logged.</div> : 
                  history.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1rem', background: 'white', borderRadius: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.is_venomous ? 'var(--danger)' : 'var(--primary)' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.result}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.time}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white' }}>
              <div style={{ height: '140px', background: `url("/assets/safety_tips.png")`, backgroundSize: 'cover', backgroundPosition: 'center 20%' }} />
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 800, marginBottom: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={16} color="var(--danger)"/> Protective Tips
                </h3>
                <div style={{ display: 'grid', gap: '1rem', fontSize: '0.8rem', lineHeight: '1.5' }}>
                  <p><span style={{ color: 'var(--primary)', fontWeight: 700 }}>● Trust the Gap:</span> Maintain 6ft distance from all wildlife sightings.</p>
                  <p><span style={{ color: 'var(--primary)', fontWeight: 700 }}>● Gear Up:</span> High-cut boots and durable fabrics are essential in tall grass.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Interaction Hub */}
        <section className="animate-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Verify Specimen</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Upload a high-resolution photo for AI verification.</p>
            </div>

            {!preview ? (
              <label className="upload-zone" style={{ height: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', background: 'rgba(248, 250, 252, 0.5)' }}>
                <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 15px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
                  <MousePointer2 size={32} color="var(--primary)" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>Drop Image Here</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>or click to browse library</div>
                <input type="file" hidden onChange={onFileChange} />
              </label>
            ) : (
              <div style={{ position: 'relative', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <img src={preview} alt="Prediction" style={{ width: '100%', height: '380px', objectFit: 'cover' }} />
                <button 
                  onClick={() => {setPreview(null); setFile(null); setResult(null);}} 
                  style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.6rem 1.2rem', background: 'white', border: 'none', borderRadius: '1rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                >
                  Change Specimen
                </button>
              </div>
            )}

            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '2rem', padding: '1.2rem', borderRadius: '1.2rem', fontSize: '1.1rem', letterSpacing: '0.5px' }} 
              onClick={onPredict} 
              disabled={!file || loading}
            >
              {loading ? "Neural Mapping..." : "Detect Danger Level"}
            </button>

            {error && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', color: 'var(--danger)', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', border: '1px solid #fee2e2' }}>
                {error}
              </div>
            )}

            {result && (
              <div className="animate-up" style={{ marginTop: '2.5rem', padding: '2rem', borderRadius: '2rem', background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: `2px solid ${result.is_venomous ? 'var(--danger)' : 'var(--primary)'}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.05 }}>
                   {result.is_venomous ? <ShieldAlert size={120} /> : <ShieldCheck size={120} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.15em', color: result.is_venomous ? 'var(--danger)' : 'var(--primary)' }}>Verification Result</div>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{result.prediction}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Confidence Score: {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer style={{ marginTop: '6rem', padding: '4rem 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 800 }}>
          DEVELOPED BY CHATHUKA PEHESARA • 2025
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .screen-alert {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          z-index: 9999; display: flex; align-items: center; justify-content: center;
          animation: flashEffect 0.5s infinite; pointer-events: none;
        }
        .screen-alert.venomous { background: rgba(220, 38, 38, 0.9); color: white; }
        .screen-alert.safe { background: rgba(16, 185, 129, 0.9); color: white; }
        .alert-content { text-align: center; }
        .alert-content h2 { text-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        @keyframes flashEffect { 0% { opacity: 0.85; } 50% { opacity: 1; } 100% { opacity: 0.85; } }
      `}} />
    </div>
  );
}

export default App;
