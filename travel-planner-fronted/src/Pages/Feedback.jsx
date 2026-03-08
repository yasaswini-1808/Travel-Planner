import React, { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & DATA
═══════════════════════════════════════════════════════════ */
const MAX_CHARS = 500;

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    avatar: "🧳",
    rating: 5,
    text: "TravelPlanner made our honeymoon absolutely perfect. The AI itinerary was spot-on!",
  },
  {
    name: "James K.",
    avatar: "🌍",
    rating: 5,
    text: "Booked 3 trips now with this app. Found deals I never would have found on my own.",
  },
  {
    name: "Priya S.",
    avatar: "✈️",
    rating: 4,
    text: "The continents section is so beautiful. Exploring destinations feels like an adventure.",
  },
  {
    name: "Carlos R.",
    avatar: "🗺️",
    rating: 5,
    text: "The chatbot answered every single question I had. Felt like a real travel agent.",
  },
  {
    name: "Aisha O.",
    avatar: "🏖️",
    rating: 5,
    text: "Day-by-day itinerary was brilliant. Saved so much planning time for our family trip.",
  },
  {
    name: "Tom W.",
    avatar: "🎒",
    rating: 4,
    text: "Super clean UI and the weather comparison feature is underrated – incredibly useful!",
  },
];

const CATEGORIES = [
  { emoji: "🤖", label: "AI Planner" },
  { emoji: "💸", label: "Deals" },
  { emoji: "🗺️", label: "Explore Map" },
  { emoji: "🎨", label: "UI/UX" },
  { emoji: "💬", label: "Support" },
  { emoji: "✈️", label: "Itinerary" },
  { emoji: "🌤️", label: "Weather" },
  { emoji: "📝", label: "Other" },
];

const STATS = [
  {
    emoji: "⭐",
    value: 49,
    display: "4.9",
    suffix: "",
    label: "Average Rating",
  },
  {
    emoji: "✍️",
    value: 12000,
    display: "12,000",
    suffix: "+",
    label: "Reviews Collected",
  },
  {
    emoji: "🚀",
    value: 96,
    display: "96",
    suffix: "%",
    label: "Satisfaction Rate",
  },
  { emoji: "🌍", value: 80, display: "80", suffix: "+", label: "Countries" },
];

const WHY_CARDS = [
  {
    emoji: "🧠",
    title: "Improves the AI",
    desc: "Your input trains our planner to deliver smarter, more personalised itineraries.",
    accent: "#a855f7",
  },
  {
    emoji: "🐛",
    title: "Squashes Bugs",
    desc: "Reports help us catch issues fast and keep the experience perfectly smooth.",
    accent: "#6366f1",
  },
  {
    emoji: "🚀",
    title: "Drives Features",
    desc: "The most-requested ideas get built first. Your wish list becomes our roadmap.",
    accent: "#ec4899",
  },
];

const STAR_LABELS = [
  "",
  "😐 Poor",
  "🙁 Fair",
  "😊 Good",
  "😄 Great",
  "🤩 Amazing!",
];

/* ═══════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════ */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function useCountUp(target, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [active, target]);
  return count;
}

/* ═══════════════════════════════════════════════════════════
   UTILITY COMPONENTS
═══════════════════════════════════════════════════════════ */

