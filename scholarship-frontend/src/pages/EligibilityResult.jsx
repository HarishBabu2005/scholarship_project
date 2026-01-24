import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/theme.css";

function EligibilityResult() {
  const navigate = useNavigate();

  // Sample data (later comes from backend)
  const eligibleScholarships = [
    {
      name: "National Merit Scholarship",
      amount: "₹50,000 per year",
    },
    {
      name: "Minority Welfare Scholarship",
      amount: "₹30,000 per year",
    },
  ];

  const notEligibleScholarships = [
    {
      name: "Post Matric Scholarship",
      reason: "Income exceeds eligibility limit",
    },
  ];

  return (
    <AuthLayout>
      <div className="card result-card">
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
