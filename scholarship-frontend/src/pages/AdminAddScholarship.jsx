import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";
import { Navigate, Link } from "react-router-dom";

function AdminAddScholarship() {
  const [formData, setFormData] = useState({
    name: "",
    incomeLimit: "",
    minMarks: "",
    category: "",
    amount: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/admin/scholarship", formData);
      alert("Scholarship added successfully");
      setFormData({
        name: "",
        incomeLimit: "",
        minMarks: "",
        category: "",
        amount: "",
      });
    } catch (error) {
      alert("Failed to add scholarship");
    }
  };

  if (!localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return (
    <AuthLayout>
      <div className="card">
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <Link to="/admin" style={{ textDecoration: "none", color: "#2563eb", fontWeight: "600", fontSize: "14px" }}>
            Back to Dashboard
          </Link>
        </div>

        <h1>Add Scholarship</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Scholarship Name</label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Income Limit (₹)</label>
            <input
              type="number"
              value={formData.incomeLimit}
              onChange={(e) =>
                setFormData({ ...formData, incomeLimit: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Minimum Marks / CGPA</label>
            <input
              type="number"
              value={formData.minMarks}
              onChange={(e) =>
                setFormData({ ...formData, minMarks: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>All</option>
              <option>Female</option>
              <option>SC</option>
              <option>ST</option>
              <option>OBC</option>
              <option>General</option>
              <option>Final Year Civil/ Electrical dept </option>

            </select>
          </div>

          <div className="input-group">
            <label>Scholarship Amount</label>
            <input
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          <button className="btn-primary">Add Scholarship</button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default AdminAddScholarship;
