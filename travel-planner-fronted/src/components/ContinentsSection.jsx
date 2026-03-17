import { useState } from "react";
import { ContinentCard } from "./ContinentCard";
import { CountrySelector } from "./CountrySelector";
import { CountryInfo } from "./CountryInfo";
import { useTravelContext } from "../context/TravelContext";

const continents = [
  {
    name: "Europe",
    countries: 44,
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop",
    description:
      "Historic castles, art museums, and culinary delights await across cobblestone streets.",
    featured: true,
  },
  {
    name: "Asia",
    countries: 48,
    image:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&auto=format&fit=crop",
    description:
      "Ancient temples, bustling cities, and breathtaking natural wonders.",
  },
  {
    name: "Africa",
    countries: 54,
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format&fit=crop",
    description:
      "Safari adventures, diverse cultures, and stunning landscapes.",
  },
  {
    name: "North America",
    countries: 23,
    image:
      "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&auto=format&fit=crop",
    description:
      "From bustling metropolises to vast national parks and wilderness.",
  },
  {
    name: "South America",
    countries: 12,
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop",
    description: "Ancient ruins, tropical rainforests, and vibrant festivals.",
    featured: true,
  },
  {
    name: "Oceania",
    countries: 14,
    image:
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&auto=format&fit=crop",
    description:
      "Pristine beaches, coral reefs, and unique wildlife encounters.",
  },
  {
    name: "Antarctica",
    countries: 0,
    image:
      "https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=800&auto=format&fit=crop",
    description:
      "The ultimate frontier: icebergs, penguins, and untouched wilderness.",
  },
];

const CONTINENT_ICONS = {
  Europe: "⬡",
  Asia: "◎",
  Africa: "△",
  "North America": "◈",
  "South America": "◇",
  Oceania: "○",
  Antarctica: "✦",
};

