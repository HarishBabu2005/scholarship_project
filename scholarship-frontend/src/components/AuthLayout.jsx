import "../styles/theme.css";
import bgImage from "../assets/bg-campus.png";

function AuthLayout({ children }) {
  return (
    <div
      className="auth-bg"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="overlay"></div>

      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
