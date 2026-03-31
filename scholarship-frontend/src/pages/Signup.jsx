import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";
import { useGoogleLogin } from "@react-oauth/google";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const signupWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google signup successful:", tokenResponse);
      alert("Google signup successful! This is a mock response, you will need to wire it up with the backend API logic later.");
    },
    onError: () => {
      console.log("Google signup failed");
      alert("Google signup failed.");
    },
  });

  // ✅ Validation function
  const validate = () => {
    let temp = {};

    if (!formData.name) {
      temp.name = "Full name is required";
    }

    if (!formData.email) {
      temp.email = "Email is required";
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!formData.password) {
      temp.password = "Password is required";
    } else if (formData.password.length < 8) {
      temp.password = "Password must be at least 8 characters";
    } else if (!specialCharRegex.test(formData.password)) {
      temp.password = "Password must contain at least one special character";
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
              onChange={(e) => {
                const newPassword = e.target.value;
                setFormData({ ...formData, password: newPassword });

                // Real-time validation
                let passError = "";
                const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

                if (!newPassword) {
                  passError = "Password is required";
                } else if (newPassword.length < 8) {
                  passError = "Password must be at least 8 characters";
                } else if (!specialCharRegex.test(newPassword)) {
                  passError = "Password must contain at least one special character";
                }

                setErrors((prev) => ({ ...prev, password: passError }));
              }}
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

        <div className="divider">
          <span>OR</span>
        </div>

        <button type="button" className="btn-google" onClick={() => signupWithGoogle()}>
          <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Sign up with Google
        </button>
      </div>
    </AuthLayout>
  );
}

export default Signup;
