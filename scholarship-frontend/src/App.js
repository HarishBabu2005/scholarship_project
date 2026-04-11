import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScholarshipHome from "./pages/ScholarshipHome";
import Welcome from "./components/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EligibilityForm from "./pages/EligibilityForm";
import EligibilityResult from "./pages/EligibilityResult";
import AdminAddScholarship from "./pages/AdminAddScholarship";
import AdminRoute from "./components/AdminRoute";
import AdminScholarshipLists from "./pages/AdminScholarshipList";
import StudentScholarships from "./pages/StudentScholarships";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import DocumentUpload from "./pages/DocumentUpload";   // ⭐ NEW IMPORT
import AdminDocumentVerification from "./pages/AdminDocumentVerification"; // ⭐ NEW IMPORT
import AdminDashboard from "./pages/AdminDashboard"; // ⭐ NEW IMPORT
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Notifications from "./pages/Notifications";

import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId="844725495194-519nengp0k60l6kf85li1at3vqcgfom3.apps.googleusercontent.com">
      <BrowserRouter>

        <Routes>

          {/* Landing Page */}
          <Route path="/" element={<ScholarshipHome />} />

          {/* Welcome Page */}
          <Route path="/welcome" element={<Welcome />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Eligibility */}
          <Route path="/eligibility" element={<EligibilityForm />} />
          <Route path="/result" element={<EligibilityResult />} />

          {/* Student Scholarship Pages */}
          <Route path="/scholarships" element={<StudentScholarships />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetail />} />

          {/* Document Upload & Notifications */}
          <Route path="/upload-documents" element={<DocumentUpload />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Admin Pages */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/add-scholarship"
            element={
              <AdminRoute>
                <AdminAddScholarship />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/scholarships"
            element={
              <AdminRoute>
                <AdminScholarshipLists />
              </AdminRoute>
            }
          />

          {/* ⭐ Admin Document Verification */}
          <Route
            path="/admin/verify-documents"
            element={
              <AdminRoute>
                <AdminDocumentVerification />
              </AdminRoute>
            }
          />

        </Routes>

      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;