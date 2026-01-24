import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Validation function
  const validate = () => {
    let temp = {};

    if (!formData.name) {
      temp.name = "Full name is required";
    }

    if (!formData.email) {
      temp.email = "Email is required";
    }

    if (!formData.password) {
      temp.password = "Password is required";
    } else if (formData.password.length < 6) {
      temp.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      temp.confirmPassword = "Passwords do not match";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        await API.post("/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        alert("Signup successful. Please login.");
        navigate("/login");
      } catch (error) {
        alert(error.response?.data?.message || "Signup failed");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="card">
        <h1>Sign Up</h1>
        <p>Create your scholarship account</p>

        {/* ✅ onSubmit added */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && (
              <div className="error-text">{errors.name}</div>
            )}
          </div>

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
              placeholder="Create password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
            />
            {errors.confirmPassword && (
              <div className="error-text">{errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Sign Up
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Signup;
