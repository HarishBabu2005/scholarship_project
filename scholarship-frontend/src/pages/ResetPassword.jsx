import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let temp = {};
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!formData.newPassword) {
      temp.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      temp.newPassword = "Password must be at least 8 characters";
    } else if (!specialCharRegex.test(formData.newPassword)) {
      temp.newPassword = "Password must contain at least one special character";
    }

    if (formData.confirmPassword !== formData.newPassword) {
      temp.confirmPassword = "Passwords do not match";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setMessage("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/reset-password", {
        token,
        newPassword: formData.newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card">
        <h1>Reset Password</h1>
        <p>Create a new password for your account</p>

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
            }}
          >
            {message}
          </div>
        )}

        {apiError && (
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
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) => {
                const newPassword = e.target.value;
                setFormData({ ...formData, newPassword });

                let passError = "";
                const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
                if (!newPassword) {
                  passError = "Password is required";
                } else if (newPassword.length < 8) {
                  passError = "Password must be at least 8 characters";
                } else if (!specialCharRegex.test(newPassword)) {
                  passError = "Password must contain at least one special character";
                }
                setErrors((prev) => ({ ...prev, newPassword: passError }));
              }}
            />
            {errors.newPassword && (
              <div className="error-text">{errors.newPassword}</div>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <div className="error-text">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
