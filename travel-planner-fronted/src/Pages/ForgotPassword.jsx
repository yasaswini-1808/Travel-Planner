import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/auth.css";

const API_BASE_URL = "http://localhost:5000/api/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const token = searchParams.get("token") || "";
  const isResetMode = location.pathname === "/reset-password";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setSuccess(
        data.message ||
          "If your email exists, a password reset link has been sent.",
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "Reset token is missing. Please use the link from forgot password.",
      );
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(data.message || "Password reset successful");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container min-vh-100 d-flex justify-content-center align-items-center px-3">
      <div className="auth-card card p-3 shadow-lg rounded-4 text-center w-100">
        <h4 className="auth-title mb-3">
          {isResetMode ? "Reset Password" : "Forgot Password"}
        </h4>
        <p className="text-muted mb-4 small">
          {isResetMode
            ? "Enter your new password to continue"
            : "Enter your registered email to get a reset link"}
        </p>

        {error && (
          <div className="alert alert-danger rounded-pill py-2 mb-3">
            {error}
          </div>
        )}
        {success && (
          <div
            className="alert alert-success py-2 mb-3"
            style={{ wordBreak: "break-word" }}
          >
            {success}
          </div>
        )}

        {!isResetMode ? (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              name="email"
              className="auth-input form-control mb-3 rounded-pill"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="auth-button btn w-100 rounded-pill fw-bold"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              name="password"
              className="auth-input form-control mb-3 rounded-pill"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              className="auth-input form-control mb-3 rounded-pill"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="auth-button btn w-100 rounded-pill fw-bold"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-4">
          <button
            type="button"
            className="btn btn-link auth-link"
            onClick={() => navigate("/login")}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