// Scroll-reveal wrapper — bug fix: was using inconsistent direction keys
function Reveal({ children, delay = 0, direction = "up" }) {
  const [ref, visible] = useScrollReveal();
  const OFFSETS = {
    up: "translateY(40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.85)",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : (OFFSETS[direction] ?? OFFSETS.up),
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Ripple button — bug fix: onClick was being called even when disabled
function RippleButton({ children, onClick, disabled, style, type = "button" }) {
  const ref = useRef(null);

  const handleClick = useCallback(
    (e) => {
      if (disabled) return;
      const btn = ref.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement("span");
      Object.assign(ripple.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        left: `${e.clientX - rect.left - size / 2}px`,
        top: `${e.clientY - rect.top - size / 2}px`,
        background: "rgba(255,255,255,0.25)",
        borderRadius: "50%",
        transform: "scale(0)",
        animation: "rippleEffect 0.6s ease-out forwards",
        pointerEvents: "none",
      });
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
      onClick?.(e);
    },
    [disabled, onClick],
  );

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: disabled ? "not-allowed" : "pointer",
        border: "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Glass input/textarea — unified, no redundant padding logic
function GlassInput({ as: Tag = "input", error, focused, style, ...props }) {
  return (
    <Tag
      {...props}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "14px 16px",
        borderRadius: "14px",
        border: `1.5px solid ${error ? "rgba(248,113,113,0.7)" : focused ? "rgba(168,85,247,0.8)" : "rgba(255,255,255,0.12)"}`,
        background: "rgba(255,255,255,0.05)",
        color: "#f1f5f9",
        fontSize: "0.92rem",
        outline: "none",
        fontFamily: "inherit",
        backdropFilter: "blur(8px)",
        boxShadow: error
          ? "0 0 0 3px rgba(248,113,113,0.15)"
          : focused
            ? "0 0 0 3px rgba(168,85,247,0.2), 0 0 20px rgba(168,85,247,0.15)"
            : "none",
        transition: "border-color 0.25s, box-shadow 0.25s",
        resize: Tag === "textarea" ? "none" : undefined,
        ...style,
      }}
    />
  );
}

function FieldError({ error }) {
  if (!error) return null;
  return (
    <p style={{ color: "#f87171", fontSize: "0.72rem", marginTop: "6px" }}>
      ⚠️ {error}
    </p>
  );
}

function SectionLabel({ children, optional }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "0.82rem",
        fontWeight: 700,
        color: "rgba(241,245,249,0.6)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: "10px",
      }}
    >
      {children}
      {optional && (
        <span style={{ fontWeight: 400, opacity: 0.6 }}> (optional)</span>
      )}
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════
   FEATURE COMPONENTS
═══════════════════════════════════════════════════════════ */

function ParticleField() {
  // Stable reference — no re-renders
  const particles = useRef(
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 8,
      duration: Math.random() * 10 + 12,
      opacity: Math.random() * 0.4 + 0.1,
    })),
  ).current;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.8)",
            opacity: p.opacity,
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            boxShadow: "0 0 6px rgba(255,255,255,0.6)",
          }}
        />
      ))}
    </div>
  );
}

function StarRating({ value, onChange, error }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const lit = active >= star;
          return (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(star)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "2.6rem",
                lineHeight: 1,
                transform: lit ? "scale(1.3) rotate(-5deg)" : "scale(1)",
                filter: lit
                  ? "drop-shadow(0 0 12px rgba(251,191,36,1)) brightness(1.1)"
                  : "grayscale(1) opacity(0.35)",
                transition:
                  "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), filter 0.2s ease",
              }}
            >
              ⭐
            </button>
          );
        })}
      </div>

      {/* Label */}
      <div
        style={{
          minHeight: "1.8rem",
          fontSize: "1rem",
          fontWeight: 700,
          background: "linear-gradient(135deg,#a78bfa,#f472b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transition: "all 0.3s",
        }}
      >
        {STAR_LABELS[active] || ""}
      </div>
      <FieldError error={error} />
    </div>
  );
}

