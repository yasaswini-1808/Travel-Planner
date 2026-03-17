import React, { useState, useEffect } from "react";

// Mock Weather component (replace with your actual Weather component import)
const Weather = ({ city, compact }) => {
  const mockData = {
    Paris: { temp: 12, condition: "Cloudy", icon: "🌥️", humidity: 72 },
    Denpasar: { temp: 30, condition: "Sunny", icon: "☀️", humidity: 80 },
    "New York": { temp: 5, condition: "Windy", icon: "💨", humidity: 60 },
    Tokyo: { temp: 10, condition: "Clear", icon: "🌤️", humidity: 55 },
    Santorini: { temp: 18, condition: "Sunny", icon: "☀️", humidity: 50 },
    Dubai: { temp: 28, condition: "Clear", icon: "🌤️", humidity: 40 },
    Male: { temp: 31, condition: "Tropical", icon: "🌴", humidity: 85 },
    Reykjavik: { temp: -2, condition: "Snowy", icon: "❄️", humidity: 78 },
  };
  const d = mockData[city] || {
    temp: 20,
    condition: "Fair",
    icon: "🌤️",
    humidity: 60,
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "13px",
      }}
    >
      <span style={{ fontSize: "22px" }}>{d.icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: "16px" }}>{d.temp}°C</div>
        <div style={{ opacity: 0.7 }}>
          {d.condition} · {d.humidity}% humidity
        </div>
      </div>
    </div>
  );
};

const deals = [
  {
    id: 1,
    title: "Paris Romantic Getaway",
    destination: "Paris",
    city: "Paris",
    desc: "5 nights at 4-star hotel with breakfast, Eiffel Tower tour, and Seine river cruise",
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    category: "europe",
    rating: 4.8,
    reviews: 234,
    duration: "5N / 6D",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    includes: ["Hotel", "Breakfast", "City Tour", "Airport Transfer"],
    availability: "Limited - 12 spots left",
    validUntil: "2025-03-15",
  },
  {
    id: 2,
    title: "Bali Beach Paradise",
    destination: "Bali",
    city: "Denpasar",
    desc: "7 nights at beachfront resort with spa, water sports, and traditional dance show",
    price: 1599,
    originalPrice: 2299,
    discount: 30,
    category: "asia",
    rating: 4.9,
    reviews: 456,
    duration: "7N / 8D",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    includes: [
      "Resort",
      "All Meals",
      "Spa",
      "Water Sports",
      "Airport Transfer",
    ],
    availability: "Available",
    validUntil: "2025-04-30",
  },
  {
    id: 3,
    title: "New York City Explorer",
    destination: "New York",
    city: "New York",
    desc: "4 nights in Manhattan with Broadway show, Empire State building, and unlimited metro pass",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    category: "america",
    rating: 4.7,
    reviews: 189,
    duration: "4N / 5D",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    includes: ["Hotel", "Broadway Show", "Metro Pass", "City Tour"],
    availability: "Available",
    validUntil: "2025-06-30",
  },
  {
    id: 4,
    title: "Tokyo Cultural Experience",
    destination: "Tokyo",
    city: "Tokyo",
    desc: "6 nights with guided tours, traditional tea ceremony, sushi making class, and Mt. Fuji trip",
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    category: "asia",
    rating: 4.9,
    reviews: 312,
    duration: "6N / 7D",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    includes: [
      "Hotel",
      "Breakfast",
      "Cultural Tours",
      "Mt. Fuji Trip",
      "Airport Transfer",
    ],
    availability: "Limited - 8 spots left",
    validUntil: "2025-05-20",
  },
  {
    id: 5,
    title: "Santorini Sunset Dreams",
    destination: "Santorini",
    city: "Santorini",
    desc: "5 nights in luxury cave hotel with caldera views, wine tasting, and sunset cruise",
    price: 1899,
    originalPrice: 2699,
    discount: 30,
    category: "europe",
    rating: 5.0,
    reviews: 567,
    duration: "5N / 6D",
    img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    includes: [
      "Luxury Hotel",
      "Breakfast",
      "Wine Tour",
      "Sunset Cruise",
      "Airport Transfer",
    ],
    availability: "Limited - 5 spots left",
    validUntil: "2025-07-15",
  },
  {
    id: 6,
    title: "Dubai Luxury Escape",
    destination: "Dubai",
    city: "Dubai",
    desc: "5 nights in 5-star hotel with desert safari, Burj Khalifa tickets, and gold souk tour",
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    category: "middle-east",
    rating: 4.8,
    reviews: 423,
    duration: "5N / 6D",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    includes: [
      "5-Star Hotel",
      "Breakfast",
      "Desert Safari",
      "Burj Khalifa",
      "City Tour",
    ],
    availability: "Available",
    validUntil: "2025-08-30",
  },
  {
    id: 7,
    title: "Maldives Honeymoon",
    destination: "Maldives",
    city: "Male",
    desc: "7 nights in overwater villa with private pool, couples spa, and diving excursions",
    price: 2999,
    originalPrice: 4299,
    discount: 30,
    category: "asia",
    rating: 5.0,
    reviews: 678,
    duration: "7N / 8D",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    includes: [
      "Overwater Villa",
      "All Inclusive",
      "Spa",
      "Diving",
      "Seaplane Transfer",
    ],
    availability: "Limited - 3 spots left",
    validUntil: "2025-12-31",
  },
  {
    id: 8,
    title: "Iceland Northern Lights",
    destination: "Iceland",
    city: "Reykjavik",
    desc: "6 nights with northern lights tour, Blue Lagoon, Golden Circle, and glacier hiking",
    price: 1699,
    originalPrice: 2399,
    discount: 29,
    category: "europe",
    rating: 4.9,
    reviews: 345,
    duration: "6N / 7D",
    img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    includes: [
      "Hotel",
      "Breakfast",
      "Northern Lights Tour",
      "Blue Lagoon",
      "Golden Circle",
    ],
    availability: "Available",
    validUntil: "2025-03-31",
  },
];

