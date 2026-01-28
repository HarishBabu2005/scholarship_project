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
function App() {
  return (
    <BrowserRouter>
      <Routes>
         {/* Landing Page */}
        <Route path="/" element={<ScholarshipHome />} />

        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/eligibility" element={<EligibilityForm />} />
        <Route path="/result" element={<EligibilityResult />} />
        <Route path="/admin/add-scholarship" element={ <AdminRoute><AdminAddScholarship />  </AdminRoute>} />
        <Route
          path="/admin/scholarships"
          element={
            <AdminRoute>
              <AdminScholarshipLists />
            </AdminRoute>
  }
/>
<Route
  path="/scholarships"
  element={<StudentScholarships/>}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;



