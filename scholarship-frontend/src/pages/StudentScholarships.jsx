import { useEffect, useState } from "react";
import { Navigate,  } from "react-router-dom";
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
          scholarships.map((s) => (
            <div key={s._id} className="result-item success-box">
              <div>
                <strong>{s.name}</strong>
                <div style={{ fontSize: "13px" }}>
                  Category: {s.category}
                </div>
                <div style={{ fontSize: "13px" }}>
                  Income ≤ ₹{s.incomeLimit}
                </div>
                <div style={{ fontSize: "13px" }}>
                  Min Marks: {s.minMarks}
                </div>
                <div style={{ fontSize: "13px" }}>
                  Amount: {s.amount}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AuthLayout>
  );
}

export default StudentScholarships;
