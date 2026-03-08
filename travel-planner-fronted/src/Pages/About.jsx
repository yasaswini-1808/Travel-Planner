import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --ink: #0a0a0f;
    --surface: #111118;
    --card: #16161f;
    --border: rgba(255,255,255,0.07);
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --text: #e8e4d9;
    --muted: rgba(232,228,217,0.65);
    --accent: #4f7fe8;
    --accent2: #8b5cf6;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ab-root {
    background: var(--ink);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .ab-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }

  .ab-hero-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    transform: scale(1.04);
    transition: transform 8s ease;
  }

  .ab-hero-bg.loaded { transform: scale(1); }

  /* Gradient only at bottom for text — rest of image fully visible */
  .ab-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(10,10,15,0.90) 0%,
      rgba(10,10,15,0.40) 30%,
      rgba(10,10,15,0.05) 60%,
      transparent 100%
    );
  }

  .ab-hero-content {
    position: relative;
    z-index: 1;
    padding: clamp(3rem,8vw,7rem) clamp(1.5rem,6vw,5rem);
    max-width: 900px;
  }

  .ab-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold-light);
    border: 1px solid rgba(201,168,76,0.5);
    border-radius: 100px;
    padding: 6px 16px;
    margin-bottom: 2rem;
    background: rgba(10,10,15,0.5);
    backdrop-filter: blur(8px);
  }

  .ab-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3.5rem, 10vw, 8rem);
    font-weight: 300;
    line-height: 1.0;
    letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 20px rgba(0,0,0,0.5);
  }

  .ab-hero-title em {
    font-style: italic;
    background: linear-gradient(135deg, var(--gold-light), var(--gold));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ab-hero-sub {
    font-size: clamp(1rem, 1.8vw, 1.2rem);
    font-weight: 300;
    color: rgba(255,255,255,0.88);
    line-height: 1.75;
    max-width: 520px;
    text-shadow: 0 1px 10px rgba(0,0,0,0.6);
  }

  .ab-scroll {
    position: absolute;
    bottom: 2.5rem;
    right: clamp(1.5rem, 5vw, 4rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    z-index: 1;
    color: rgba(255,255,255,0.55);
    font-size: 0.65rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    writing-mode: vertical-rl;
  }

  .ab-scroll-line {
    width: 1px; height: 60px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    animation: scrollPulse 2.5s ease-in-out infinite;
  }

  @keyframes scrollPulse {
    0%,100% { opacity:0.4; transform:scaleY(1); }
    50% { opacity:1; transform:scaleY(1.2); }
  }

  /* ── MISSION ── */
  .ab-mission {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 70vh;
  }

  @media (max-width: 768px) {
    .ab-mission { grid-template-columns: 1fr; min-height: auto; }
  }

  .ab-mission-img {
    position: relative;
    overflow: hidden;
    min-height: 420px;
  }

  .ab-mission-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 6s ease;
  }

  .ab-mission-img:hover img { transform: scale(1.05); }

  /* Only right-edge fade to blend into the dark text panel */
  .ab-mission-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 55%, rgba(17,17,24,0.75) 100%);
    pointer-events: none;
  }

  .ab-mission-text {
    background: var(--surface);
    padding: clamp(3rem,7vw,6rem) clamp(2rem,5vw,5rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .ab-section-label {
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1.2rem;
  }

  .ab-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 300;
    line-height: 1.15;
    margin-bottom: 1.5rem;
  }

  .ab-section-title em { font-style: italic; color: var(--gold-light); }

  .ab-body {
    font-size: clamp(0.9rem, 1.4vw, 1.05rem);
    color: var(--muted);
    line-height: 1.8;
  }

  .ab-gold-line {
    width: 48px; height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
    margin: 2rem 0;
  }

  /* ── STATS — photo clearly visible at 45% overlay ── */
  .ab-stats {
    position: relative;
    padding: clamp(4rem,8vw,7rem) 1.5rem;
    overflow: hidden;
  }

  .ab-stats-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=85&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
  }

  .ab-stats-overlay {
    position: absolute; inset: 0;
    background: rgba(10,10,15,0.52);
  }

  .ab-stats-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
  }

  .ab-stats-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .ab-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 20px;
    overflow: hidden;
    backdrop-filter: blur(16px);
  }

  @media (max-width: 640px) {
    .ab-stats-grid { grid-template-columns: 1fr 1fr; }
  }

  .ab-stat-cell {
    background: rgba(10,10,15,0.42);
    padding: 2.5rem 2rem;
    text-align: center;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }

  .ab-stat-cell.visible { opacity: 1; transform: translateY(0); }

  .ab-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 600;
    color: var(--gold-light);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .ab-stat-label {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.72);
  }

  /* ── FEATURES ── */
  .ab-features {
    padding: clamp(4rem,8vw,7rem) 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .ab-features-header { text-align: center; margin-bottom: 3rem; }

  .ab-feat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
  }

  @media (max-width: 900px) { .ab-feat-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .ab-feat-grid { grid-template-columns: 1fr; } }

  .ab-feat-card {
    background: var(--card);
    padding: 2.5rem 2rem;
    position: relative;
    transition: background 0.3s;
  }

  .ab-feat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .ab-feat-card:hover { background: rgba(30,30,42,0.95); }
  .ab-feat-card:hover::before { opacity: 1; }

  .ab-feat-icon { font-size: 2.2rem; margin-bottom: 1.2rem; display: block; }
  .ab-feat-title { font-size: 1.05rem; font-weight: 500; margin-bottom: 0.6rem; }
  .ab-feat-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.65; }

  /* ── PHOTO STRIP — full brightness, no filter ── */
  .ab-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: clamp(220px, 38vw, 480px);
    overflow: hidden;
  }

  @media (max-width: 500px) {
    .ab-strip { grid-template-columns: 1fr; height: auto; }
    .ab-strip-item { height: 240px; }
  }

  .ab-strip-item {
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .ab-strip-item img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
    /* Full color, no desaturation */
  }

  .ab-strip-item:hover img { transform: scale(1.08); }

  /* Only a thin gradient at the very bottom for labels */
  .ab-strip-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(10,10,15,0.6) 0%, transparent 40%);
  }

  .ab-strip-label {
    position: absolute;
    bottom: 1.2rem; left: 1.4rem;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.92);
    text-shadow: 0 1px 8px rgba(0,0,0,0.6);
    transition: color 0.3s;
  }

  .ab-strip-item:hover .ab-strip-label { color: var(--gold-light); }

  /* ── VALUES — photo at 55% overlay ── */
  .ab-values {
    position: relative;
    padding: clamp(4rem,8vw,7rem) 1.5rem;
    overflow: hidden;
  }

  .ab-values-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=85&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
  }

  .ab-values-overlay {
    position: absolute; inset: 0;
    background: rgba(10,10,15,0.55);
  }

  .ab-values-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto; text-align: center;
  }

  .ab-values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;
  }

  @media (max-width: 640px) { .ab-values-grid { grid-template-columns: 1fr 1fr; } }

  .ab-value-card {
    background: rgba(10,10,15,0.5);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 16px;
    padding: 2rem 1.5rem;
    backdrop-filter: blur(14px);
    transition: all 0.3s;
  }

  .ab-value-card:hover {
    border-color: rgba(201,168,76,0.45);
    background: rgba(201,168,76,0.1);
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.35);
  }

  .ab-value-icon { font-size: 2rem; margin-bottom: 1rem; display: block; }
  .ab-value-title { font-size: 0.95rem; font-weight: 500; letter-spacing: 0.04em; }
  .ab-value-desc { font-size: 0.8rem; color: rgba(255,255,255,0.62); margin-top: 0.4rem; line-height: 1.5; }

  /* ── CTA — photo at 55% overlay ── */
  .ab-cta {
    position: relative;
    padding: clamp(5rem,10vw,9rem) 1.5rem;
    text-align: center;
    overflow: hidden;
  }

  .ab-cta-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=85&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
  }

  .ab-cta-overlay {
    position: absolute; inset: 0;
    background: rgba(10,10,15,0.55);
  }

  .ab-cta-content {
    position: relative; z-index: 1;
    max-width: 680px; margin: 0 auto;
  }

  .ab-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 6vw, 5.5rem);
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 1.2rem;
    text-shadow: 0 2px 20px rgba(0,0,0,0.5);
  }

  .ab-cta-sub {
    font-size: clamp(0.9rem, 1.5vw, 1.1rem);
    color: rgba(255,255,255,0.82);
    line-height: 1.7;
    margin-bottom: 2.5rem;
    text-shadow: 0 1px 10px rgba(0,0,0,0.5);
  }

  .ab-cta-btns {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-gold {
    padding: 14px 34px;
    border-radius: 100px;
    border: 1px solid rgba(201,168,76,0.55);
    background: rgba(201,168,76,0.18);
    backdrop-filter: blur(8px);
    color: var(--gold-light);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem; font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex; align-items: center; gap: 8px;
  }

  .btn-gold:hover {
    background: rgba(201,168,76,0.3);
    box-shadow: 0 12px 40px rgba(201,168,76,0.28);
    transform: translateY(-2px);
  }

  .btn-plan {
    padding: 14px 34px;
    border-radius: 100px;
    border: none;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem; font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex; align-items: center; gap: 8px;
  }

  .btn-plan:hover {
    box-shadow: 0 12px 40px rgba(79,127,232,0.45);
    transform: translateY(-2px);
  }
`;

const stats = [
  { value: "50K+", label: "Happy Travelers" },
  { value: "150+", label: "Countries Covered" },
  { value: "100K+", label: "Trips Planned" },
  { value: "4.9 / 5", label: "User Rating" },
];

const features = [
  {
    icon: "🧠",
    title: "Personalized Itineraries",
    desc: "AI-crafted trips shaped around your interests, travel rhythm, and budget — no two plans alike.",
  },
  {
    icon: "💸",
    title: "Best Deals Finder",
    desc: "Real-time discovery across flights, hotels, and activities to stretch every dollar further.",
  },
  {
    icon: "🤖",
    title: "24 / 7 AI Support",
    desc: "An always-on travel companion to answer questions, adjust plans, and solve problems mid-journey.",
  },
];

const values = [
  { icon: "🎯", title: "Personalization", desc: "Every journey unique to you" },
  { icon: "💡", title: "Innovation", desc: "Cutting-edge AI technology" },
  { icon: "🤝", title: "Trust", desc: "Transparent & reliable" },
  { icon: "🌍", title: "Sustainability", desc: "Responsible travel choices" },
];

const stripImages = [
  {
    url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=85&auto=format&fit=crop",
    label: "Nature Escapes",
  },
  {
    url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&q=85&auto=format&fit=crop",
    label: "Mountain Retreats",
  },
  {
    url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&q=85&auto=format&fit=crop",
    label: "Ocean Horizons",
  },
];

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function About() {
  const navigate = useNavigate();
  const [bgLoaded, setBgLoaded] = useState(false);
  const [statsRef, statsVisible] = useInView(0.2);

  useEffect(() => {
    const img = new Image();
    img.src =
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85&auto=format&fit=crop";
    img.onload = () => setBgLoaded(true);
  }, []);

  return (
    <div className="ab-root">
      <style>{css}</style>

      {/* HERO */}
      <section className="ab-hero">
        <div className={`ab-hero-bg ${bgLoaded ? "loaded" : ""}`} />
        <div className="ab-hero-overlay" />
        <div className="ab-hero-content">
          <span className="ab-eyebrow">✦ AI-Powered Travel Platform</span>
          <h1 className="ab-hero-title">
            About
            <br />
            <em>TravelPlanner</em>
          </h1>
          <p className="ab-hero-sub">
            Transforming the way the world explores — one intelligent,
            personalized journey at a time.
          </p>
        </div>
        <div className="ab-scroll">
          <div className="ab-scroll-line" />
          Scroll
        </div>
      </section>

      {/* MISSION */}
      <section className="ab-mission">
        <div className="ab-mission-img">
          <img
            src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=85&auto=format&fit=crop"
            alt="Traveler on scenic path"
            loading="lazy"
          />
          <div className="ab-mission-img-overlay" />
        </div>
        <div className="ab-mission-text">
          <p className="ab-section-label">✦ Our Mission</p>
          <h2 className="ab-section-title">
            Travel made
            <br />
            <em>effortlessly yours</em>
          </h2>
          <div className="ab-gold-line" />
          <p className="ab-body">
            At TravelPlanner, we believe every journey should feel exactly right
            for the person taking it. We harness AI to simplify the complexity
            of travel — crafting personalized, efficient, and deeply enjoyable
            experiences tailored to your dreams, budget, and pace.
          </p>
          <p className="ab-body" style={{ marginTop: "1rem" }}>
            No generic itineraries. No decision fatigue. Just intelligent travel
            that fits who you are.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="ab-stats">
        <div className="ab-stats-bg" />
        <div className="ab-stats-overlay" />
        <div className="ab-stats-inner">
          <div className="ab-stats-header">
            <p className="ab-section-label">✦ By the Numbers</p>
            <h2 className="ab-section-title">
              Trusted by <em>travelers worldwide</em>
            </h2>
          </div>
          <div className="ab-stats-grid" ref={statsRef}>
            {stats.map((s, i) => (
              <div
                key={i}
                className={`ab-stat-cell ${statsVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="ab-stat-num">{s.value}</div>
                <div className="ab-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="ab-features">
        <div className="ab-features-header">
          <p className="ab-section-label">✦ What We Do</p>
          <h2 className="ab-section-title">
            Built for the <em>modern traveler</em>
          </h2>
        </div>
        <div className="ab-feat-grid">
          {features.map((f, i) => (
            <div key={i} className="ab-feat-card">
              <span className="ab-feat-icon">{f.icon}</span>
              <div className="ab-feat-title">{f.title}</div>
              <div className="ab-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO STRIP */}
      <div className="ab-strip">
        {stripImages.map((img, i) => (
          <div key={i} className="ab-strip-item">
            <img src={img.url} alt={img.label} loading="lazy" />
            <div className="ab-strip-overlay" />
            <span className="ab-strip-label">{img.label}</span>
          </div>
        ))}
      </div>

      {/* VALUES */}
      <section className="ab-values">
        <div className="ab-values-bg" />
        <div className="ab-values-overlay" />
        <div className="ab-values-inner">
          <p className="ab-section-label">✦ What Drives Us</p>
          <h2 className="ab-section-title">
            Our <em>core values</em>
          </h2>
          <div className="ab-values-grid">
            {values.map((v, i) => (
              <div key={i} className="ab-value-card">
                <span className="ab-value-icon">{v.icon}</span>
                <div className="ab-value-title">{v.title}</div>
                <div className="ab-value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ab-cta">
        <div className="ab-cta-bg" />
        <div className="ab-cta-overlay" />
        <div className="ab-cta-content">
          <p className="ab-section-label" style={{ marginBottom: "1.2rem" }}>
            ✦ Begin Your Story
          </p>
          <h2 className="ab-cta-title">
            Ready to start
            <br />
            <em
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontStyle: "italic",
                background:
                  "linear-gradient(135deg,var(--gold-light),var(--gold))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              your journey?
            </em>
          </h2>
          <p className="ab-cta-sub">
            Join thousands of explorers using AI to plan unforgettable trips —
            tailored to every dream, budget, and travel style.
          </p>
          <div className="ab-cta-btns">
            <button className="btn-gold" onClick={() => navigate("/explore")}>
              🗺️ Explore Places
            </button>
            <button className="btn-plan" onClick={() => navigate("/planner")}>
              🤖 Plan My Trip
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
