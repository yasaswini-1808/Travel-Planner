// src/App.jsx
import { Component, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { TravelProvider } from "./context/TravelContext";
import React from "react";
class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#eef2ff",
            background: "#06070f",
            textAlign: "center",
            padding: "24px",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          <div>
            <h2 style={{ marginBottom: "10px" }}>Something went wrong</h2>
            <p style={{ opacity: 0.75 }}>
              Please refresh this page. If it continues, open browser console.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Landing = lazy(() => import("./Pages/Landing"));
const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const Blogs = lazy(() => import("./Pages/Blogs"));
const Deals = lazy(() => import("./Pages/Deals"));
const Itinerary = lazy(() => import("./Pages/Itinerary"));
const Auth = lazy(() => import("./Pages/Auth"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const Planner = lazy(() => import("./Pages/Planner"));
const Budget = lazy(() => import("./Pages/Budget"));
const Explore = lazy(() => import("./Pages/Explore"));
const Services = lazy(() => import("./Pages/Services"));
const Feedback = lazy(() => import("./Pages/Feedback"));
const TravelPreferences = lazy(() => import("./Pages/TravelPreferences"));
const WeatherApp = lazy(() => import("./components/Weather"));
const Users = lazy(() => import("./Pages/Users"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Chatbot = lazy(() => import("./components/Chatbot"));

function RouteFallback() {
  return (
    <div className="min-h-[40vh] w-full flex items-center justify-center text-amber-700 font-semibold">
      Loading page...
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";
  const isLandingPage = location.pathname === "/";
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="App">
      <Header />

      <div className={`app-routes-shell${isLandingPage ? " is-landing" : ""}`}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/home" replace /> : <Landing />
              }
            />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <Blogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deals"
              element={
                <ProtectedRoute>
                  <Deals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/itinerary"
              element={
                <ProtectedRoute>
                  <Itinerary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/planner"
              element={
                <ProtectedRoute>
                  <Planner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <ProtectedRoute>
                  <Budget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <TravelPreferences />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weather"
              element={
                <ProtectedRoute>
                  <WeatherApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      {/* Chatbot - Only show when logged in and not on auth/landing pages */}
      {isLoggedIn && !isAuthPage && !isLandingPage && (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      )}
    </div>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <TravelProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppContent />
        </Router>
      </TravelProvider>
    </AppErrorBoundary>
  );
}

export default App;