const categories = [
  { id: "all", label: "ALL" },
  { id: "europe", label: "EUROPE" },
  { id: "asia", label: "ASIA" },
  { id: "america", label: "AMERICAS" },
  { id: "middle-east", label: "MIDDLE EAST" },
];

export default function Deals() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [filteredDeals, setFilteredDeals] = useState(deals);
  const [showWeather, setShowWeather] = useState({});
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    let filtered = deals;
    if (selectedCategory !== "all")
      filtered = filtered.filter((d) => d.category === selectedCategory);
    if (searchQuery)
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.destination.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    if (priceRange === "budget")
      filtered = filtered.filter((d) => d.price < 1000);
    else if (priceRange === "mid")
      filtered = filtered.filter((d) => d.price >= 1000 && d.price < 2000);
    else if (priceRange === "luxury")
      filtered = filtered.filter((d) => d.price >= 2000);
    if (sortBy === "price-low")
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high")
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating")
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "discount")
      filtered = [...filtered].sort((a, b) => b.discount - a.discount);
    setFilteredDeals(filtered);
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const toggleWeather = (id) => setShowWeather((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06070f",
        color: "#f0ece4",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .deal-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 2px;
          overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease;
          cursor: pointer;
        }
        .deal-card:hover { border-color: #6366f1; transform: translateY(-4px); }

        .deal-img {
          width: 100%; height: 220px; object-fit: cover;
          filter: saturate(0.7) brightness(0.85);
          transition: filter 0.4s ease, transform 0.4s ease;
        }
        .deal-card:hover .deal-img { filter: saturate(1) brightness(0.95); transform: scale(1.03); }

        .cat-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 2px;
          color: #666; padding: 8px 0; border-bottom: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .cat-btn:hover { color: #6366f1; }
        .cat-btn.active { color: #6366f1; border-bottom-color: #6366f1; }

        .search-input, .filter-select {
          background: #111; border: 1px solid #2a2a2a; color: #f0ece4;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          padding: 10px 16px; outline: none;
          transition: border-color 0.2s;
        }
        .search-input::placeholder { color: #444; }
        .search-input:focus, .filter-select:focus { border-color: #6366f1; }
        .filter-select option { background: #111; }

        .book-btn {
          background: #6366f1; color: #06070f; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 11px;
          font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
          padding: 12px 24px; cursor: pointer; width: 100%;
          transition: background 0.2s, transform 0.1s;
        }
        .book-btn:hover { background: #c7d2fe; transform: scale(1.01); }

        .weather-btn {
          background: none; border: 1px solid #2a2a2a; color: #888;
          font-family: 'DM Sans', sans-serif; font-size: 11px;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 9px; width: 100%; cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .weather-btn:hover, .weather-btn.active { border-color: #7dd3fc; color: #7dd3fc; }

        .weather-box {
          background: #0d1520; border: 1px solid #1a2d45;
          padding: 14px 16px; margin: 10px 0;
          animation: fadeSlide 0.2s ease;
        }

        .tag {
          font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
          padding: 3px 8px; border: 1px solid #2a2a2a; color: #666;
          white-space: nowrap;
        }

        .limited-badge {
          position: absolute; top: 14px; left: 14px;
          background: #c0392b; color: #fff;
          font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 4px 8px; font-family: 'DM Sans', sans-serif; font-weight: 500;
        }

        .discount-badge {
          position: absolute; top: 14px; right: 14px;
          background: #6366f1; color: #06070f;
          font-size: 11px; font-weight: 700; font-family: 'DM Sans', sans-serif;
          padding: 5px 10px;
        }

        .divider { border: none; border-top: 1px solid #1e1e1e; margin: 14px 0; }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .star-bar { display: flex; gap: 2px; }
        .star { color: #6366f1; font-size: 12px; }
        .star.empty { color: #2a2a2a; }

        .deals-category-nav {
          display: flex;
          gap: 32px;
          margin-bottom: 32px;
          border-bottom: 1px solid #1a1a1a;
          padding-bottom: 0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .deals-category-nav::-webkit-scrollbar { display: none; }

        .deals-controls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          align-items: center;
        }

        .deals-count {
          font-size: 11px;
          color: #444;
          letter-spacing: 1px;
          white-space: nowrap;
          justify-self: end;
        }

        @media (max-width: 768px) {
          .deals-controls-grid {
            grid-template-columns: 1fr;
          }

          .deals-count {
            justify-self: start;
          }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #06070f; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; }
      `}</style>

      {/* Top bar */}
      <div
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "14px clamp(16px, 4vw, 48px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            color: "#666",
            textTransform: "uppercase",
          }}
        >
          Wanderlust Co.
        </div>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "2px",
            color: "#6366f1",
            textTransform: "uppercase",
          }}
        >
          ✦ Limited Time Offers
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          padding: "80px clamp(16px, 4vw, 48px) 60px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "40px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "4px",
                color: "#555",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Curated Escapes
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(48px, 8vw, 100px)",
                fontWeight: 400,
                lineHeight: 0.9,
                color: "#f0ece4",
              }}
            >
              Travel
              <br />
              <em style={{ color: "#6366f1" }}>Deals</em>
            </h1>
          </div>
          <p
            style={{
              maxWidth: "360px",
              fontSize: "14px",
              lineHeight: 1.8,
              color: "#666",
              fontWeight: 300,
            }}
          >
            Handpicked destinations at exceptional prices. Check real-time
            weather before you commit.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 48px) 40px",
        }}
      >
        {/* Category nav */}
        <div className="deals-category-nav">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-btn${selectedCategory === cat.id ? " active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="deals-controls-grid">
          <input
            className="search-input"
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="budget">Under $1,000</option>
            <option value="mid">$1,000 – $2,000</option>
            <option value="luxury">$2,000+</option>
          </select>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price ↑</option>
            <option value="price-high">Price ↓</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Best Discount</option>
          </select>
          <div className="deals-count">
            {filteredDeals.length}{" "}
            {filteredDeals.length === 1 ? "deal" : "deals"}
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 48px) 80px",
        }}
      >
        {filteredDeals.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "80px 0", color: "#444" }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>◌</div>
            <div
              style={{
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              No results found
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1px",
              background: "#1a1a1a",
            }}
          >
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="deal-card"
                style={{ background: "#06070f" }}
              >
                {/* Image */}
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    height: "220px",
                  }}
                >
                  <img src={deal.img} alt={deal.title} className="deal-img" />
                  <div className="discount-badge">−{deal.discount}%</div>
                  {deal.availability.includes("Limited") && (
                    <div className="limited-badge">● {deal.availability}</div>
                  )}
                  {/* Overlay gradient */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "60px",
                      background:
                        "linear-gradient(transparent, rgba(10,10,10,0.8))",
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: "20px" }}>
                  {/* Location + Duration */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        letterSpacing: "2px",
                        color: "#6366f1",
                        textTransform: "uppercase",
                      }}
                    >
                      {deal.destination}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        letterSpacing: "1px",
                      }}
                    >
                      {deal.duration}
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "20px",
                      fontWeight: 400,
                      lineHeight: 1.25,
                      marginBottom: "10px",
                      color: "#f0ece4",
                    }}
                  >
                    {deal.title}
                  </h3>

                  {/* Desc */}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      lineHeight: 1.7,
                      marginBottom: "14px",
                      fontWeight: 300,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {deal.desc}
                  </p>

                  {/* Rating */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "14px",
                    }}
                  >
                    <div className="star-bar">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`star${i <= Math.floor(deal.rating) ? "" : " empty"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: "11px", color: "#555" }}>
                      {deal.rating} ({deal.reviews})
                    </span>
                  </div>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                      marginBottom: "16px",
                    }}
                  >
                    {deal.includes.slice(0, 3).map((item, i) => (
                      <span key={i} className="tag">
                        {item}
                      </span>
                    ))}
                    {deal.includes.length > 3 && (
                      <span className="tag">+{deal.includes.length - 3}</span>
                    )}
                  </div>

                  <hr className="divider" />

                  {/* Price */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "10px",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "28px",
                        color: "#f0ece4",
                        fontWeight: 400,
                      }}
                    >
                      ${deal.price.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#3a3a3a",
                        textDecoration: "line-through",
                      }}
                    >
                      ${deal.originalPrice.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        marginLeft: "auto",
                        letterSpacing: "1px",
                      }}
                    >
                      per person
                    </span>
                  </div>

                  {/* Weather toggle */}
                  <button
                    className={`weather-btn${showWeather[deal.id] ? " active" : ""}`}
                    onClick={() => toggleWeather(deal.id)}
                  >
                    {showWeather[deal.id]
                      ? "▲ Hide Weather"
                      : "▼ Check Weather"}
                  </button>

                  {/* Weather display */}
                  {showWeather[deal.id] && (
                    <div className="weather-box">
                      <Weather city={deal.city} compact={true} />
                    </div>
                  )}

                  {/* Book */}
                  <div style={{ marginTop: "14px" }}>
                    <button className="book-btn">Book Now</button>
                  </div>

                  {/* Valid until */}
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "10px",
                      color: "#3a3a3a",
                      letterSpacing: "1px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}
                  >
                    Valid until{" "}
                    {new Date(deal.validUntil).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer line */}
      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          padding: "24px clamp(16px, 4vw, 48px)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "3px",
            color: "#333",
            textTransform: "uppercase",
          }}
        >
          Wanderlust Co. · All prices per person · Subject to availability
        </div>
      </div>
    </div>
  );
}


