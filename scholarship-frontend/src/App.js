import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScholarshipHome from "./pages/ScholarshipHome";
import Welcome from "./components/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EligibilityForm from "./pages/EligibilityForm";
import EligibilityResult from "./pages/EligibilityResult";
import AdminAddScholarship from "./pages/AdminAddScholarship";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminScholarshipLists from "./pages/AdminScholarshipList";
import StudentScholarships from "./pages/StudentScholarships";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import DocumentUpload from "./pages/DocumentUpload";
import AdminDocumentVerification from "./pages/AdminDocumentVerification";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApplicationManagement from "./pages/AdminApplicationManagement";
import MyApplications from "./pages/MyApplications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Notifications from "./pages/Notifications";

import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "844725495194-519nengp0k60l6kf85li1at3vqcgfom3.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Welcome Pages */}
          <Route path="/" element={<ScholarshipHome />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Student Routes */}
          <Route
            path="/eligibility"
            element={
              <ProtectedRoute>
                <EligibilityForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <EligibilityResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scholarships"
            element={
              <ProtectedRoute>
                <StudentScholarships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scholarships/:id"
            element={
              <ProtectedRoute>
                <ScholarshipDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-documents"
            element={
              <ProtectedRoute>
                <DocumentUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
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
          <Route
            path="/admin/verify-documents"
            element={
              <AdminRoute>
                <AdminDocumentVerification />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <AdminRoute>
                <AdminApplicationManagement />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;