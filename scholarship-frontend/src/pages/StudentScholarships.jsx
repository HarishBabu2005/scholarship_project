import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";

function StudentScholarships() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("match"); // 'match', 'amount', 'deadline'

  // Student saved eligibility context for calculating match score
  const [studentCriteria, setStudentCriteria] = useState({
    income: 250000,
    marks: 75,
    category: "General",
  });

  useEffect(() => {
    if (!token) return;

    // Check if user ran eligibility form previously
    const savedEligibility = localStorage.getItem("eligibilityInput");
    if (savedEligibility) {
      try {
        setStudentCriteria(JSON.parse(savedEligibility));
      } catch (e) {
        console.error("Failed to parse saved eligibility input");
      }
    }

    const fetchUnread = async () => {
      try {
        const res = await API.get("/notifications");
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };

    const fetchScholarships = async () => {
      try {
        const res = await API.get("/eligibility/scholarships");
        setScholarships(res.data);
      } catch (err) {
        console.error("Failed to fetch scholarships");
      } finally {
        setLoading(false);
      }
    };

    fetchUnread();
    fetchScholarships();
  }, [token]);

  if (!token) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("eligibilityResult");
    localStorage.removeItem("eligibilityInput");
    navigate("/");
  };

  // Match score calculation algorithm
  const calculateMatchScore = (scholarship) => {
    let score = 100;
    const { income, marks, category } = studentCriteria;

    // Category weight (35%)
    if (scholarship.category !== "All" && scholarship.category !== category) {
      score -= 35;
    }

    // Income weight (35%)
    if (income > scholarship.incomeLimit) {
      const diffRatio = (income - scholarship.incomeLimit) / scholarship.incomeLimit;
      score -= Math.min(35, Math.round(diffRatio * 50));
    }

    // Marks weight (30%)
    if (marks < scholarship.minMarks) {
      const diffMarks = scholarship.minMarks - marks;
      score -= Math.min(30, Math.round(diffMarks * 2.5));
    }

    return Math.max(10, Math.min(100, score));
  };

  // Filter & Sort logic
  const filteredScholarships = scholarships
    .map((s) => ({
      ...s,
      matchScore: calculateMatchScore(s),
    }))
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.provider && s.provider.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === "All" ||
        s.category === categoryFilter ||
        s.category === "All";

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "amount") return (b.amount || 0) - (a.amount || 0);
      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return 0;
    });

  return (
    <AuthLayout>
      {/* Top Header Controls */}
      <div style={{ position: "absolute", top: "30px", right: "40px", display: "flex", gap: "12px", zIndex: 10 }}>
        <button
          onClick={() => navigate("/my-applications")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "40px",
            padding: "0 16px",
            background: "rgba(255, 255, 255, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "700",
            color: "#1e3a8a",
            backdropFilter: "blur(10px)",
          }}
        >
          📂 My Applications
        </button>

        <button
          onClick={() => navigate("/notifications")}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "40px",
            width: "40px",
            background: "rgba(255, 255, 255, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "20px",
            backdropFilter: "blur(10px)",
          }}
          title="Notifications"
        >
          🔔
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "#ef4444",
                color: "white",
                fontSize: "11px",
                fontWeight: "700",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          style={{
            height: "40px",
            padding: "0 18px",
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "700",
            boxShadow: "0 10px 20px rgba(220, 38, 38, 0.3)",
          }}
        >
          Logout
        </button>
      </div>

      <div className="card result-card" style={{ maxWidth: "1200px", width: "95%", textAlign: "left" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Scholarship Opportunities</h1>
            <p style={{ margin: "4px 0 0 0", color: "#6b7280" }}>
              Explore schemes tailored to your criteria with smart match scoring
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate("/eligibility")}
            style={{ padding: "10px 20px", width: "auto" }}
          >
            Check My Eligibility
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "25px",
            flexWrap: "wrap",
            background: "rgba(255, 255, 255, 0.5)",
            padding: "15px",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.6)",
          }}
        >
          <input
            type="text"
            placeholder="🔍 Search scholarships by name or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 2,
              minWidth: "220px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              outline: "none",
            }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              flex: 1,
              minWidth: "150px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              outline: "none",
            }}
          >
            <option value="All">All Categories</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
            <option value="General">General</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              flex: 1,
              minWidth: "160px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              outline: "none",
            }}
          >
            <option value="match">Sort by: Match Score %</option>
            <option value="amount">Sort by: Amount (High to Low)</option>
            <option value="deadline">Sort by: Deadline (Soonest)</option>
          </select>
        </div>

        {/* Scholarships Grid */}
        <div className="blog-grid">
          {loading ? (
            <p style={{ textAlign: "center", gridColumn: "span 3", color: "#4b5563", padding: "40px" }}>
              Loading scholarships...
            </p>
          ) : filteredScholarships.length === 0 ? (
            <p style={{ textAlign: "center", gridColumn: "span 3", color: "#4b5563", padding: "40px" }}>
              No scholarships matched your search criteria.
            </p>
          ) : (
            filteredScholarships.map((s) => {
              const matchColor =
                s.matchScore >= 80 ? "#10b981" : s.matchScore >= 50 ? "#f59e0b" : "#6b7280";

              return (
                <div
                  key={s._id}
                  className="scholarship-card detailed-card"
                  onClick={() => navigate(`/scholarships/${s._id}`)}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Match Score Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        background: matchColor,
                        color: "white",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      {s.matchScore}% Match
                    </div>

                    <div className="detailed-title" style={{ fontSize: "17px", borderBottom: "none", paddingRight: "70px" }}>
                      {s.name}
                    </div>

                    {s.provider && (
                      <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>
                        🏛️ {s.provider}
                      </p>
                    )}

                    <div className="detail-section" style={{ marginBottom: "10px" }}>
                      <div className="detail-heading">Eligibility & Details:</div>
                      <ul className="detail-list" style={{ fontSize: "13px" }}>
                        <li><strong>Category:</strong> {s.category || "All"}</li>
                        <li><strong>Max Income:</strong> Below ₹{s.incomeLimit?.toLocaleString("en-IN")}</li>
                        <li><strong>Min Marks:</strong> {s.minMarks}%</li>
                        <li><strong>Award Amount:</strong> ₹{s.amount ? Number(s.amount).toLocaleString("en-IN") : "N/A"}</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    {s.deadline && (
                      <p style={{ margin: "5px 0", fontSize: "11px", color: "#dc2626", fontWeight: "bold" }}>
                        ⏰ Deadline: {new Date(s.deadline).toLocaleDateString()}
                      </p>
                    )}
                    <div style={{ width: "100%", textAlign: "center", marginTop: "8px", fontSize: "13px", color: "#1e3a8a", fontWeight: "700" }}>
                      View & Apply →
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

export default StudentScholarships;
