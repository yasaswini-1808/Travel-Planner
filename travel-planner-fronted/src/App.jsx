// src/App.jsx
import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Chatbot from "./components/Chatbot"; // Import Chatbot
import ProtectedRoute from "./components/ProtectedRoute";
import { TravelProvider } from "./context/TravelContext";

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
      {isLoggedIn && !isAuthPage && !isLandingPage && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <TravelProvider>
      <Router>
        <AppContent />
      </Router>
    </TravelProvider>
  );
}

export default App;
