import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
};

const getDescription = (tags, filterType) => {
  if (!tags) return "A place of interest for travelers.";
  if (filterType === "attraction" || tags.tourism === "attraction")
    return tags.description || "A popular tourist attraction worth visiting.";
  if (
    filterType === "beach" ||
    tags.natural === "beach" ||
    tags.leisure === "beach_resort"
  )
    return (
      tags.description ||
      "A beautiful beach for relaxation and water activities."
    );
  if (filterType === "famous") {
    if (tags.historic)
      return (
        tags.description ||
        "A historic landmark with significant cultural and architectural heritage."
      );
    if (tags.tourism === "museum")
      return (
        tags.description ||
        "A museum showcasing art, history, culture, and historical artifacts."
      );
    if (tags.tourism === "viewpoint")
      return (
        tags.description ||
        "A scenic viewpoint offering panoramic views and photo opportunities."
      );
    if (tags.tourism === "attraction")
      return (
        tags.description ||
        "A famous tourist attraction known for its unique features."
      );
  }
  if (
    filterType === "shopping" ||
    tags.shop === "mall" ||
    tags.shop === "department_store"
  ) {
    if (tags.shop === "mall")
      return (
        tags.description ||
        "A shopping mall with multiple stores, restaurants, and entertainment options."
      );
    if (tags.shop === "department_store")
      return (
        tags.description ||
        "A department store offering a wide variety of products and brands."
      );
    if (tags.amenity === "marketplace")
      return (
        tags.description ||
        "A marketplace for local shopping, handicrafts, and traditional goods."
      );
  }
  if (filterType === "hotel" || tags.tourism === "hotel") {
    const stars = tags.stars ? ` (${tags.stars} stars)` : "";
    return (
      tags.description ||
      `A hotel providing comfortable accommodation and hospitality services${stars}.`
    );
  }
  if (filterType === "restaurant" || tags.amenity === "restaurant") {
    const cuisine = tags.cuisine
      ? ` serving ${tags.cuisine} cuisine`
      : " serving local and popular food";
    return (
      tags.description ||
      `A restaurant${cuisine} with a pleasant dining experience.`
    );
  }
  if (tags.tourism === "museum")
    return "A museum showcasing art, history, or culture.";
  if (tags.historic) return "A historic landmark with cultural significance.";
  if (tags.tourism === "viewpoint")
    return "A scenic viewpoint with great views.";
  if (tags.natural === "beach")
    return "A beautiful beach for relaxation and water activities.";
  if (tags.leisure === "beach_resort")
    return "A beach resort with amenities and facilities.";
  if (tags.shop === "mall" || tags.shop === "department_store")
    return "A shopping mall with various stores and brands.";
  if (tags.amenity === "marketplace")
    return "A marketplace for local shopping and goods.";
  if (tags.tourism === "hotel") return "A hotel suitable for tourists.";
  if (tags.amenity === "restaurant")
    return "A restaurant serving local and popular food.";
  return "A well-known location for visitors.";
};

const filterConfig = [
  { value: "attraction", label: "Attractions", icon: "🎭", color: "#F59E0B" },
  { value: "beach", label: "Beaches", icon: "🏖️", color: "#06B6D4" },
  { value: "famous", label: "Famous Spots", icon: "⭐", color: "#8B5CF6" },
  { value: "shopping", label: "Shopping", icon: "🛍️", color: "#EC4899" },
  { value: "hotel", label: "Hotels", icon: "🏨", color: "#10B981" },
  { value: "restaurant", label: "Restaurants", icon: "🍽️", color: "#EF4444" },
  {
    value: "hotel_restaurant",
    label: "Hotels & Dining",
    icon: "🌟",
    color: "#F97316",
  },
];

const budgetConfig = [
  { value: "low", label: "Budget", icon: "💰", desc: "Affordable picks" },
  { value: "medium", label: "Mid-Range", icon: "💵", desc: "Best value" },
  { value: "high", label: "Premium", icon: "💎", desc: "Luxury only" },
];

