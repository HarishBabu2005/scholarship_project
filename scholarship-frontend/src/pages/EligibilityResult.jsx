import { useNavigate,Navigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/theme.css";

function EligibilityResult() {
  const navigate = useNavigate();
  
 const data = JSON.parse(localStorage.getItem("eligibilityResult"));

const eligibleScholarships = data?.eligible || [];
const notEligibleScholarships = data?.notEligible || [];
if (!localStorage.getItem("token")) {
  return <Navigate to="/" />;
}
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("eligibilityResult");
  navigate("/");
};

  return (
    <AuthLayout>
      <div className="card result-card">
        <div style={{ textAlign: "right" }}>
  <button
    className="btn-outline"
    style={{ fontSize: "14px" }}
    onClick={handleLogout}
  >
    Logout
  </button>
</div>

        <h1>Eligibility Result</h1>
        <p>Based on your details, here are the results</p>

        {/* Eligible Scholarships */}
        <div className="result-section">
          <h3 className="success">Eligible Scholarships</h3>

          {eligibleScholarships.length > 0 ? (
            eligibleScholarships.map((item, index) => (
              <div key={index} className="result-item success-box">
                <strong>{item.name}</strong>
                <span>{item.amount}</span>
              </div>
            ))
          ) : (
            <p>No eligible scholarships found</p>
          )}
        </div>

        {/* Not Eligible Scholarships */}
        <div className="result-section">
          <h3 className="danger">Not Eligible</h3>

          {notEligibleScholarships.map((item, index) => (
            <div key={index} className="result-item danger-box">
              <strong>{item.name}</strong>
              <span>{item.reason}</span>
            </div>
          ))}
        </div>

        <button
          className="btn-outline"
          onClick={() => navigate("/eligibility")}
        >
          Back
        </button>
      </div>
    </AuthLayout>
  );
}

export default EligibilityResult;
