import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/home", icon: "⌂" },
    { name: "Explore", path: "/explore", icon: "🗺️" },
    { name: "Services", path: "/services", icon: "✦" },
    { name: "Feedback", path: "/feedback", icon: "📝" },
    { name: "Deals", path: "/deals", icon: "◈" },
    { name: "Blogs", path: "/blogs", icon: "✎" },
    { name: "About", path: "/about", icon: "◉" },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const syncAuthState = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    setLoggedIn(Boolean(token));

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    syncAuthState();

    const onStorage = (e) => {
      if (e.key === "token") {
        syncAuthState();
      }
      if (e.key === "user") {
        syncAuthState();
      }
    };

    const onFocus = () => syncAuthState();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    syncAuthState();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (e) => {
      if (!e.target.closest(".user-dropdown-wrap")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dropdownOpen]);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

        .hdr-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          font-family: 'Syne', sans-serif;
          transition: all 0.3s ease;
        }

        .hdr-bar {
          display: flex; align-items: center;
          padding: 0 32px; height: 64px;
          background: rgba(8, 10, 18, 0.6);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: background 0.3s ease, box-shadow 0.3s ease;
          gap: 0;
        }
        .hdr-bar.scrolled {
          background: rgba(8, 10, 18, 0.92);
          box-shadow: 0 4px 40px rgba(0,0,0,0.5);
          border-bottom-color: rgba(255,255,255,0.1);
        }
        /* Brand */
        .hdr-brand {
          display: flex; align-items: center; gap: 10px;
          background: none; border: none; cursor: pointer; padding: 0;
          text-decoration: none; flex-shrink: 0;
        }
        .hdr-brand-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #6366F1, #EC4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 16px rgba(99,102,241,0.45);
        }
        .hdr-brand-text {
          font-size: 17px; font-weight: 800; letter-spacing: -0.5px;
          color: #fff;
        }
        .hdr-brand-text span {
          background: linear-gradient(90deg, #7DD3FC, #EC4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        /* Nav */
        .hdr-nav {
          display: flex; align-items: center; gap: 2px;
          margin: 0 auto; list-style: none; padding: 0;
        }
        .hdr-nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 600; letter-spacing: 0.1px;
          color: rgba(255,255,255,0.5); text-decoration: none;
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .hdr-nav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .hdr-nav-link.active {
          color: #fff; background: rgba(99,102,241,0.2);
          box-shadow: inset 0 0 0 1px rgba(196,181,253,0.4);
        }
        .hdr-nav-link.active .nav-dot {
          background: #A5B4FC; box-shadow: 0 0 8px #A5B4FC;
        }
        .nav-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          transition: background 0.2s, box-shadow 0.2s;
        }
        /* Right actions */
        .hdr-actions {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }

        .btn-plan {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 20px; border-radius: 10px; border: none; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          background: linear-gradient(135deg, #6366F1, #EC4899);
          color: #fff; letter-spacing: 0.2px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(99,102,241,0.45);
        }
        .btn-plan:hover { transform: scale(1.04); box-shadow: 0 6px 24px rgba(99,102,241,0.65); }

        .btn-signin {
          display: flex; align-items: center;
          padding: 8px 18px; border-radius: 10px; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s ease;
        }
        .btn-signin:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); }
        .btn-getstarted {
          display: flex; align-items: center;
          padding: 8px 20px; border-radius: 10px; border: none; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          background: linear-gradient(135deg, #E0E7FF, #F5D0FE); color: #111827;
          transition: all 0.25s ease;
          box-shadow: 0 2px 12px rgba(99,102,241,0.25);
        }
        .btn-getstarted:hover { background: linear-gradient(135deg, #C7D2FE, #E9D5FF); transform: scale(1.03); }

        /* Avatar + dropdown */
        .user-dropdown-wrap { position: relative; }
        .user-avatar-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 12px 5px 5px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          cursor: pointer; transition: all 0.2s ease;
        }
        .user-avatar-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .avatar-circle {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg, #6366F1, #EC4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; color: #fff; letter-spacing: 0.5px;
          flex-shrink: 0;
        }
        .avatar-name {
          font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85);
          max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .avatar-chevron {
          font-size: 10px; color: rgba(255,255,255,0.35);
          transition: transform 0.2s ease;
        }
        .avatar-chevron.open { transform: rotate(180deg); }
        /* Dropdown menu */
        .dropdown-menu-custom {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 220px; border-radius: 16px;
          background: #0E1020;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 16px 60px rgba(0,0,0,0.7);
          padding: 8px; z-index: 999;
          animation: dropIn 0.2s cubic-bezier(0.23,1,0.32,1);
        }
        @keyframes dropIn {
          from { opacity:0; transform: translateY(-8px) scale(0.97); }
          to { opacity:1; transform: translateY(0) scale(1); }
        }
        .dd-user-info {
          padding: 10px 12px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 6px;
        }
        .dd-user-name { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
        .dd-user-email { font-size: 11px; color: rgba(255,255,255,0.35); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dd-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 12px; border-radius: 10px;
          border: none; background: none; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.6); text-align: left;
          transition: background 0.15s, color 0.15s;
        }
        .dd-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .dd-item.danger { color: rgba(239,68,68,0.7); }
        .dd-item.danger:hover { background: rgba(239,68,68,0.1); color: #F87171; }
        .dd-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 4px 0; }
        /* Mobile hamburger */
        .hamburger-btn {
          display: none; flex-direction: column; justify-content: center; gap: 5px;
          width: 36px; height: 36px; padding: 8px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px; cursor: pointer; transition: background 0.2s;
          margin-left: auto;
        }
        .hamburger-btn:hover { background: rgba(255,255,255,0.1); }
        .ham-line {
          width: 100%; height: 2px; background: rgba(255,255,255,0.7); border-radius: 2px;
          transition: all 0.3s ease; transform-origin: center;
        }
        .hamburger-btn.open .ham-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger-btn.open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger-btn.open .ham-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile drawer */
        .mobile-drawer {
          display: none;
          flex-direction: column;
          background: rgba(8,10,18,0.97);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 16px 20px 24px;
          gap: 4px;
          max-height: calc(100vh - 64px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          animation: slideDown 0.25s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-drawer.open { display: flex; }
        .mob-nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 12px;
          font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.55);
          text-decoration: none; transition: all 0.2s ease;
        }
        .mob-nav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .mob-nav-link.active { color: #fff; background: rgba(99,102,241,0.2); box-shadow: inset 0 0 0 1px rgba(196,181,253,0.4); }
        .mob-nav-icon { font-size: 16px; width: 22px; text-align: center; }
        .mob-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 8px 0; }
        .mob-actions { display: flex; gap: 10px; padding: 4px 0 0; }
        .mob-btn-full {
          flex: 1; padding: 12px; border-radius: 12px; border: none; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          transition: all 0.2s ease;
        }
        .mob-btn-outline {
          background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .mob-btn-outline:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .mob-btn-primary {
          background: linear-gradient(135deg, #6366F1, #EC4899); color: #fff;
          box-shadow: 0 4px 16px rgba(99,102,241,0.45);
        }
        .mob-btn-primary:hover { box-shadow: 0 6px 24px rgba(99,102,241,0.65); }

        /* Mobile user section */
        .mob-user-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; background: rgba(255,255,255,0.04);
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 8px;
        }
        .mob-user-info { flex: 1; min-width: 0; }
        .mob-user-name { font-size: 14px; font-weight: 700; color: #fff; }
        .mob-user-email { font-size: 11px; color: rgba(255,255,255,0.35); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* Responsive breakpoints */
        @media (max-width: 768px) {
          .hdr-bar { padding: 0 20px; }
          .hdr-nav { display: none; }
          .hdr-actions { display: none; }
          .hamburger-btn { display: flex; }
        }
        @media (min-width: 769px) {
          .mobile-drawer { display: none !important; }
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 400px) {
          .hdr-brand-text { font-size: 15px; }
        }
      `}</style>

      <header className="hdr-root" role="banner" aria-label="Main header">
        {/* Main bar */}
        <nav
          className={`hdr-bar${scrolled ? " scrolled" : ""}`}
          aria-label="Main navigation"
        >
          {/* Brand */}
          <button
            type="button"
            className="hdr-brand"
            onClick={() => navigate(loggedIn ? "/home" : "/")}
            aria-label="Go to home"
          >
            <div className="hdr-brand-icon">✈️</div>
            <span className="hdr-brand-text">
              Travel<span>Planner</span>
            </span>
          </button>

          {/* Desktop nav */}
          {loggedIn ? (
            <ul className="hdr-nav" role="list">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `hdr-nav-link${isActive ? " active" : ""}`
                    }
                    aria-current={
                      location.pathname === item.path ? "page" : undefined
                    }
                  >
                    <span className="nav-dot" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="hdr-nav" role="list">
              <li>
                <a href="#features" className="hdr-nav-link">
                  <span className="nav-dot" />
                  Features
                </a>
              </li>
            </ul>
          )}

          {/* Desktop actions */}
          <div className="hdr-actions">
            {loggedIn ? (
              <>
                <button
                  type="button"
                  className="btn-plan"
                  onClick={() => navigate("/planner")}
                >
                  <span>✦</span> Start Planning
                </button>
                <div className="user-dropdown-wrap">
                  <button
                    className="user-avatar-btn"
                    onClick={() => setDropdownOpen((o) => !o)}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="avatar-circle">{initials}</div>
                    <span className="avatar-name">
                      {user?.username || "User"}
                    </span>
                    <span
                      className={`avatar-chevron${dropdownOpen ? " open" : ""}`}
                    >
                      ▼
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="dropdown-menu-custom" role="menu">
                      <div className="dd-user-info">
                        <div className="dd-user-name">
                          {user?.fullName || user?.username}
                        </div>
                        <div className="dd-user-email">{user?.email}</div>
                      </div>
                      <button
                        className="dd-item"
                        onClick={() => navigate("/preferences")}
                      >
                        📝 My Plans
                      </button>
                      <button
                        className="dd-item"
                        onClick={() => navigate("/explore")}
                      >
                        🗺️ Explore
                      </button>
                      <button
                        className="dd-item"
                        onClick={() => navigate("/budget")}
                      >
                        💸 Budget Tracker
                      </button>
                      <button
                        className="dd-item"
                        onClick={() => navigate("/users")}
                      >
                        👥 View Users
                      </button>
                      <div className="dd-divider" />
                      <button className="dd-item danger" onClick={handleLogout}>
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-signin"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="btn-getstarted"
                  onClick={() => navigate("/register")}
                >
                  Get Started →
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`hamburger-btn${mobileOpen ? " open" : ""}`}
            onClick={() => setMobileOpen((s) => !s)}
            aria-controls="mobile-drawer"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            <div className="ham-line" />
            <div className="ham-line" />
            <div className="ham-line" />
          </button>
        </nav>

        {/* Mobile drawer */}
        <div
          id="mobile-drawer"
          className={`mobile-drawer${mobileOpen ? " open" : ""}`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {loggedIn ? (
            <>
              {/* User info */}
              <div className="mob-user-row">
                <div
                  className="avatar-circle"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                >
                  {initials}
                </div>
                <div className="mob-user-info">
                  <div className="mob-user-name">
                    {user?.fullName || user?.username || "User"}
                  </div>
                  <div className="mob-user-email">{user?.email}</div>
                </div>
              </div>

              {/* Nav links */}
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `mob-nav-link${isActive ? " active" : ""}`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="mob-nav-icon">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}

              <div className="mob-divider" />

              <NavLink
                to="/preferences"
                className="mob-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                <span className="mob-nav-icon">📝</span> My Plans
              </NavLink>
              <NavLink
                to="/budget"
                className="mob-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                <span className="mob-nav-icon">💸</span> Budget Tracker
              </NavLink>
              <NavLink
                to="/users"
                className="mob-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                <span className="mob-nav-icon">👥</span> View Users
              </NavLink>

              <div className="mob-divider" />

              <button
                className="mob-btn-full mob-btn-primary"
                onClick={() => {
                  navigate("/planner");
                  setMobileOpen(false);
                }}
              >
                ✦ Start Planning
              </button>
              <button
                className="mob-btn-full mob-btn-outline"
                style={{
                  marginTop: 8,
                  background: "rgba(239,68,68,0.08)",
                  color: "#F87171",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="#features"
                className="mob-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                <span className="mob-nav-icon">✦</span> Features
              </a>
              <div className="mob-divider" />
              <div className="mob-actions">
                <button
                  className="mob-btn-full mob-btn-outline"
                  onClick={() => {
                    navigate("/login");
                    setMobileOpen(false);
                  }}
                >
                  Sign In
                </button>
                <button
                  className="mob-btn-full mob-btn-primary"
                  onClick={() => {
                    navigate("/register");
                    setMobileOpen(false);
                  }}
                >
                  Get Started
                </button>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}
