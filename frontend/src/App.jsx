import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import AdminInvitePage from "./components/AdminInvitePage";
import VolunteerDashboard from "./components/VolunteerDashboard";
import LeftoverManagement from "./components/LeftoverManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/admin" element={<AdminInvitePage />} />
      <Route path="/volunteer" element={<VolunteerDashboard />} />
      <Route path="/Leftover" element={<LeftoverManagement />} />
    </Routes>
  );
}

export default App;
