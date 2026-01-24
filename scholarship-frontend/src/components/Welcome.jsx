import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

function Welcome() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="card">
        <h1>Welcome</h1>
        <p>Please login or create a new account to continue</p>

        <button
          className="btn-primary"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          className="btn-outline"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
    </AuthLayout>
  );
}

export default Welcome;
