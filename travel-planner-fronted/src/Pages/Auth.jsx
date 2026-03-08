import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/auth.css";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lightOn, setLightOn] = useState(false);
  const [activeTab, setActiveTab] = useState("signin"); // signin or signup
  const [selectedRole, setSelectedRole] = useState("user");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const eyeLeft = useRef(null);
  const eyeRight = useRef(null);

  // Set active tab based on route
  useEffect(() => {
    if (location.pathname === "/register") {
      setActiveTab("signup");
    } else {
      setActiveTab("signin");
    }
  }, [location]);

  // 👀 Eye Follow
  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/planner");
    }

    const moveEyes = (e) => {
      [eyeLeft.current, eyeRight.current].forEach((eye) => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(y, x);
        eye.style.transform = `translate(${Math.cos(angle) * 3}px, ${
          Math.sin(angle) * 3
        }px)`;
      });
    };
    window.addEventListener("mousemove", moveEyes);
    return () => window.removeEventListener("mousemove", moveEyes);
  }, [navigate]);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Verify role matches selection
      if (data.user.role !== selectedRole) {
        throw new Error(
          `You are not registered as ${selectedRole === "admin" ? "an Admin" : "a User"}`,
        );
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate to planner
      navigate("/planner");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (selectedRole === "admin") {
      setError(
        "Admin accounts cannot be created from sign up. Please contact an existing admin.",
      );
      setLoading(false);
      return;
    }

    // Basic validation
    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...registerData, role: selectedRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate to planner
      navigate("/planner");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container min-vh-100 d-flex justify-content-center align-items-center px-3">
      <div className="auth-card card p-3 shadow-lg rounded-4 text-center w-100">
        {/* 💡 Lamp */}
        <div className="lamp-container position-relative mb-2">
          {/* Light */}
          {lightOn && <div className="lamp-light"></div>}

          {/* Lamp Head */}
          <div className="lamp-head mx-auto position-relative">
            <div className="d-flex justify-content-around pt-3">
              <span ref={eyeLeft} className="eye bg-dark rounded-circle"></span>
              <span
                ref={eyeRight}
                className="eye bg-dark rounded-circle"
              ></span>
            </div>
          </div>

          <div className="lamp-wire mx-auto bg-secondary"></div>
          <div className="lamp-base mx-auto bg-secondary rounded-pill"></div>
        </div>

        {/* Welcome Message */}
        <h4 className="auth-title mb-2">Welcome Back</h4>
        <p className="text-muted mb-3 small">
          Sign in to your account to continue
        </p>

        {/* Tab Selector - Sign In / Sign Up */}
        <div className="auth-tabs d-flex gap-0 mb-3 mx-auto">
          <button
            type="button"
            className={`auth-tab-btn flex-fill ${activeTab === "signin" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("signin");
              setError("");
            }}
          >
            SIGN IN
          </button>
          <button
            type="button"
            className={`auth-tab-btn flex-fill ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("signup");
              setError("");
            }}
          >
            SIGN UP
          </button>
        </div>

        {/* Role Selector */}
        <div className="d-flex gap-3 mb-3 justify-content-center">
          <button
            type="button"
            className={`btn role-selector-btn rounded-pill px-4 py-2 ${
              selectedRole === "user" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setSelectedRole("user")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-person me-2"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
            </svg>
            User
          </button>
          <button
            type="button"
            className={`btn role-selector-btn rounded-pill px-4 py-2 ${
              selectedRole === "admin" ? "btn-danger" : "btn-outline-secondary"
            }`}
            onClick={() => setSelectedRole("admin")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-shield-check me-2"
              viewBox="0 0 16 16"
            >
              <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.856C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
              <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
            </svg>
            Admin
          </button>
        </div>

        {error && (
          <div className="alert alert-danger rounded-pill py-2 mb-4">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === "signin" && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              className="auth-input form-control mb-4 rounded-pill"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              onFocus={() => setLightOn(true)}
              onBlur={() => setLightOn(false)}
              required
            />

            <input
              type="password"
              name="password"
              className="auth-input form-control mb-4 rounded-pill"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              onFocus={() => setLightOn(true)}
              onBlur={() => setLightOn(false)}
              required
            />

            <div className="text-end mb-3">
              <button
                type="button"
                className="btn btn-link p-0 auth-link"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="auth-button btn w-100 rounded-pill fw-bold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === "signup" && (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="fullName"
              className="auth-input form-control mb-3 rounded-pill"
              placeholder="Full Name (Optional)"
              value={registerData.fullName}
              onChange={handleRegisterChange}
              onFocus={() => setLightOn(true)}
              onBlur={() => setLightOn(false)}
            />

            <input
              type="text"
              name="username"
              className="auth-input form-control mb-3 rounded-pill"
              placeholder="Username"
              value={registerData.username}
              onChange={handleRegisterChange}
              onFocus={() => setLightOn(true)}
              onBlur={() => setLightOn(false)}
              required
            />

            <input
              type="email"
              name="email"
              className="auth-input form-control mb-3 rounded-pill"
              placeholder="Email"
              value={registerData.email}
              onChange={handleRegisterChange}
              onFocus={() => setLightOn(true)}
              onBlur={() => setLightOn(false)}
              required
            />

            <input
              type="password"
              name="password"
              className="auth-input form-control mb-4 rounded-pill"
              placeholder="Password (min 6 characters)"
              value={registerData.password}
              onChange={handleRegisterChange}
              onFocus={() => setLightOn(true)}
              onBlur={() => setLightOn(false)}
              required
            />

            <button
              type="submit"
              className="auth-button btn w-100 rounded-pill fw-bold"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
