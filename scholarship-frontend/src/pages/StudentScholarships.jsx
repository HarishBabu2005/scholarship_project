import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";

function StudentScholarships() {
  const [scholarships, setScholarships] = useState([]);
  const token = localStorage.getItem("token");

  const fetchScholarships = async () => {
    try {
      const res = await API.get("/eligibility/scholarships");
      setScholarships(res.data);
    } catch (error) {
      alert("Failed to load scholarships");
    }
  };

  useEffect(() => {
    if (token) {
      fetchScholarships();
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <AuthLayout>
      <div className="card result-card">
        <h1>Available Scholarships</h1>
        <p>Browse scholarships you may be eligible for</p>

        {scholarships.length === 0 ? (
          <p>No scholarships available</p>
        ) : (
          <div className="scholarship-grid">
            {scholarships.map((s) => (
              <div key={s._id} className="scholarship-card">
                <div className="scholarship-title">{s.name}</div>

                <div className="badge-group">
                  <span className="badge">
                    Category: {s.category}
                  </span>
                  <span className="badge">
                    Income ≤ ₹{s.incomeLimit}
                  </span>
                  <span className="badge">
                    Min Marks: {s.minMarks}
                  </span>
                </div>

                <div className="amount">
                  Scholarship Amount: ₹{s.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default StudentScholarships;
