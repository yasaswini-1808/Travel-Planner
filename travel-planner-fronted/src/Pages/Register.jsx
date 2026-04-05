import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../api/config";

const Register = () => {
  const navigate = useNavigate();
  const [lightOn, setLightOn] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const eyeLeft = useRef(null);
  const eyeRight = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/planner");

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
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (selectedRole === "admin") {
      setError(
        "Admin accounts cannot be created from sign up. Please contact an existing admin.",
      );
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/planner");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes flicker {
          0%,100%{opacity:1}92%{opacity:1}93%{opacity:.6}94%{opacity:1}96%{opacity:.7}97%{opacity:1}
        }
        @keyframes coneFlicker {
          0%,100%{opacity:.92}93%{opacity:.5}94%{opacity:.85}96%{opacity:.6}97%{opacity:.92}
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(24px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes shake {
          0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}
        }
        @keyframes pulseGlow {
          0%,100%{box-shadow:0 0 0 0 rgba(255,200,80,0)}
          50%{box-shadow:0 0 18px 4px rgba(255,200,80,.18)}
        }
        @keyframes gridMove {
          from{background-position:0 0}to{background-position:40px 40px}
        }
        @keyframes successPop {
          0%{transform:scale(0.8);opacity:0}
          70%{transform:scale(1.05)}
          100%{transform:scale(1);opacity:1}
        }

        .reg-card { animation: slideUp .6s cubic-bezier(.16,1,.3,1) both; }

        .auth-input {
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .auth-input:focus {
          outline: none;
          border-color: #f5c842 !important;
          background: rgba(245,200,66,.06) !important;
          box-shadow: 0 0 0 3px rgba(245,200,66,.12) !important;
        }
        .auth-input::placeholder { color: #444; }

        .role-btn { transition: all .18s ease; cursor: pointer; border: none; }
        .role-btn:hover { filter: brightness(1.15); }

        .submit-btn {
          transition: transform .15s, box-shadow .15s, filter .15s;
          cursor: pointer; border: none;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(245,200,66,.35);
          filter: brightness(1.08);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: .7; cursor: not-allowed; }

        .error-msg { animation: shake .4s ease both; }
        .lamp-light-on { animation: flicker 5s infinite, pulseGlow 3s infinite; }
        .lamp-cone-on { animation: coneFlicker 5s infinite; }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 480px) {
          .field-row { grid-template-columns: 1fr; }
        }

        .step-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #222; transition: background .2s;
        }
        .step-dot.active { background: #f5c842; box-shadow: 0 0 6px #f5c842; }
      `}</style>

      <div style={styles.gridBg} />
      <div style={styles.vignette} />

      <div className="reg-card" style={styles.card}>
        {/* Corner label */}
        <div style={styles.topLabel}>
          <span style={styles.labelDot} />
          <span style={styles.labelText}>NEW ACCOUNT</span>
        </div>

        {/* Lamp */}
        <div style={styles.lampWrap}>
          {lightOn && <div className="lamp-cone-on" style={styles.lightCone} />}
          <div style={styles.wire} />
          <div
            className={lightOn ? "lamp-light-on" : ""}
            style={{
              ...styles.lampHead,
              background: lightOn
                ? "linear-gradient(135deg,#f5c842,#e8a020)"
                : "linear-gradient(135deg,#2a2a2a,#1a1a1a)",
              boxShadow: lightOn
                ? "0 4px 24px rgba(245,200,66,.5),inset 0 1px 0 rgba(255,255,255,.15)"
                : "inset 0 1px 0 rgba(255,255,255,.05)",
            }}
          >
            <div style={styles.reflector} />
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
            <div
              style={{
                ...styles.mouth,
                borderColor: lightOn
                  ? "rgba(30,10,0,.4)"
                  : "rgba(255,255,255,.12)",
              }}
            />
          </div>
          <div style={styles.stand} />
          <div style={styles.base} />
        </div>

        {/* Title */}
        <div style={styles.titleBlock}>
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.subtitle}>Join us and start planning your trips</p>
        </div>

        {/* Role Tabs */}
        <div style={styles.roleWrap}>
          <button
            className="role-btn"
            style={{
              ...styles.roleBtn,
              background: selectedRole === "user" ? "#f5c842" : "transparent",
              color: selectedRole === "user" ? "#0d0d0d" : "#555",
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
              color: selectedRole === "admin" ? "#fff" : "#555",
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

        {/* Admin warning banner */}
        {selectedRole === "admin" && (
          <div style={styles.adminNotice}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="#f5c842"
              style={{ flexShrink: 0, marginTop: 1 }}
            >
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
            </svg>
            Admin accounts cannot be created from sign up. Please contact an
            existing admin.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-msg" style={styles.error}>
            <svg
              width="13"
              height="13"
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
          {/* Row 1: Full name + username */}
          <div className="field-row">
            <div style={styles.fieldWrap}>
              <label style={styles.label}>FULL NAME</label>
              <input
                type="text"
                name="fullName"
                className="auth-input"
                placeholder="Optional"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setLightOn(true)}
                onBlur={() => setLightOn(false)}
                style={styles.input}
              />
            </div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>
                USERNAME <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="username"
                className="auth-input"
                placeholder="handle"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setLightOn(true)}
                onBlur={() => setLightOn(false)}
                required
                style={styles.input}
              />
            </div>
          </div>

          {/* Email */}
          <div style={styles.fieldWrap}>
            <label style={styles.label}>
              EMAIL <span style={styles.required}>*</span>
            </label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setLightOn(true)}
              onBlur={() => setLightOn(false)}
              required
              style={styles.input}
            />
          </div>

          {/* Password */}
          <div style={styles.fieldWrap}>
            <label style={styles.label}>
              PASSWORD <span style={styles.required}>*</span>
            </label>
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setLightOn(true)}
              onBlur={() => setLightOn(false)}
              required
              style={styles.input}
            />
            {/* Strength bar */}
            {formData.password.length > 0 && (
              <div style={styles.strengthWrap}>
                {[2, 4, 6, 8, 10].map((threshold, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.strengthSegment,
                      background:
                        formData.password.length >= threshold
                          ? i < 2
                            ? "#ff4d4d"
                            : i < 4
                              ? "#f5c842"
                              : "#4dff91"
                          : "#1e1e1e",
                    }}
                  />
                ))}
                <span style={styles.strengthLabel}>
                  {formData.password.length < 4
                    ? "Weak"
                    : formData.password.length < 8
                      ? "Fair"
                      : "Strong"}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              background:
                selectedRole === "admin"
                  ? "linear-gradient(135deg,#ff4d4d,#cc2020)"
                  : "linear-gradient(135deg,#f5c842,#e8920a)",
              color: selectedRole === "admin" ? "#fff" : "#0d0d0d",
              marginTop: 4,
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
                      dur=".8s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
                Creating account…
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
                Sign up
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m3 5c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4" />
                  <path d="M13.5 5a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2a.5.5 0 0 1 .5-.5" />
                </svg>
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footer}>
          Already have an account?{" "}
          <span style={styles.footerLink} onClick={() => navigate("/login")}>
            Sign in
          </span>
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
      linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)
    `,
    backgroundSize: "40px 40px",
    animation: "gridMove 8s linear infinite",
    pointerEvents: "none",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,.85) 100%)",
    pointerEvents: "none",
  },
  card: {
    background: "linear-gradient(160deg,#111 0%,#0d0d0d 100%)",
    border: "1px solid #1e1e1e",
    borderRadius: 20,
    padding: "36px 32px 28px",
    width: "100%",
    maxWidth: 460,
    position: "relative",
    boxShadow: "0 32px 64px rgba(0,0,0,.8),0 1px 0 rgba(255,255,255,.04) inset",
  },
  topLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
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
  lampWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
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
    borderTop: "120px solid rgba(245,200,66,.08)",
    filter: "blur(8px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  wire: {
    width: 2,
    height: 28,
    background: "linear-gradient(to bottom,#333,#222)",
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
    transition: "background .3s,box-shadow .3s",
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
    background: "rgba(255,255,255,.06)",
    borderRadius: 20,
    pointerEvents: "none",
  },
  eyeRow: { display: "flex", gap: 16, marginTop: 4 },
  eyeSocket: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "rgba(0,0,0,.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pupil: {
    display: "block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "background .3s",
  },
  mouth: {
    width: 20,
    height: 8,
    borderBottom: "2px solid",
    borderRadius: "0 0 10px 10px",
    marginTop: 4,
    transition: "border-color .3s",
  },
  stand: { width: 3, height: 12, background: "#222", borderRadius: 2 },
  base: {
    width: 40,
    height: 7,
    background: "linear-gradient(to right,#1a1a1a,#2a2a2a,#1a1a1a)",
    borderRadius: 4,
    boxShadow: "0 2px 8px rgba(0,0,0,.5)",
  },
  titleBlock: { textAlign: "center", marginBottom: 18 },
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
  roleWrap: {
    display: "flex",
    borderRadius: 10,
    border: "1px solid #222",
    overflow: "hidden",
    marginBottom: 16,
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
    transition: "all .18s ease",
  },
  adminNotice: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    background: "rgba(245,200,66,.06)",
    border: "1px solid rgba(245,200,66,.15)",
    borderRadius: 10,
    padding: "10px 12px",
    marginBottom: 14,
    fontFamily: "'DM Mono', monospace",
    fontSize: 10.5,
    color: "#888",
    lineHeight: 1.5,
  },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 5 },
  label: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.18em",
    color: "#444",
    fontWeight: 400,
    paddingLeft: 2,
  },
  required: { color: "#f5c842" },
  input: {
    background: "#0f0f0f",
    border: "1px solid #222",
    borderRadius: 10,
    padding: "11px 14px",
    color: "#e8e8e8",
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    width: "100%",
  },
  strengthWrap: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  strengthSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    transition: "background .3s",
  },
  strengthLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    color: "#444",
    letterSpacing: "0.1em",
    marginLeft: 4,
    whiteSpace: "nowrap",
  },
  submitBtn: {
    padding: "14px",
    borderRadius: 10,
    fontFamily: "'Syne', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
  error: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,77,77,.08)",
    border: "1px solid rgba(255,77,77,.2)",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#ff6b6b",
    fontFamily: "'DM Mono', monospace",
    fontSize: 11,
    marginBottom: 4,
  },
  footer: {
    textAlign: "center",
    marginTop: 18,
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

export default Register;
