import { Routes, Route } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import AdminInvitePage from "./components/AdminInvitePage";
import VolunteerDashboard from "./components/VolunteerDashboard";
import VolunteerAttendanceRequestPage from "./pages/VolunteerAttendanceRequestPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/admin" element={<AdminInvitePage />} />
      <Route path="/volunteer" element={<VolunteerDashboard />} />
      <Route path="/volunteer/attendance" element={<VolunteerAttendanceRequestPage />} />
    </Routes>
  );
}

export default App;
