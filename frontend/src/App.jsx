import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import AdminInvitePage from "./components/AdminInvitePage";
import VolunteerDashboard from "./components/VolunteerDashboard";
import AttendanceSummary from "./components/AttendanceSummary";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/admin" element={<AdminInvitePage />} />
      <Route path="/volunteer" element={<VolunteerDashboard />} />
      <Route path="/attendance" element={<AttendanceSummary />} />
    </Routes>
  );
}

export default App;