export const ContinentsSection = () => {
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryInfo, setShowCountryInfo] = useState(false);
  const { preferredCountry } = useTravelContext();

  const handleContinentClick = (name) => {
    setSelectedContinent(name);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedContinent(null);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsModalOpen(false);
    setShowCountryInfo(true);
  };

  const handleCloseCountryInfo = () => {
    setShowCountryInfo(false);
    setSelectedCountry(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Jost:wght@200;300;400;500&display=swap');

        .cs-section {
          position: relative; z-index: 2;
          padding: 6rem 1.5rem;
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%),
            linear-gradient(180deg, #06070f 0%, #0b1020 50%, #06070f 100%);
          border-top: 1px solid rgba(99,102,241,0.15);
          overflow: hidden;
        }

        /* Gold dot grid */
        .cs-section::before {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, rgba(99,102,241,0.05) 1px, transparent 0);
          background-size: 48px 48px;
        }

        /* Vertical accent lines */
        .cs-vline {
          position: absolute; width: 1px; pointer-events: none;
          background: linear-gradient(to bottom, transparent, rgba(99,102,241,0.15), transparent);
        }

        .cs-inner { max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }

        /* ── HEADER ── */
        .cs-header { text-align: center; margin-bottom: 4rem; }

        .cs-ornament {
          display: inline-flex; align-items: center; gap: 14px; margin-bottom: 1.4rem;
        }
        .cs-ornament-line {
          height: 1px; width: 50px;
          background: linear-gradient(to right, transparent, #6366f1);
        }
        .cs-ornament-line.r { background: linear-gradient(to left, transparent, #6366f1); }
        .cs-ornament-gem {
          width: 7px; height: 7px; background: #6366f1;
          transform: rotate(45deg); box-shadow: 0 0 10px rgba(99,102,241,0.5);
        }
        .cs-ornament-text {
          font-family: "Jost", sans-serif;
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.3em;
          text-transform: uppercase; color: #6366f1;
        }

        .cs-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 400; line-height: 1.1; color: #f5eed8;
          margin-bottom: 1rem;
        }
        .cs-title em {
          font-style: italic;
          background: linear-gradient(135deg, #ec4899, #6366f1, #c4b5fd, #6366f1);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: csTitleShimmer 5s linear infinite;
        }
        @keyframes csTitleShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .cs-subtitle {
          font-family: "Jost", sans-serif;
          font-size: 0.92rem; font-weight: 300; color: rgba(232,224,204,0.5);
          line-height: 1.85; letter-spacing: 0.04em; max-width: 560px; margin: 0 auto;
        }

        .cs-preferred {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 1.2rem; font-family: "Jost", sans-serif;
          font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em;
          color: #ec4899; border: 1px solid rgba(99,102,241,0.25);
          padding: 6px 18px; background: rgba(99,102,241,0.06);
        }
        .cs-preferred strong { color: #c4b5fd; font-weight: 500; }

        /* ── GRID ── */
        .cs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem;
          auto-rows: 1fr;
        }
        @media (max-width: 1100px) { .cs-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .cs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .cs-grid { grid-template-columns: 1fr; } }

        /* ── CARD ── */
        .cs-card {
          position: relative; overflow: hidden; cursor: pointer;
          border: 1px solid rgba(99,102,241,0.14);
          background: #0a0806;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1),
                      border-color 0.3s, box-shadow 0.45s;
          min-height: 240px;
          display: flex; flex-direction: column; justify-content: flex-end;
          animation: csCardReveal 0.7s ease both;
        }
        .cs-card:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: rgba(99,102,241,0.55);
          box-shadow: 0 28px 70px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.1);
          z-index: 2;
        }
        @keyframes csCardReveal {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Top gold line on hover */
        .cs-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #6366f1, #c4b5fd, #6366f1, transparent);
          opacity: 0; transition: opacity 0.3s; z-index: 3;
        }
        .cs-card:hover::before { opacity: 1; }

        /* Gold scan line on hover */
        .cs-card:hover .cs-card-scan {
          animation: csScan 1s ease 0.1s both;
        }
        .cs-card-scan {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          background: linear-gradient(to bottom, transparent 0%, rgba(99,102,241,0.07) 50%, transparent 100%);
          transform: translateY(-100%);
        }
        @keyframes csScan {
          from { transform: translateY(-100%); }
          to   { transform: translateY(200%); }
        }

        /* Image */
        .cs-card-img {
          position: absolute; inset: 0;
        }
        .cs-card-img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: brightness(0.5) saturate(0.65);
          transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.5s;
        }
        .cs-card:hover .cs-card-img img {
          transform: scale(1.1);
          filter: brightness(0.65) saturate(0.75);
        }

        /* Gradient overlay */
        .cs-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top,
            rgba(8,7,5,0.92) 0%,
            rgba(8,7,5,0.5) 50%,
            rgba(8,7,5,0.1) 100%);
          pointer-events: none;
        }

        /* Featured badge */
        .cs-card-badge {
          position: absolute; top: 0; left: 0;
          font-family: "Jost", sans-serif;
          font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
          color: #06070f; background: #6366f1;
          padding: 5px 16px 5px 12px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
          z-index: 3;
        }

        /* Icon */
        .cs-card-icon {
          position: absolute; top: 14px; right: 14px; z-index: 3;
          font-size: 1rem; color: rgba(99,102,241,0.4);
          transition: color 0.3s, transform 0.3s;
        }
        .cs-card:hover .cs-card-icon { color: rgba(99,102,241,0.8); transform: scale(1.2) rotate(15deg); }

        /* Content */
        .cs-card-content {
          position: relative; z-index: 3; padding: 1.4rem;
        }

        .cs-card-count {
          font-family: "Jost", sans-serif;
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.22em;
          text-transform: uppercase; color: #ec4899; margin-bottom: 0.4rem;
          display: flex; align-items: center; gap: 6px;
        }
        .cs-card-count::before {
          content: ""; display: inline-block; width: 16px; height: 1px;
          background: #ec4899;
        }

        .cs-card-name {
          font-family: "Playfair Display", serif;
          font-size: clamp(1.2rem, 2.5vw, 1.5rem); font-weight: 400;
          color: #f5eed8; line-height: 1.2; margin-bottom: 0.5rem;
          transition: color 0.25s;
        }
        .cs-card:hover .cs-card-name { color: #c4b5fd; }

        .cs-card-desc {
          font-family: "Jost", sans-serif;
          font-size: 0.78rem; color: rgba(232,224,204,0.55);
          line-height: 1.7; font-weight: 300;
          max-height: 0; overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.4s;
          opacity: 0;
        }
        .cs-card:hover .cs-card-desc { max-height: 80px; opacity: 1; }

        /* Explore CTA */
        .cs-card-cta {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 0.85rem; font-family: "Jost", sans-serif;
          font-size: 0.68rem; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; color: #6366f1;
          opacity: 0; transform: translateY(4px);
          transition: opacity 0.35s, transform 0.35s;
        }
        .cs-card:hover .cs-card-cta { opacity: 1; transform: translateY(0); }
        .cs-card-cta-arrow { transition: transform 0.25s; }
        .cs-card:hover .cs-card-cta-arrow { transform: translateX(4px); }

        /* Bottom gold border line */
        .cs-card-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
          transform: scaleX(0); transition: transform 0.4s ease;
          z-index: 3;
        }
        .cs-card:hover .cs-card-bottom { transform: scaleX(1); }

        /* ── DECO DIVIDER ── */
        .cs-deco {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; margin-top: 4rem;
        }
        .cs-deco-bar { height: 1px; width: 80px; background: linear-gradient(to right, transparent, rgba(99,102,241,0.25)); }
        .cs-deco-bar.r { background: linear-gradient(to left, transparent, rgba(99,102,241,0.25)); }
        .cs-deco-text {
          font-family: "Jost", sans-serif;
          font-size: 0.58rem; color: rgba(99,102,241,0.35);
          letter-spacing: 0.3em; text-transform: uppercase;
        }
      `}</style>

      <section className="cs-section">
        {/* Vertical accent lines */}
        <div
          className="cs-vline"
          style={{ left: "8%", top: "5%", height: "35%" }}
        />
        <div
          className="cs-vline"
          style={{ right: "8%", top: "10%", height: "28%" }}
        />
        <div
          className="cs-vline"
          style={{
            left: "50%",
            top: 0,
            height: "60px",
            background:
              "linear-gradient(to bottom,rgba(99,102,241,0.3),transparent)",
          }}
        />

        <div className="cs-inner">
          {/* ── HEADER ── */}
          <div className="cs-header">
            <div className="cs-ornament">
              <span className="cs-ornament-line" />
              <span className="cs-ornament-gem" />
              <span className="cs-ornament-text">Seven Continents Await</span>
              <span className="cs-ornament-gem" />
              <span className="cs-ornament-line r" />
            </div>

            <h2 className="cs-title">
              Choose Your <em>Continent</em>
            </h2>

            <p className="cs-subtitle">
              From the ancient streets of Europe to the wild plains of Africa,
              let AI help you discover the perfect destination for your next
              adventure.
            </p>

            {preferredCountry && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <div className="cs-preferred">
                  <span>◎</span>
                  <span>
                    Your preferred destination:{" "}
                    <strong>{preferredCountry}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── GRID ── */}
          <div className="cs-grid">
            {continents.map((continent, idx) => (
              <div
                key={continent.name}
                className="cs-card"
                style={{ animationDelay: `${idx * 0.07}s` }}
                onClick={() => handleContinentClick(continent.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleContinentClick(continent.name)
                }
                aria-label={`Explore ${continent.name}`}
              >
                {/* Image */}
                <div className="cs-card-img">
                  <img
                    src={continent.image}
                    alt={continent.name}
                    loading="lazy"
                  />
                </div>

                {/* Overlays */}
                <div className="cs-card-overlay" />
                <div className="cs-card-scan" />
                <div className="cs-card-bottom" />

                {/* Featured badge */}
                {continent.featured && (
                  <span className="cs-card-badge">✦ Featured</span>
                )}

                {/* Deco icon */}
                <span className="cs-card-icon">
                  {CONTINENT_ICONS[continent.name] || "◇"}
                </span>

                {/* Content */}
                <div className="cs-card-content">
                  {continent.countries > 0 && (
                    <div className="cs-card-count">
                      {continent.countries} Countries
                    </div>
                  )}
                  <h3 className="cs-card-name">{continent.name}</h3>
                  <p className="cs-card-desc">{continent.description}</p>
                  <div className="cs-card-cta">
                    Explore <span className="cs-card-cta-arrow">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── FOOTER DECO ── */}
          <div className="cs-deco">
            <span className="cs-deco-bar" />
            <span className="cs-deco-text">
              Select a continent to explore countries
            </span>
            <span className="cs-deco-bar r" />
          </div>
        </div>
      </section>

      {/* Modals — unchanged, just passed through */}
      <CountrySelector
        continent={selectedContinent}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSelect={handleCountrySelect}
      />

      <CountryInfo
        country={selectedCountry}
        isOpen={showCountryInfo}
        onClose={handleCloseCountryInfo}
      />
    </>
  );
};
