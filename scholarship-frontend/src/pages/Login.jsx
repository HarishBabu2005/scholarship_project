import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Validation function (THIS WAS MISSING)
  const validate = () => {
    let temp = {};

    if (!formData.email) {
      temp.email = "Email is required";
    }

    if (!formData.password) {
      temp.password = "Password is required";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const res = await API.post("/auth/login", formData);

        // Save JWT token
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        navigate("/eligibility");
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="card">
        <h1>Login</h1>
        <p>Access your scholarship dashboard</p>

        {/* ✅ onSubmit added */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && (
              <div className="error-text">{errors.email}</div>
            )}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
