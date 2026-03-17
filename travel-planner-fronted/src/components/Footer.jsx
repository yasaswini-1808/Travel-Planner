import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const footerLinks = {
    Product: [
      { name: "Features", path: "/features" },
      { name: "Pricing", path: "/pricing" },
      { name: "Services", path: "/services" },
      { name: "Deals", path: "/deals" },
    ],
    Company: [
      { name: "About Us", path: "/about" },
      { name: "Blogs", path: "/blogs" },
      { name: "Careers", path: "/careers" },
      { name: "Contact", path: "/contact" },
    ],
    Support: [
      { name: "Help Center", path: "/help" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "FAQs", path: "/faqs" },
    ],
  };

  const socialLinks = [
    { name: "Twitter / X", icon: "𝕏", url: "#", color: "#E8E4DC" },
    { name: "Facebook", icon: "f", url: "#", color: "#3B82F6" },
    { name: "Instagram", icon: "◈", url: "#", color: "#EC4899" },
    { name: "LinkedIn", icon: "in", url: "#", color: "#06B6D4" },
  ];

  return (
    <footer
      style={{
        background: "#06070F",
        fontFamily: "'Syne', sans-serif",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .ft-link {
          background: none; border: none; cursor: pointer; padding: 0;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s ease;
          text-align: left;
        }
        .ft-link:hover { color: rgba(255,255,255,0.85); }

        .ft-social {
          width: 40px; height: 40px; border-radius: 11px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; cursor: pointer;
          transition: all 0.25s ease; text-decoration: none; color: rgba(255,255,255,0.5);
        }
        .ft-social:hover {
          background: rgba(255,255,255,0.1); color: #fff;
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-3px);
        }

        .ft-bottom-link {
          background: none; border: none; cursor: pointer; padding: 0;
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          color: rgba(255,255,255,0.3); transition: color 0.2s ease;
        }
        .ft-bottom-link:hover { color: rgba(255,255,255,0.7); }

        .ft-col-title {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: rgba(255,255,255,0.5);
          margin-bottom: 20px;
        }

        /* Responsive */
        @media(max-width:768px){
          .ft-main-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .ft-links-grid { grid-template-columns: repeat(2,1fr) !important; }
          .ft-bottom-row { flex-direction: column !important; gap: 12px !important; text-align: center; }
          .ft-wrap { padding: 60px 20px 40px !important; }
        }
        @media(max-width:480px){
          .ft-links-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Top gradient accent */}
      <div
        style={{
          height: 2,
          background:
            "linear-gradient(90deg, #6366F1, #06B6D4, #F59E0B, #EC4899, #6366F1)",
          backgroundSize: "200% auto",
          animation: "shimmer 4s linear infinite",
        }}
      />
      <style>{`@keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}`}</style>

      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.07), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="ft-wrap"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "80px 48px 48px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── MAIN GRID ── */}
        <div
          className="ft-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr",
            gap: 80,
            marginBottom: 64,
          }}
        >
          {/* Brand column */}
          <div>
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#6366F1,#06B6D4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                  flexShrink: 0,
                }}
              >
                ✈️
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  color: "#E8E4DC",
                }}
              >
                Travel
                <span
                  style={{
                    background: "linear-gradient(90deg,#6366F1,#06B6D4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Planner
                </span>
              </span>
            </div>

            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.85,
                maxWidth: 380,
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 300,
                marginBottom: 28,
              }}
            >
              Your intelligent travel companion. Plan smarter trips, discover
              amazing destinations, and travel without stress — powered by AI.
            </p>

            {/* Social row */}
            <div style={{ display: "flex", gap: 10, marginBottom: 48 }}>
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  className="ft-social"
                  aria-label={s.name}
                  onMouseEnter={() => setHoveredSocial(i)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={
                    hoveredSocial === i
                      ? {
                          color: s.color,
                          borderColor: `${s.color}40`,
                          background: `${s.color}12`,
                        }
                      : {}
                  }
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div
            className="ft-links-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 32,
            }}
          >
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <div className="ft-col-title">{group}</div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {links.map((link) => (
                    <button
                      key={link.name}
                      className="ft-link"
                      onClick={() => navigate(link.path)}
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 28,
          }}
        >
          <div
            className="ft-bottom-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                © 2025 TravelPlanner. All rights reserved.
              </span>
            </div>

            {/* Status badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 100,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22C55E",
                  boxShadow: "0 0 8px #22C55E",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.5px",
                }}
              >
                All systems operational
              </span>
            </div>

            <div style={{ display: "flex", gap: 20 }}>
              {[
                ["Privacy", "/privacy"],
                ["Terms", "/terms"],
                ["Cookies", "/cookies"],
              ].map(([label, path]) => (
                <button
                  key={label}
                  className="ft-bottom-link"
                  onClick={() => navigate(path)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
