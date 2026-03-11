import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
}

export default App;
