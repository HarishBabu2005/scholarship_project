import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import "../styles/theme.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  return (
    <AuthLayout>
      <div className="card">
        <h1>Login</h1>
        <p>Access your scholarship dashboard</p>

        <form>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>

          <button className="btn-primary">Login</button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
