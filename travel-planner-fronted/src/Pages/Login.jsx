import { useState, useEffect, useRef } from "react";

const Login = () => {
  const [lightOn, setLightOn] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const eyeLeft = useRef(null);
  const eyeRight = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const moveEyes = (e) => {
      [eyeLeft.current, eyeRight.current].forEach((eye) => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(y, x);
        const dist = Math.min(Math.hypot(x, y), 40);
        const px = Math.cos(angle) * (dist / 40) * 4;
        const py = Math.sin(angle) * (dist / 40) * 4;
        eye.style.transform = `translate(${px}px, ${py}px)`;
      });
    };
    window.addEventListener("mousemove", moveEyes);
    return () => window.removeEventListener("mousemove", moveEyes);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setError("Invalid credentials. Please try again.");
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.6; }
          94% { opacity: 1; }
          96% { opacity: 0.7; }
          97% { opacity: 1; }
        }

        @keyframes coneFlicker {
          0%, 100% { opacity: 0.92; }
          93% { opacity: 0.5; }
          94% { opacity: 0.85; }
          96% { opacity: 0.6; }
          97% { opacity: 0.92; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 200, 80, 0); }
          50% { box-shadow: 0 0 18px 4px rgba(255, 200, 80, 0.18); }
        }

        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }

        .login-card {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .auth-input {
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus {
          outline: none;
          border-color: #f5c842 !important;
          background: rgba(245, 200, 66, 0.06) !important;
          box-shadow: 0 0 0 3px rgba(245, 200, 66, 0.12) !important;
        }
        .auth-input::placeholder { color: #555; }

        .role-btn {
          transition: all 0.18s ease;
          cursor: pointer;
          border: none;
        }
        .role-btn:hover { filter: brightness(1.15); }

        .submit-btn {
          transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
          cursor: pointer;
          border: none;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(245, 200, 66, 0.35);
          filter: brightness(1.08);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .error-msg {
          animation: shake 0.4s ease both;
        }

        .lamp-light-on {
          animation: flicker 5s infinite, pulseGlow 3s infinite;
        }

        .lamp-cone-on {
          animation: coneFlicker 5s infinite;
        }
      `}</style>

      {/* Animated grid bg */}
      <div style={styles.gridBg} />

      {/* Vignette */}
      <div style={styles.vignette} />

      <div className="login-card" ref={cardRef} style={styles.card}>
        {/* Header label */}
        <div style={styles.topLabel}>
          <span style={styles.labelDot} />
          <span style={styles.labelText}>SECURE ACCESS</span>
        </div>

        {/* Lamp */}
        <div style={styles.lampWrap}>
          {/* Light cone */}
          {lightOn && <div className="lamp-cone-on" style={styles.lightCone} />}

          {/* Wire */}
          <div style={styles.wire} />

          {/* Head */}
          <div
            className={lightOn ? "lamp-light-on" : ""}
            style={{
              ...styles.lampHead,
              background: lightOn
                ? "linear-gradient(135deg, #f5c842, #e8a020)"
                : "linear-gradient(135deg, #2a2a2a, #1a1a1a)",
              boxShadow: lightOn
                ? "0 4px 24px rgba(245, 200, 66, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)"
                : "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Reflector shine */}
            <div style={styles.reflector} />

            {/* Eyes */}
            <div style={styles.eyeRow}>
              <div style={styles.eyeSocket}>
                <span
                  ref={eyeLeft}
                  style={{
                    ...styles.pupil,
                    background: lightOn ? "#1a0a00" : "#e0e0e0",
                  }}
                />
              </div>
              <div style={styles.eyeSocket}>
                <span
                  ref={eyeRight}
                  style={{
                    ...styles.pupil,
                    background: lightOn ? "#1a0a00" : "#e0e0e0",
                  }}
                />
              </div>
            </div>

            {/* Mouth */}
            <div
              style={{
                ...styles.mouth,
                borderColor: lightOn
                  ? "rgba(30,10,0,0.4)"
                  : "rgba(255,255,255,0.12)",
              }}
            />
          </div>

          {/* Stand */}
          <div style={styles.stand} />
          <div style={styles.base} />
        </div>

        {/* Title */}
        <div style={styles.titleBlock}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to continue your session</p>
        </div>

        {/* Role Tabs */}
        <div style={styles.roleWrap}>
          <button
            className="role-btn"
            style={{
              ...styles.roleBtn,
              background: selectedRole === "user" ? "#f5c842" : "transparent",
              color: selectedRole === "user" ? "#0d0d0d" : "#666",
              borderRight: "1px solid #222",
            }}
            onClick={() => setSelectedRole("user")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{ marginRight: 6 }}
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Z" />
            </svg>
            User
          </button>
          <button
            className="role-btn"
            style={{
              ...styles.roleBtn,
              background: selectedRole === "admin" ? "#ff4d4d" : "transparent",
              color: selectedRole === "admin" ? "#fff" : "#666",
            }}
            onClick={() => setSelectedRole("admin")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{ marginRight: 6 }}
            >
              <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.856C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524z" />
              <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
            </svg>
            Admin
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="error-msg" style={styles.error}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="#ff6b6b"
              style={{ flexShrink: 0 }}
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldWrap}>
            <label style={styles.label}>EMAIL</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => {
                setLightOn(true);
                setFocused("email");
              }}
              onBlur={() => {
                setLightOn(false);
                setFocused(null);
              }}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>PASSWORD</label>
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => {
                setLightOn(true);
                setFocused("password");
              }}
              onBlur={() => {
                setLightOn(false);
                setFocused(null);
              }}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              background:
                selectedRole === "admin"
                  ? "linear-gradient(135deg, #ff4d4d, #cc2020)"
                  : "linear-gradient(135deg, #f5c842, #e8920a)",
              color: selectedRole === "admin" ? "#fff" : "#0d0d0d",
            }}
          >
            {loading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 12 12"
                      to="360 12 12"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
                Authenticating…
              </span>
            ) : (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                Sign in as {selectedRole === "admin" ? "Admin" : "User"}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                  />
                </svg>
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footer}>
          Don't have an account?{" "}
          <span style={styles.footerLink}>Create one</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Syne', sans-serif",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  gridBg: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    animation: "gridMove 8s linear infinite",
    pointerEvents: "none",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
    pointerEvents: "none",
  },
  card: {
    background: "linear-gradient(160deg, #111 0%, #0d0d0d 100%)",
    border: "1px solid #1e1e1e",
    borderRadius: 20,
    padding: "36px 32px 28px",
    width: "100%",
    maxWidth: 400,
    position: "relative",
    boxShadow:
      "0 32px 64px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.04) inset",
  },
  topLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginBottom: 24,
    position: "absolute",
    top: 20,
    left: 24,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#f5c842",
    boxShadow: "0 0 6px #f5c842",
  },
  labelText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.2em",
    color: "#444",
    fontWeight: 400,
  },

  // Lamp
  lampWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    position: "relative",
  },
  lightCone: {
    position: "absolute",
    top: 70,
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "90px solid transparent",
    borderRight: "90px solid transparent",
    borderTop: "120px solid rgba(245, 200, 66, 0.08)",
    filter: "blur(8px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  wire: {
    width: 2,
    height: 28,
    background: "linear-gradient(to bottom, #333, #222)",
    borderRadius: 1,
  },
  lampHead: {
    width: 88,
    height: 56,
    borderRadius: "50px 50px 16px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    transition: "background 0.3s, box-shadow 0.3s",
    zIndex: 1,
    overflow: "hidden",
  },
  reflector: {
    position: "absolute",
    top: 4,
    left: "50%",
    transform: "translateX(-50%)",
    width: 60,
    height: 14,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    pointerEvents: "none",
  },
  eyeRow: {
    display: "flex",
    gap: 16,
    marginTop: 4,
  },
  eyeSocket: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pupil: {
    display: "block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "background 0.3s",
  },
  mouth: {
    width: 20,
    height: 8,
    borderBottom: "2px solid",
    borderRadius: "0 0 10px 10px",
    marginTop: 4,
    transition: "border-color 0.3s",
  },
  stand: {
    width: 3,
    height: 12,
    background: "#222",
    borderRadius: 2,
  },
  base: {
    width: 40,
    height: 7,
    background: "linear-gradient(to right, #1a1a1a, #2a2a2a, #1a1a1a)",
    borderRadius: 4,
    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },

  // Content
  titleBlock: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: "#f0f0f0",
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
  },
  subtitle: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11,
    color: "#444",
    marginTop: 6,
    letterSpacing: "0.05em",
  },

  // Role tabs
  roleWrap: {
    display: "flex",
    borderRadius: 10,
    border: "1px solid #222",
    overflow: "hidden",
    marginBottom: 20,
  },
  roleBtn: {
    flex: 1,
    padding: "10px 12px",
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.02em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.18s ease",
  },

  // Form
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  label: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.18em",
    color: "#444",
    fontWeight: 400,
    paddingLeft: 2,
  },
  input: {
    background: "#0f0f0f",
    border: "1px solid #222",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#e8e8e8",
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    width: "100%",
  },
  submitBtn: {
    padding: "14px",
    borderRadius: 10,
    fontFamily: "'Syne', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.02em",
    marginTop: 4,
  },

  // Error
  error: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255, 77, 77, 0.08)",
    border: "1px solid rgba(255, 77, 77, 0.2)",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#ff6b6b",
    fontFamily: "'DM Mono', monospace",
    fontSize: 11,
    marginBottom: 14,
  },

  // Footer
  footer: {
    textAlign: "center",
    marginTop: 20,
    fontFamily: "'DM Mono', monospace",
    fontSize: 11,
    color: "#333",
    letterSpacing: "0.03em",
  },
  footerLink: {
    color: "#f5c842",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
};

export default Login;
