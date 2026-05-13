import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, ShieldAlert, PhoneCall, AlertTriangle, CheckCircle2,
  Eye, Move, Clock, HeartPulse, Ban, Navigation
} from 'lucide-react';

const DOs = [
  { icon: CheckCircle2, text: 'Stay calm and keep the victim as still as possible — movement speeds venom spread.' },
  { icon: CheckCircle2, text: 'Remove tight clothing, watches, and jewelry near the bite site.' },
  { icon: CheckCircle2, text: 'Keep the bitten limb immobilized and positioned below heart level.' },
  { icon: CheckCircle2, text: 'Note the time of bite and describe the snake\'s appearance for medical staff.' },
  { icon: CheckCircle2, text: 'Transport to the nearest hospital with antivenom facilities immediately.' },
  { icon: CheckCircle2, text: 'If possible, photograph the snake from a safe distance for identification.' },
];

const DONTs = [
  { icon: Ban, text: 'Do NOT attempt to catch, kill, or handle the snake — 50% of bites happen during this.' },
  { icon: Ban, text: 'Do NOT suck, slash, or squeeze venom from the wound.' },
  { icon: Ban, text: 'Do NOT apply ice, a tourniquet, or electric shock — these cause severe damage.' },
  { icon: Ban, text: 'Do NOT wash the bite site — doctors may use residual venom for identification.' },
  { icon: Ban, text: 'Do NOT give alcohol, painkillers, or home remedies to the victim.' },
  { icon: Ban, text: 'Do NOT wait for symptoms — by the time you feel severe effects, it may be too late.' },
];

const TIPS = [
  { icon: '🥾', title: 'Proper Footwear', body: 'Wear thick, high-cut boots in forests, tall grass, and scrublands. Most bites happen to feet and ankles.' },
  { icon: '🔦', title: 'Light Your Path', body: 'Always carry a torch at night. Snakes are most active after dusk and are often found on warm paths and roads.' },
  { icon: '📏', title: 'Respect Distance', body: 'Maintain at least 6 feet (2 meters) distance from any snake. Most snakes strike only when they feel threatened.' },
  { icon: '🌿', title: 'Check Before You Grab', body: 'Avoid reaching into rock crevices, woodpiles, or thick grass without first inspecting the area.' },
  { icon: '🏕️', title: 'Safe Camping', body: 'Shake out sleeping bags and shoes before use. Sleep on a raised cot when camping in snake-prone areas.' },
  { icon: '👁️', title: 'Stay Aware', body: 'Snakes camouflage exceptionally well. Watch where you step, sit, and place your hands outdoors.' },
];

const EMERGENCY = [
  { label: 'Ambulance (LK)', number: '1990', icon: PhoneCall, color: 'var(--danger)' },
  { label: 'National Hospital', number: '011-2691111', icon: Navigation, color: 'var(--primary)' },
  { label: 'Poison Centre (IN)', number: '1800-116-117', icon: HeartPulse, color: 'var(--warning)' },
];

export default function Safety() {
  return (
    <>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div className="section-eyebrow" style={{ color: 'var(--danger)', background: 'var(--danger-glow)' }}>
          <AlertTriangle size={13} /> Emergency Protocols & Education
        </div>
        <h1 className="section-title">
          Safety Guide &<br /><span>First Response.</span>
        </h1>
        <p className="section-sub" style={{ margin: '0.75rem auto 0' }}>
          Knowing what to do — and what NOT to do — in the first 30 minutes after a snakebite can be the difference between life and death.
        </p>
      </div>

      {/* DO / DON'T */}
      <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* DO */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="safety-do-box do">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
            <CheckCircle2 size={22} /> What TO Do
          </h2>
          {DOs.map((item, i) => (
            <div key={i} className="safety-item">
              <item.icon size={16} color="var(--primary-dark)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
              <span style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.55 }}>{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* DON'T */}
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="safety-do-box dont">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', color: 'var(--danger)' }}>
            <ShieldAlert size={22} /> What NOT to Do
          </h2>
          {DONTs.map((item, i) => (
            <div key={i} className="safety-item">
              <item.icon size={16} color="var(--danger)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
              <span style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.55 }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Safety Tips grid */}
      <div className="fade-up delay-2" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text)' }}>Prevention & Awareness</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {TIPS.map((tip, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="card" style={{ padding: '1.5rem' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{tip.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>{tip.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{tip.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <ShieldCheck size={28} color="var(--primary)" />
        </div>
        <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.6rem' }}>Emergency Contacts</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 520, marginBottom: '2rem', lineHeight: 1.6 }}>
          If bitten, do not wait for symptoms. Contact emergency services immediately and go to the nearest hospital with antivenom.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {EMERGENCY.map(({ label, number, icon: Icon, color }, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius)', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 200 }}>
              <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.2rem' }}>{label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{number}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
