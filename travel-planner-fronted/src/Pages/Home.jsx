import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { ContinentsSection } from "../components/ContinentsSection";
import "../assets/styles/global.css";

/* ═══════════════════════════════════════════
   GOLD DUST PARTICLE CANVAS
═══════════════════════════════════════════ */
function GoldDust() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.12 - 0.08,
      alpha: Math.random() * 0.55 + 0.1,
      flicker: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.flicker += 0.018;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const a = p.alpha * (0.55 + 0.45 * Math.sin(p.flicker));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.5,
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const FEATURES = [
  {
    icon: "🧭",
    title: "Personalized Itineraries",
    desc: "AI-powered travel plans based on your preferences and budget.",
    accent: "#c9a84c",
  },
  {
    icon: "🌍",
    title: "Top Destinations",
    desc: "Discover popular spots and hidden gems around the world.",
    accent: "#e8c97a",
  },
  {
    icon: "💸",
    title: "Budget Friendly",
    desc: "Find the best deals on flights, hotels, and activities.",
    accent: "#a07832",
  },
  {
    icon: "📅",
    title: "Smart Scheduling",
    desc: "Plan each day efficiently without missing key experiences.",
    accent: "#c9a84c",
  },
  {
    icon: "🧳",
    title: "All-in-One Planner",
    desc: "Manage itineraries, notes, and bookings in one place.",
    accent: "#e8c97a",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    desc: "Fully responsive design for mobile, tablet, and desktop.",
    accent: "#a07832",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Share Your Plan",
    desc: "Tell us your destination, dates, and travel preferences.",
    icon: "✈️",
  },
  {
    step: "02",
    title: "Get Smart Itinerary",
    desc: "Receive a personalized travel plan instantly.",
    icon: "🤖",
  },
  {
    step: "03",
    title: "Travel Confidently",
    desc: "Follow your itinerary and enjoy stress-free travel.",
    icon: "🎉",
  },
];

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [travelers, setTravelers] = useState("");

  /* Auto-cycle steps */
  useEffect(() => {
    const id = setInterval(() => setActiveStep((p) => (p + 1) % 3), 3000);
    return () => clearInterval(id);
  }, []);

  /* Navigate to planner with pre-filled query if destination entered */
  const handleSearch = () => {
    const query = [destination, dates, travelers].filter(Boolean).join(" · ");
    navigate(query ? `/planner?q=${encodeURIComponent(query)}` : "/planner");
  };

  /* Allow Enter key in search fields */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      style={{
        background: "#080705",
        color: "#e8e0cc",
        fontFamily: "'Jost', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --gold:    #c9a84c;
          --gold2:   #e8c97a;
          --gold3:   #a07832;
          --black:   #080705;
          --black2:  #0f0d0a;
          --black3:  #161310;
          --cream:   #f5eed8;
          --text:    #e8e0cc;
          --muted:   rgba(232,224,204,0.5);
          --border:  rgba(201,168,76,0.2);
          --glow:    rgba(201,168,76,0.3);
        }

        * { box-sizing: border-box; }

        /* HERO */
        .home-hero {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 7rem 1.5rem 5rem;
          overflow: hidden;
          background:
            radial-gradient(ellipse 90% 70% at 50% -10%, rgba(201,168,76,0.1) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 80% 110%, rgba(160,120,50,0.06) 0%, transparent 55%),
            #080705;
        }

        /* Earth stays from original global.css — just keep it */
        .home-hero .earth { z-index: 0; }

        /* Gold grid overlay */
        .home-hero-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        /* Vertical accent lines */
        .home-hero-vline {
          position: absolute; width: 1px; pointer-events: none; z-index: 1;
          background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.2), transparent);
          animation: vlineRise 2s ease both;
        }
        @keyframes vlineRise {
          from { opacity: 0; transform: scaleY(0); }
          to   { opacity: 1; transform: scaleY(1); }
        }

        /* Top center line */
        .home-hero::before {
          content: ""; position: absolute; z-index: 2;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 100px;
          background: linear-gradient(to bottom, transparent, var(--gold), transparent);
          animation: vlineRise 1.8s ease 0.3s both;
        }

        .home-hero-inner { position: relative; z-index: 10; max-width: 860px; margin: 0 auto; }

        /* Ornament */
        .home-ornament {
          display: inline-flex; align-items: center; gap: 12px;
          margin-bottom: 1.8rem;
          animation: heroFade 1s ease 0.2s both;
        }
        .home-ornament-line {
          height: 1px; width: 50px;
          background: linear-gradient(to right, transparent, var(--gold));
        }
        .home-ornament-line.r { background: linear-gradient(to left, transparent, var(--gold)); }
        .home-ornament-gem {
          width: 7px; height: 7px; background: var(--gold);
          transform: rotate(45deg); box-shadow: 0 0 10px var(--glow);
        }
        .home-ornament-text {
          font-size: 0.62rem; font-weight: 500; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--gold);
        }

        @keyframes heroFade {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Hero title */
        .home-hero-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(3rem, 9vw, 7rem);
          font-weight: 400; line-height: 1.02;
          letter-spacing: -0.01em; margin-bottom: 0.25em;
          animation: heroFade 1.1s ease 0.4s both;
        }
        .home-hero-title .line-white { color: var(--cream); display: block; }
        .home-hero-title .line-gold {
          display: block; font-style: italic;
          background: linear-gradient(135deg, var(--gold3), var(--gold), var(--gold2), var(--gold), var(--gold3));
          background-size: 250% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: heroFade 1.1s ease 0.4s both, goldShimmer 5s linear 1.5s infinite;
        }
        @keyframes goldShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 250% center; }
        }

        /* Deco divider */
        .home-deco {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin: 0.6rem 0 1.6rem;
          animation: heroFade 1.1s ease 0.5s both;
        }
        .home-deco-bar { height: 1px; width: 36px; background: rgba(201,168,76,0.35); }
        .home-deco-gem { width: 5px; height: 5px; background: var(--gold3); transform: rotate(45deg); }

        .home-hero-sub {
          font-size: clamp(0.9rem, 1.6vw, 1.05rem); font-weight: 300;
          color: rgba(232,224,204,0.7); line-height: 1.85;
          letter-spacing: 0.04em; margin-bottom: 2.5rem;
          max-width: 560px; margin-left: auto; margin-right: auto;
          animation: heroFade 1.1s ease 0.6s both;
        }

        /* SEARCH CARD */
        .home-search-card {
          background: rgba(15,13,10,0.82);
          border: 1px solid var(--border);
          border-top: 2px solid var(--gold3);
          padding: 1.8rem 2rem;
          margin-bottom: 2.5rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(201,168,76,0.05);
          animation: heroFade 1.1s ease 0.7s both;
          text-align: left;
        }

        .home-search-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
          margin-bottom: 1rem;
        }
        @media (max-width: 640px) { .home-search-grid { grid-template-columns: 1fr; } }

        .home-search-label {
          display: block; font-size: 0.65rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold3); margin-bottom: 0.5rem;
        }
        .home-search-input {
          width: 100%; padding: 12px 14px;
          background: rgba(201,168,76,0.04);
          border: 1px solid rgba(201,168,76,0.18);
          border-bottom: 2px solid rgba(201,168,76,0.25);
          color: var(--text); font-family: "Jost", sans-serif;
          font-size: 0.85rem; font-weight: 300; letter-spacing: 0.04em;
          outline: none; transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .home-search-input::placeholder { color: rgba(232,224,204,0.3); }
        .home-search-input:focus {
          border-color: var(--gold3); border-bottom-color: var(--gold);
          background: rgba(201,168,76,0.08);
          box-shadow: 0 0 0 1px rgba(201,168,76,0.15);
        }

        .home-search-hint {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.75rem; color: var(--muted); margin-bottom: 1.2rem;
          letter-spacing: 0.04em;
        }
        .home-search-hint span:first-child { color: var(--gold); }

        .home-search-btn {
          padding: 12px 32px;
          background: linear-gradient(135deg, var(--gold3), var(--gold), var(--gold2));
          background-size: 200% auto;
          border: none; color: #080705;
          font-family: "Jost", sans-serif; font-size: 0.78rem;
          font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          position: relative; overflow: hidden;
        }
        .home-search-btn:hover {
          background-position: right center;
          box-shadow: 0 6px 28px rgba(201,168,76,0.35);
          transform: translateY(-1px);
        }

        /* STATS */
        .home-stats {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 2.5rem;
          animation: heroFade 1.1s ease 0.9s both;
        }
        .home-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .home-stat-icon { font-size: 1.8rem; }
        .home-stat-label {
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--gold);
        }

        /* SCROLL CUE */
        .home-scroll-cue {
          position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 10;
          animation: heroFade 1.5s ease 1.4s both;
        }
        .home-scroll-text {
          font-size: 0.55rem; letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(201,168,76,0.5);
        }
        .home-scroll-track {
          width: 1px; height: 52px;
          background: rgba(201,168,76,0.15);
          position: relative; overflow: hidden;
        }
        .home-scroll-track::after {
          content: ""; position: absolute; top: -40%; left: 0;
          width: 100%; height: 40%; background: var(--gold);
          animation: scrollDrop 1.8s ease-in-out infinite;
        }
        @keyframes scrollDrop { 0% { top: -40%; } 100% { top: 140%; } }

        /* SECTION HEADER */
        .home-section-header { text-align: center; margin-bottom: 3.5rem; }
        .home-section-ornament {
          display: inline-flex; align-items: center; gap: 12px;
          margin-bottom: 1.2rem;
        }
        .home-section-line { height: 1px; width: 40px; background: linear-gradient(to right, transparent, var(--gold3)); }
        .home-section-line.r { background: linear-gradient(to left, transparent, var(--gold3)); }
        .home-section-tag {
          font-size: 0.6rem; color: var(--gold3); letter-spacing: 0.3em; text-transform: uppercase;
        }
        .home-section-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 400;
          color: var(--cream); line-height: 1.15;
        }
        .home-section-title em {
          font-style: italic;
          background: linear-gradient(135deg, var(--gold3), var(--gold), var(--gold2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .home-section-sub {
          font-size: 0.88rem; color: var(--muted); margin-top: 0.75rem;
          font-weight: 300; letter-spacing: 0.05em; line-height: 1.7;
        }

        /* FEATURES SECTION */
        .home-features-section {
          position: relative; z-index: 2; padding: 6rem 1.5rem;
          background:
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 60%),
            #0a0806;
        }
        .home-features-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem;
        }
        @media (max-width: 1024px) { .home-features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .home-features-grid { grid-template-columns: 1fr; } }

        .home-feature-card {
          background: rgba(15,13,10,0.8);
          border: 1px solid rgba(201,168,76,0.14);
          padding: 2rem 1.6rem;
          cursor: default; position: relative; overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1),
                      border-color 0.3s, box-shadow 0.4s;
        }
        .home-feature-card::before {
          content: ""; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold3), var(--gold), var(--gold3), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .home-feature-card:hover {
          transform: translateY(-7px);
          border-color: rgba(201,168,76,0.4);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 30px rgba(201,168,76,0.07);
        }
        .home-feature-card:hover::before { opacity: 1; }

        /* Corner accent */
        .home-feature-card::after {
          content: ""; position: absolute;
          top: 0; right: 0; width: 60px; height: 60px;
          background: radial-gradient(circle at top right, rgba(201,168,76,0.1), transparent 70%);
          opacity: 0; transition: opacity 0.3s;
        }
        .home-feature-card:hover::after { opacity: 1; }

        .home-feature-icon {
          font-size: 2.4rem; margin-bottom: 1rem; display: block;
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .home-feature-card:hover .home-feature-icon { transform: scale(1.15) rotate(8deg); }

        .home-feature-title {
          font-family: "Playfair Display", serif;
          font-size: 1.05rem; font-weight: 400;
          color: var(--cream); margin-bottom: 0.6rem;
          transition: color 0.25s;
        }
        .home-feature-card:hover .home-feature-title { color: var(--gold2); }

        .home-feature-desc {
          font-size: 0.82rem; color: var(--muted); line-height: 1.75; font-weight: 300;
          margin-bottom: 1rem;
        }
        .home-feature-link {
          font-size: 0.72rem; color: var(--gold3); letter-spacing: 0.12em;
          text-transform: uppercase; opacity: 0; transition: opacity 0.3s;
        }
        .home-feature-card:hover .home-feature-link { opacity: 1; }

        /* HOW IT WORKS */
        .home-how-section {
          position: relative; z-index: 2; padding: 6rem 1.5rem;
          background:
            linear-gradient(135deg, #0c0a07 0%, #0f0d08 50%, #0a0806 100%);
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          overflow: hidden;
        }

        /* Gold diamond grid pattern */
        .home-how-section::before {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, rgba(201,168,76,0.06) 1px, transparent 0);
          background-size: 44px 44px;
        }

        .home-steps-grid {
          max-width: 1000px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
          position: relative; z-index: 1;
        }
        @media (max-width: 768px) { .home-steps-grid { grid-template-columns: 1fr; } }

        .home-step-card {
          border: 1px solid rgba(201,168,76,0.15);
          padding: 2rem 1.6rem; text-align: center;
          position: relative; overflow: hidden;
          background: rgba(8,7,5,0.6); backdrop-filter: blur(10px);
          cursor: pointer; transition: all 0.4s ease;
        }
        .home-step-card.active,
        .home-step-card:hover {
          border-color: rgba(201,168,76,0.5);
          background: rgba(201,168,76,0.06);
          box-shadow: 0 0 40px rgba(201,168,76,0.08);
          transform: translateY(-4px);
        }

        /* Active top bar */
        .home-step-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .home-step-card.active .home-step-bar,
        .home-step-card:hover .home-step-bar { opacity: 1; }

        /* Progress fill when active */
        .home-step-progress {
          position: absolute; top: 0; left: 0; height: 2px;
          background: var(--gold2); width: 0%;
          animation: none;
        }
        .home-step-card.active .home-step-progress {
          animation: stepProgress 3s linear forwards;
        }
        @keyframes stepProgress { from { width: 0%; } to { width: 100%; } }

        .home-step-icon {
          font-size: 2.6rem; margin-bottom: 0.75rem; display: block;
          transition: transform 0.3s;
        }
        .home-step-card.active .home-step-icon,
        .home-step-card:hover .home-step-icon { transform: scale(1.12); }

        .home-step-num {
          font-family: "Playfair Display", serif; font-size: 3rem; font-weight: 400;
          color: rgba(201,168,76,0.12); line-height: 1; margin-bottom: 0.5rem;
          transition: color 0.3s;
        }
        .home-step-card.active .home-step-num,
        .home-step-card:hover .home-step-num { color: rgba(201,168,76,0.35); }

        .home-step-title {
          font-family: "Playfair Display", serif; font-size: 1.1rem; font-weight: 400;
          color: var(--cream); margin-bottom: 0.6rem;
        }
        .home-step-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.7; font-weight: 300; }

        /* Connector arrow between steps */
        .home-step-arrow {
          position: absolute; right: -1rem; top: 50%; transform: translateY(-50%);
          color: rgba(201,168,76,0.25); font-size: 1.2rem; z-index: 2;
        }
        @media (max-width: 768px) { .home-step-arrow { display: none; } }

        /* Step dots */
        .home-step-dots {
          display: flex; justify-content: center; gap: 10px; margin-top: 2.5rem;
          position: relative; z-index: 1;
        }
        .home-step-dot {
          height: 4px; border-radius: 2px; cursor: pointer;
          background: rgba(201,168,76,0.25);
          transition: all 0.3s; border: none;
        }
        .home-step-dot.active { background: var(--gold); width: 28px !important; }
        .home-step-dot:hover { background: rgba(201,168,76,0.5); }

        /* CTA */
        .home-cta-section {
          position: relative; z-index: 2; padding: 6rem 1.5rem;
          text-align: center;
          background:
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,168,76,0.05) 0%, transparent 60%),
            #080705;
        }

        .home-cta-btn {
          padding: 15px 42px; border: 1px solid;
          font-family: "Jost", sans-serif; font-size: 0.78rem;
          font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; transition: all 0.35s; position: relative; overflow: hidden;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          display: inline-flex; align-items: center; gap: 10px;
        }
        .home-cta-btn.primary {
          background: linear-gradient(135deg, var(--gold3), var(--gold));
          border-color: transparent; color: #080705; font-weight: 600;
        }
        .home-cta-btn.primary:hover {
          box-shadow: 0 8px 36px rgba(201,168,76,0.35);
          transform: translateY(-2px);
        }
        .home-cta-btn.secondary {
          background: transparent;
          border-color: rgba(201,168,76,0.35); color: var(--gold);
        }
        .home-cta-btn.secondary:hover {
          background: rgba(201,168,76,0.08);
          border-color: var(--gold);
          box-shadow: 0 0 30px rgba(201,168,76,0.12);
          transform: translateY(-2px);
        }
        .home-cta-btn .btn-arrow {
          display: inline-block; transition: transform 0.3s;
        }
        .home-cta-btn:hover .btn-arrow { transform: translateX(4px); }

        .home-cta-note {
          font-size: 0.78rem; color: rgba(232,224,204,0.3);
          margin-top: 1.8rem; line-height: 1.8;
          letter-spacing: 0.04em;
        }
        .home-cta-note strong { color: var(--gold3); font-weight: 500; }

        /* Footer deco */
        .home-footer-deco {
          text-align: center; padding: 2rem 1.5rem;
          border-top: 1px solid rgba(201,168,76,0.12);
        }
        .home-footer-deco-inner {
          display: inline-flex; align-items: center; gap: 14px;
        }
        .home-footer-line { height: 1px; width: 60px; background: linear-gradient(to right, transparent, var(--gold3)); }
        .home-footer-line.r { background: linear-gradient(to left, transparent, var(--gold3)); }
        .home-footer-mark { font-size: 0.58rem; color: rgba(201,168,76,0.4); letter-spacing: 0.3em; text-transform: uppercase; }
      `}</style>

      <GoldDust />

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="home-hero hero-section">
        <div className="home-hero-grid" />

        {/* Decorative vertical lines */}
        <div
          className="home-hero-vline"
          style={{
            left: "14%",
            top: "8%",
            height: "40%",
            animationDelay: "0.2s",
          }}
        />
        <div
          className="home-hero-vline"
          style={{
            left: "27%",
            top: "18%",
            height: "25%",
            animationDelay: "0.4s",
          }}
        />
        <div
          className="home-hero-vline"
          style={{
            right: "14%",
            top: "6%",
            height: "38%",
            animationDelay: "0.6s",
          }}
        />
        <div
          className="home-hero-vline"
          style={{
            right: "28%",
            top: "22%",
            height: "22%",
            animationDelay: "0.8s",
          }}
        />

        {/* Rotating Earth from global.css */}
        <div className="earth" style={{ zIndex: 0 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom,rgba(8,7,5,0.55),rgba(8,7,5,0.35),rgba(8,7,5,0.65))",
            zIndex: 1,
          }}
        />

        <div className="home-hero-inner">
          {/* Ornament */}
          <div className="home-ornament">
            <span className="home-ornament-line" />
            <span className="home-ornament-gem" />
            <span className="home-ornament-text">
              AI-Powered Travel Planning
            </span>
            <span className="home-ornament-gem" />
            <span className="home-ornament-line r" />
          </div>

          {/* Title */}
          <h1 className="home-hero-title">
            <span className="line-white">Explore Every</span>
            <span className="line-gold">Continent</span>
            <span
              className="line-white"
              style={{
                fontSize: "clamp(2rem,6vw,4.5rem)",
                fontStyle: "normal",
                opacity: 0.85,
              }}
            >
              with AI Guidance
            </span>
          </h1>

          {/* Deco */}
          <div className="home-deco">
            <span className="home-deco-bar" />
            <span className="home-deco-gem" />
            <span className="home-deco-bar" />
          </div>

          {/* Subtext */}
          <p className="home-hero-sub">
            Let our intelligent travel assistant craft your perfect journey
            across the world's most stunning destinations.
          </p>

          {/* Search card */}
          <div className="home-search-card">
            <div className="home-search-grid">
              <div>
                <label className="home-search-label">Where to?</label>
                <input
                  className="home-search-input"
                  type="text"
                  placeholder="Continents, countries, cities…"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div>
                <label className="home-search-label">When?</label>
                <input
                  className="home-search-input"
                  type="text"
                  placeholder="Select dates"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div>
                <label className="home-search-label">Travelers</label>
                <input
                  className="home-search-input"
                  type="text"
                  placeholder="2 guests"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <div className="home-search-hint">
              <span>✦</span>
              <span>Type naturally: "Family trip to Europe in summer"</span>
            </div>

            <button className="home-search-btn" onClick={handleSearch}>
              ✦ Start Planning
            </button>
          </div>

          {/* Stats */}
          <div className="home-stats">
            {[
              ["🌍", "7 Continents"],
              ["🗺️", "195+ Countries"],
              ["🤖", "AI Personalized"],
            ].map(([icon, label]) => (
              <div key={label} className="home-stat">
                <span className="home-stat-icon">{icon}</span>
                <span className="home-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="home-scroll-cue">
          <span className="home-scroll-text">Scroll</span>
          <div className="home-scroll-track" />
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURES
      ══════════════════════════════════ */}
      <section className="home-features-section">
        <div className="home-section-header">
          <div className="home-section-ornament">
            <span className="home-section-line" />
            <span className="home-section-tag">What We Offer</span>
            <span className="home-section-line r" />
          </div>
          <h2 className="home-section-title">
            Why Choose <em>Travel Planner?</em>
          </h2>
          <p className="home-section-sub">
            Every tool you need for the perfect journey, in one place.
          </p>
        </div>

        <div className="home-features-grid">
          {FEATURES.map((item, i) => (
            <div
              key={item.title}
              className="home-feature-card"
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="home-feature-icon">{item.icon}</span>
              <h3 className="home-feature-title">{item.title}</h3>
              <p className="home-feature-desc">{item.desc}</p>
              <span className="home-feature-link">Discover more →</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section className="home-how-section">
        <div className="home-section-header">
          <div className="home-section-ornament">
            <span className="home-section-line" />
            <span className="home-section-tag">The Process</span>
            <span className="home-section-line r" />
          </div>
          <h2 className="home-section-title">
            How It <em>Works</em>
          </h2>
        </div>

        <div className="home-steps-grid">
          {STEPS.map((item, i) => (
            <div
              key={item.step}
              className={`home-step-card ${activeStep === i ? "active" : ""}`}
              onClick={() => setActiveStep(i)}
              style={{ position: "relative" }}
            >
              <div className="home-step-bar" />
              {activeStep === i && <div className="home-step-progress" />}

              <span className="home-step-icon">{item.icon}</span>
              <div className="home-step-num">{item.step}</div>
              <h3 className="home-step-title">{item.title}</h3>
              <p className="home-step-desc">{item.desc}</p>

              {i < 2 && <span className="home-step-arrow">→</span>}
            </div>
          ))}
        </div>

        <div className="home-step-dots">
          {STEPS.map((_, i) => (
            <button
              key={i}
              className={`home-step-dot ${activeStep === i ? "active" : ""}`}
              style={{ width: activeStep === i ? 28 : 10 }}
              onClick={() => setActiveStep(i)}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          CONTINENTS (unchanged component)
      ══════════════════════════════════ */}
      <ContinentsSection />

      {/* ══════════════════════════════════
          CTA
      ══════════════════════════════════ */}
      <section className="home-cta-section">
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,168,76,0.06), transparent 70%)",
              animation: "ctaPulse 4s ease-in-out infinite",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <div
            className="home-section-ornament"
            style={{ marginBottom: "1.4rem" }}
          >
            <span className="home-section-line" />
            <span className="home-section-tag">Begin Your Journey</span>
            <span className="home-section-line r" />
          </div>

          <h2 className="home-section-title" style={{ marginBottom: "1rem" }}>
            Ready to Start Your <em>Journey?</em>
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--muted)",
              marginBottom: "2.5rem",
              maxWidth: "500px",
              margin: "0 auto 2.5rem",
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            Explore destinations on a map or create a detailed multi-day
            itinerary with AI assistance.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <button
              className="home-cta-btn secondary"
              onClick={() => navigate("/explore")}
            >
              🗺️ Explore Places <span className="btn-arrow">→</span>
            </button>
            <button
              className="home-cta-btn primary"
              onClick={() => navigate("/planner")}
            >
              🤖 Plan Itinerary <span className="btn-arrow">→</span>
            </button>
          </div>

          <p className="home-cta-note">
            <strong>Explore:</strong> Find nearby attractions, hotels &amp;
            restaurants with an interactive map
            <br />
            <strong>Plan:</strong> Get a complete multi-day itinerary with
            budget tracking
          </p>
        </div>

        <style>{`
          @keyframes ctaPulse {
            0%,100% { transform: scale(1); opacity: 0.8; }
            50%      { transform: scale(1.15); opacity: 1; }
          }
        `}</style>
      </section>

      <Footer />
    </div>
  );
}
