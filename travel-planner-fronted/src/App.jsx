// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Chatbot from "./components/Chatbot"; // Import Chatbot
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Blogs from "./Pages/Blogs";
import Deals from "./Pages/Deals";
import Itinerary from "./Pages/Itinerary";
import Auth from "./Pages/Auth";
import ForgotPassword from "./Pages/ForgotPassword";
import Planner from "./Pages/Planner";
import Explore from "./Pages/Explore";
import Services from "./Pages/Services";
import Feedback from "./Pages/Feedback";
import TravelPreferences from "./Pages/TravelPreferences";
import WeatherApp from "./components/Weather";
import Users from "./Pages/Users";
import NotFound from "./Pages/NotFound";
import { ThemeProvider } from "./context/ThemeContext";
import { TravelProvider } from "./context/TravelContext";

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

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
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

      {/* Chatbot - Only show when logged in and not on auth/landing pages */}
      {isLoggedIn && !isAuthPage && !isLandingPage && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TravelProvider>
        <Router>
          <AppContent />
        </Router>
      </TravelProvider>
    </ThemeProvider>
  );
}

export default App;
