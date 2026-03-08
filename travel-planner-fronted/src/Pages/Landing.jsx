import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
      label: "Swiss Alps",
      tagline: "Peaks that touch the sky",
    },
    {
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80",
      label: "Santorini, Greece",
      tagline: "Where the sea meets the sky",
    },
    {
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80",
      label: "Machu Picchu",
      tagline: "Lost cities found again",
    },
    {
      url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80",
      label: "Kyoto, Japan",
      tagline: "Ancient tranquility awaits",
    },
  ];

  const features = [
    {
      icon: "🗺️",
      bg: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      title: "AI-Powered Planning",
      description:
        "Smart itinerary generation with personalized recommendations based on your preferences and travel style",
    },
    {
      icon: "🌤️",
      bg: "https://images.unsplash.com/photo-1504608524841-42584120d693?w=600&q=80",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      title: "Real-Time Weather",
      description:
        "Live weather updates and forecasts to help you plan the perfect trip with accurate climate information",
    },
    {
      icon: "💬",
      bg: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&q=80",
      gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
      title: "Travel Assistant",
      description:
        "24/7 AI chatbot to answer your questions and provide instant travel advice and destination insights",
    },
    {
      icon: "📋",
      bg: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      title: "Custom Itineraries",
      description:
        "Create, save, and manage personalized travel plans with detailed day-by-day schedules and activities",
    },
  ];

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          color: #f5f0e8;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          height: 100vh;
          min-height: 700px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transform: scale(1.08);
          transition: opacity 1.4s cubic-bezier(0.4,0,0.2,1), transform 6s cubic-bezier(0.4,0,0.2,1);
          will-change: opacity, transform;
        }

        .hero-slide.active {
          opacity: 1;
          transform: scale(1);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.25) 0%,
            rgba(0,0,0,0.55) 50%,
            rgba(0,0,0,0.85) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 24px;
          max-width: 900px;
          transform: translateY(calc(var(--scroll) * -0.3px));
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 8px 20px;
          border-radius: 999px;
          margin-bottom: 32px;
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.06);
          animation: fadeSlideUp 0.8s ease both;
        }

        .hero-eyebrow::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s ease infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 10vw, 120px);
          font-weight: 300;
          line-height: 0.92;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 24px;
          animation: fadeSlideUp 0.8s 0.15s ease both;
        }

        .hero-title em {
          font-style: italic;
          color: #fbbf24;
        }

        .hero-subtitle {
          font-size: clamp(15px, 2vw, 18px);
          font-weight: 300;
          color: rgba(255,255,255,0.72);
          line-height: 1.65;
          max-width: 560px;
          margin: 0 auto 48px;
          animation: fadeSlideUp 0.8s 0.3s ease both;
        }

        .hero-cta {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeSlideUp 0.8s 0.45s ease both;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #fbbf24;
          color: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 16px 36px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          box-shadow: 0 0 0 0 rgba(251,191,36,0.4);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          background: #f59e0b;
          box-shadow: 0 8px 30px rgba(251,191,36,0.45);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          padding: 16px 36px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }

        .btn-ghost:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.4);
        }

        /* Slide indicators */
        .slide-indicators {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .slide-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.35);
          border: none;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .slide-dot.active {
          width: 28px;
          background: #fbbf24;
        }

        .slide-label {
          position: absolute;
          bottom: 80px;
          right: 40px;
          z-index: 3;
          text-align: right;
        }

        .slide-location {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          font-style: italic;
          color: rgba(255,255,255,0.9);
          display: block;
        }

        .slide-tagline {
          font-size: 12px;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }

        /* Scroll indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 44px;
          left: 40px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .scroll-line {
          width: 40px;
          height: 1px;
          background: rgba(255,255,255,0.2);
          position: relative;
          overflow: hidden;
        }

        .scroll-line::after {
          content: '';
          position: absolute;
          left: -100%;
          top: 0;
          height: 100%;
          width: 100%;
          background: rgba(255,255,255,0.7);
          animation: scrollLine 2s ease infinite;
        }

        @keyframes scrollLine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* ── DESTINATION STRIP ── */
        .dest-strip {
          background: #0f0f0f;
          padding: 20px 0;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .dest-track {
          display: flex;
          gap: 48px;
          animation: marquee 30s linear infinite;
          white-space: nowrap;
        }

        .dest-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          flex-shrink: 0;
        }

        .dest-item span {
          font-size: 18px;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── FEATURES ── */
        .features {
          padding: 120px 24px;
          background: #0a0a0a;
          position: relative;
        }

        .features::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        }

        .section-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 80px;
        }

        .section-tag {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #fbbf24;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 300;
          line-height: 1.1;
          color: #f5f0e8;
          margin-bottom: 20px;
        }

        .section-desc {
          font-size: 16px;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          height: 380px;
          cursor: pointer;
          group: true;
        }

        .feature-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }

        .feature-card:hover .feature-card-bg {
          transform: scale(1.08);
        }

        .feature-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.92) 0%,
            rgba(0,0,0,0.5) 55%,
            rgba(0,0,0,0.15) 100%
          );
          transition: background 0.4s ease;
        }

        .feature-card:hover .feature-card-overlay {
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.96) 0%,
            rgba(0,0,0,0.65) 60%,
            rgba(0,0,0,0.3) 100%
          );
        }

        .feature-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 32px;
          transform: translateY(8px);
          transition: transform 0.4s ease;
        }

        .feature-card:hover .feature-card-content {
          transform: translateY(0);
        }

        .feature-icon-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          font-size: 22px;
          margin-bottom: 16px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
        }

        .feature-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 400;
          color: #fff;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .feature-card-desc {
          font-size: 13.5px;
          font-weight: 300;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s 0.05s ease, transform 0.4s 0.05s ease;
          max-height: 0;
          overflow: hidden;
        }

        .feature-card:hover .feature-card-desc {
          opacity: 1;
          transform: translateY(0);
          max-height: 200px;
        }

        /* ── PHOTO MOSAIC ── */
        .photo-mosaic {
          padding: 0 24px 120px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .mosaic-label {
          text-align: center;
          margin-bottom: 48px;
        }

        .mosaic-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          grid-template-rows: 260px 260px;
          gap: 12px;
          border-radius: 24px;
          overflow: hidden;
        }

        .mosaic-item {
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .mosaic-item:first-child {
          grid-row: 1 / 3;
        }

        .mosaic-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.2);
          transition: background 0.4s ease;
        }

        .mosaic-item:hover::after {
          background: rgba(0,0,0,0.05);
        }

        .mosaic-item-label {
          position: absolute;
          bottom: 16px;
          left: 16px;
          z-index: 1;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-style: italic;
          color: rgba(255,255,255,0.85);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .mosaic-item:hover .mosaic-item-label {
          opacity: 1;
        }

        /* ── CTA ── */
        .cta-section {
          position: relative;
          padding: 0;
          overflow: hidden;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cta-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1920&q=80');
          background-size: cover;
          background-position: center 30%;
          filter: brightness(0.45);
        }

        .cta-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 100px 24px;
          max-width: 700px;
        }

        .cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 300;
          line-height: 1.05;
          color: #fff;
          margin-bottom: 20px;
        }

        .cta-subtitle {
          font-size: 16px;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
          margin-bottom: 48px;
          line-height: 1.65;
        }

        .cta-btns {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Stats bar */
        .stats-bar {
          background: #111;
          padding: 48px 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .stats-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 80px;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px;
          font-weight: 300;
          color: #fbbf24;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .mosaic-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 200px 200px 200px;
          }
          .mosaic-item:first-child { grid-row: 1; }
          .slide-label, .scroll-indicator { display: none; }
          .stats-inner { gap: 40px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hero" ref={heroRef} style={{ "--scroll": scrollY }}>
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide ${i === activeSlide ? "active" : ""}`}
            style={{ backgroundImage: `url('${slide.url}')` }}
          />
        ))}
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-eyebrow">AI Travel Intelligence</div>
          <h1 className="hero-title">
            Plan Your <em>Next</em>
            <br />
            Adventure
          </h1>
          <p className="hero-subtitle">
            Experience seamless travel planning powered by AI — personalized
            itineraries, live weather, and a 24/7 assistant, all in one place.
          </p>
          <div className="hero-cta">
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
            >
              🚀 Get Started Free
            </button>
            <button className="btn-ghost" onClick={() => navigate("/login")}>
              ✨ Sign In
            </button>
          </div>
        </div>

        <div className="slide-label">
          <span className="slide-location">
            {heroSlides[activeSlide].label}
          </span>
          <span className="slide-tagline">
            {heroSlides[activeSlide].tagline}
          </span>
        </div>

        <div className="slide-indicators">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`slide-dot ${i === activeSlide ? "active" : ""}`}
              onClick={() => setActiveSlide(i)}
            />
          ))}
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line" />
          Scroll
        </div>
      </section>

      {/* ── DESTINATION STRIP ── */}
      <div className="dest-strip">
        <div className="dest-track">
          {[
            { icon: "🏔️", name: "Swiss Alps" },
            { icon: "🌊", name: "Maldives" },
            { icon: "🗼", name: "Paris" },
            { icon: "🏯", name: "Kyoto" },
            { icon: "🌅", name: "Bali" },
            { icon: "🏜️", name: "Sahara" },
            { icon: "🗽", name: "New York" },
            { icon: "🦁", name: "Serengeti" },
            { icon: "🏛️", name: "Rome" },
            { icon: "🌺", name: "Hawaii" },
            { icon: "🏔️", name: "Swiss Alps" },
            { icon: "🌊", name: "Maldives" },
            { icon: "🗼", name: "Paris" },
            { icon: "🏯", name: "Kyoto" },
            { icon: "🌅", name: "Bali" },
            { icon: "🏜️", name: "Sahara" },
            { icon: "🗽", name: "New York" },
            { icon: "🦁", name: "Serengeti" },
            { icon: "🏛️", name: "Rome" },
            { icon: "🌺", name: "Hawaii" },
          ].map((d, i) => (
            <div key={i} className="dest-item">
              <span>{d.icon}</span>
              {d.name}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="features">
        <div className="section-header">
          <div className="section-tag">Why Choose TravelPlanner?</div>
          <h2 className="section-title">Everything you need</h2>
          <p className="section-desc">
            AI-powered recommendations and personalized itineraries for your
            perfect journey, wherever that takes you.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div
                className="feature-card-bg"
                style={{ backgroundImage: `url('${f.bg}')` }}
              />
              <div className="feature-card-overlay" />
              <div className="feature-card-content">
                <div className="feature-icon-badge">{f.icon}</div>
                <div className="feature-card-title">{f.title}</div>
                <div className="feature-card-desc">{f.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Travelers</div>
          </div>
          <div className="stat">
            <div className="stat-number">120+</div>
            <div className="stat-label">Destinations</div>
          </div>
          <div className="stat">
            <div className="stat-number">4.9★</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">AI Support</div>
          </div>
        </div>
      </div>

      {/* ── PHOTO MOSAIC ── */}
      <div className="photo-mosaic">
        <div className="mosaic-label">
          <div className="section-tag">Destinations Await</div>
          <h3 className="section-title" style={{ fontSize: "36px" }}>
            Where will you go?
          </h3>
        </div>
        <div className="mosaic-grid">
          {[
            {
              url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
              label: "Santorini",
            },
            {
              url: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=600&q=80",
              label: "Bali",
            },
            {
              url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80",
              label: "Tokyo",
            },
            {
              url: "https://images.unsplash.com/photo-1550986922-de3a9bf6aa24?w=600&q=80",
              label: "Maldives",
            },
            {
              url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
              label: "Taj Mahal",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="mosaic-item"
              style={{ backgroundImage: `url('${item.url}')` }}
            >
              <span className="mosaic-item-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to start
            <br />
            your journey?
          </h2>
          <p className="cta-subtitle">
            Join thousands of travelers who plan smarter with TravelPlanner.
          </p>
          <div className="cta-btns">
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
            >
              🚀 Get Started
            </button>
            <button className="btn-ghost" onClick={() => navigate("/login")}>
              ✨ Already have an account? Sign In
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
