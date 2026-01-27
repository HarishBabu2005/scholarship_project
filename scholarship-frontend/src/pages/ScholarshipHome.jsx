import "./ScholarshipHome.css";

const ScholarshipHome = () => {
  return (
    <div
      className="scholarship-hero"
      style={{
        backgroundImage:
          "url('https://images.stockcake.com/public/2/0/4/20406b38-ae9c-4d6f-bc9f-ba54d5a0d1b0_large/students-studying-outdoors-stockcake.jpg')",
      }}
    >
      {/* Navbar */}
      <nav className="nav">
        <div className="logo">🎓 Scholarship Portal</div>

        <div className="auth-links">
          <a href="/login" className="login-btn">
            Login
          </a>
          <a href="/signup" className="signup-btn">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="hero-text">
        <h1>
          Find the Right <span>Scholarship</span> for Your Education
        </h1>

        <p>
          Explore government and private scholarships based on income,
          category, and academic performance.
        </p>

        <div className="hero-actions">
          <button className="primary-btn">Explore Scholarships</button>
          <button className="secondary-btn">Check Eligibility</button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipHome;
