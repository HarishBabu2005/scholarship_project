import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import "../styles/theme.css";
import { useNavigate } from "react-router-dom";

function EligibilityForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    category: "",
    income: "",
    education: "",
    marks: "",
    disability: "no",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};

    if (!formData.name) temp.name = "Name is required";
    if (!formData.dob) temp.dob = "Date of birth is required";
    if (!formData.gender) temp.gender = "Gender is required";
    if (!formData.category) temp.category = "Category is required";
    if (!formData.income) temp.income = "Annual income is required";
    if (!formData.education) temp.education = "Education level is required";
    if (!formData.marks) temp.marks = "Marks / CGPA is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Eligibility Data:", formData);
      navigate("/result");
      // Later → send to backend API
    }
  };

  return (
    <AuthLayout>
      <div className="card">
        <h1>Check Scholarship Eligibility</h1>
        <p>Enter your details to find eligible scholarships</p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          {/* DOB */}
          <div className="input-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
            />
            {errors.dob && <div className="error-text">{errors.dob}</div>}
          </div>

          {/* Gender */}
          <div className="input-group">
            <label>Gender</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && <div className="error-text">{errors.gender}</div>}
          </div>

          {/* Category */}
          <div className="input-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>SC</option>
              <option>ST</option>
              <option>OBC</option>
              <option>General</option>
            </select>
            {errors.category && (
              <div className="error-text">{errors.category}</div>
            )}
          </div>

          {/* Income */}
          <div className="input-group">
            <label>Annual Family Income (₹)</label>
            <input
              type="number"
              value={formData.income}
              onChange={(e) =>
                setFormData({ ...formData, income: e.target.value })
              }
            />
            {errors.income && <div className="error-text">{errors.income}</div>}
          </div>

          {/* Education */}
          <div className="input-group">
            <label>Education Level</label>
            <select
              value={formData.education}
              onChange={(e) =>
                setFormData({ ...formData, education: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>High School</option>
              <option>Diploma</option>
              <option>Undergraduate</option>
              <option>Postgraduate</option>
            </select>
            {errors.education && (
              <div className="error-text">{errors.education}</div>
            )}
          </div>

          {/* Marks */}
          <div className="input-group">
            <label>Marks / CGPA</label>
            <input
              type="number"
              step="0.01"
              value={formData.marks}
              onChange={(e) =>
                setFormData({ ...formData, marks: e.target.value })
              }
            />
            {errors.marks && <div className="error-text">{errors.marks}</div>}
          </div>

          {/* Disability */}
          <div className="input-group">
            <label>Disability</label>
            <select
              value={formData.disability}
              onChange={(e) =>
                setFormData({ ...formData, disability: e.target.value })
              }
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Check Eligibility
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default EligibilityForm;
