import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import "../styles/theme.css";

function Signup() {
  return (
    <AuthLayout>
      <div className="card">
        <h1>Sign Up</h1>
        <p>Create your scholarship account</p>

        <form>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Create password" />
          </div>

          <button className="btn-primary">Sign Up</button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Signup;
