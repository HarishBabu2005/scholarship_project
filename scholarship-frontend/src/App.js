import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EligibilityForm from "./pages/EligibilityForm";
import EligibilityResult from "./pages/EligibilityResult";
import AdminAddScholarship from "./pages/AdminAddScholarship";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/eligibility" element={<EligibilityForm />} />
        <Route path="/result" element={<EligibilityResult />} />
        <Route path="/admin/add-scholarship" element={<AdminAddScholarship />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
