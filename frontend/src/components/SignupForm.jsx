import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

function SignupForm() {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [volunteerName, setVolunteerName] = useState("");
  const [tokenValid, setTokenValid] = useState(null); 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    fetch(`/api/auth/invite/validate/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("invalid");
        return res.json();
      })
      .then((data) => {
        setInviteEmail(data.email);
        setVolunteerName(data.name || "");
        setTokenValid(true);
      })
      .catch(() => setTokenValid(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) { setError("Password is required"); return; }
    if (password !== confirmPass) { setError("Passwords do not match"); return; }

    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPass }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(typeof data === "string" ? data : data.message);
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("Server-side or Network error:", err);
      setError("Server error, please try again");
    }
  };

  if (tokenValid === null) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-200">
        <p className="text-slate-600">Validating your invite link…</p>
      </main>
    );
  }

  if (!tokenValid) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800">
            {token ? "Invalid invite link" : "Invite link required"}
          </h2>
          <p className="text-sm text-slate-500">
            {token
              ? "This invite link is invalid or has expired. Please ask an admin to send you a new one."
              : "Direct signup is disabled. Ask an admin to generate and share your invite link."}
          </p>
          <Link to="/" className="text-teal-600 hover:underline text-sm font-medium">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">🍱 CYF Lunch Organiser</h1>
          <p className="text-sm text-slate-500 mt-1">Create your volunteer account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <input
              type="text"
              value={volunteerName}
              disabled
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={inviteEmail}
              disabled
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400">Pre-filled from your invite</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPass}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 text-white font-semibold py-2.5 hover:bg-slate-800 transition shadow-sm"
          >
            Create Account
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </main>
  );
}

export default SignupForm;