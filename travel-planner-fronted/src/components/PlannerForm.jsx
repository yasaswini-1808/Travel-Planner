import { useState, useEffect, useRef, useCallback } from "react";
import { saveItinerary } from "../api/itineraryAPI";
import { searchBookings } from "../api/bookingsAPI";
import { getDestinationImages } from "../api/unsplash";
import { getCurrentWeather, getWeather } from "../api/Weather";
import { apiUrl } from "../api/config";

/* ═══════════════════════════════════════════════════════
   CURRENCY DATA
═══════════════════════════════════════════════════════ */
const CM = {
  usd: { n: "US Dollar", f: "🇺🇸", s: "$", r: "Major" },
  eur: { n: "Euro", f: "🇪🇺", s: "€", r: "Major" },
  gbp: { n: "British Pound", f: "🇬🇧", s: "£", r: "Major" },
  jpy: { n: "Japanese Yen", f: "🇯🇵", s: "¥", r: "Major" },
  chf: { n: "Swiss Franc", f: "🇨🇭", s: "Fr", r: "Major" },
  cad: { n: "Canadian Dollar", f: "🇨🇦", s: "C$", r: "Major" },
  aud: { n: "Australian Dollar", f: "🇦🇺", s: "A$", r: "Major" },
  cny: { n: "Chinese Yuan", f: "🇨🇳", s: "¥", r: "Major" },
  inr: { n: "Indian Rupee", f: "🇮🇳", s: "₹", r: "Major" },
  sgd: { n: "Singapore Dollar", f: "🇸🇬", s: "S$", r: "Major" },
  hkd: { n: "Hong Kong Dollar", f: "🇭🇰", s: "HK$", r: "Major" },
  nzd: { n: "New Zealand Dollar", f: "🇳🇿", s: "NZ$", r: "Major" },
  sek: { n: "Swedish Krona", f: "🇸🇪", s: "kr", r: "Major" },
  nok: { n: "Norwegian Krone", f: "🇳🇴", s: "kr", r: "Major" },
  dkk: { n: "Danish Krone", f: "🇩🇰", s: "kr", r: "Major" },
  idr: { n: "Indonesian Rupiah", f: "🇮🇩", s: "Rp", r: "Asia & Pacific" },
  myr: { n: "Malaysian Ringgit", f: "🇲🇾", s: "RM", r: "Asia & Pacific" },
  thb: { n: "Thai Baht", f: "🇹🇭", s: "฿", r: "Asia & Pacific" },
  php: { n: "Philippine Peso", f: "🇵🇭", s: "₱", r: "Asia & Pacific" },
  vnd: { n: "Vietnamese Dong", f: "🇻🇳", s: "₫", r: "Asia & Pacific" },
  krw: { n: "South Korean Won", f: "🇰🇷", s: "₩", r: "Asia & Pacific" },
  twd: { n: "Taiwan Dollar", f: "🇹🇼", s: "NT$", r: "Asia & Pacific" },
  bdt: { n: "Bangladeshi Taka", f: "🇧🇩", s: "৳", r: "Asia & Pacific" },
  pkr: { n: "Pakistani Rupee", f: "🇵🇰", s: "₨", r: "Asia & Pacific" },
  lkr: { n: "Sri Lankan Rupee", f: "🇱🇰", s: "₨", r: "Asia & Pacific" },
  kzt: { n: "Kazakhstani Tenge", f: "🇰🇿", s: "₸", r: "Asia & Pacific" },
  azn: { n: "Azerbaijani Manat", f: "🇦🇿", s: "₼", r: "Asia & Pacific" },
  gel: { n: "Georgian Lari", f: "🇬🇪", s: "₾", r: "Asia & Pacific" },
  aed: { n: "UAE Dirham", f: "🇦🇪", s: "د.إ", r: "Middle East" },
  sar: { n: "Saudi Riyal", f: "🇸🇦", s: "﷼", r: "Middle East" },
  qar: { n: "Qatari Riyal", f: "🇶🇦", s: "﷼", r: "Middle East" },
  kwd: { n: "Kuwaiti Dinar", f: "🇰🇼", s: "KD", r: "Middle East" },
  bhd: { n: "Bahraini Dinar", f: "🇧🇭", s: "BD", r: "Middle East" },
  omr: { n: "Omani Rial", f: "🇴🇲", s: "﷼", r: "Middle East" },
  jod: { n: "Jordanian Dinar", f: "🇯🇴", s: "JD", r: "Middle East" },
  ils: { n: "Israeli Shekel", f: "🇮🇱", s: "₪", r: "Middle East" },
  irr: { n: "Iranian Rial", f: "🇮🇷", s: "﷼", r: "Middle East" },
  rub: { n: "Russian Ruble", f: "🇷🇺", s: "₽", r: "Europe" },
  uah: { n: "Ukrainian Hryvnia", f: "🇺🇦", s: "₴", r: "Europe" },
  pln: { n: "Polish Zloty", f: "🇵🇱", s: "zł", r: "Europe" },
  czk: { n: "Czech Koruna", f: "🇨🇿", s: "Kč", r: "Europe" },
  huf: { n: "Hungarian Forint", f: "🇭🇺", s: "Ft", r: "Europe" },
  ron: { n: "Romanian Leu", f: "🇷🇴", s: "lei", r: "Europe" },
  bgn: { n: "Bulgarian Lev", f: "🇧🇬", s: "лв", r: "Europe" },
  try: { n: "Turkish Lira", f: "🇹🇷", s: "₺", r: "Europe" },
  isk: { n: "Icelandic Króna", f: "🇮🇸", s: "kr", r: "Europe" },
  zar: { n: "South African Rand", f: "🇿🇦", s: "R", r: "Africa" },
  ngn: { n: "Nigerian Naira", f: "🇳🇬", s: "₦", r: "Africa" },
  kes: { n: "Kenyan Shilling", f: "🇰🇪", s: "Ksh", r: "Africa" },
  ghs: { n: "Ghanaian Cedi", f: "🇬🇭", s: "GH₵", r: "Africa" },
  egp: { n: "Egyptian Pound", f: "🇪🇬", s: "£", r: "Africa" },
  mad: { n: "Moroccan Dirham", f: "🇲🇦", s: "د.م.", r: "Africa" },
  brl: { n: "Brazilian Real", f: "🇧🇷", s: "R$", r: "Americas" },
  mxn: { n: "Mexican Peso", f: "🇲🇽", s: "$", r: "Americas" },
  ars: { n: "Argentine Peso", f: "🇦🇷", s: "$", r: "Americas" },
  cop: { n: "Colombian Peso", f: "🇨🇴", s: "$", r: "Americas" },
  clp: { n: "Chilean Peso", f: "🇨🇱", s: "$", r: "Americas" },
  pen: { n: "Peruvian Sol", f: "🇵🇪", s: "S/", r: "Americas" },
};

const REGIONS = [
  "Major",
  "Asia & Pacific",
  "Middle East",
  "Europe",
  "Africa",
  "Americas",
];

const BUDGET_RANGES = {
  Budget: { min: 500, max: 1500, daily: 167 },
  Moderate: { min: 1500, max: 3000, daily: 300 },
  Luxury: { min: 3000, max: 10000, daily: 600 },
};

const ACTIVITIES = [
  "🏖️ Beaches",
  "🏛️ Sightseeing",
  "🥾 Hiking",
  "🎨 Museums",
  "🍜 Food Tours",
  "🎉 Nightlife",
  "🛍️ Shopping",
  "🪂 Adventure",
];
const DIETS = [
  "🥗 Vegetarian",
  "🌱 Vegan",
  "🥙 Halal",
  "✡️ Kosher",
  "🌾 Gluten-Free",
];

const SOURCE_SUGGESTIONS = [
  "Hyderabad, India",
  "Bengaluru, India",
  "Chennai, India",
  "Mumbai, India",
  "Delhi, India",
  "London, UK",
];

const BG = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=1920&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539650116574-75c0c6d06e8e?w=1920&q=90&auto=format&fit=crop",
];

const DAY_BG = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=85&auto=format&fit=crop",
];

