import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName.trim()) { setError("Email is required"); return; }
    if (!password.trim()) { setError("Password is required"); return; }

    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const rawBody = await response.text();
      let data = null;

      try {
        data = rawBody ? JSON.parse(rawBody) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const message =
          typeof data === "string"
            ? data
            : data?.message || rawBody || "Login failed. Please try again.";
        setError(message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.forms) {
        localStorage.setItem("forms", JSON.stringify(data.user.forms));
      }

      if (data.user.roleId === 1) {
        navigate("/admin");
      } else {
        navigate("/volunteer");
      }
    } catch (err) {
      console.error("Server-side or Network error:", err);
      setError("Server error, please try again");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">🍱 CYF Lunch Organiser</h1>
          <p className="text-sm text-slate-500 mt-1">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</label>
            <input
              id="email"
              type="email"
              value={userName}
              placeholder="you@codeyourfuture.io"
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 text-white font-semibold py-2.5 hover:bg-slate-800 transition shadow-sm"
          >
            Log In
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center">
          Access is limited to authorised CYF volunteers.
        </p>
        <p className="text-sm text-center text-slate-500">
          Back to{" "}
          <Link to="/" className="text-teal-600 hover:underline font-medium">home</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginForm;
