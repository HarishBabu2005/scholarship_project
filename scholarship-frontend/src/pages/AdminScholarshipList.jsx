import { useEffect, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";
import { Navigate ,useNavigate} from "react-router-dom";

function AdminScholarshipList() {
 const navigate=useNavigate();
  const [scholarships, setScholarships] = useState([]);

  const fetchScholarships = async () => {
    try {
      const res = await API.get("/admin/scholarships");
      setScholarships(res.data);
    } catch (error) {
      alert("Failed to load scholarships");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scholarship?")) return;

    try {
      await API.delete(`/admin/scholarship/${id}`);
      fetchScholarships();
    } catch (error) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);
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

        <h1>Scholarship List</h1>
        <p>Admin Panel</p>

        {scholarships.length === 0 ? (
          <p>No scholarships found</p>
        ) : (
          scholarships.map((s) => (
            <div key={s._id} className="result-item success-box">
              <div>
                <strong>{s.name}</strong>
                <div style={{ fontSize: "13px" }}>
                  Income ≤ ₹{s.incomeLimit} | Marks ≥ {s.minMarks} |{" "}
                  {s.category}
                </div>
                <div style={{ fontSize: "13px" }}>
                  Amount: {s.amount}
                </div>
              </div>

              <button
                className="btn-outline"
                onClick={() => handleDelete(s._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </AuthLayout>
  );
}

export default AdminScholarshipList;