const GL = {
  fontSize: 10,
  fontWeight: 800,
  color: "rgba(99,102,241,0.7)",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  marginBottom: 6,
  fontFamily: "'Jost',sans-serif",
};

const formatWeatherCondition = (weather) => {
  const description = weather?.weather?.[0]?.description;
  const fallback = weather?.weather?.[0]?.main || "Unknown";
  return description
    ? description.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : fallback;
};

/* ═══════════════════════════════════════════════════════
   CURRENCY DROPDOWN
═══════════════════════════════════════════════════════ */
function CurrencyDropdown({ value, onChange, dark = true }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const inp = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inp.current?.focus(), 40);
  }, [open]);

  const matches = Object.entries(CM).filter(([code, c]) => {
    const lq = q.toLowerCase();
    return (
      !lq ||
      code.includes(lq) ||
      c.n.toLowerCase().includes(lq) ||
      c.s.includes(lq) ||
      c.r.toLowerCase().includes(lq)
    );
  });
  const grouped = REGIONS.map((r) => ({
    r,
    items: matches.filter(([, c]) => c.r === r),
  })).filter((g) => g.items.length);
  const sel = CM[value];

  const btnBg = dark
    ? open
      ? "rgba(99,102,241,0.14)"
      : "rgba(99,102,241,0.06)"
    : open
      ? "rgba(99,102,241,0.12)"
      : "#fff";
  const btnBord = dark
    ? open
      ? "rgba(99,102,241,0.6)"
      : "rgba(99,102,241,0.25)"
    : open
      ? "#6366f1"
      : "#e2e8f0";
  const btnClr = dark ? "#e8e0cc" : "#1a1814";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          background: btnBg,
          border: `1.5px solid ${btnBord}`,
          padding: "12px 14px",
          cursor: "pointer",
          fontFamily: "'Jost',sans-serif",
          color: btnClr,
          transition: "all 0.2s",
          backdropFilter: "blur(12px)",
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>
          {sel?.f}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "left",
            fontWeight: 500,
            fontSize: 13,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value.toUpperCase()} – {sel?.n}
        </span>
        <span
          style={{
            background: "rgba(99,102,241,0.18)",
            color: "#6366f1",
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            flexShrink: 0,
          }}
        >
          {sel?.s}
        </span>
        <span
          style={{ color: "rgba(99,102,241,0.5)", fontSize: 9, marginLeft: 2 }}
        >
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#0c0a07",
            border: "1px solid rgba(99,102,241,0.2)",
            zIndex: 9999,
            boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            maxHeight: 320,
            overflow: "hidden",
            animation: "dropIn 0.2s ease both",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid rgba(99,102,241,0.1)",
              flexShrink: 0,
            }}
          >
            <input
              ref={inp}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search currency or country…"
              style={{
                width: "100%",
                background: "rgba(99,102,241,0.06)",
                border: "1px solid rgba(99,102,241,0.15)",
                padding: "8px 12px",
                color: "#e8e0cc",
                fontSize: 12,
                fontFamily: "'Jost',sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {grouped.map(({ r, items }) => (
              <div key={r}>
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#6366f1",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    padding: "7px 14px 3px",
                    background: "rgba(99,102,241,0.04)",
                    borderBottom: "1px solid rgba(99,102,241,0.06)",
                  }}
                >
                  ⎯ {r}
                </p>
                {items.map(([code, c]) => {
                  const active = value === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        onChange(code);
                        setOpen(false);
                        setQ("");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        border: "none",
                        padding: "9px 14px",
                        background: active
                          ? "rgba(99,102,241,0.1)"
                          : "transparent",
                        cursor: "pointer",
                        fontFamily: "'Jost',sans-serif",
                        fontSize: 12,
                        color: active ? "#6366f1" : "rgba(232,224,204,0.8)",
                        fontWeight: active ? 600 : 400,
                        textAlign: "left",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        if (!active)
                          e.currentTarget.style.background =
                            "rgba(99,102,241,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        if (!active)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span style={{ fontSize: 16, width: 20, flexShrink: 0 }}>
                        {c.f}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.n}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "monospace",
                          color: "rgba(99,102,241,0.35)",
                          flexShrink: 0,
                        }}
                      >
                        {code.toUpperCase()}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(99,102,241,0.6)",
                          minWidth: 24,
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {c.s}
                      </span>
                      {active && (
                        <span style={{ color: "#6366f1", fontSize: 11 }}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   QUICK CONVERTER
═══════════════════════════════════════════════════════ */
function QuickConverter({ userCurrency, exchangeRates }) {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("usd");
  const sym = CM[userCurrency];

  const result = (() => {
    if (!exchangeRates || !Object.keys(exchangeRates).length) return null;
    const fr = exchangeRates[from] ?? 1;
    const tr = exchangeRates[userCurrency] ?? 1;
    return (amount / fr) * tr;
  })();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "100px 1fr 150px",
        gap: 12,
        alignItems: "end",
        padding: "16px 20px",
      }}
      className="cvg-grid"
    >
      <div>
        <p style={GL}>Amount</p>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          style={{
            width: "100%",
            background: "rgba(99,102,241,0.06)",
            border: "1.5px solid rgba(99,102,241,0.2)",
            padding: "11px 12px",
            color: "#e8e0cc",
            fontSize: 14,
            fontFamily: "'Jost',sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div>
        <p style={GL}>From Currency</p>
        <CurrencyDropdown value={from} onChange={setFrom} />
      </div>
      <div
        style={{
          background: "rgba(99,102,241,0.1)",
          border: "1.5px solid rgba(99,102,241,0.3)",
          padding: "11px 14px",
          minHeight: 46,
        }}
      >
        <p
          style={{
            fontSize: 9,
            color: "#6366f1",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: 4,
            fontFamily: "'Jost',sans-serif",
          }}
        >
          Result
        </p>
        <p
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#c4b5fd",
            lineHeight: 1,
            fontFamily: "'Playfair Display',serif",
          }}
        >
          {result != null
            ? `${sym?.f} ${sym?.s}${result.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
            : "—"}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAG BUTTON
═══════════════════════════════════════════════════════ */
function Tag({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "7px 14px",
        cursor: "pointer",
        fontFamily: "'Jost',sans-serif",
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        transition: "all 0.22s",
        border: `1px solid ${active ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.18)"}`,
        background: active ? "rgba(99,102,241,0.15)" : "transparent",
        color: active ? "#c4b5fd" : "rgba(232,224,204,0.5)",
        boxShadow: active ? "0 0 16px rgba(99,102,241,0.15)" : "none",
        transform: active ? "translateY(-1px) scale(1.02)" : "none",
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION BLOCK
═══════════════════════════════════════════════════════ */
function SectionBlock({ icon, label, text }) {
  return (
    <div
      style={{
        background: "rgba(99,102,241,0.05)",
        borderLeft: "2px solid rgba(99,102,241,0.3)",
        padding: "12px 15px",
      }}
    >
      <p
        style={{
          fontWeight: 600,
          color: "#6366f1",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          marginBottom: 5,
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontFamily: "'Jost',sans-serif",
        }}
      >
        {icon} {label}
      </p>
      <p
        style={{
          fontSize: 13,
          color: "rgba(232,224,204,0.7)",
          lineHeight: 1.7,
          fontFamily: "'Jost',sans-serif",
          fontWeight: 300,
        }}
      >
        {text}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GOLD ORNAMENT DIVIDER
═══════════════════════════════════════════════════════ */
function Ornament({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: "1.2rem",
      }}
    >
      <span
        style={{
          height: 1,
          flex: 1,
          background:
            "linear-gradient(to right, transparent, rgba(99,102,241,0.3))",
        }}
      />
      <span
        style={{
          fontSize: "0.6rem",
          color: "#ec4899",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontFamily: "'Jost',sans-serif",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        style={{
          height: 1,
          flex: 1,
          background:
            "linear-gradient(to left, transparent, rgba(99,102,241,0.3))",
        }}
      />
    </div>
  );
}

const fieldLabel = {
  fontSize: 10,
  fontWeight: 600,
  color: "rgba(99,102,241,0.65)",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  marginBottom: 7,
  display: "block",
  fontFamily: "'Jost',sans-serif",
};
const fieldInput = {
  width: "100%",
  background: "rgba(99,102,241,0.04)",
  border: "1px solid rgba(99,102,241,0.2)",
  borderBottom: "2px solid rgba(99,102,241,0.3)",
  padding: "11px 14px",
  color: "#e8e0cc",
  fontSize: 13,
  fontFamily: "'Jost',sans-serif",
  fontWeight: 300,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
};

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function TripNavigatorAI() {
  const [bgIdx, setBgIdx] = useState(0);
  const [heroImages, setHeroImages] = useState([]);
  const [destinationImages, setDestinationImages] = useState([]);
  const [userCurrency, setUserCurrency] = useState("usd");
  const [exchangeRates, setExchangeRates] = useState({});
  const [showConverter, setShowConverter] = useState(false);
  const [form, setForm] = useState({
    source: "",
    destination: "",
    date: "",
    days: 3,
    budget: "",
    companion: "",
    accommodation: "",
    transport: "",
    specialRequests: "",
  });
  const [activities, setActivities] = useState([]);
  const [dietary, setDietary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingOptions, setBookingOptions] = useState(null);
  const [error, setError] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const resultsRef = useRef(null);
  const activeHeroImages = heroImages.length ? heroImages : BG;
  const activeDestinationImages = destinationImages.length
    ? destinationImages
    : DAY_BG;

  useEffect(() => {
    const t = setInterval(
      () => setBgIdx((i) => (i + 1) % activeHeroImages.length),
      7000,
    );
    return () => clearInterval(t);
  }, [activeHeroImages.length]);

  useEffect(() => {
    let cancelled = false;

    const loadHeroImages = async () => {
      const images = await getDestinationImages("travel planning destinations");
      if (!cancelled && images.length) {
        setHeroImages(images.slice(0, BG.length));
      }
    };

    loadHeroImages();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const query = String(form.destination || "").trim();
    if (query.length < 3) {
      setDestinationImages([]);
      return;
    }

    let cancelled = false;

    const loadDestinationImages = async () => {
      const images = await getDestinationImages(`${query} travel landmarks`);
      if (!cancelled) {
        setDestinationImages(images);
      }
    };

    loadDestinationImages();

    return () => {
      cancelled = true;
    };
  }, [form.destination]);

  useEffect(() => {
    fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${userCurrency}.json`,
    )
      .then((r) => r.json())
      .then((d) => setExchangeRates(d[userCurrency] || {}))
      .catch(() => {});
  }, [userCurrency]);

  const fetchWeatherByCity = useCallback(async (cityName) => {
    const q = String(cityName || "").trim();
    if (!q) return;

    try {
      setWeatherLoading(true);
      setWeatherError("");
      const payload = await getWeather(q);
      if (payload?.error) {
        throw new Error(
          payload?.message || "Could not fetch destination weather",
        );
      }
      setWeatherData(payload);
    } catch (err) {
      setWeatherData(null);
      setWeatherError(err.message || "Could not fetch destination weather");
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    try {
      setWeatherLoading(true);
      setWeatherError("");
      const payload = await getCurrentWeather(lat, lon);
      if (payload?.error) {
        throw new Error(payload?.message || "Could not fetch location weather");
      }
      setWeatherData(payload);
    } catch (err) {
      setWeatherData(null);
      setWeatherError(err.message || "Could not fetch location weather");
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!form.destination || form.destination.trim().length < 3) return;

    const id = setTimeout(() => {
      fetchWeatherByCity(form.destination);
    }, 700);

    return () => clearTimeout(id);
  }, [form.destination, fetchWeatherByCity]);

  const convert = useCallback(
    (raw, num = false) => {
      const v = parseFloat(String(raw).replace(/[^0-9.-]+/g, ""));
      if (isNaN(v)) return num ? 0 : raw;
      const s = CM[userCurrency];
      if (userCurrency === "usd")
        return num ? v : `${s.s}${v.toLocaleString()}`;
      const rate = exchangeRates[userCurrency] ?? 1;
      const c = v * rate;
      return num
        ? c
        : `${s.f} ${s.s}${c.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    },
    [userCurrency, exchangeRates],
  );

  const toggleTag = (val, arr, set) =>
    set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const buildSavePayload = (tripName) => {
    const startDate = form.date || null;
    const endDate = form.date
      ? new Date(
          new Date(form.date).getTime() +
            (Math.max(Number(form.days || 1), 1) - 1) * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0]
      : null;

    return {
      source: form.source,
      destination: form.destination,
      tripName: tripName || form.destination,
      startDate,
      endDate,
      numberOfDays: Number(form.days),
      budget: form.budget,
      companion: form.companion,
      accommodation: form.accommodation || null,
      transport: form.transport || null,
      activities,
      dietary,
      specialRequests: form.specialRequests || null,
      itineraryData: itinerary,
    };
  };

  const handleSaveTrip = async () => {
    if (!itinerary) {
      alert("Generate an itinerary first before saving.");
      return;
    }

    const tripName = prompt("Trip name:", form.destination)?.trim();
    if (!tripName) return;

    try {
      setSavingTrip(true);
      await saveItinerary(buildSavePayload(tripName));
      alert(`✅ "${tripName}" saved successfully!`);
    } catch (err) {
      alert(`❌ ${err.message || "Failed to save trip"}`);
    } finally {
      setSavingTrip(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setItinerary(null);
    setBookingOptions(null);
    setBookingError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to generate an itinerary");
      const res = await fetch(apiUrl("/api/generate-itinerary"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, activities, dietary }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setItinerary(data);

      try {
        setBookingLoading(true);
        const endDate = form.date
          ? new Date(
              new Date(form.date).getTime() +
                (Math.max(Number(form.days || 1), 1) - 1) * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0]
          : null;

        const bookingData = await searchBookings({
          source: form.source,
          destination: form.destination,
          departureDate: form.date,
          returnDate: endDate,
          passengers: 1,
        });
        setBookingOptions(bookingData.options);
      } catch (bookingErr) {
        setBookingError(bookingErr.message || "Could not load booking options");
      } finally {
        setBookingLoading(false);
      }

      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
        120,
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setGeoLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Accept: "application/json",
              },
            },
          );

          const data = await response.json();
          const address = data?.address || {};
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            "";
          const country = address.country || "";
          const label = [city, country].filter(Boolean).join(", ");

          setForm((f) => ({
            ...f,
            source: label || data?.display_name || `${latitude}, ${longitude}`,
          }));
          await fetchWeatherByCoords(latitude, longitude);
        } catch {
          setError("Could not resolve your current location name.");
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setError("Location access denied. Enter source manually.");
        setShowSourceSuggestions(true);
        setGeoLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
      },
    );
  };

  const sym = CM[userCurrency];

  const BC = (() => {
    if (!itinerary || !form.budget) return null;
    const range = BUDGET_RANGES[form.budget];
    const tripDays = Math.max(Number(form.days || 1), 1);
    const parseEstimatedCost = (value) => {
      const matches = String(value || "").match(/\d+(?:\.\d+)?/g);
      if (!matches || matches.length === 0) return 0;
      const nums = matches.map(Number).filter((n) => Number.isFinite(n));
      if (nums.length === 0) return 0;
      if (nums.length >= 2) {
        return (nums[0] + nums[1]) / 2;
      }
      return nums[0];
    };
    const days = (itinerary.itinerary || []).map((d) => {
      const raw = parseEstimatedCost(d.estimatedCost);
      return { day: d.day, raw, conv: convert(raw, true), fmt: convert(raw) };
    });
    const total = days.reduce((s, d) => s + d.conv, 0);
    const max = convert(range.max, true),
      min = convert(range.min, true),
      daily = convert(
        Math.round((range.min + range.max) / (2 * tripDays)),
        true,
      );
    const pct = max > 0 ? Math.min((total / max) * 100, 100) : 0;
    const over = total > max,
      under = total < min;
    return {
      days,
      total,
      max,
      min,
      daily,
      pct,
      over,
      under,
      within: !over && !under,
      avg: total / tripDays,
    };
  })();

  return (
    <div
      style={{
        fontFamily: "'Jost','DM Sans',sans-serif",
        background: "#06070f",
        minHeight: "100vh",
        color: "#e8e0cc",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@200;300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; overflow-x: hidden; scroll-behavior: smooth; }

        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes riseUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes goldShim { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes scrollDrop { 0%{top:-40%} 100%{top:140%} }
        @keyframes scanLine { from{transform:translateY(-100%)} to{transform:translateY(200%)} }
        @keyframes dropIn   { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroZoom { from{transform:scale(1.04)} to{transform:scale(1.12)} }
        @keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes borderFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes revealLeft {
          from { opacity:0; transform: translateX(-20px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform: scale(0.93); }
          to   { opacity:1; transform: scale(1); }
        }

        .tn-rise  { animation: riseUp 0.7s ease both; }
        .tn-fade  { animation: fadeIn 0.5s ease both; }
        .tn-scale { animation: scaleIn 0.5s ease both; }

        /* Inputs */
        input:focus, textarea:focus {
          outline: none !important;
          border-color: #6366f1 !important;
          border-bottom-color: #c4b5fd !important;
          box-shadow: 0 0 0 2px rgba(99,102,241,0.1) !important;
          background: rgba(99,102,241,0.08) !important;
        }
        select:focus { outline: none !important; border-color: #6366f1 !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) saturate(3) hue-rotate(5deg); cursor:pointer; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { opacity: 0.4; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(99,102,241,0.04); }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 10px; }

        /* HERO — full viewport */
        .tn-hero {
          position: relative; width: 100%; height: 100vh; min-height: 500px;
          overflow: hidden; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
        }
        .tn-hero-slide {
          position: absolute; inset: 0;
          background-size: cover !important; background-position: center !important;
          background-repeat: no-repeat !important;
          transition: opacity 2s ease; animation: heroZoom 14s ease-in-out infinite alternate;
        }
        .tn-hero-overlay {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(180deg, rgba(8,7,5,0.5) 0%, rgba(8,7,5,0.2) 35%, rgba(8,7,5,0.6) 70%, rgba(8,7,5,0.95) 100%),
            radial-gradient(ellipse 100% 70% at 50% 100%, rgba(8,7,5,0.9) 0%, transparent 55%);
        }
        .tn-hero-grid {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background-image: linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 70px 70px;
        }
        .tn-hero::before {
          content: ""; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 90px;
          background: linear-gradient(to bottom, transparent, #6366f1, transparent);
          z-index: 3; animation: riseUp 1.8s ease 0.3s both;
        }
        .tn-hero-inner { position: relative; z-index: 4; width: 100%; max-width: 800px; padding: 0 20px 80px; }

        .tn-hero-badge {
          display: inline-flex; align-items: center; gap: 8px; margin-bottom: 1.8rem;
          background: rgba(99,102,241,0.1); backdrop-filter: blur(16px);
          border: 1px solid rgba(99,102,241,0.3); color: #6366f1;
          padding: 7px 22px; font-size: 0.6rem; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase;
          animation: riseUp 0.8s ease 0.2s both;
        }
        .tn-hero-badge span { width:6px; height:6px; background:#6366f1; transform:rotate(45deg); box-shadow:0 0 8px #6366f1; animation: glowPulse 2s ease infinite; }

        .tn-hero-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(3rem, 9vw, 7rem);
          font-weight: 400; line-height: 0.98; letter-spacing: -0.02em; margin-bottom: 0.25em;
          animation: riseUp 0.9s ease 0.4s both; opacity: 0; animation-fill-mode: forwards;
        }
        .tn-title-white { color: #f5eed8; display: block; }
        .tn-title-gold {
          display: block; font-style: italic;
          background: linear-gradient(135deg, #ec4899, #6366f1, #c4b5fd, #6366f1);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: riseUp 0.9s ease 0.4s both, goldShim 5s linear 1.5s infinite;
          opacity: 0; animation-fill-mode: forwards;
        }
        .tn-hero-sub {
          font-size: clamp(0.85rem, 1.8vw, 1rem); font-weight: 300;
          color: rgba(232,224,204,0.65); line-height: 1.85; letter-spacing: 0.05em;
          max-width: 500px; margin: 1.4rem auto 2.4rem;
          animation: riseUp 0.9s ease 0.6s both; opacity: 0; animation-fill-mode: forwards;
        }
        .tn-hero-stats {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 3rem;
          animation: riseUp 1s ease 0.8s both; opacity: 0; animation-fill-mode: forwards;
        }
        .tn-stat-item { animation: floatUp 4s ease-in-out infinite; }
        .tn-stat-item:nth-child(2) { animation-delay: 0.8s; }
        .tn-stat-item:nth-child(3) { animation-delay: 1.6s; }
        .tn-stat-num { font-family:"Playfair Display",serif; font-size:2.6rem; font-weight:400; color:#6366f1; line-height:1; display:block; }
        .tn-stat-label { font-size:0.58rem; color:rgba(232,224,204,0.45); text-transform:uppercase; letter-spacing:0.28em; margin-top:3px; display:block; }

        .tn-scroll-cue {
          position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
          z-index: 4; display: flex; flex-direction: column; align-items: center; gap: 6px;
          animation: fadeIn 1s ease 1.4s both; opacity: 0; animation-fill-mode: forwards;
        }
        .tn-scroll-text { font-size:0.55rem; color:rgba(99,102,241,0.4); letter-spacing:0.35em; text-transform:uppercase; }
        .tn-scroll-track { width:1px; height:50px; background:rgba(99,102,241,0.15); position:relative; overflow:hidden; }
        .tn-scroll-track::after { content:""; position:absolute; top:-40%; left:0; width:100%; height:40%; background:#6366f1; animation:scrollDrop 1.8s ease-in-out infinite; }

        /* MAIN */
        .tn-main { width: 100%; max-width: 1000px; margin: 0 auto; padding: 0 16px 80px; }

        /* GLASS */
        .tn-glass {
          background: rgba(12,10,7,0.92); backdrop-filter: blur(24px);
          border: 1px solid rgba(99,102,241,0.18); box-shadow: 0 24px 64px rgba(0,0,0,0.5);
          position: relative;
        }
        .tn-glass::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #ec4899, #6366f1, #ec4899, transparent);
          background-size: 200% 100%; animation: borderFlow 4s linear infinite;
        }

        /* FORM CARD */
        .tn-form-card {
          background: rgba(14,11,8,0.97); border: 1px solid rgba(99,102,241,0.18);
          box-shadow: 0 12px 48px rgba(0,0,0,0.4); overflow: hidden; margin-bottom: 24px;
          position: relative;
        }
        .tn-form-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #ec4899, #c4b5fd, #ec4899, transparent);
          background-size: 200% 100%; animation: borderFlow 4s linear infinite;
        }

        /* Form header (no photo) */
        .tn-form-header {
          padding: 28px 28px 20px;
          border-bottom: 1px solid rgba(99,102,241,0.1);
          background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
          position: relative; overflow: hidden;
        }
        .tn-form-header::after {
          content: "✈";
          position: absolute; right: 24px; top: 50%; transform: translateY(-50%);
          font-size: 80px; opacity: 0.04; color: #6366f1;
          animation: floatUp 6s ease-in-out infinite;
        }

        /* SELECT */
        .tn-select {
          width: 100%; background: rgba(99,102,241,0.04);
          border: 1px solid rgba(99,102,241,0.2); border-bottom: 2px solid rgba(99,102,241,0.3);
          padding: 11px 14px; color: #e8e0cc;
          font-family: "Jost", sans-serif; font-size: 13px; font-weight: 300;
          outline: none; cursor: pointer; appearance: auto; transition: border-color 0.2s;
        }
        .tn-select option { background: #0b1020; color: #e8e0cc; }
        .tn-select:focus { border-color: #6366f1 !important; border-bottom-color: #c4b5fd !important; }

        /* SUBMIT BUTTON */
        .tn-submit {
          width: 100%; padding: 16px;
          border: none;
          background: linear-gradient(135deg, #ec4899 0%, #6366f1 40%, #c4b5fd 70%, #6366f1 100%);
          background-size: 200% auto;
          color: #06070f; font-family: "Playfair Display", serif;
          font-size: 1.05rem; font-weight: 600; letter-spacing: 0.06em;
          cursor: pointer; transition: all 0.35s; position: relative; overflow: hidden;
        }
        .tn-submit::before {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%); transition: transform 0.5s ease;
        }
        .tn-submit:hover:not(:disabled)::before { transform: translateX(100%); }
        .tn-submit:hover:not(:disabled) { background-position: right center; box-shadow: 0 8px 32px rgba(99,102,241,0.35); transform: translateY(-2px); }
        .tn-submit:active:not(:disabled) { transform: translateY(0px); }
        .tn-submit:disabled { background: rgba(99,102,241,0.3); color: rgba(8,7,5,0.5); cursor: not-allowed; transform: none; }

        /* ACTION BUTTONS */
        .tn-action-btn {
          padding: 11px 22px; border: 1px solid rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.06); color: #6366f1;
          font-family: "Jost", sans-serif; font-size: 12px; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
        }
        .tn-action-btn:hover { background: rgba(99,102,241,0.15); border-color: #6366f1; box-shadow: 0 4px 20px rgba(99,102,241,0.15); transform: translateY(-2px); }

        /* DAY CARD */
        .tn-day-card {
          overflow: hidden; margin-bottom: 20px;
          border: 1px solid rgba(99,102,241,0.15);
          background: rgba(10,8,5,0.95);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
          animation: scaleIn 0.5s ease both;
        }
        .tn-day-card:hover { border-color: rgba(99,102,241,0.4); box-shadow: 0 20px 60px rgba(0,0,0,0.55), 0 0 30px rgba(99,102,241,0.07); transform: translateY(-2px); }

        .tn-day-img-wrap { position: relative; overflow: hidden; }
        .tn-day-img-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: brightness(0.5) saturate(0.7);
          transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.5s;
        }
        .tn-day-card:hover .tn-day-img-wrap img { transform: scale(1.06); filter: brightness(0.62) saturate(0.8); }
        .tn-day-scan {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to bottom, transparent 0%, rgba(99,102,241,0.07) 50%, transparent 100%);
          transform: translateY(-100%);
        }
        .tn-day-card:hover .tn-day-scan { animation: scanLine 1.2s ease 0.1s both; }

        /* RESPONSIVE GRID HELPERS */
        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
        .g-tip { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }

        @media (max-width: 768px) {
          .g2  { grid-template-columns: 1fr !important; }
          .g3  { grid-template-columns: 1fr 1fr !important; }
          .g4  { grid-template-columns: 1fr 1fr !important; }
          .g-tip { grid-template-columns: 1fr !important; }
          .cvg-grid { grid-template-columns: 1fr !important; }
          .tn-hero-stats { gap: 2rem !important; }
          .tn-day-img-wrap { height: 200px !important; }
          .curr-row { flex-direction: column !important; }
          .curr-row > * { min-width: unset !important; max-width: unset !important; }
          .bstat { grid-template-columns: 1fr 1fr !important; }
          .spsum { grid-template-columns: 1fr !important; }
          .tn-form-header::after { display: none; }
        }
        @media (max-width: 480px) {
          .g3 { grid-template-columns: 1fr !important; }
          .g4 { grid-template-columns: 1fr !important; }
          .bstat { grid-template-columns: 1fr !important; }
          .tn-hero-inner { padding: 0 14px 60px !important; }
          .tag-wrap { gap: 5px !important; }
        }

        /* Animated entry for form fields */
        .field-animate { animation: revealLeft 0.45s ease both; }
        .field-animate:nth-child(1) { animation-delay: 0.05s; }
        .field-animate:nth-child(2) { animation-delay: 0.1s; }
        .field-animate:nth-child(3) { animation-delay: 0.15s; }
        .field-animate:nth-child(4) { animation-delay: 0.2s; }
        .field-animate:nth-child(5) { animation-delay: 0.25s; }
        .field-animate:nth-child(6) { animation-delay: 0.3s; }
        .field-animate:nth-child(7) { animation-delay: 0.35s; }
        .field-animate:nth-child(8) { animation-delay: 0.4s; }
      `}</style>

      {/* ══════════ HERO ══════════ */}
      <header className="tn-hero">
        {activeHeroImages.map((src, i) => (
          <div
            key={i}
            className="tn-hero-slide"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === bgIdx ? 1 : 0,
              zIndex: 0,
            }}
          />
        ))}
        <div className="tn-hero-overlay" />
        <div className="tn-hero-grid" />

        {[
          { l: "12%", d: "0.2s" },
          { l: "25%", d: "0.5s", h: "30%" },
          { r: "12%", d: "0.4s" },
          { r: "26%", d: "0.7s", h: "25%" },
        ].map((v, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 1,
              height: v.h || "40%",
              top: "8%",
              left: v.l,
              right: v.r,
              background:
                "linear-gradient(to bottom,transparent,rgba(99,102,241,0.18),transparent)",
              zIndex: 3,
              animation: `riseUp 2s ease ${v.d} both`,
            }}
          />
        ))}

        <div className="tn-hero-inner">
          <div className="tn-hero-badge">
            <span />
            &nbsp; AI-Powered Travel Planning
          </div>
          <h1 className="tn-hero-title">
            <span className="tn-title-white">Discover the</span>
            <span className="tn-title-gold">World, Your Way</span>
          </h1>
          <p className="tn-hero-sub">
            Personalized AI itineraries with real-time budget tracking in every
            world currency
          </p>
          <div className="tn-hero-stats">
            {[
              ["150+", "Destinations"],
              ["10K+", "Trips Planned"],
              [`${Object.keys(CM).length}+`, "Currencies"],
            ].map(([n, l]) => (
              <div
                key={l}
                className="tn-stat-item"
                style={{ textAlign: "center" }}
              >
                <span className="tn-stat-num">{n}</span>
                <span className="tn-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tn-scroll-cue">
          <span className="tn-scroll-text">Scroll</span>
          <div className="tn-scroll-track" />
        </div>
      </header>

      {/* ══════════ MAIN ══════════ */}
      <main className="tn-main">
        {/* ── Currency Card ── */}
        <div
          className="tn-glass tn-rise"
          style={{
            marginTop: -70,
            marginBottom: 22,
            position: "relative",
            zIndex: 20,
          }}
        >
          <div style={{ padding: "20px 24px" }}>
            <div
              className="curr-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  background: "linear-gradient(135deg,#ec4899,#0b1020)",
                  border: "1px solid #ec4899",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                💱
              </div>
              <div style={{ flex: "0 0 auto" }}>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#f5eed8",
                    marginBottom: 2,
                    fontFamily: "'Playfair Display',serif",
                  }}
                >
                  Display Prices In
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(232,224,204,0.45)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Live exchange rates · All currencies
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                  minWidth: 0,
                  justifyContent: "flex-end",
                }}
              >
                <div style={{ flex: 1, minWidth: 140, maxWidth: 400 }}>
                  <CurrencyDropdown
                    value={userCurrency}
                    onChange={setUserCurrency}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConverter((v) => !v)}
                  style={{
                    padding: "12px 18px",
                    flexShrink: 0,
                    background: showConverter
                      ? "rgba(99,102,241,0.18)"
                      : "transparent",
                    border: "1px solid rgba(99,102,241,0.35)",
                    color: "#6366f1",
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    transition: "all 0.2s",
                  }}
                >
                  {showConverter ? "Hide" : "Show"} Calc
                </button>
              </div>
            </div>
          </div>

          {showConverter && (
            <div
              style={{
                borderTop: "1px solid rgba(99,102,241,0.1)",
                animation: "dropIn 0.25s ease both",
              }}
            >
              <QuickConverter
                userCurrency={userCurrency}
                exchangeRates={exchangeRates}
              />
            </div>
          )}
        </div>

        {/* ── Planner Form ── */}
        <div
          className="tn-form-card tn-rise"
          style={{ animationDelay: "0.08s" }}
        >
          {/* Clean header — no photo */}
          <div className="tn-form-header">
            <Ornament label="AI Travel Planner" />
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(1.4rem,3.5vw,2rem)",
                fontWeight: 400,
                color: "#f5eed8",
                lineHeight: 1.15,
                marginBottom: 6,
              }}
            >
              Plan Your Perfect Trip
            </h2>
            <p
              style={{
                fontSize: 12,
                color: "rgba(232,224,204,0.45)",
                letterSpacing: "0.05em",
              }}
            >
              Fill in your preferences and let AI craft your personalized
              itinerary
            </p>
          </div>

          <div style={{ padding: "24px 26px" }}>
            <form onSubmit={handleSubmit}>
              {/* Source + Destination */}
              <div className="g2 field-animate" style={{ marginBottom: 16 }}>
                <div>
                  <label style={fieldLabel}>Starting Location *</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 13,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 15,
                        pointerEvents: "none",
                        color: "#ec4899",
                      }}
                    >
                      ⌖
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Hyderabad, Delhi, London"
                      value={form.source}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, source: e.target.value }))
                      }
                      onFocus={() => setShowSourceSuggestions(true)}
                      style={{ ...fieldInput, paddingLeft: 38 }}
                    />
                    <button
                      type="button"
                      onClick={handleUseMyLocation}
                      disabled={geoLoading}
                      style={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "1px solid rgba(99,102,241,0.35)",
                        background: "rgba(99,102,241,0.12)",
                        color: "#c4b5fd",
                        padding: "4px 8px",
                        fontSize: 10,
                        cursor: geoLoading ? "not-allowed" : "pointer",
                        fontFamily: "'Jost',sans-serif",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {geoLoading ? "Locating..." : "Use Current"}
                    </button>
                  </div>
                  {(showSourceSuggestions || !form.source) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginTop: 8,
                      }}
                    >
                      {SOURCE_SUGGESTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setForm((f) => ({ ...f, source: item }));
                            setShowSourceSuggestions(false);
                          }}
                          style={{
                            border: "1px solid rgba(99,102,241,0.25)",
                            background: "rgba(99,102,241,0.08)",
                            color: "rgba(232,224,204,0.9)",
                            fontSize: 10,
                            padding: "4px 8px",
                            cursor: "pointer",
                            fontFamily: "'Jost',sans-serif",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label style={fieldLabel}>Where are you going? *</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 13,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 15,
                        pointerEvents: "none",
                        color: "#ec4899",
                      }}
                    >
                      ◎
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Bali, Tokyo, Paris, New York"
                      value={form.destination}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, destination: e.target.value }))
                      }
                      style={{ ...fieldInput, paddingLeft: 38 }}
                    />
                  </div>
                </div>
              </div>

              <div className="field-animate" style={{ marginBottom: 16 }}>
                <label style={fieldLabel}>Live Weather</label>
                <div
                  style={{
                    border: "1px solid rgba(99,102,241,0.2)",
                    background: "rgba(99,102,241,0.05)",
                    padding: "12px 14px",
                  }}
                >
                  {weatherLoading ? (
                    <p
                      style={{
                        fontSize: 12,
                        color: "#c4b5fd",
                        marginBottom: 8,
                        fontFamily: "'Jost',sans-serif",
                      }}
                    >
                      Fetching real-time weather...
                    </p>
                  ) : weatherData ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit,minmax(140px,1fr))",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(99,102,241,0.75)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Location
                        </p>
                        <p style={{ fontSize: 13, color: "#f5eed8" }}>
                          {weatherData.name}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(99,102,241,0.75)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Temperature
                        </p>
                        <p style={{ fontSize: 13, color: "#f5eed8" }}>
                          {Math.round(weatherData.main?.temp)}°C
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(99,102,241,0.75)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Condition
                        </p>
                        <p style={{ fontSize: 13, color: "#f5eed8" }}>
                          {formatWeatherCondition(weatherData)}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(99,102,241,0.75)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Humidity
                        </p>
                        <p style={{ fontSize: 13, color: "#f5eed8" }}>
                          {weatherData.main?.humidity}%
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(232,224,204,0.6)",
                        marginBottom: 8,
                        fontFamily: "'Jost',sans-serif",
                      }}
                    >
                      Enter destination to auto-load weather, or use your
                      current location.
                    </p>
                  )}

                  {weatherError && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "#fca5a5",
                        marginBottom: 8,
                        fontFamily: "'Jost',sans-serif",
                      }}
                    >
                      {weatherError}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => fetchWeatherByCity(form.destination)}
                      disabled={weatherLoading || !form.destination.trim()}
                      style={{
                        border: "1px solid rgba(99,102,241,0.35)",
                        background: "rgba(99,102,241,0.12)",
                        color: "#c4b5fd",
                        padding: "6px 10px",
                        fontSize: 10,
                        cursor:
                          weatherLoading || !form.destination.trim()
                            ? "not-allowed"
                            : "pointer",
                        fontFamily: "'Jost',sans-serif",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      Check Destination Weather
                    </button>
                    <button
                      type="button"
                      onClick={handleUseMyLocation}
                      disabled={geoLoading || weatherLoading}
                      style={{
                        border: "1px solid rgba(99,102,241,0.35)",
                        background: "transparent",
                        color: "rgba(232,224,204,0.85)",
                        padding: "6px 10px",
                        fontSize: 10,
                        cursor:
                          geoLoading || weatherLoading
                            ? "not-allowed"
                            : "pointer",
                        fontFamily: "'Jost',sans-serif",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {geoLoading
                        ? "Locating..."
                        : "Use Current Location Weather"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Date + Days */}
              <div className="g2 field-animate" style={{ marginBottom: 16 }}>
                <div>
                  <label style={fieldLabel}>Travel Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    style={fieldInput}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Number of Days *</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    required
                    value={form.days}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        days: parseInt(e.target.value) || 1,
                      }))
                    }
                    style={fieldInput}
                  />
                </div>
              </div>

              {/* Budget + Companion */}
              <div className="g2 field-animate" style={{ marginBottom: 16 }}>
                <div>
                  <label style={fieldLabel}>Budget Level *</label>
                  <select
                    required
                    value={form.budget}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budget: e.target.value }))
                    }
                    className="tn-select"
                  >
                    <option value="">Select Budget</option>
                    <option value="Budget">◇ Budget ($500–$1,500)</option>
                    <option value="Moderate">◈ Moderate ($1,500–$3,000)</option>
                    <option value="Luxury">✦ Luxury ($3,000+)</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Traveling With *</label>
                  <select
                    required
                    value={form.companion}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, companion: e.target.value }))
                    }
                    className="tn-select"
                  >
                    <option value="">Select</option>
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Family with Kids">Family</option>
                    <option value="Friends">Friends</option>
                  </select>
                </div>
              </div>

              {/* Accommodation + Transport */}
              <div className="g2 field-animate" style={{ marginBottom: 16 }}>
                <div>
                  <label style={fieldLabel}>Accommodation</label>
                  <select
                    value={form.accommodation}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, accommodation: e.target.value }))
                    }
                    className="tn-select"
                  >
                    <option value="">Any</option>
                    <option value="Luxury Hotel">Luxury Hotel</option>
                    <option value="Boutique Hotel">Boutique Hotel</option>
                    <option value="Airbnb">Airbnb</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Transport</label>
                  <select
                    value={form.transport}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, transport: e.target.value }))
                    }
                    className="tn-select"
                  >
                    <option value="">Any</option>
                    <option value="Flight">Flight</option>
                    <option value="Train">Train</option>
                    <option value="Bus">Bus</option>
                    <option value="Car Rental">Car Rental</option>
                    <option value="Public Transport">Public Transit</option>
                  </select>
                </div>
              </div>

              {/* Activities */}
              <div style={{ marginBottom: 16 }} className="field-animate">
                <label style={fieldLabel}>What interests you?</label>
                <div
                  className="tag-wrap"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 7,
                    marginTop: 6,
                  }}
                >
                  {ACTIVITIES.map((a) => {
                    const v = a.split(" ").slice(1).join(" ");
                    return (
                      <Tag
                        key={v}
                        label={a}
                        active={activities.includes(v)}
                        onClick={() => toggleTag(v, activities, setActivities)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Dietary */}
              <div style={{ marginBottom: 16 }} className="field-animate">
                <label style={fieldLabel}>Dietary Preferences</label>
                <div
                  className="tag-wrap"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 7,
                    marginTop: 6,
                  }}
                >
                  {DIETS.map((d) => {
                    const v = d.split(" ").slice(1).join(" ");
                    return (
                      <Tag
                        key={v}
                        label={d}
                        active={dietary.includes(v)}
                        onClick={() => toggleTag(v, dietary, setDietary)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Special requests */}
              <div style={{ marginBottom: 22 }} className="field-animate">
                <label style={fieldLabel}>Special Requests</label>
                <textarea
                  rows={3}
                  value={form.specialRequests}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, specialRequests: e.target.value }))
                  }
                  placeholder="e.g., love photography, wheelchair access, avoid crowds…"
                  style={{ ...fieldInput, resize: "vertical", lineHeight: 1.7 }}
                />
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="tn-submit">
                {loading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        border: "2.5px solid rgba(8,7,5,0.3)",
                        borderTopColor: "#06070f",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    AI is crafting your adventure…
                  </span>
                ) : (
                  "✦ Generate My Itinerary"
                )}
              </button>
            </form>

            {error && (
              <div
                style={{
                  marginTop: 14,
                  padding: "14px 18px",
                  background: "rgba(220,38,38,0.1)",
                  border: "1px solid rgba(220,38,38,0.3)",
                  color: "#f87171",
                  fontSize: 13,
                  animation: "shake 0.4s ease",
                  fontFamily: "'Jost',sans-serif",
                  letterSpacing: "0.03em",
                }}
              >
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>

        {/* ══════════ RESULTS ══════════ */}
        <div ref={resultsRef}>
          {itinerary && (
            <div className="tn-fade">
              {/* Booking Options */}
              <div
                style={{
                  background: "rgba(9,8,6,0.95)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  padding: "20px 22px",
                  marginBottom: 20,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                }}
              >
                <h3
                  style={{
                    marginBottom: 8,
                    color: "#c4b5fd",
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "1.25rem",
                  }}
                >
                  Bookings: Flights, Hotels, Trains, Buses
                </h3>
                <p
                  style={{
                    color: "rgba(232,224,204,0.7)",
                    fontSize: 12,
                    marginBottom: 12,
                    fontFamily: "'Jost',sans-serif",
                  }}
                >
                  From {form.source} to {form.destination}
                </p>

                {bookingLoading && (
                  <div style={{ color: "#c4b5fd", fontSize: 12 }}>
                    Loading booking options...
                  </div>
                )}

                {bookingError && (
                  <div
                    style={{ color: "#fca5a5", fontSize: 12, marginBottom: 8 }}
                  >
                    {bookingError}
                  </div>
                )}

                {bookingOptions && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                      gap: 10,
                    }}
                  >
                    {[
                      ["Flights", bookingOptions.flights || []],
                      ["Hotels", bookingOptions.hotels || []],
                      ["Trains", bookingOptions.trains || []],
                      ["Buses", bookingOptions.buses || []],
                    ].map(([title, items]) => (
                      <div
                        key={title}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(99,102,241,0.2)",
                          padding: "12px",
                        }}
                      >
                        <div
                          style={{
                            color: "#f5eed8",
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 8,
                          }}
                        >
                          {title}
                        </div>
                        {items.length === 0 ? (
                          <div
                            style={{
                              color: "rgba(232,224,204,0.6)",
                              fontSize: 11,
                            }}
                          >
                            No options available
                          </div>
                        ) : (
                          items.map((item, idx) => (
                            <a
                              key={`${title}-${idx}`}
                              href={item.bookingUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "block",
                                textDecoration: "none",
                                color: "#c4b5fd",
                                fontSize: 12,
                                marginBottom: 6,
                                border: "1px solid rgba(99,102,241,0.25)",
                                padding: "6px 8px",
                                background: "rgba(99,102,241,0.08)",
                              }}
                            >
                              {item.provider}
                            </a>
                          ))
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget Analysis */}
              {BC && (
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: 20,
                    padding: "26px 28px",
                    color: "#f5eed8",
                    background: BC.over
                      ? "linear-gradient(135deg,rgba(60,8,8,0.95),rgba(180,30,30,0.85))"
                      : BC.within
                        ? "linear-gradient(135deg,rgba(8,35,18,0.95),rgba(6,120,80,0.85))"
                        : "linear-gradient(135deg,rgba(40,20,5,0.95),rgba(180,100,20,0.85))",
                    border: `1px solid ${BC.over ? "rgba(220,38,38,0.35)" : BC.within ? "rgba(6,120,80,0.35)" : "rgba(99,102,241,0.35)"}`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                    animation: "scaleIn 0.5s ease both",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 280,
                      height: 280,
                      background:
                        "radial-gradient(circle,rgba(255,255,255,0.04) 0%,transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 18,
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display',serif",
                          fontSize: "1.6rem",
                          fontWeight: 400,
                          marginBottom: 5,
                        }}
                      >
                        {BC.over ? "⚠️" : BC.within ? "✅" : "💡"} Budget
                        Analysis
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          opacity: 0.85,
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 300,
                        }}
                      >
                        {BC.over
                          ? `Over budget by ${sym?.s}${Math.abs(BC.max - BC.total).toFixed(2)}`
                          : BC.under
                            ? "Under minimum — consider upgrading"
                            : `Great! Saving ${sym?.s}${(BC.max - BC.total).toFixed(2)}`}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: 9,
                          opacity: 0.5,
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                          marginBottom: 3,
                          fontFamily: "'Jost',sans-serif",
                        }}
                      >
                        Budget Level
                      </p>
                      <p
                        style={{
                          fontFamily: "'Playfair Display',serif",
                          fontSize: "1.5rem",
                          fontWeight: 400,
                          color: "#c4b5fd",
                        }}
                      >
                        {form.budget}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      height: 7,
                      overflow: "hidden",
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${BC.pct}%`,
                        background: "rgba(255,255,255,0.75)",
                        transition: "width 1.2s ease",
                      }}
                    />
                  </div>
                  <div
                    className="bstat"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      gap: 10,
                    }}
                  >
                    {[
                      [
                        "Budget Range",
                        `${sym?.s}${BC.min.toFixed(0)} – ${sym?.s}${BC.max.toFixed(0)}`,
                      ],
                      ["Total Spent", `${sym?.s}${BC.total.toFixed(2)}`],
                      ["Daily Avg", `${sym?.s}${BC.avg.toFixed(2)}`],
                      ["Rec. Daily", `${sym?.s}${BC.daily.toFixed(0)}/day`],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          padding: "11px 13px",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 9,
                            opacity: 0.55,
                            marginBottom: 3,
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            fontFamily: "'Jost',sans-serif",
                          }}
                        >
                          {l}
                        </p>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            wordBreak: "break-all",
                            fontFamily: "'Jost',sans-serif",
                          }}
                        >
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trip Summary */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  marginBottom: 20,
                  minHeight: 220,
                  border: "1px solid rgba(99,102,241,0.2)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                  animation: "scaleIn 0.5s ease 0.1s both",
                }}
              >
                <img
                  src={activeDestinationImages[0] || activeHeroImages[0]}
                  alt="Travel map"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.35) saturate(0.6)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg,rgba(8,7,5,0.88),rgba(160,120,50,0.5))",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    padding: "2rem 2.2rem",
                    color: "#f5eed8",
                  }}
                >
                  <Ornament label="Your Journey" />
                  <h3
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: "clamp(1.4rem,4vw,2rem)",
                      fontWeight: 400,
                      marginBottom: 10,
                    }}
                  >
                    ◎ {form.destination} Adventure
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      opacity: 0.85,
                      lineHeight: 1.75,
                      marginBottom: 20,
                      maxWidth: 600,
                      fontWeight: 300,
                      fontFamily: "'Jost',sans-serif",
                    }}
                  >
                    {itinerary.summary}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[
                      `📅 ${form.days} Days`,
                      `💰 ${convert(itinerary.totalEstimatedCost)}`,
                      `👥 ${form.companion}`,
                      `${sym?.f} ${sym?.n}`,
                    ].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "rgba(99,102,241,0.14)",
                          border: "1px solid rgba(99,102,241,0.3)",
                          padding: "6px 14px",
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#c4b5fd",
                          fontFamily: "'Jost',sans-serif",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daily Spending */}
              {BC?.days?.length > 0 && (
                <div
                  style={{
                    background: "rgba(10,8,5,0.95)",
                    border: "1px solid rgba(99,102,241,0.15)",
                    padding: "24px 26px",
                    marginBottom: 20,
                    animation: "scaleIn 0.5s ease 0.15s both",
                  }}
                >
                  <Ornament label="Spending Breakdown" />
                  <h3
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: "1.3rem",
                      color: "#f5eed8",
                      marginBottom: 18,
                    }}
                  >
                    Daily Budget Tracker
                  </h3>
                  {BC.days.map((d, i) => {
                    const p = BC.daily > 0 ? (d.conv / BC.daily) * 100 : 0,
                      ov = p > 100;
                    return (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 6,
                            flexWrap: "wrap",
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 500,
                              fontSize: 12,
                              color: "#f5eed8",
                              fontFamily: "'Jost',sans-serif",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            Day {d.day}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                color: "rgba(232,224,204,0.45)",
                                fontFamily: "'Jost',sans-serif",
                              }}
                            >
                              {d.fmt}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 10px",
                                background: ov
                                  ? "rgba(220,38,38,0.15)"
                                  : "rgba(6,120,80,0.15)",
                                color: ov ? "#f87171" : "#34d399",
                                border: `1px solid ${ov ? "rgba(220,38,38,0.3)" : "rgba(6,120,80,0.3)"}`,
                                fontFamily: "'Jost',sans-serif",
                              }}
                            >
                              {p.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            height: 5,
                            background: "rgba(99,102,241,0.08)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.min(p, 100)}%`,
                              background: ov
                                ? "linear-gradient(90deg,#dc2626,#f97316)"
                                : "linear-gradient(90deg,#ec4899,#6366f1)",
                              transition: "width 1s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className="spsum"
                    style={{
                      borderTop: "1px solid rgba(99,102,241,0.1)",
                      paddingTop: 16,
                      marginTop: 6,
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: 12,
                    }}
                  >
                    {[
                      [
                        "Lowest Day",
                        "#34d399",
                        Math.min(...BC.days.map((d) => d.conv)),
                      ],
                      [
                        "Highest Day",
                        "#f87171",
                        Math.max(...BC.days.map((d) => d.conv)),
                      ],
                      ["Average Day", "#c4b5fd", BC.avg],
                    ].map(([l, c, v]) => (
                      <div key={l} style={{ textAlign: "center" }}>
                        <p
                          style={{
                            fontSize: 9,
                            color: "rgba(232,224,204,0.45)",
                            marginBottom: 4,
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            fontFamily: "'Jost',sans-serif",
                          }}
                        >
                          {l}
                        </p>
                        <p
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: c,
                            fontFamily: "'Playfair Display',serif",
                          }}
                        >
                          {sym?.s}
                          {v.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Ornament label="Day-by-Day Itinerary" />

              {/* Day Cards */}
              {(itinerary.itinerary || []).map((day, i) => (
                <div
                  key={i}
                  className="tn-day-card"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="tn-day-img-wrap" style={{ height: 250 }}>
                    <img
                      src={
                        day.image ||
                        activeDestinationImages[
                          i % activeDestinationImages.length
                        ]
                      }
                      alt={day.title}
                      onError={(e) => {
                        e.target.src = DAY_BG[i % DAY_BG.length];
                      }}
                    />
                    <div className="tn-day-scan" />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top,rgba(8,7,5,0.92) 0%,rgba(8,7,5,0.25) 55%,transparent 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        background: "#6366f1",
                        color: "#06070f",
                        padding: "6px 18px 6px 14px",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontFamily: "'Jost',sans-serif",
                        clipPath:
                          "polygon(0 0,100% 0,calc(100% - 8px) 100%,0 100%)",
                      }}
                    >
                      Day {day.day}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 14,
                        background: "rgba(8,7,5,0.75)",
                        backdropFilter: "blur(12px)",
                        padding: "7px 16px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#c4b5fd",
                        border: "1px solid rgba(99,102,241,0.3)",
                        fontFamily: "'Jost',sans-serif",
                      }}
                    >
                      💰 {convert(day.estimatedCost)}
                    </div>
                    <h3
                      style={{
                        position: "absolute",
                        bottom: 16,
                        left: 18,
                        right: 18,
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "clamp(1.1rem,3vw,1.5rem)",
                        fontWeight: 400,
                        color: "#fff",
                        lineHeight: 1.2,
                        textShadow: "0 2px 16px rgba(0,0,0,0.7)",
                      }}
                    >
                      {day.title}
                    </h3>
                  </div>
                  <div
                    style={{
                      padding: "18px 20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <SectionBlock
                      icon="🌅"
                      label="Morning"
                      text={day.morning}
                    />
                    <SectionBlock
                      icon="☀️"
                      label="Afternoon"
                      text={day.afternoon}
                    />
                    <SectionBlock
                      icon="🌆"
                      label="Evening"
                      text={day.evening}
                    />
                    <SectionBlock icon="🍽️" label="Dining" text={day.dining} />
                    <SectionBlock
                      icon="✦"
                      label="Insider Tips"
                      text={day.tips}
                    />
                  </div>
                </div>
              ))}

              {/* Tips Grid */}
              <div className="g-tip">
                {[
                  {
                    title: "◈ Pack Essentials",
                    items: itinerary.packingTips || [],
                    img:
                      activeDestinationImages[1] ||
                      activeHeroImages[1] ||
                      BG[1],
                  },
                  {
                    title: "◎ Local Know-How",
                    items: itinerary.localTips || [],
                    img:
                      activeDestinationImages[2] ||
                      activeHeroImages[2] ||
                      BG[2],
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    style={{
                      border: "1px solid rgba(99,102,241,0.15)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        height: 90,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={card.img}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "brightness(0.4) saturate(0.6)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(8,7,5,0.6)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "1.2rem",
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: "'Playfair Display',serif",
                            fontSize: "1rem",
                            fontWeight: 400,
                            color: "#f5eed8",
                          }}
                        >
                          {card.title}
                        </h4>
                      </div>
                    </div>
                    <div
                      style={{
                        background: "rgba(10,8,5,0.95)",
                        padding: "12px 14px 14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 7,
                      }}
                    >
                      {(card.items || []).map((tip, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 10,
                            fontSize: 12,
                            color: "rgba(232,224,204,0.45)",
                            background: "rgba(99,102,241,0.04)",
                            padding: "9px 12px",
                            borderLeft: "2px solid rgba(99,102,241,0.2)",
                            alignItems: "flex-start",
                            fontFamily: "'Jost',sans-serif",
                            fontWeight: 300,
                          }}
                        >
                          <span
                            style={{
                              color: "#6366f1",
                              flexShrink: 0,
                              fontSize: 10,
                              marginTop: 2,
                            }}
                          >
                            ✦
                          </span>
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                {[
                  {
                    l: savingTrip ? "⏳ Saving..." : "◇ Save Trip",
                    fn: handleSaveTrip,
                    dis: savingTrip,
                  },
                  { l: "⬡ Print", fn: () => window.print() },
                  {
                    l: "◈ Copy Details",
                    fn: () =>
                      navigator.clipboard
                        .writeText(JSON.stringify(itinerary, null, 2))
                        .then(() => alert("✅ Copied!")),
                  },
                  {
                    l: "↺ Plan Another",
                    fn: () => {
                      setItinerary(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    },
                  },
                ].map((btn) => (
                  <button
                    key={btn.l}
                    onClick={btn.fn}
                    className="tn-action-btn"
                    disabled={btn.dis}
                  >
                    {btn.l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
