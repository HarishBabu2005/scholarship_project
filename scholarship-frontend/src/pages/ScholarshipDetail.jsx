import { useParams, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { HARDCODED_SCHOLARSHIPS } from "../data/scholarships";
import "../styles/theme.css";

function ScholarshipDetail() {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    if (!token) {
        return <Navigate to="/" />;
    }

    const scholarship = HARDCODED_SCHOLARSHIPS.find((s) => s.id === parseInt(id));

    if (!scholarship) {
        return (
            <AuthLayout>
                <div className="card">
                    <h1>Scholarship Not Found</h1>
                    <button className="btn-primary" onClick={() => navigate("/scholarships")}>
                        Back to Scholarships
                    </button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="card result-card" style={{ maxWidth: "800px", width: "95%", textAlign: "left" }}>
                <button
                    className="btn-outline"
                    onClick={() => navigate("/scholarships")}
                    style={{ width: "auto", marginBottom: "20px", padding: "8px 15px", fontSize: "14px" }}
                >
                    &larr; Back
                </button>

                <h1 style={{ fontSize: "24px", color: "#1e3a8a", marginBottom: "20px", borderBottom: "2px solid rgba(30,58,138,0.2)", paddingBottom: "10px" }}>
                    {scholarship.title}
                </h1>

                {scholarship.source && (
                    <div className="detail-section">
                        <div className="detail-heading">Source:</div>
                        <p style={{ color: "#4b5563", fontSize: "15px" }}>{scholarship.source}</p>
                    </div>
                )}

                <div className="detail-section">
                    <div className="detail-heading">Eligibility:</div>
                    <ul className="detail-list" style={{ fontSize: "15px" }}>
                        {scholarship.eligibility.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="detail-section">
                    <div className="detail-heading">Amount:</div>
                    <p style={{ color: "#065f46", fontSize: "16px", whiteSpace: "pre-wrap", fontWeight: "bold" }}>
                        {scholarship.amount}
                    </p>
                </div>

                <div className="detail-section">
                    <div className="detail-heading">Application:</div>
                    <ul className="detail-list" style={{ fontSize: "15px" }}>
                        {scholarship.application.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="detail-section">
                    <div className="detail-heading">Documents Required:</div>
                    <ul className="detail-list" style={{ fontSize: "15px", columns: "1" }}>
                        {scholarship.documents.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </AuthLayout>
    );
}

export default ScholarshipDetail;
