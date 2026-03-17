import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { ContinentsSection } from "../components/ContinentsSection";
import "../assets/styles/global.css";
import { apiUrl } from "../api/config";

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
        ctx.fillStyle = `rgba(99,102,241,${a})`;
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
   ANIMATED COUNTER HOOK
═══════════════════════════════════════════ */
function useCountUp(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

/* ═══════════════════════════════════════════
   STAT ITEM
═══════════════════════════════════════════ */
function StatItem({ stat, triggered, style }) {
  const count = useCountUp(stat.target, stat.duration, triggered);
  const display =
    count >= 1000
      ? (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + "k"
      : count;

  return (
    <div className="home-stats-counter-item" style={style}>
      <div className="home-stats-counter-orb" />
      <span className="home-stats-counter-icon">{stat.icon}</span>
      <div className="home-stats-counter-value">
        {display}
        <span className="home-stats-counter-suffix">{stat.suffix}</span>
      </div>
      <div className="home-stats-counter-label">{stat.label}</div>
      <div className="home-stats-counter-sub">{stat.sub}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STATS COUNTER SECTION
═══════════════════════════════════════════ */
const TRIP_STATS = [
  {
    icon: "🗺️",
    target: 48200,
    suffix: "+",
    label: "Trips Planned",
    sub: "AI-generated itineraries",
    duration: 2200,
  },
  {
    icon: "🌍",
    target: 195,
    suffix: "",
    label: "Countries Covered",
    sub: "Every nation on Earth",
    duration: 1600,
  },
  {
    icon: "⭐",
    target: 98,
    suffix: "%",
    label: "Happy Travelers",
    sub: "Based on user feedback",
    duration: 1800,
  },
  {
    icon: "🤖",
    target: 3,
    suffix: "s",
    label: "Avg. Plan Time",
    sub: "From prompt to itinerary",
    duration: 1400,
  },
];

function StatsCounterSection() {
  const sectionRef = useRef(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTriggered(true);
      },
      { threshold: 0.3 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="home-stats-section" ref={sectionRef}>
      <div className="home-section-header">
        <div className="home-section-ornament">
          <span className="home-section-line" />
          <span className="home-section-tag">By The Numbers</span>
          <span className="home-section-line r" />
        </div>
        <h2 className="home-section-title">
          Travel Planning <em>at Scale</em>
        </h2>
        <p className="home-section-sub">
          Real numbers behind every journey we help craft.
        </p>
      </div>

      <div className="home-stats-counter-grid">
        {TRIP_STATS.map((stat, i) => (
          <StatItem
            key={stat.label}
            stat={stat}
            triggered={triggered}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </section>
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
    accent: "#6366f1",
    details: [
      "Generates day-by-day plans based on destination, trip length, and travel style.",
      "Adjusts recommendations for budget levels like Budget, Moderate, and Luxury.",
      "Balances attractions, food, rest time, and local experiences in one flow.",
    ],
    ctaLabel: "Create My Itinerary",
    ctaPath: "/planner",
  },
  {
    icon: "🌍",
    title: "Top Destinations",
    desc: "Discover popular spots and hidden gems around the world.",
    accent: "#c4b5fd",
    details: [
      "Shows trending places plus lesser-known local gems for each region.",
      "Highlights seasonal travel ideas and weather-aware suggestions.",
      "Helps compare destinations by vibe, budget, and best visit time.",
    ],
    ctaLabel: "Explore Destinations",
    ctaPath: "/explore",
  },
  {
    icon: "💸",
    title: "Budget Friendly",
    desc: "Find the best deals on flights, hotels, and activities.",
    accent: "#ec4899",
    details: [
      "Estimates daily spend so you can plan with confidence before booking.",
      "Suggests value options for stays, transport, and must-do activities.",
      "Optimizes trip plans to reduce cost without missing key experiences.",
    ],
    ctaLabel: "Plan With Budget",
    ctaPath: "/planner",
  },
  {
    icon: "📅",
    title: "Smart Scheduling",
    desc: "Plan each day efficiently without missing key experiences.",
    accent: "#6366f1",
    details: [
      "Builds realistic timelines with travel time, meal windows, and breaks.",
      "Groups nearby places to avoid backtracking and save energy.",
      "Improves each day sequence for smooth mornings, afternoons, and evenings.",
    ],
    ctaLabel: "Build My Schedule",
    ctaPath: "/planner",
  },
  {
    icon: "🧳",
    title: "All-in-One Planner",
    desc: "Manage itineraries, notes, and bookings in one place.",
    accent: "#c4b5fd",
    details: [
      "Keeps trip plans, travel notes, and booking details in one dashboard.",
      "Makes it easy to revisit saved plans and update trips anytime.",
      "Reduces switching between multiple apps while preparing your journey.",
    ],
    ctaLabel: "Open My Plans",
    ctaPath: "/preferences",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    desc: "Fully responsive design for mobile, tablet, and desktop.",
    accent: "#ec4899",
    details: [
      "Designed for quick planning on phone and detailed editing on desktop.",
      "Maintains a consistent experience across screen sizes.",
      "Lets users continue planning from any device with minimal friction.",
    ],
    ctaLabel: "Start On Any Device",
    ctaPath: "/planner",
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

const WEATHER_ICONS = {
  Clouds: "clouds.png",
  Clear: "clear.png",
  Rain: "rain.png",
  Drizzle: "drizzle.png",
  Mist: "mist.png",
  Snow: "snow.png",
};

const HOME_AURORA_ORBS = [
  {
    className: "home-aurora-orb orb-a",
    style: {
      width: 520,
      height: 520,
      top: -140,
      left: -120,
    },
  },
  {
    className: "home-aurora-orb orb-b",
    style: {
      width: 460,
      height: 460,
      right: -120,
      bottom: -90,
    },
  },
  {
    className: "home-aurora-orb orb-c",
    style: {
      width: 360,
      height: 360,
      top: "36%",
      left: "52%",
      transform: "translate(-50%, -50%)",
    },
  },
];

const HOME_FLOATING_GLYPHS = [
  { symbol: "✈️", top: "22%", left: "10%", delay: "0s", duration: "6.5s" },
  { symbol: "🧭", top: "68%", left: "14%", delay: "0.8s", duration: "7.2s" },
  { symbol: "🌍", top: "18%", right: "12%", delay: "1.2s", duration: "6.8s" },
  { symbol: "💸", top: "62%", right: "10%", delay: "0.5s", duration: "7.6s" },
  { symbol: "📍", top: "42%", left: "6%", delay: "1.5s", duration: "6.9s" },
  { symbol: "🎒", top: "34%", right: "7%", delay: "0.3s", duration: "7.4s" },
];

const formatWeatherCondition = (weather) => {
  const description = weather?.weather?.[0]?.description;
  const fallback = weather?.weather?.[0]?.main || "Unknown";
  return description
    ? description.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : fallback;
};

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [travelers, setTravelers] = useState("");
  const [localWeather, setLocalWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(null);

  const getWeatherImage = (condition) =>
    WEATHER_ICONS[condition] || "clouds.png";

  const fetchCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setWeatherError("Geolocation is not supported on this browser.");
      setWeatherLoading(false);
      return;
    }

    setWeatherLoading(true);
    setWeatherError("");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            apiUrl(
              `/api/weather/current?lat=${coords.latitude}&lon=${coords.longitude}`,
            ),
          );

          let payload = null;
          try {
            payload = await response.json();
          } catch {
            payload = null;
          }

          if (!response.ok) {
            throw new Error(
              payload?.error ||
                "Weather service unavailable. Ensure backend is running.",
            );
          }

          setLocalWeather(payload);
          setWeatherLoading(false);
        } catch (err) {
          setWeatherError(
            err?.message ||
              "Failed to fetch weather for your current location.",
          );
          setWeatherLoading(false);
        }
      },
      () => {
        setWeatherError(
          "Location permission denied. Enable it to view local weather.",
        );
        setWeatherLoading(false);
      },
      { timeout: 10000 },
    );
  };

  /* Auto-cycle steps */
  useEffect(() => {
    const id = setInterval(() => setActiveStep((p) => (p + 1) % 3), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchCurrentLocationWeather();
  }, []);

  useEffect(() => {
    if (!selectedFeature) return;
    const onEscape = (event) => {
      if (event.key === "Escape") setSelectedFeature(null);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [selectedFeature]);

  const handleSearch = () => {
    const query = [destination, dates, travelers].filter(Boolean).join(" · ");
    navigate(query ? `/planner?q=${encodeURIComponent(query)}` : "/planner");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      style={{
        background: "#06070f",
        color: "#e8e0cc",
        fontFamily: "'Jost', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --gold:    #6366f1;
          --gold2:   #c4b5fd;
          --gold3:   #ec4899;
          --black:   #06070f;
          --black2:  #0b1020;
          --black3:  #161310;
          --cream:   #f5eed8;
          --text:    #e8e0cc;
          --muted:   rgba(232,224,204,0.5);
          --border:  rgba(99,102,241,0.2);
          --glow:    rgba(99,102,241,0.3);
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
            radial-gradient(ellipse 90% 70% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 80% 110%, rgba(160,120,50,0.03) 0%, transparent 55%),
            #06070f;
        }

        .home-aurora-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(14px);
          opacity: 0.75;
          z-index: 1;
          mix-blend-mode: screen;
        }
        .home-aurora-orb.orb-a {
          background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 68%);
          animation: homeAuroraA 16s ease-in-out infinite alternate;
        }
        .home-aurora-orb.orb-b {
          background: radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%);
          animation: homeAuroraB 18s ease-in-out infinite alternate;
        }
        .home-aurora-orb.orb-c {
          background: radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 72%);
          animation: homeAuroraC 20s ease-in-out infinite alternate;
        }

        .home-hero-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          background-image:
            radial-gradient(circle at 20% 25%, rgba(255,255,255,0.05) 0, transparent 1.2px),
            radial-gradient(circle at 75% 35%, rgba(255,255,255,0.04) 0, transparent 1px),
            radial-gradient(circle at 60% 80%, rgba(255,255,255,0.03) 0, transparent 1.4px);
          background-size: 220px 220px, 180px 180px, 260px 260px;
          opacity: 0.45;
        }

        .home-floating-glyph {
          position: absolute;
          z-index: 3;
          pointer-events: none;
          font-size: clamp(1.1rem, 1.8vw, 1.6rem);
          color: rgba(226, 232, 255, 0.42);
          text-shadow: 0 0 18px rgba(99,102,241,0.18);
          animation: homeFloatGlyph var(--glyph-duration, 7s) ease-in-out var(--glyph-delay, 0s) infinite alternate;
        }

        .home-hero .earth { z-index: 0; }

        .home-hero-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .home-hero-vline {
          position: absolute; width: 1px; pointer-events: none; z-index: 1;
          background: linear-gradient(to bottom, transparent, rgba(99,102,241,0.2), transparent);
          animation: vlineRise 2s ease both;
        }
        @keyframes vlineRise {
          from { opacity: 0; transform: scaleY(0); }
          to   { opacity: 1; transform: scaleY(1); }
        }

        .home-hero::before {
          content: ""; position: absolute; z-index: 2;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 100px;
          background: linear-gradient(to bottom, transparent, var(--gold), transparent);
          animation: vlineRise 1.8s ease 0.3s both;
        }

        .home-hero-inner { position: relative; z-index: 10; max-width: 860px; margin: 0 auto; }

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

        @keyframes homeAuroraA {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(70px, 42px) scale(1.18); }
        }

        @keyframes homeAuroraB {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(-64px, -34px) scale(1.16); }
        }

        @keyframes homeAuroraC {
          from { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          to { transform: translate(-50%, -50%) scale(1.26) rotate(14deg); }
        }

        @keyframes homeFloatGlyph {
          from { transform: translateY(0) rotate(-8deg); opacity: 0.22; }
          to { transform: translateY(-18px) rotate(8deg); opacity: 0.58; }
        }

        @keyframes homeFeatureReveal {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .home-hero-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(3rem, 9vw, 7rem);
          font-weight: 400; line-height: 1.02;
          letter-spacing: -0.01em; margin-bottom: 0.25em;
          animation: heroFade 1.1s ease 0.4s both;
          position: relative;
        }
        .home-hero-title::before {
          content: "";
          position: absolute;
          inset: -20px -30px;
          background: radial-gradient(circle 450px at 50% 0%, rgba(99,102,241,0.25) 0%, transparent 70%);
          z-index: -1;
          filter: blur(24px);
          opacity: 0;
          animation: titleGlowPulse 4s ease-in-out 1s infinite;
          pointer-events: none;
        }
        @keyframes titleGlowPulse {
          0%, 100% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1.05); }
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

        .home-deco {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin: 0.6rem 0 1.6rem;
          animation: heroFade 1.1s ease 0.5s both;
        }
        .home-deco-bar { height: 1px; width: 36px; background: rgba(99,102,241,0.35); }
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
          box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.05);
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
          background: rgba(99,102,241,0.04);
          border: 1px solid rgba(99,102,241,0.18);
          border-bottom: 2px solid rgba(99,102,241,0.25);
          color: var(--text); font-family: "Jost", sans-serif;
          font-size: 0.85rem; font-weight: 300; letter-spacing: 0.04em;
          outline: none; transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .home-search-input::placeholder { color: rgba(232,224,204,0.3); }
        .home-search-input:focus {
          border-color: var(--gold3); border-bottom-color: var(--gold);
          background: rgba(99,102,241,0.08);
          box-shadow: 0 0 0 1px rgba(99,102,241,0.15);
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
          border: none; color: #06070f;
          font-family: "Jost", sans-serif; font-size: 0.78rem;
          font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          position: relative; overflow: hidden;
        }
        .home-search-btn:hover {
          background-position: right center;
          box-shadow: 0 6px 28px rgba(99,102,241,0.35);
          transform: translateY(-1px);
        }

        /* LOCAL WEATHER CARD */
        .home-weather-card {
          margin-top: 1rem;
          border: 1px solid rgba(99,102,241,0.2);
          background: rgba(8, 7, 5, 0.72);
          backdrop-filter: blur(12px);
          padding: 1rem 1.1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .home-weather-left {
          display: flex; align-items: center; gap: 0.8rem; min-width: 0;
        }
        .home-weather-icon {
          width: 56px; height: 56px; object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35));
        }
        .home-weather-title {
          font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold3); margin-bottom: 0.2rem;
        }
        .home-weather-city {
          font-size: 0.9rem; color: var(--cream); margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;
        }
        .home-weather-meta {
          margin: 0; color: var(--muted); font-size: 0.76rem; letter-spacing: 0.04em;
        }
        .home-weather-right {
          text-align: right; display: flex; flex-direction: column;
          align-items: flex-end; gap: 0.4rem;
        }
        .home-weather-temp {
          font-family: "Playfair Display", serif; color: var(--gold2);
          font-size: 1.7rem; line-height: 1;
        }
        .home-weather-refresh {
          border: 1px solid rgba(99,102,241,0.28);
          background: rgba(99,102,241,0.08); color: var(--gold2);
          font-size: 0.62rem; letter-spacing: 0.13em; text-transform: uppercase;
          padding: 0.45rem 0.6rem; cursor: pointer; transition: all 0.2s ease;
        }
        .home-weather-refresh:hover {
          border-color: rgba(99,102,241,0.55); background: rgba(99,102,241,0.16);
        }
        .home-weather-message { margin: 0; color: var(--muted); font-size: 0.78rem; letter-spacing: 0.03em; }
        .home-weather-message.error { color: #fca5a5; }

        @media (max-width: 640px) {
          .home-weather-card { flex-direction: column; align-items: stretch; }
          .home-weather-right { align-items: flex-start; text-align: left; }
          .home-weather-city { max-width: none; }
          .home-floating-glyph { display: none; }
        }

        @media (max-width: 380px) {
          .home-hero { padding: 6.2rem 0.9rem 4rem; }
          .home-ornament-line { width: 24px; }
          .home-ornament-text { letter-spacing: 0.16em; font-size: 0.56rem; }
          .home-search-card { padding: 1rem 0.9rem; }
          .home-search-btn { width: 100%; padding: 11px 12px; letter-spacing: 0.1em; clip-path: none; }
          .home-feature-modal { padding: 1.05rem 0.9rem; }
          .home-feature-modal-title { font-size: 1.2rem; }
          .home-stats { gap: 1.1rem; }
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
        .home-scroll-text { font-size: 0.55rem; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(99,102,241,0.5); }
        .home-scroll-track { width: 1px; height: 52px; background: rgba(99,102,241,0.15); position: relative; overflow: hidden; }
        .home-scroll-track::after {
          content: ""; position: absolute; top: -40%; left: 0;
          width: 100%; height: 40%; background: var(--gold);
          animation: scrollDrop 1.8s ease-in-out infinite;
        }
        @keyframes scrollDrop { 0% { top: -40%; } 100% { top: 140%; } }

        /* SECTION HEADER */
        .home-section-header { text-align: center; margin-bottom: 3.5rem; }
        .home-section-ornament { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 1.2rem; }
        .home-section-line { height: 1px; width: 40px; background: linear-gradient(to right, transparent, var(--gold3)); }
        .home-section-line.r { background: linear-gradient(to left, transparent, var(--gold3)); }
        .home-section-tag { font-size: 0.6rem; color: var(--gold3); letter-spacing: 0.3em; text-transform: uppercase; }
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
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.04) 0%, transparent 60%),
            #0a0806;
        }
        .home-features-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem;
        }
        @media (max-width: 1024px) { .home-features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .home-features-grid { grid-template-columns: 1fr; } }

        .home-feature-card {
          background: rgba(15,13,10,0.8); border: 1px solid rgba(99,102,241,0.14);
          padding: 2rem 1.6rem; cursor: default; position: relative; overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.3s, box-shadow 0.4s;
          animation: homeFeatureReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .home-feature-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold3), var(--gold), var(--gold3), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .home-feature-card:hover { transform: translateY(-7px); border-color: rgba(99,102,241,0.4); box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.07); }
        .home-feature-card:hover::before { opacity: 1; }
        .home-feature-card::after {
          content: ""; position: absolute; top: 0; right: 0; width: 60px; height: 60px;
          background: radial-gradient(circle at top right, rgba(99,102,241,0.1), transparent 70%);
          opacity: 0; transition: opacity 0.3s;
        }
        .home-feature-card:hover::after { opacity: 1; }
        .home-feature-icon { font-size: 2.4rem; margin-bottom: 1rem; display: block; transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .home-feature-card:hover .home-feature-icon { transform: scale(1.15) rotate(8deg); }
        .home-feature-title { font-family: "Playfair Display", serif; font-size: 1.05rem; font-weight: 400; color: var(--cream); margin-bottom: 0.6rem; transition: color 0.25s; }
        .home-feature-card:hover .home-feature-title { color: var(--gold2); }
        .home-feature-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.75; font-weight: 300; margin-bottom: 1rem; }
        .home-feature-link { font-size: 0.72rem; color: var(--gold3); letter-spacing: 0.12em; text-transform: uppercase; opacity: 0; transition: opacity 0.3s; }
        .home-feature-link-btn { background: none; border: none; cursor: pointer; padding: 0; font-family: "Jost", sans-serif; font-weight: 500; }
        .home-feature-card:hover .home-feature-link { opacity: 1; }

        /* FEATURE MODAL */
        .home-feature-modal-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px); display: flex; align-items: center;
          justify-content: center; padding: 1rem; z-index: 1200;
        }
        .home-feature-modal {
          width: min(680px, 100%);
          background: linear-gradient(160deg, #11100d 0%, #0b0a08 100%);
          border: 1px solid rgba(201,168,76,0.32);
          box-shadow: 0 28px 70px rgba(0,0,0,0.55);
          position: relative; padding: 1.6rem 1.5rem;
          animation: heroFade 0.25s ease;
        }
        .home-feature-close {
          position: absolute; right: 0.8rem; top: 0.65rem;
          border: 1px solid rgba(201,168,76,0.3); background: rgba(201,168,76,0.06);
          color: var(--gold2); width: 34px; height: 34px; cursor: pointer; font-size: 1.2rem; line-height: 1;
        }
        .home-feature-modal-head { display: flex; align-items: center; gap: 0.7rem; padding-right: 2.2rem; margin-bottom: 0.9rem; }
        .home-feature-modal-icon { font-size: 1.8rem; }
        .home-feature-modal-title { margin: 0; font-family: "Playfair Display", serif; font-size: 1.45rem; color: var(--cream); }
        .home-feature-modal-desc { color: var(--muted); font-size: 0.9rem; line-height: 1.75; margin-bottom: 1rem; }
        .home-feature-modal-list { margin: 0; padding-left: 1.2rem; color: var(--text); display: grid; gap: 0.6rem; }
        .home-feature-modal-item { font-size: 0.86rem; line-height: 1.7; color: rgba(232,224,204,0.88); }
        .home-feature-modal-actions { margin-top: 1.3rem; display: flex; justify-content: flex-end; }
        .home-feature-modal-btn {
          border: none;
          background: linear-gradient(135deg, var(--gold3), var(--gold), var(--gold2));
          color: #06070f; padding: 0.62rem 1.1rem; font-family: "Jost", sans-serif;
          font-size: 0.74rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; cursor: pointer;
        }

        /* HOW IT WORKS */
        .home-how-section {
          position: relative; z-index: 2; padding: 6rem 1.5rem;
          background: linear-gradient(135deg, #0c0a07 0%, #0f0d08 50%, #0a0806 100%);
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); overflow: hidden;
        }
        .home-how-section::before {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, rgba(99,102,241,0.06) 1px, transparent 0);
          background-size: 44px 44px;
        }
        .home-steps-grid {
          max-width: 1000px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
          position: relative; z-index: 1;
        }
        @media (max-width: 768px) { .home-steps-grid { grid-template-columns: 1fr; } }

        .home-step-card {
          border: 1px solid rgba(99,102,241,0.15); padding: 2rem 1.6rem; text-align: center;
          position: relative; overflow: hidden; background: rgba(8,7,5,0.6); backdrop-filter: blur(10px);
          cursor: pointer; transition: all 0.4s ease;
          animation: homeFeatureReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .home-step-card.active, .home-step-card:hover {
          border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.06);
          box-shadow: 0 0 40px rgba(99,102,241,0.08); transform: translateY(-4px);
        }
        .home-step-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); opacity: 0; transition: opacity 0.3s; }
        .home-step-card.active .home-step-bar, .home-step-card:hover .home-step-bar { opacity: 1; }
        .home-step-progress { position: absolute; top: 0; left: 0; height: 2px; background: var(--gold2); width: 0%; animation: none; }
        .home-step-card.active .home-step-progress { animation: stepProgress 3s linear forwards; }
        @keyframes stepProgress { from { width: 0%; } to { width: 100%; } }
        .home-step-icon { font-size: 2.6rem; margin-bottom: 0.75rem; display: block; transition: transform 0.3s; }
        .home-step-card.active .home-step-icon, .home-step-card:hover .home-step-icon { transform: scale(1.12); }
        .home-step-num { font-family: "Playfair Display", serif; font-size: 3rem; font-weight: 400; color: rgba(99,102,241,0.12); line-height: 1; margin-bottom: 0.5rem; transition: color 0.3s; }
        .home-step-card.active .home-step-num, .home-step-card:hover .home-step-num { color: rgba(99,102,241,0.35); }
        .home-step-title { font-family: "Playfair Display", serif; font-size: 1.1rem; font-weight: 400; color: var(--cream); margin-bottom: 0.6rem; }
        .home-step-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.7; font-weight: 300; }
        .home-step-arrow { position: absolute; right: -1rem; top: 50%; transform: translateY(-50%); color: rgba(99,102,241,0.25); font-size: 1.2rem; z-index: 2; }
        @media (max-width: 768px) { .home-step-arrow { display: none; } }
        .home-step-dots { display: flex; justify-content: center; gap: 10px; margin-top: 2.5rem; position: relative; z-index: 1; }
        .home-step-dot { height: 4px; border-radius: 2px; cursor: pointer; background: rgba(99,102,241,0.25); transition: all 0.3s; border: none; }
        .home-step-dot.active { background: var(--gold); width: 28px !important; }
        .home-step-dot:hover { background: rgba(99,102,241,0.5); }

        /* ═══════════════════════════════════════════
           ANIMATED STATS COUNTER SECTION
        ═══════════════════════════════════════════ */
        .home-stats-section {
          position: relative; z-index: 2; padding: 6rem 1.5rem;
          background:
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(99,102,241,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 50%, rgba(236,72,153,0.04) 0%, transparent 55%),
            #08070a;
          border-top: 1px solid var(--border);
          overflow: hidden;
        }
        .home-stats-section::before {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .home-stats-counter-grid {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;
          position: relative; z-index: 1;
        }
        @media (max-width: 900px) { .home-stats-counter-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px)  { .home-stats-counter-grid { grid-template-columns: 1fr; } }

        .home-stats-counter-item {
          padding: 2.8rem 2rem; border: 1px solid rgba(99,102,241,0.1);
          background: rgba(10,9,7,0.7); text-align: center;
          position: relative; overflow: hidden;
          transition: border-color 0.4s, background 0.4s, transform 0.4s cubic-bezier(0.22,1,0.36,1);
          cursor: default;
          animation: homeFeatureReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .home-stats-counter-item:hover {
          border-color: rgba(99,102,241,0.35); background: rgba(99,102,241,0.05); transform: translateY(-6px);
        }
        .home-stats-counter-item::after {
          content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          opacity: 0; transition: opacity 0.35s;
        }
        .home-stats-counter-item:nth-child(1)::after { background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .home-stats-counter-item:nth-child(2)::after { background: linear-gradient(90deg, transparent, var(--gold3), transparent); }
        .home-stats-counter-item:nth-child(3)::after { background: linear-gradient(90deg, transparent, var(--gold2), transparent); }
        .home-stats-counter-item:nth-child(4)::after { background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .home-stats-counter-item:hover::after { opacity: 1; }

        .home-stats-counter-orb {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 120px; height: 120px; border-radius: 50%;
          pointer-events: none; opacity: 0; transition: opacity 0.5s;
        }
        .home-stats-counter-item:hover .home-stats-counter-orb { opacity: 1; }
        .home-stats-counter-item:nth-child(1) .home-stats-counter-orb { background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%); }
        .home-stats-counter-item:nth-child(2) .home-stats-counter-orb { background: radial-gradient(circle, rgba(236,72,153,0.12), transparent 70%); }
        .home-stats-counter-item:nth-child(3) .home-stats-counter-orb { background: radial-gradient(circle, rgba(196,181,253,0.12), transparent 70%); }
        .home-stats-counter-item:nth-child(4) .home-stats-counter-orb { background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%); }

        .home-stats-counter-icon {
          font-size: 2.2rem; display: block; margin-bottom: 1rem;
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .home-stats-counter-item:hover .home-stats-counter-icon { transform: scale(1.2) rotate(10deg); }

        .home-stats-counter-value {
          font-family: "Playfair Display", serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 400; line-height: 1;
          margin-bottom: 0.5rem; letter-spacing: -0.02em;
        }
        .home-stats-counter-item:nth-child(1) .home-stats-counter-value { color: var(--gold); }
        .home-stats-counter-item:nth-child(2) .home-stats-counter-value { color: var(--gold3); }
        .home-stats-counter-item:nth-child(3) .home-stats-counter-value { color: var(--gold2); }
        .home-stats-counter-item:nth-child(4) .home-stats-counter-value { color: var(--gold); }

        .home-stats-counter-suffix { font-family: "Playfair Display", serif; font-size: 0.55em; vertical-align: super; opacity: 0.75; }
        .home-stats-counter-label { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.45rem; }
        .home-stats-counter-sub { font-size: 0.76rem; color: rgba(232,224,204,0.3); font-weight: 300; line-height: 1.5; }

        /* CTA */
        .home-cta-section {
          position: relative; z-index: 2; padding: 6rem 1.5rem; text-align: center;
          background:
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(99,102,241,0.05) 0%, transparent 60%),
            #06070f;
        }
        .home-cta-btn {
          padding: 15px 42px; border: 1px solid;
          font-family: "Jost", sans-serif; font-size: 0.78rem;
          font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; transition: all 0.35s; position: relative; overflow: hidden;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          display: inline-flex; align-items: center; gap: 10px;
        }
        .home-cta-btn.primary { background: linear-gradient(135deg, var(--gold3), var(--gold)); border-color: transparent; color: #06070f; font-weight: 600; }
        .home-cta-btn.primary:hover { box-shadow: 0 8px 36px rgba(99,102,241,0.35); transform: translateY(-2px); }
        .home-cta-btn.secondary { background: transparent; border-color: rgba(99,102,241,0.35); color: var(--gold); }
        .home-cta-btn.secondary:hover { background: rgba(99,102,241,0.08); border-color: var(--gold); box-shadow: 0 0 30px rgba(99,102,241,0.12); transform: translateY(-2px); }
        .home-cta-btn .btn-arrow { display: inline-block; transition: transform 0.3s; }
        .home-cta-btn:hover .btn-arrow { transform: translateX(4px); }
        .home-cta-note { font-size: 0.78rem; color: rgba(232,224,204,0.3); margin-top: 1.8rem; line-height: 1.8; letter-spacing: 0.04em; }
        .home-cta-note strong { color: var(--gold3); font-weight: 500; }

        .home-footer-deco { text-align: center; padding: 2rem 1.5rem; border-top: 1px solid rgba(99,102,241,0.12); }
        .home-footer-deco-inner { display: inline-flex; align-items: center; gap: 14px; }
        .home-footer-line { height: 1px; width: 60px; background: linear-gradient(to right, transparent, var(--gold3)); }
        .home-footer-line.r { background: linear-gradient(to left, transparent, var(--gold3)); }
        .home-footer-mark { font-size: 0.58rem; color: rgba(99,102,241,0.4); letter-spacing: 0.3em; text-transform: uppercase; }
      `}</style>

      <GoldDust />

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="home-hero hero-section">
        {HOME_AURORA_ORBS.map((orb) => (
          <div
            key={orb.className}
            className={orb.className}
            style={orb.style}
          />
        ))}
        <div className="home-hero-noise" />
        {HOME_FLOATING_GLYPHS.map((glyph) => (
          <span
            key={`${glyph.symbol}-${glyph.top}-${glyph.left || glyph.right}`}
            className="home-floating-glyph"
            style={{
              top: glyph.top,
              left: glyph.left,
              right: glyph.right,
              ["--glyph-delay"]: glyph.delay,
              ["--glyph-duration"]: glyph.duration,
            }}
          >
            {glyph.symbol}
          </span>
        ))}
        <div className="home-hero-grid" />

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

        <div className="earth" style={{ zIndex: 0 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom,rgba(8,7,5,0.4),rgba(8,7,5,0.2),rgba(8,7,5,0.45))",
            zIndex: 1,
          }}
        />

        <div className="home-hero-inner">
          <div className="home-ornament">
            <span className="home-ornament-line" />
            <span className="home-ornament-gem" />
            <span className="home-ornament-text">
              AI-Powered Travel Planning
            </span>
            <span className="home-ornament-gem" />
            <span className="home-ornament-line r" />
          </div>

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

          <div className="home-deco">
            <span className="home-deco-bar" />
            <span className="home-deco-gem" />
            <span className="home-deco-bar" />
          </div>

          <p className="home-hero-sub">
            Let our intelligent travel assistant craft your perfect journey
            across the world's most stunning destinations.
          </p>

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
                  onClick={handleSearch}
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
                  onClick={handleSearch}
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
                  onClick={handleSearch}
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

            <div className="home-weather-card">
              {weatherLoading ? (
                <p className="home-weather-message">
                  Detecting your location and loading weather...
                </p>
              ) : weatherError ? (
                <>
                  <p className="home-weather-message error">{weatherError}</p>
                  <button
                    className="home-weather-refresh"
                    onClick={fetchCurrentLocationWeather}
                  >
                    Retry
                  </button>
                </>
              ) : (
                <>
                  <div className="home-weather-left">
                    <img
                      src={`/Weather/${getWeatherImage(localWeather?.weather?.[0]?.main)}`}
                      alt={localWeather?.weather?.[0]?.main || "Weather icon"}
                      className="home-weather-icon"
                    />
                    <div>
                      <p className="home-weather-title">Your Local Weather</p>
                      <p className="home-weather-city">
                        {localWeather?.name}, {localWeather?.sys?.country}
                      </p>
                      <p className="home-weather-meta">
                        {formatWeatherCondition(localWeather)} • Humidity{" "}
                        {localWeather?.main?.humidity}%
                      </p>
                    </div>
                  </div>
                  <div className="home-weather-right">
                    <span className="home-weather-temp">
                      {Math.round(localWeather?.main?.temp ?? 0)}°C
                    </span>
                    <button
                      className="home-weather-refresh"
                      onClick={fetchCurrentLocationWeather}
                    >
                      Refresh
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

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
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="home-feature-icon">{item.icon}</span>
              <h3 className="home-feature-title">{item.title}</h3>
              <p className="home-feature-desc">{item.desc}</p>
              <button
                type="button"
                className="home-feature-link home-feature-link-btn"
                onClick={() => setSelectedFeature(item)}
              >
                Discover more →
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedFeature && (
        <div
          className="home-feature-modal-backdrop"
          onClick={() => setSelectedFeature(null)}
        >
          <div
            className="home-feature-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="home-feature-close"
              onClick={() => setSelectedFeature(null)}
              aria-label="Close feature details"
            >
              ×
            </button>
            <div className="home-feature-modal-head">
              <span className="home-feature-modal-icon">
                {selectedFeature.icon}
              </span>
              <h3 className="home-feature-modal-title">
                {selectedFeature.title}
              </h3>
            </div>
            <p className="home-feature-modal-desc">{selectedFeature.desc}</p>
            <ul className="home-feature-modal-list">
              {selectedFeature.details.map((point) => (
                <li key={point} className="home-feature-modal-item">
                  {point}
                </li>
              ))}
            </ul>
            <div className="home-feature-modal-actions">
              <button
                type="button"
                className="home-feature-modal-btn"
                onClick={() => {
                  navigate(selectedFeature.ctaPath);
                  setSelectedFeature(null);
                }}
              >
                {selectedFeature.ctaLabel} →
              </button>
            </div>
          </div>
        </div>
      )}

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
              style={{ position: "relative", animationDelay: `${i * 0.1}s` }}
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
          CONTINENTS
      ══════════════════════════════════ */}
      <ContinentsSection />

      {/* ══════════════════════════════════
          STATS COUNTER
      ══════════════════════════════════ */}
      <StatsCounterSection />

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
                "radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)",
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
