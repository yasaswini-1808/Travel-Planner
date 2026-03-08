import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Close modal on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedService(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const services = [
    {
      title: "Flight Booking",
      desc: "AI-powered search across every airline. Best fares, instant confirmation.",
      icon: "✈",
      gradient: "linear-gradient(135deg,#3B82F6,#06B6D4)",
      shadow: "rgba(59,130,246,0.4)",
      tag: "FLIGHTS",
      details: {
        tagline: "Fly smarter, pay less",
        about:
          "Our AI scans millions of flight combinations in real-time to find you the absolute best fare. Whether it's a quick weekend getaway or a round-the-world adventure, we compare every airline, every route, and every layover option so you don't have to.",
        highlights: [
          "Price alerts when fares drop",
          "Flexible date search calendar",
          "Seat selection & meal preferences",
          "Instant e-ticket delivery",
        ],
        price: "From $9 service fee",
      },
    },
    {
      title: "Hotel Booking",
      desc: "Curated stays tailored to your comfort, style, and budget.",
      icon: "🏨",
      gradient: "linear-gradient(135deg,#8B5CF6,#EC4899)",
      shadow: "rgba(139,92,246,0.4)",
      tag: "HOTELS",
      details: {
        tagline: "Sleep well, wherever you go",
        about:
          "From boutique B&Bs to 5-star resorts, we surface only the highest-rated properties matched to your preferences. Filter by pool, breakfast, view, pet-friendly, and more — with real verified reviews.",
        highlights: [
          "1M+ properties worldwide",
          "Free cancellation options",
          "Verified guest reviews only",
          "Exclusive member-only rates",
        ],
        price: "Best rate guarantee",
      },
    },
    {
      title: "AI Itinerary",
      desc: "Smart, fully personalized day-by-day travel plans built by AI.",
      icon: "🧠",
      gradient: "linear-gradient(135deg,#F43F5E,#F97316)",
      shadow: "rgba(244,63,94,0.4)",
      tag: "AI POWERED",
      details: {
        tagline: "Your trip, planned perfectly",
        about:
          "Tell us your destination, dates, and vibe — our AI builds a complete itinerary with timings, restaurant recommendations, must-see spots, and local tips. Adjust any detail with a single click and share it with travel companions.",
        highlights: [
          "Day-by-day hourly schedule",
          "Restaurant & activity bookings",
          "Live traffic & weather aware",
          "Shareable trip link",
        ],
        price: "Free for all users",
      },
    },
    {
      title: "Travel Insurance",
      desc: "Comprehensive coverage with trusted global insurance partners.",
      icon: "🛡️",
      gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",
      shadow: "rgba(245,158,11,0.4)",
      tag: "PROTECTION",
      details: {
        tagline: "Travel with total confidence",
        about:
          "Accidents happen. Our insurance partners cover trip cancellations, medical emergencies, lost luggage, flight delays, and more — so a bad day doesn't ruin your entire journey.",
        highlights: [
          "Medical coverage up to $1M",
          "24/7 emergency helpline",
          "Trip cancellation protection",
          "Lost baggage reimbursement",
        ],
        price: "From $3/day",
      },
    },
    {
      title: "Car Rentals",
      desc: "Competitive rates from top providers at destinations worldwide.",
      icon: "🚗",
      gradient: "linear-gradient(135deg,#10B981,#06B6D4)",
      shadow: "rgba(16,185,129,0.4)",
      tag: "MOBILITY",
      details: {
        tagline: "Hit the road your way",
        about:
          "Compare cars from Hertz, Avis, Enterprise, and local providers side by side. No hidden fees, transparent pricing, and free cancellation up to 48 hours before pickup — electric and luxury options available.",
        highlights: [
          "500+ car rental partners",
          "Electric & luxury options",
          "Airport pickup available",
          "No hidden fees ever",
        ],
        price: "From $18/day",
      },
    },
    {
      title: "Tour Packages",
      desc: "Handcrafted tours led by local experts and seasoned guides.",
      icon: "🗺️",
      gradient: "linear-gradient(135deg,#EF4444,#EC4899)",
      shadow: "rgba(239,68,68,0.4)",
      tag: "EXPERIENCES",
      details: {
        tagline: "See the world like a local",
        about:
          "Our curated packages combine accommodation, guided tours, and unique cultural experiences into one seamless booking. Small groups, expert local guides, and memories that last a lifetime.",
        highlights: [
          "Small groups (max 12 people)",
          "Local certified guides",
          "Meals & entry fees included",
          "Private custom tours available",
        ],
        price: "From $299/person",
      },
    },
    {
      title: "24/7 Support",
      desc: "Round-the-clock assistance wherever in the world you are.",
      icon: "💬",
      gradient: "linear-gradient(135deg,#6366F1,#3B82F6)",
      shadow: "rgba(99,102,241,0.4)",
      tag: "SUPPORT",
      details: {
        tagline: "We're always here for you",
        about:
          "Stuck at an airport at 3am? Lost your passport? Flight cancelled? Our dedicated support team is available 24/7 via live chat, phone, and email in 15 languages to get you back on track fast.",
        highlights: [
          "Average response under 2 min",
          "15 languages supported",
          "Real humans, not bots",
          "Emergency rebooking included",
        ],
        price: "Free for all bookings",
      },
    },
    {
      title: "Visa Assistance",
      desc: "Expert help navigating requirements, applications, and approvals.",
      icon: "📋",
      gradient: "linear-gradient(135deg,#14B8A6,#6366F1)",
      shadow: "rgba(20,184,166,0.4)",
      tag: "VISA",
      details: {
        tagline: "Skip the paperwork stress",
        about:
          "Visa requirements are confusing and constantly changing. Our experts check your eligibility, prepare your documents, fill out applications, and track your approval — all in one place.",
        highlights: [
          "195 countries covered",
          "Document checklist builder",
          "Application status tracking",
          "Express processing available",
        ],
        price: "From $29/application",
      },
    },
  ];

  const features = [
    {
      icon: "⚡",
      title: "Instant Booking",
      desc: "Flights, hotels, and experiences confirmed in under 10 seconds — no waiting, no back-and-forth.",
      stat: "10s",
      color: "#F59E0B",
    },
    {
      icon: "💰",
      title: "Price Guarantee",
      desc: "Find it cheaper? We'll match the price or refund the difference. Zero risk, always.",
      stat: "0 risk",
      color: "#10B981",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      desc: "Military-grade 256-bit encryption on every single transaction and personal detail.",
      stat: "256bit",
      color: "#6366F1",
    },
    {
      icon: "🌍",
      title: "Worldwide Access",
      desc: "We operate across 200+ countries and thousands of destinations worldwide.",
      stat: "200+",
      color: "#EC4899",
    },
  ];

  const s = selectedService;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06070F",
        fontFamily: "'Outfit', sans-serif",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .mesh-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(236,72,153,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 60% 30%, rgba(6,182,212,0.08) 0%, transparent 50%);
        }
        .cursor-glow {
          position: fixed; pointer-events: none; z-index: 1;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: left 0.12s ease, top 0.12s ease;
        }

        /* Service card */
        .svc-card {
          position: relative; border-radius: 24px; padding: 30px 26px 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden; cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          display: flex; flex-direction: column;
        }
        .svc-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 24px;
          background: var(--g); opacity: 0; transition: opacity 0.4s ease;
        }
        .svc-card:hover { transform: translateY(-8px) scale(1.02); border-color: transparent; box-shadow: 0 24px 60px rgba(0,0,0,0.4); }
        .svc-card:hover::before { opacity: 0.12; }
        .svc-card:hover .card-glow { opacity: 1; }
        .svc-card:hover .icon-wrap { transform: scale(1.12) rotate(-6deg); }

        .card-glow {
          position: absolute; inset: -1px; border-radius: 24px;
          background: var(--g); opacity: 0; transition: opacity 0.4s ease;
          z-index: -1; filter: blur(18px);
        }
        .icon-wrap {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 20px;
          background: var(--g);
          box-shadow: 0 8px 28px var(--sh);
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          flex-shrink: 0; position: relative; z-index: 1;
        }

        /* Explore button — always visible */
        .explore-btn {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: auto; padding-top: 18px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
          border: none; background: none; cursor: pointer;
          background: var(--g);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          transition: gap 0.25s ease;
          position: relative; z-index: 1;
        }
        .explore-btn::after {
          content: '→';
          background: var(--g);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          transition: transform 0.25s ease; display: inline-block;
        }
        .svc-card:hover .explore-btn { gap: 10px; }
        .svc-card:hover .explore-btn::after { transform: translateX(4px); }

        /* Feature tabs */
        .feat-tab {
          padding: 18px 22px; border-radius: 16px; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          transition: all 0.25s ease; display: flex; align-items: center; gap: 14px;
        }
        .feat-tab:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
        .feat-tab.active { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.18); }

        /* CTA buttons */
        .cta-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 38px; border-radius: 100px; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700;
          background: linear-gradient(135deg, #6366F1, #EC4899);
          color: #fff; position: relative; overflow: hidden;
          transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 8px 32px rgba(99,102,241,0.5);
        }
        .cta-primary:hover { transform: scale(1.05); box-shadow: 0 12px 50px rgba(99,102,241,0.7); }
        .cta-primary svg { transition: transform 0.3s ease; }
        .cta-primary:hover svg { transform: translateX(5px); }

        .cta-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 32px; border-radius: 100px; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
          background: transparent; color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.3s ease;
        }
        .cta-secondary:hover { background: rgba(255,255,255,0.07); color: #fff; border-color: rgba(255,255,255,0.3); }

        .badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 14px; border-radius: 100px;
          font-size: 11px; font-weight: 600; letter-spacing: 1px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6);
        }

        .stat-item {
          text-align: center; padding: 30px 16px;
          border-right: 1px solid rgba(255,255,255,0.06);
          transition: background 0.3s ease;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: rgba(255,255,255,0.03); }

        /* ── MODAL ── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: fadeOverlay 0.25s ease;
        }
        @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }

        .modal-box {
          background: #0E0F1A;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 28px; overflow: hidden;
          width: 100%; max-width: 660px;
          animation: slideUp 0.3s cubic-bezier(0.23,1,0.32,1);
          position: relative;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .modal-header {
          padding: 40px 44px 32px;
          position: relative;
        }
        .modal-body { padding: 0 44px 44px; }

        .highlight-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          font-size: 14px; color: rgba(255,255,255,0.8);
          transition: background 0.2s ease;
        }
        .highlight-item:hover { background: rgba(255,255,255,0.07); }

        .modal-close {
          position: absolute; top: 20px; right: 20px;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.6); font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease;
        }
        .modal-close:hover { background: rgba(255,255,255,0.12); color: #fff; }

        /* Orbs */
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,-40px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px,30px); } }
        .orb1 { animation: float1 12s ease-in-out infinite; }
        .orb2 { animation: float2 16s ease-in-out infinite; }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #a78bfa 40%, #f472b6 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
        .fade-in { opacity: 0; transform: translateY(24px); animation: fadeIn 0.7s ease forwards; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #06070F; }
        ::-webkit-scrollbar-thumb { background: #6366F1; border-radius: 4px; }
      `}</style>

      {/* Background */}
      <div className="mesh-bg" />
      <div
        className="cursor-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      <div
        className="orb1"
        style={{
          position: "fixed",
          top: "15%",
          left: "5%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        className="orb2"
        style={{
          position: "fixed",
          bottom: "10%",
          right: "5%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.1), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── SERVICE DETAIL MODAL ── */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Gradient top bar */}
            <div style={{ height: 5, background: selectedService.gradient }} />

            <div className="modal-header">
              <button
                className="modal-close"
                onClick={() => setSelectedService(null)}
              >
                ✕
              </button>

              {/* Icon + tag */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    background: selectedService.gradient,
                    boxShadow: `0 8px 32px ${selectedService.shadow}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                  }}
                >
                  {selectedService.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "2px",
                      color: "rgba(255,255,255,0.35)",
                      marginBottom: 4,
                    }}
                  >
                    {selectedService.tag}
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 28,
                      fontWeight: 400,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {selectedService.title}
                  </h2>
                </div>
              </div>

              {/* Tagline */}
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  marginBottom: 12,
                  background: selectedService.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {selectedService.details.tagline}
              </div>

              {/* About */}
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.85,
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 300,
                }}
              >
                {selectedService.details.about}
              </p>
            </div>

            <div className="modal-body">
              {/* Divider */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  marginBottom: 24,
                }}
              />

              {/* What's included */}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: 14,
                }}
              >
                WHAT'S INCLUDED
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 28,
                }}
              >
                {selectedService.details.highlights.map((h, i) => (
                  <div key={i} className="highlight-item">
                    <span
                      style={{
                        fontSize: 16,
                        background: selectedService.gradient,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {h}
                  </div>
                ))}
              </div>

              {/* Pricing + CTA */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.3)",
                      marginBottom: 4,
                      letterSpacing: "1px",
                    }}
                  >
                    PRICING
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      background: selectedService.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {selectedService.details.price}
                  </div>
                </div>
                <button
                  className="cta-primary"
                  style={{
                    background: selectedService.gradient,
                    boxShadow: `0 8px 32px ${selectedService.shadow}`,
                    fontSize: 14,
                    padding: "14px 32px",
                  }}
                  onClick={() => navigate("/login")}
                >
                  <span>Book Now</span>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          padding: "20px 60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          background: "rgba(6,7,15,0.8)",
        }}
      >
        <div
          style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}
        >
          Wander
          <span
            style={{
              background: "linear-gradient(135deg,#6366F1,#EC4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            lust
          </span>
        </div>
        <div className="badge">
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22C55E",
              display: "inline-block",
              boxShadow: "0 0 8px #22C55E",
            }}
          />
          All services live
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "100px 60px 80px",
          textAlign: "center",
        }}
      >
        <div
          className="badge fade-in"
          style={{ marginBottom: 28, animationDelay: "0.1s" }}
        >
          ✦ Everything you need to travel
        </div>
        <h1
          className="fade-in"
          style={{
            animationDelay: "0.2s",
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(56px, 9vw, 108px)",
            lineHeight: 0.92,
            letterSpacing: "-3px",
            marginBottom: 32,
            fontWeight: 400,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.9)" }}>Every journey</span>
          <br />
          <em className="shimmer-text">perfectly covered</em>
        </h1>
        <p
          className="fade-in"
          style={{
            animationDelay: "0.35s",
            fontSize: 18,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.4)",
            maxWidth: 540,
            margin: "0 auto 48px",
            fontWeight: 300,
          }}
        >
          Eight powerful services covering every step of your journey — from AI
          planning to 24/7 support.
        </p>
        <div
          className="fade-in"
          style={{
            animationDelay: "0.5s",
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <button className="cta-primary" onClick={() => navigate("/explore")}>
            Start Exploring
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
          <button className="cta-secondary" onClick={() => navigate("/deals")}>
            View All Deals
          </button>
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1320px",
          margin: "0 auto 20px",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            overflow: "hidden",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(10px)",
          }}
        >
          {[
            ["500K+", "Happy travelers"],
            ["200+", "Countries covered"],
            ["8", "Premium services"],
            ["99.8%", "Satisfaction rate"],
          ].map(([num, label], i) => (
            <div key={i} className="stat-item">
              <div
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: "clamp(30px,4vw,46px)",
                  fontStyle: "italic",
                  background: "linear-gradient(135deg,#a78bfa,#f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 6,
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "60px 60px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="badge" style={{ marginBottom: 14 }}>
            Our Services
          </div>
          <h2
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(34px,5vw,54px)",
              fontWeight: 400,
              letterSpacing: "-1.5px",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Built for every traveler
          </h2>
          <p
            style={{
              marginTop: 12,
              fontSize: 14,
              color: "rgba(255,255,255,0.35)",
              fontWeight: 300,
            }}
          >
            Click{" "}
            <strong style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
              Explore
            </strong>{" "}
            on any card to learn more
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 18,
          }}
        >
          {services.map((svc, i) => (
            <div
              key={i}
              className="svc-card"
              style={{ "--g": svc.gradient, "--sh": svc.shadow }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="card-glow" style={{ background: svc.gradient }} />

              {/* Top tag */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 18,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                {svc.tag}
              </div>

              <div className="icon-wrap">{svc.icon}</div>

              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 10,
                  color: "#fff",
                  position: "relative",
                  zIndex: 1,
                  lineHeight: 1.2,
                }}
              >
                {svc.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.75,
                  fontWeight: 300,
                  position: "relative",
                  zIndex: 1,
                  flexGrow: 1,
                }}
              >
                {svc.desc}
              </p>

              {/* Always-visible Explore button */}
              <button
                className="explore-btn"
                onClick={() => setSelectedService(svc)}
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 60px 80px",
        }}
      >
        <div
          style={{
            borderRadius: 32,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr" }}>
            <div
              style={{
                padding: "52px 40px",
                borderRight: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="badge" style={{ marginBottom: 20 }}>
                Why Us
              </div>
              <h2
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 34,
                  fontWeight: 400,
                  letterSpacing: "-1px",
                  marginBottom: 28,
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.15,
                }}
              >
                Trusted by half a million travelers
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {features.map((f, i) => (
                  <div
                    key={i}
                    className={`feat-tab${activeFeature === i ? " active" : ""}`}
                    onClick={() => setActiveFeature(i)}
                  >
                    <div style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color:
                          activeFeature === i
                            ? "#fff"
                            : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {f.title}
                    </div>
                    {activeFeature === i && (
                      <div
                        style={{
                          marginLeft: "auto",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: f.color,
                          boxShadow: `0 0 10px ${f.color}`,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div
              key={activeFeature}
              style={{
                padding: "52px 52px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                animation: "fadeIn 0.4s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: "clamp(72px,10vw,120px)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  lineHeight: 0.9,
                  marginBottom: 24,
                  background: `linear-gradient(135deg, ${features[activeFeature].color}, rgba(255,255,255,0.2))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {features[activeFeature].stat}
              </div>
              <h3
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  marginBottom: 14,
                  color: "#fff",
                }}
              >
                {features[activeFeature].title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.8,
                  fontWeight: 300,
                  maxWidth: 380,
                }}
              >
                {features[activeFeature].desc}
              </p>
              <div
                style={{
                  marginTop: 28,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 18px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  alignSelf: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: features[activeFeature].color,
                    boxShadow: `0 0 12px ${features[activeFeature].color}`,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: 500,
                  }}
                >
                  Verified by our team
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 60px 100px",
        }}
      >
        <div
          style={{
            borderRadius: 40,
            padding: "76px 68px",
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.15) 50%, rgba(6,182,212,0.1) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(30px)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 40,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -80,
              right: 80,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -30,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="badge" style={{ marginBottom: 20 }}>
              ✦ Free to start
            </div>
            <h2
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "clamp(36px,5vw,62px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#fff",
                lineHeight: 1.05,
                letterSpacing: "-1.5px",
              }}
            >
              Your next adventure
              <br />
              starts right now.
            </h2>
            <p
              style={{
                marginTop: 14,
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                fontWeight: 300,
              }}
            >
              No credit card required. Set up in 60 seconds.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              position: "relative",
              zIndex: 1,
            }}
          >
            <button className="cta-primary" onClick={() => navigate("/login")}>
              Get Started Free
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {["🔒 Secure", "No spam", "Cancel anytime"].map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    fontWeight: 500,
                  }}
                >
                  {t}
                  {i < 2 ? " ·" : ""}&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