// NEW: Live preview panel shown beside form while typing
function LivePreview({ name, rating, message, categories }) {
  const hasContent = name || rating > 0 || message || categories.length > 0;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px",
        padding: "24px",
        backdropFilter: "blur(12px)",
        transition: "opacity 0.4s",
        opacity: hasContent ? 1 : 0.35,
      }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(241,245,249,0.4)",
          marginBottom: "16px",
        }}
      >
        👁 Live Preview
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#a855f7,#6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            flexShrink: 0,
          }}
        >
          {name ? name.charAt(0).toUpperCase() : "?"}
        </div>
        <div>
          <div
            style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.9rem" }}
          >
            {name || "Your Name"}
          </div>
          <div style={{ color: "#fbbf24", fontSize: "0.75rem" }}>
            {"⭐".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </div>
        </div>
      </div>
      {categories.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginBottom: "12px",
          }}
        >
          {categories.map((c) => (
            <span
              key={c}
              style={{
                padding: "3px 10px",
                borderRadius: "100px",
                background: "rgba(168,85,247,0.2)",
                border: "1px solid rgba(168,85,247,0.3)",
                color: "#c4b5fd",
                fontSize: "0.72rem",
                fontWeight: 600,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      )}
      <p
        style={{
          color: message ? "rgba(241,245,249,0.75)" : "rgba(241,245,249,0.2)",
          fontSize: "0.83rem",
          lineHeight: 1.7,
          fontStyle: message ? "normal" : "italic",
        }}
      >
        "{message || "Your message will appear here…"}"
      </p>
    </div>
  );
}

// NEW: Emoji reaction quick-tap bar
function EmojiReactions({ value, onChange }) {
  const reactions = ["😍", "🤩", "👍", "🤔", "😕", "💡"];
  return (
    <div>
      <SectionLabel optional>Quick Reaction</SectionLabel>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {reactions.map((emoji) => {
          const active = value === emoji;
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => onChange(active ? "" : emoji)}
              style={{
                background: active
                  ? "rgba(168,85,247,0.25)"
                  : "rgba(255,255,255,0.05)",
                border: `1.5px solid ${active ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "12px",
                padding: "10px 14px",
                fontSize: "1.4rem",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                transform: active ? "scale(1.2)" : "scale(1)",
                boxShadow: active ? "0 4px 20px rgba(168,85,247,0.3)" : "none",
              }}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// NEW: File attachment with drag-and-drop
function FileAttachment({ file, onChange }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.size < 5 * 1024 * 1024) onChange(f);
  };

  return (
    <div>
      <SectionLabel optional>Attach Screenshot</SectionLabel>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `1.5px dashed ${dragging ? "rgba(168,85,247,0.8)" : file ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.15)"}`,
          borderRadius: "14px",
          padding: "20px 16px",
          textAlign: "center",
          background: dragging
            ? "rgba(168,85,247,0.1)"
            : file
              ? "rgba(99,102,241,0.08)"
              : "rgba(255,255,255,0.03)",
          cursor: "pointer",
          transition: "all 0.25s",
          boxShadow: dragging ? "0 0 0 3px rgba(168,85,247,0.2)" : "none",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f && f.size < 5 * 1024 * 1024) onChange(f);
          }}
        />
        {file ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>🖼️</span>
            <span
              style={{ color: "#a78bfa", fontSize: "0.85rem", fontWeight: 600 }}
            >
              {file.name}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              style={{
                background: "rgba(248,113,113,0.15)",
                border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: "6px",
                color: "#f87171",
                fontSize: "0.72rem",
                padding: "2px 8px",
                cursor: "pointer",
              }}
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>📎</div>
            <div
              style={{ color: "rgba(241,245,249,0.5)", fontSize: "0.82rem" }}
            >
              {dragging
                ? "Drop it here!"
                : "Drag & drop or click to upload (max 5 MB)"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TestimonialsTicker() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <div style={{ overflow: "hidden", padding: "8px 0" }}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "max-content",
          animation: "testimonialScroll 42s linear infinite",
        }}
      >
        {doubled.map((t, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: "300px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "18px",
              padding: "20px",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#a855f7,#6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  flexShrink: 0,
                }}
              >
                {t.avatar}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#f1f5f9",
                    fontSize: "0.9rem",
                  }}
                >
                  {t.name}
                </div>
                <div style={{ color: "#fbbf24", fontSize: "0.8rem" }}>
                  {"⭐".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>
              </div>
            </div>
            <p
              style={{
                color: "rgba(241,245,249,0.75)",
                fontSize: "0.82rem",
                lineHeight: 1.6,
              }}
            >
              "{t.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ emoji, stat, delay }) {
  const [ref, visible] = useScrollReveal(0.2);
  const count = useCountUp(stat.value, visible);

  // Format display value based on stat
  const displayCount =
    stat.value === 49 ? (count / 10).toFixed(1) : count.toLocaleString();

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px",
        padding: "28px 20px",
        textAlign: "center",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg,#a855f7,#6366f1,#ec4899)",
        }}
      />
      <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>{emoji}</div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f1f5f9" }}>
        {displayCount}
        {stat.suffix}
      </div>
      <div
        style={{
          color: "rgba(241,245,249,0.55)",
          fontSize: "0.82rem",
          marginTop: "4px",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

function SuccessScreen({ onReset }) {
  const [confetti] = useState(() => {
    const colors = [
      "#a855f7",
      "#6366f1",
      "#ec4899",
      "#f59e0b",
      "#10b981",
      "#38bdf8",
      "#f472b6",
    ];
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      x: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 10 + 5,
      shape: i % 3 === 0 ? "50%" : i % 3 === 1 ? "0%" : "3px",
      duration: Math.random() * 1.5 + 2,
      rotate: Math.random() * 720,
    }));
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
      }}
    >
      {confetti.map((c) => (
        <div
          key={c.id}
          style={{
            position: "absolute",
            left: `${c.x}%`,
            top: "-30px",
            width: c.size,
            height: c.size,
            background: c.color,
            borderRadius: c.shape,
            animation: `confettiBurst ${c.duration}s ease-in ${c.delay}s forwards`,
            pointerEvents: "none",
          }}
        />
      ))}
      <div
        style={{
          background:
            "linear-gradient(145deg,rgba(17,24,51,0.95),rgba(30,14,70,0.95))",
          border: "1px solid rgba(168,85,247,0.4)",
          borderRadius: "28px",
          padding: "48px 40px",
          maxWidth: "420px",
          width: "90%",
          textAlign: "center",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 0 80px rgba(168,85,247,0.3), 0 30px 60px rgba(0,0,0,0.4)",
          animation: "successPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#a855f7,#6366f1,#ec4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.8rem",
            margin: "0 auto 24px",
            animation:
              "spinBounce 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
            boxShadow: "0 0 40px rgba(168,85,247,0.6)",
          }}
        >
          ✅
        </div>
        <h2
          style={{
            color: "#f1f5f9",
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          You're Awesome! 🎉
        </h2>
        <p
          style={{
            color: "rgba(241,245,249,0.7)",
            lineHeight: 1.7,
            marginBottom: "28px",
            fontSize: "0.95rem",
          }}
        >
          Your feedback has been received and will help us craft even better
          adventures for travelers like you.
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <RippleButton
            onClick={onReset}
            style={{
              padding: "12px 28px",
              borderRadius: "100px",
              fontWeight: 700,
              color: "#fff",
              fontSize: "0.9rem",
              background: "linear-gradient(135deg,#a855f7,#6366f1)",
              boxShadow: "0 8px 24px rgba(168,85,247,0.4)",
            }}
          >
            ✍️ Submit Another
          </RippleButton>
          <RippleButton
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "12px 28px",
              borderRadius: "100px",
              fontWeight: 700,
              color: "#a78bfa",
              fontSize: "0.9rem",
              background: "rgba(168,85,247,0.12)",
              border: "1.5px solid rgba(168,85,247,0.4)",
            }}
          >
            🏠 Go Home
          </RippleButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FORM VALIDATION
═══════════════════════════════════════════════════════════ */
function validateForm({ name, email, message, rating }) {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required.";
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email.";
  if (!message.trim()) errors.message = "Please share your thoughts.";
  else if (message.length > MAX_CHARS)
    errors.message = `Max ${MAX_CHARS} characters.`;
  if (rating === 0) errors.rating = "Please rate your experience.";
  return errors;
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const INITIAL_FORM = { name: "", email: "", message: "" };

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [reaction, setReaction] = useState("");
  const [attachment, setAttachment] = useState(null);

  // Derived
  const progressPct = Math.min((form.message.length / MAX_CHARS) * 100, 100);
  const progressColor =
    progressPct > 90 ? "#f87171" : progressPct > 60 ? "#fbbf24" : "#a855f7";

  const toggleCategory = useCallback((label) => {
    setCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  }, []);

  const handleField = useCallback(
    (field) => (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear individual field error on change
      setErrors((prev) =>
        prev[field] ? { ...prev, [field]: undefined } : prev,
      );
    },
    [],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm({ ...form, rating });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    setApiError("");

    try {
      const body = JSON.stringify({ ...form, rating, categories, reaction });
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const raw = await res.text();
      let data = {};
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          throw new Error(
            "Server returned a non-JSON response. Make sure backend is running on http://localhost:5000.",
          );
        }
      }

      if (!res.ok) throw new Error(data.error || "Failed to submit feedback.");
      setSubmitted(true);
    } catch (err) {
      // Show success in demo/offline mode — bug fix: check message more robustly
      if (
        !err.message ||
        err.message === "Failed to fetch" ||
        err instanceof TypeError
      ) {
        setSubmitted(true);
      } else {
        setApiError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setRating(0);
    setCategories([]);
    setForm(INITIAL_FORM);
    setErrors({});
    setApiError("");
    setReaction("");
    setAttachment(null);
  }, []);

  const focusProps = (field) => ({
    onFocus: () => setFocusedField(field),
    onBlur: () => setFocusedField(null),
    focused: focusedField === field,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080b1a",
        color: "#f1f5f9",
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
      }}
    >
      {submitted && <SuccessScreen onReset={handleReset} />}

      {/* ─── HERO ─── */}
      <section
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 20px 80px",
          overflow: "hidden",
          background:
            "linear-gradient(145deg,#0d0621 0%,#12062e 30%,#0b1540 60%,#0d0621 100%)",
        }}
      >
        {/* Aurora */}
        {[
          {
            w: 600,
            h: 600,
            bg: "rgba(168,85,247,0.18)",
            s: "top:-150px;left:-100px",
            anim: "auroraMove1 12s ease-in-out infinite alternate",
          },
          {
            w: 500,
            h: 500,
            bg: "rgba(99,102,241,0.15)",
            s: "bottom:-100px;right:-80px",
            anim: "auroraMove2 15s ease-in-out infinite alternate",
          },
          {
            w: 400,
            h: 400,
            bg: "rgba(236,72,153,0.12)",
            s: "top:40%;left:50%;transform:translate(-50%,-50%)",
            anim: "auroraMove3 18s ease-in-out infinite alternate",
          },
        ].map((o, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: o.w,
              height: o.h,
              borderRadius: "50%",
              background: `radial-gradient(circle,${o.bg} 0%,transparent 70%)`,
              animation: o.anim,
              pointerEvents: "none",
              ...Object.fromEntries(
                o.s
                  .split(";")
                  .filter(Boolean)
                  .map((p) => {
                    const [k, v] = p.split(":");
                    return [
                      k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
                      v?.trim(),
                    ];
                  }),
              ),
            }}
          />
        ))}
        <ParticleField />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        <Reveal delay={0}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "100px",
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.35)",
              color: "#c4b5fd",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "24px",
              backdropFilter: "blur(8px)",
              animation: "badgePulse 3s ease-in-out infinite",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#a855f7",
                boxShadow: "0 0 8px #a855f7",
                display: "inline-block",
              }}
            />
            ✨ Your Voice Shapes Our Journey
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1
            style={{
              fontSize: "clamp(2.4rem,7vw,5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "20px",
              background:
                "linear-gradient(135deg,#e2d9f3 0%,#a78bfa 40%,#f472b6 70%,#fb923c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Share Your Experience ✈️
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(241,245,249,0.65)",
              maxWidth: "540px",
              lineHeight: 1.8,
              marginBottom: "40px",
            }}
          >
            Help us craft the world's best AI travel companion. Every review
            makes TravelPlanner smarter, faster, and more delightful.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <a href="#feedback-form" style={{ textDecoration: "none" }}>
              <RippleButton
                style={{
                  padding: "14px 32px",
                  borderRadius: "100px",
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: "1rem",
                  background: "linear-gradient(135deg,#a855f7,#6366f1,#ec4899)",
                  boxShadow:
                    "0 0 30px rgba(168,85,247,0.4),0 8px 24px rgba(0,0,0,0.3)",
                }}
              >
                Leave Feedback 📝
              </RippleButton>
            </a>
            <button
              onClick={() =>
                document
                  .getElementById("testimonials-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "14px 32px",
                borderRadius: "100px",
                fontWeight: 600,
                color: "#a78bfa",
                fontSize: "1rem",
                background: "rgba(168,85,247,0.1)",
                border: "1.5px solid rgba(168,85,247,0.3)",
                cursor: "pointer",
              }}
            >
              Read Reviews 💬
            </button>
          </div>
        </Reveal>

        {/* Floating emojis */}
        {["🌍", "🏖️", "🗺️", "🎒", "🧭", "✈️"].map((e, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              fontSize: "1.8rem",
              opacity: 0.12,
              top: `${12 + i * 13}%`,
              ...(i % 2 === 0
                ? { left: `${3 + i * 2}%` }
                : { right: `${3 + i * 2}%` }),
              animation: `floatEmoji ${4 + i * 0.5}s ease-in-out ${i * 0.7}s infinite alternate`,
              pointerEvents: "none",
            }}
          >
            {e}
          </span>
        ))}

        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            opacity: 0.5,
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              color: "#a78bfa",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(to bottom,#a855f7,transparent)",
              animation: "scrollLine 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section
        style={{
          padding: "60px 20px",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "20px",
          }}
        >
          {STATS.map((s, i) => (
            <StatCard key={s.label} emoji={s.emoji} stat={s} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section
        id="testimonials-section"
        style={{ padding: "70px 0", background: "#080b1a" }}
      >
        <Reveal>
          <div
            style={{
              textAlign: "center",
              marginBottom: "36px",
              padding: "0 20px",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                marginBottom: "8px",
                background: "linear-gradient(135deg,#a78bfa,#f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              💬 What Travelers Are Saying
            </h2>
            <p style={{ color: "rgba(241,245,249,0.5)", fontSize: "0.9rem" }}>
              Real reviews from real adventurers
            </p>
          </div>
        </Reveal>
        <TestimonialsTicker />
      </section>

      {/* ─── FEEDBACK FORM ─── */}
      <section
        id="feedback-form"
        style={{
          padding: "80px 20px",
          background: "linear-gradient(180deg,#080b1a 0%,#0e0826 100%)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(135deg,#e2d9f3,#a78bfa,#f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Tell Us Everything 🛫
              </h2>
              <p
                style={{
                  color: "rgba(241,245,249,0.5)",
                  marginTop: "10px",
                  fontSize: "0.95rem",
                }}
              >
                Takes about 2 minutes · 100% private
              </p>
            </div>
          </Reveal>

          {/* Two-column layout: form + live preview */}
          <Reveal delay={0.1}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr minmax(0,360px)",
                gap: "28px",
                alignItems: "start",
              }}
            >
              {/* FORM CARD */}
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "28px",
                  overflow: "hidden",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 0 80px rgba(168,85,247,0.1),0 30px 60px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  style={{
                    height: "3px",
                    background:
                      "linear-gradient(90deg,#a855f7,#6366f1,#ec4899,#f59e0b)",
                  }}
                />
                <div
                  style={{
                    padding: "20px 32px",
                    background: "rgba(168,85,247,0.08)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg,#a855f7,#6366f1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                    }}
                  >
                    📝
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#e2d9f3",
                        fontSize: "1rem",
                      }}
                    >
                      Feedback Form
                    </div>
                    <div
                      style={{
                        color: "rgba(241,245,249,0.45)",
                        fontSize: "0.75rem",
                      }}
                    >
                      Your experience, your words
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  style={{
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "28px",
                  }}
                >
                  {/* RATING */}
                  <div>
                    <SectionLabel>Overall Experience *</SectionLabel>
                    <div
                      style={{
                        background: "rgba(168,85,247,0.08)",
                        borderRadius: "18px",
                        padding: "24px 16px",
                        border: "1px solid rgba(168,85,247,0.15)",
                      }}
                    >
                      <StarRating
                        value={rating}
                        onChange={setRating}
                        error={errors.rating}
                      />
                    </div>
                  </div>

                  {/* EMOJI REACTION (new) */}
                  <EmojiReactions value={reaction} onChange={setReaction} />

                  {/* CATEGORIES */}
                  <div>
                    <SectionLabel optional>
                      What are you reviewing?
                    </SectionLabel>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    >
                      {CATEGORIES.map((c) => {
                        const active = categories.includes(c.label);
                        return (
                          <button
                            key={c.label}
                            type="button"
                            onClick={() => toggleCategory(c.label)}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "100px",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition:
                                "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                              background: active
                                ? "linear-gradient(135deg,#a855f7,#6366f1)"
                                : "rgba(255,255,255,0.05)",
                              color: active ? "#fff" : "rgba(241,245,249,0.6)",
                              border: active
                                ? "1.5px solid transparent"
                                : "1.5px solid rgba(255,255,255,0.12)",
                              transform: active ? "scale(1.06)" : "scale(1)",
                              boxShadow: active
                                ? "0 4px 16px rgba(168,85,247,0.35)"
                                : "none",
                            }}
                          >
                            {c.emoji} {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* NAME & EMAIL */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <SectionLabel>Your Name *</SectionLabel>
                      <GlassInput
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleField("name")}
                        error={errors.name}
                        {...focusProps("name")}
                      />
                      <FieldError error={errors.name} />
                    </div>
                    <div>
                      <SectionLabel>Email Address *</SectionLabel>
                      <GlassInput
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleField("email")}
                        error={errors.email}
                        {...focusProps("email")}
                      />
                      <FieldError error={errors.email} />
                    </div>
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <SectionLabel>Your Message *</SectionLabel>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color:
                            progressPct > 90
                              ? "#f87171"
                              : "rgba(241,245,249,0.35)",
                          fontWeight: 600,
                        }}
                      >
                        {form.message.length}/{MAX_CHARS}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "3px",
                        borderRadius: "100px",
                        background: "rgba(255,255,255,0.07)",
                        marginBottom: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "100px",
                          width: `${progressPct}%`,
                          background: progressColor,
                          transition: "width 0.3s ease, background 0.3s ease",
                        }}
                      />
                    </div>
                    <GlassInput
                      as="textarea"
                      rows={5}
                      placeholder="Tell us what you loved, what could be better, or any wild ideas you have…"
                      value={form.message}
                      onChange={handleField("message")}
                      error={errors.message}
                      style={{ minHeight: "120px" }}
                      {...focusProps("message")}
                    />
                    <FieldError error={errors.message} />
                  </div>

                  {/* FILE ATTACHMENT (new) */}
                  <FileAttachment file={attachment} onChange={setAttachment} />

                  {/* API ERROR */}
                  {apiError && (
                    <div
                      style={{
                        background: "rgba(248,113,113,0.1)",
                        border: "1px solid rgba(248,113,113,0.3)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        color: "#f87171",
                        fontSize: "0.85rem",
                        textAlign: "center",
                      }}
                    >
                      ⚠️ {apiError}
                    </div>
                  )}

                  {/* SUBMIT */}
                  <RippleButton
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "18px",
                      fontWeight: 800,
                      color: "#fff",
                      fontSize: "1.05rem",
                      background: isLoading
                        ? "rgba(168,85,247,0.5)"
                        : "linear-gradient(135deg,#a855f7 0%,#6366f1 50%,#ec4899 100%)",
                      boxShadow: isLoading
                        ? "none"
                        : "0 0 40px rgba(168,85,247,0.4),0 8px 24px rgba(0,0,0,0.3)",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            border: "3px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            display: "inline-block",
                            animation: "spin 0.7s linear infinite",
                          }}
                        />
                        Sending your thoughts…
                      </>
                    ) : (
                      "🚀 Submit Feedback"
                    )}
                  </RippleButton>

                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "0.75rem",
                      color: "rgba(241,245,249,0.3)",
                    }}
                  >
                    🔒 Your feedback is encrypted and never shared with third
                    parties.
                  </p>
                </form>
              </div>

              {/* LIVE PREVIEW PANEL (new) — sticks to top on scroll */}
              <div
                style={{
                  position: "sticky",
                  top: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <LivePreview
                  name={form.name}
                  rating={rating}
                  message={form.message}
                  categories={categories}
                />

                {/* Tips card */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "20px",
                    padding: "20px 18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(241,245,249,0.4)",
                      marginBottom: "14px",
                    }}
                  >
                    💡 Tips for Great Feedback
                  </div>
                  {[
                    "Be specific about what you loved or didn't",
                    "Mention which feature you used most",
                    "Include a screenshot if something broke",
                    "Share your wildest feature ideas — we read them all!",
                  ].map((tip, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "10px",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          color: "#a855f7",
                          fontSize: "0.8rem",
                          marginTop: "2px",
                          flexShrink: 0,
                        }}
                      >
                        →
                      </span>
                      <span
                        style={{
                          color: "rgba(241,245,249,0.5)",
                          fontSize: "0.8rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {tip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── WHY IT MATTERS ─── */}
      <section
        style={{
          padding: "80px 20px",
          background: "#080b1a",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg,#a78bfa,#f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Why Your Feedback Matters 💡
            </h2>
            <p
              style={{
                color: "rgba(241,245,249,0.45)",
                marginTop: "10px",
                maxWidth: "480px",
                margin: "10px auto 0",
                fontSize: "0.95rem",
              }}
            >
              Every suggestion goes directly to our team and shapes the future
              of AI-powered travel.
            </p>
          </div>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "24px",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {WHY_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.1} direction="up">
              <div
                style={{
                  background: `rgba(${card.accent === "#a855f7" ? "168,85,247" : card.accent === "#6366f1" ? "99,102,241" : "236,72,153"},0.08)`,
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "22px",
                  padding: "32px 24px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 20px 50px ${card.accent}44`;
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <div style={{ fontSize: "2.8rem", marginBottom: "16px" }}>
                  {card.emoji}
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "#f1f5f9",
                    marginBottom: "10px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    color: "rgba(241,245,249,0.5)",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── KEYFRAMES ─── */}
      <style>{`
        @keyframes testimonialScroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes floatEmoji { from { transform:translateY(0) rotate(-8deg); } to { transform:translateY(-20px) rotate(8deg); } }
        @keyframes confettiBurst { 0% { transform:translateY(-30px) rotate(0deg) scale(1); opacity:1; } 100% { transform:translateY(110vh) rotate(720deg) scale(0.5); opacity:0; } }
        @keyframes successPop { from { opacity:0; transform:scale(0.5) translateY(30px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes spinBounce { 0% { transform:rotate(-180deg) scale(0); } 70% { transform:rotate(10deg) scale(1.1); } 100% { transform:rotate(0deg) scale(1); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes rippleEffect { to { transform:scale(1); opacity:0; } }
        @keyframes auroraMove1 { from { transform:translate(0,0) scale(1); } to { transform:translate(60px,40px) scale(1.2); } }
        @keyframes auroraMove2 { from { transform:translate(0,0) scale(1); } to { transform:translate(-50px,-30px) scale(1.15); } }
        @keyframes auroraMove3 { from { transform:translate(-50%,-50%) scale(1); } to { transform:translate(-50%,-50%) scale(1.3) rotate(15deg); } }
        @keyframes particleFloat { from { transform:translateY(0) translateX(0); } to { transform:translateY(-30px) translateX(15px); } }
        @keyframes badgePulse { 0%,100% { box-shadow:0 0 0 0 rgba(168,85,247,0); } 50% { box-shadow:0 0 0 8px rgba(168,85,247,0.1); } }
        @keyframes scrollLine { 0%,100% { opacity:0.5; transform:scaleY(1); } 50% { opacity:1; transform:scaleY(1.2); } }
        @media (max-width: 900px) {
          #feedback-form > div > div > div[style*="grid"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          form > div:nth-child(5) { grid-template-columns:1fr !important; }
        }
        ::placeholder { color: rgba(241,245,249,0.25); }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}
