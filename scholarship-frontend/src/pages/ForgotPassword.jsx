import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetLink("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      if (res.data.resetLink) {
        setResetLink(res.data.resetLink);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card">
        <h1>Forgot Password</h1>
        <p>Enter your email to receive a reset link</p>

        {message && (
          <div
            style={{
              background: "rgba(34, 197, 94, 0.15)",
              color: "#065f46",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              fontSize: "14px",
              textAlign: "left",
            }}
          >
            {message}
          </div>
        )}

        {resetLink && (
          <div
            style={{
              background: "rgba(37, 99, 235, 0.1)",
              color: "#1e40af",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "1px solid rgba(37, 99, 235, 0.25)",
              fontSize: "13px",
              textAlign: "left",
              wordBreak: "break-all",
            }}
          >
            <strong>Dev Mode — Reset Link:</strong>
            <br />
            <a
              href={resetLink.replace("http://localhost:3000", "")}
              onClick={(e) => {
                e.preventDefault();
                const path = resetLink.replace("http://localhost:3000", "");
                navigate(path);
              }}
              style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}
            >
              Click here to reset your password
            </a>
          </div>
        )}

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            style={{
              color: "#2563eb",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