function Explore() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [route, setRoute] = useState([]);
  const [filter, setFilter] = useState("attraction");
  const [budget, setBudget] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const getLatLng = async (city) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&accept-language=en`,
    );
    const data = await res.json();
    if (data.length > 0)
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    return null;
  };

  const filterByBudget = (places, budgetLevel, type) => {
    if (["attraction", "beach", "famous", "shopping"].includes(type))
      return places;
    const filtered = places.filter((place) => {
      const tags = place.tags || {};
      if (tags.tourism === "hotel" && tags.stars) {
        const stars = parseInt(tags.stars);
        if (budgetLevel === "low" && stars <= 2) return true;
        if (budgetLevel === "medium" && stars >= 2 && stars <= 4) return true;
        if (budgetLevel === "high" && stars >= 4) return true;
        return false;
      }
      if (tags.amenity === "restaurant") {
        const name = (tags.name || "").toLowerCase();
        const cuisine = (tags.cuisine || "").toLowerCase();
        const budgetKw = ["street", "fast", "casual", "dhaba", "local", "cafe"];
        const luxuryKw = ["fine", "gourmet", "premium", "luxury", "rooftop"];
        if (
          budgetLevel === "low" &&
          budgetKw.some((kw) => name.includes(kw) || cuisine.includes(kw))
        )
          return true;
        if (
          budgetLevel === "high" &&
          luxuryKw.some((kw) => name.includes(kw) || cuisine.includes(kw))
        )
          return true;
      }
      return true;
    });
    return filtered.length >= 3 ? filtered : places;
  };

  const getNearbyPlaces = async (lat, lng, type, budgetLevel) => {
    const queries = {
      attraction: `[out:json][timeout:10];(node(around:5000,${lat},${lng})[tourism=attraction];way(around:5000,${lat},${lng})[tourism=attraction];);out center 50;`,
      beach: `[out:json][timeout:10];(node(around:12000,${lat},${lng})[natural=beach];way(around:12000,${lat},${lng})[natural=beach];node(around:12000,${lat},${lng})[leisure=beach_resort];way(around:12000,${lat},${lng})[leisure=beach_resort];);out center 30;`,
      famous: `[out:json][timeout:10];(node(around:8000,${lat},${lng})[tourism=attraction];way(around:8000,${lat},${lng})[tourism=attraction];node(around:8000,${lat},${lng})[historic];way(around:8000,${lat},${lng})[historic];node(around:8000,${lat},${lng})[tourism=museum];way(around:8000,${lat},${lng})[tourism=museum];node(around:8000,${lat},${lng})[tourism=viewpoint];way(around:8000,${lat},${lng})[tourism=viewpoint];);out center 50;`,
      shopping: `[out:json][timeout:10];(node(around:5000,${lat},${lng})[shop=mall];way(around:5000,${lat},${lng})[shop=mall];node(around:5000,${lat},${lng})[shop=department_store];way(around:5000,${lat},${lng})[shop=department_store];node(around:5000,${lat},${lng})[amenity=marketplace];way(around:5000,${lat},${lng})[amenity=marketplace];);out center 40;`,
      hotel: `[out:json][timeout:10];(node(around:6000,${lat},${lng})[tourism=hotel];way(around:6000,${lat},${lng})[tourism=hotel];);out center 50;`,
      restaurant: `[out:json][timeout:10];(node(around:6000,${lat},${lng})[amenity=restaurant];way(around:6000,${lat},${lng})[amenity=restaurant];);out center 50;`,
      hotel_restaurant: `[out:json][timeout:10];(node(around:6000,${lat},${lng})[tourism=hotel];way(around:6000,${lat},${lng})[tourism=hotel];node(around:6000,${lat},${lng})[amenity=restaurant];way(around:6000,${lat},${lng})[amenity=restaurant];);out center 60;`,
    };
    const maxDistance = type === "beach" ? 12 : type === "famous" ? 8 : 6;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${queries[type] || queries.attraction}`,
    });
    const data = await res.json();
    let results = (data.elements || [])
      .map((item) =>
        item.type === "way" && item.center
          ? { ...item, lat: item.center.lat, lon: item.center.lon }
          : item,
      )
      .filter((place) => {
        const dist = parseFloat(getDistance(lat, lng, place.lat, place.lon));
        return dist <= maxDistance && place.tags?.name;
      });
    if (["hotel", "restaurant", "hotel_restaurant"].includes(type))
      results = filterByBudget(results, budgetLevel, type);
    return results;
  };

  const getRoute = async (from, to) => {
    setRouteLoading(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lon},${to.lat}?geometries=geojson&overview=full`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes?.length > 0) {
        setRoute(data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]));
      } else alert("Route not found! Try a different location.");
    } catch (error) {
      alert("Could not calculate route: " + error.message);
    } finally {
      setRouteLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    const loc = await getLatLng(city);
    if (!loc) {
      setLoading(false);
      return alert("City not found");
    }
    setLocation(loc);
    setRoute([]);
    setPlaces([]);
    const nearby = await getNearbyPlaces(loc.lat, loc.lng, filter, budget);
    setPlaces(nearby);
    setLoading(false);
  };

  const activeCat = filterConfig.find((f) => f.value === filter);
  const showBudget = ["hotel", "restaurant", "hotel_restaurant"].includes(
    filter,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080C14",
        fontFamily: "'Syne', sans-serif",
        color: "#E8E4DC",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Map overrides */
        .leaflet-container { font-family: 'Syne', sans-serif !important; }
        .leaflet-popup-content-wrapper {
          background: #0E1420 !important; color: #E8E4DC !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-radius: 12px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-tip { background: #0E1420 !important; }
        .leaflet-popup-content { font-size: 13px !important; font-weight: 500 !important; }

        /* Search input */
        .search-input {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: #E8E4DC; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 500;
          padding: 16px 20px 16px 52px; border-radius: 16px; width: 100%; outline: none;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.25); }
        .search-input:focus { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.07); }

        /* Filter chips */
        .filter-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.5); cursor: pointer;
          transition: all 0.2s ease; white-space: nowrap;
        }
        .filter-chip:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.8); }
        .filter-chip.active { border-color: var(--chip-color); color: #fff;
          background: rgba(var(--chip-rgb), 0.15); box-shadow: 0 0 20px rgba(var(--chip-rgb), 0.2); }

        /* Budget pills */
        .budget-pill {
          padding: 8px 20px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.4); cursor: pointer;
          transition: all 0.2s ease;
        }
        .budget-pill:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }
        .budget-pill.active { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); color: #fff; }
        .budget-pill:disabled { opacity: 0.3; cursor: not-allowed; }

        /* Search button */
        .search-btn {
          padding: 16px 36px; border-radius: 16px; border: none; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          letter-spacing: 0.5px; background: #E8E4DC; color: #080C14;
          transition: all 0.25s cubic-bezier(0.23,1,0.32,1);
          display: flex; align-items: center; gap: 10px; white-space: nowrap;
        }
        .search-btn:hover:not(:disabled) { background: #fff; transform: scale(1.03); box-shadow: 0 8px 30px rgba(232,228,220,0.3); }
        .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Place cards */
        .place-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; overflow: hidden; cursor: pointer;
          transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
          display: flex; flex-direction: column;
        }
        .place-card:hover {
          background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15);
          transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.4);
        }

        /* Route button */
        .route-btn {
          width: 100%; padding: 12px; border-radius: 12px; border: none; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 0.5px; text-transform: uppercase;
          background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s ease;
        }
        .route-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.12); color: #fff; border-color: rgba(255,255,255,0.2);
        }
        .route-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Monospace distances */
        .mono { font-family: 'DM Mono', monospace; }

        /* Loading shimmer */
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .shimmer-card {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%);
          background-size: 600px 100%; animation: shimmer 1.5s infinite;
          border-radius: 20px; height: 200px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        /* Pulse dot */
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.85); } }
        .pulse { animation: pulse 2s ease infinite; }

        /* Fade in */
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }

        /* Clear route btn */
        .clear-btn {
          padding: 8px 16px; border-radius: 100px;
          border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.08);
          color: #F87171; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease;
        }
        .clear-btn:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.5); }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #080C14; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        /* Chip filter scroll */
        .chip-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; }
        .chip-scroll::-webkit-scrollbar { height: 0; }
      `}</style>

      {/* Top decorative bar */}
      <div
        style={{
          height: 2,
          background:
            "linear-gradient(90deg, #6366F1, #06B6D4, #F59E0B, #EC4899)",
        }}
      />

      {/* Header */}
      <div style={{ padding: "40px 48px 0", maxWidth: 1400, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "3px",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                marginBottom: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "5px 12px",
                borderRadius: 100,
              }}
            >
              <span
                className="pulse"
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#22C55E",
                  display: "inline-block",
                }}
              />
              Live Explorer
            </div>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 800,
                letterSpacing: "-1.5px",
                lineHeight: 1,
                color: "#E8E4DC",
              }}
            >
              Smart Place
              <span
                style={{
                  display: "block",
                  background: "linear-gradient(90deg,#6366F1,#06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Explorer
              </span>
            </h1>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.35)",
              maxWidth: 320,
              lineHeight: 1.7,
              fontWeight: 400,
              paddingBottom: 6,
            }}
          >
            Discover attractions, hotels & restaurants. Get turn-by-turn
            directions on a live interactive map.
          </p>
        </div>

        {/* ── SEARCH PANEL ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "28px 32px",
            marginBottom: 28,
          }}
        >
          {/* City input + Search btn */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <span
                style={{
                  position: "absolute",
                  left: 18,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 18,
                  pointerEvents: "none",
                }}
              >
                🗺️
              </span>
              <input
                className="search-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter a city — Paris, Tokyo, Dubai..."
              />
            </div>
            <button
              className="search-btn"
              onClick={handleSearch}
              disabled={loading || !city.trim()}
            >
              {loading ? (
                <>
                  <span className="pulse">⏳</span> Searching...
                </>
              ) : (
                <>
                  <span>🔍</span> Explore
                </>
              )}
            </button>
          </div>

          {/* Filter chips */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "2px",
                color: "rgba(255,255,255,0.25)",
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Category
            </div>
            <div className="chip-scroll">
              {filterConfig.map((cat) => {
                const rgb = cat.color
                  .replace("#", "")
                  .match(/.{2}/g)
                  .map((h) => parseInt(h, 16))
                  .join(",");
                return (
                  <button
                    key={cat.value}
                    className={`filter-chip${filter === cat.value ? " active" : ""}`}
                    style={{ "--chip-color": cat.color, "--chip-rgb": rgb }}
                    onClick={() => setFilter(cat.value)}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "2px",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
                marginRight: 4,
              }}
            >
              Budget
            </div>
            {budgetConfig.map((b) => (
              <button
                key={b.value}
                className={`budget-pill${budget === b.value ? " active" : ""}`}
                disabled={!showBudget}
                onClick={() => showBudget && setBudget(b.value)}
                title={
                  !showBudget
                    ? "Select Hotels or Restaurants to filter by budget"
                    : b.desc
                }
              >
                {b.icon} {b.label}
              </button>
            ))}
            {!showBudget && (
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.2)",
                  marginLeft: 4,
                }}
              >
                — select Hotels or Restaurants to enable
              </span>
            )}
          </div>

          {/* Result count + clear route */}
          {places.length > 0 && (
            <div
              style={{
                marginTop: 20,
                paddingTop: 20,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22C55E",
                    boxShadow: "0 0 10px #22C55E",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <span style={{ color: "#22C55E" }}>{places.length}</span>{" "}
                  places found in{" "}
                  <span style={{ color: "#E8E4DC" }}>{city}</span>
                </span>
              </div>
              {route.length > 0 && (
                <button className="clear-btn" onClick={() => setRoute([])}>
                  ✕ Clear Route
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── MAP ── */}
        {location && (
          <div
            className="fade-up"
            style={{
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: 32,
              position: "relative",
            }}
          >
            {/* Map label */}
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 999,
                background: "rgba(8,12,20,0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14 }}>{activeCat?.icon}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#E8E4DC",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {city}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </span>
            </div>
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={13}
              style={{ height: 500 }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='© <a href="https://carto.com/">CARTO</a>'
              />
              <Marker position={[location.lat, location.lng]}>
                <Popup>
                  <strong style={{ fontFamily: "'Syne',sans-serif" }}>
                    📍 {city}
                  </strong>
                </Popup>
              </Marker>
              {places.map((p) => (
                <Marker key={p.id} position={[p.lat, p.lon]}>
                  <Popup>
                    <div style={{ fontFamily: "'Syne',sans-serif" }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>
                        {p.tags?.name || "Place"}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.6 }}>
                        {getDistance(location.lat, location.lng, p.lat, p.lon)}{" "}
                        km away
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {route.length > 0 && (
                <Polyline
                  positions={route}
                  color="#6366F1"
                  weight={4}
                  opacity={0.85}
                />
              )}
            </MapContainer>
          </div>
        )}

        {/* ── PLACES GRID ── */}
        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
              marginBottom: 48,
            }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="shimmer-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {!loading && places.length > 0 && (
          <>
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
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "3px",
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                }}
              >
                {activeCat?.label} · {places.length} results
              </div>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                gap: 16,
                paddingBottom: 60,
              }}
            >
              {places.map((p, i) => {
                const dist = getDistance(
                  location.lat,
                  location.lng,
                  p.lat,
                  p.lon,
                );
                const name = p.tags?.name || "Unnamed Place";
                const desc = getDescription(p.tags, filter);
                const budgetLabel =
                  budget === "low"
                    ? { label: "Budget", color: "#22C55E" }
                    : budget === "high"
                      ? { label: "Premium", color: "#F59E0B" }
                      : { label: "Mid-Range", color: "#06B6D4" };

                return (
                  <div
                    key={p.id}
                    className="place-card fade-up"
                    style={{ animationDelay: `${i * 0.04}s` }}
                    onMouseEnter={() => setActiveCard(p.id)}
                    onMouseLeave={() => setActiveCard(null)}
                  >
                    {/* Card top accent */}
                    <div
                      style={{
                        height: 3,
                        background: activeCat?.color || "#6366F1",
                        opacity: activeCard === p.id ? 1 : 0.4,
                        transition: "opacity 0.3s ease",
                      }}
                    />

                    <div style={{ padding: "20px 20px 18px" }}>
                      {/* Header row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 12,
                          gap: 8,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#E8E4DC",
                            lineHeight: 1.3,
                            flex: 1,
                          }}
                        >
                          {name}
                        </h3>
                        <span
                          className="mono"
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.35)",
                            background: "rgba(255,255,255,0.05)",
                            padding: "3px 8px",
                            borderRadius: 6,
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {dist} km
                        </span>
                      </div>

                      {/* Budget badge */}
                      {showBudget && (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 10px",
                            borderRadius: 100,
                            border: `1px solid ${budgetLabel.color}40`,
                            background: `${budgetLabel.color}15`,
                            marginBottom: 10,
                          }}
                        >
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: budgetLabel.color,
                              display: "inline-block",
                            }}
                          />
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: budgetLabel.color,
                              letterSpacing: "0.5px",
                            }}
                          >
                            {budgetLabel.label}
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      <p
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.4)",
                          lineHeight: 1.7,
                          marginBottom: 18,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {desc}
                      </p>

                      {/* Tags */}
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          flexWrap: "wrap",
                          marginBottom: 16,
                        }}
                      >
                        {p.tags?.cuisine && (
                          <span
                            style={{
                              fontSize: 10,
                              padding: "3px 8px",
                              borderRadius: 6,
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.4)",
                              border: "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            🍴 {p.tags.cuisine}
                          </span>
                        )}
                        {p.tags?.stars && (
                          <span
                            style={{
                              fontSize: 10,
                              padding: "3px 8px",
                              borderRadius: 6,
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.4)",
                              border: "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            {"⭐".repeat(Math.min(parseInt(p.tags.stars), 5))}
                          </span>
                        )}
                        {p.tags?.["addr:city"] && (
                          <span
                            style={{
                              fontSize: 10,
                              padding: "3px 8px",
                              borderRadius: 6,
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.4)",
                              border: "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            📍 {p.tags["addr:city"]}
                          </span>
                        )}
                        {p.tags?.opening_hours && (
                          <span
                            style={{
                              fontSize: 10,
                              padding: "3px 8px",
                              borderRadius: 6,
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.4)",
                              border: "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            🕐 {p.tags.opening_hours.substring(0, 20)}
                          </span>
                        )}
                      </div>

                      {/* Route button */}
                      <button
                        className="route-btn"
                        onClick={() => getRoute(location, p)}
                        disabled={routeLoading}
                      >
                        {routeLoading
                          ? "⏳ Loading Route..."
                          : "🧭 Show Route on Map"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && !location && (
          <div style={{ textAlign: "center", padding: "80px 0 100px" }}>
            <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.3 }}>
              🌍
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "rgba(255,255,255,0.3)",
                marginBottom: 8,
              }}
            >
              Enter a city to begin
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.15)",
                fontWeight: 400,
              }}
            >
              Discover attractions, hotels, beaches and more
            </div>
          </div>
        )}

        {!loading && location && places.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0 80px" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>
              🔍
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "rgba(255,255,255,0.3)",
                marginBottom: 8,
              }}
            >
              No results found
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.15)" }}>
              Try a different category or expand your search area
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
