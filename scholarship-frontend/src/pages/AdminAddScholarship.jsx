import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";

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

  return (
    <AuthLayout>
      <div className="card">
        <h1>Add Scholarship</h1>
        <p>Admin Panel</p>

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
              <option>SC</option>
              <option>ST</option>
              <option>OBC</option>
              <option>General</option>
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
