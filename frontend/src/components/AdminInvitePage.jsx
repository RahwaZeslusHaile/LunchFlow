import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminInvitePage() {
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.roleId !== 1) {
      navigate("/login");
    }
  }, [navigate]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    setError("");
    setInviteLink("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(typeof data === "string" ? data : data.message);
        return;
      }

      setInviteLink(`${window.location.origin}/signup?token=${data.token}`);
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Invite volunteers to join</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-800 underline"
          >
            Log out
          </button>
        </div>

        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="inviteEmail" className="text-sm font-semibold text-slate-700">
              Volunteer email
            </label>
            <input
              id="inviteEmail"
              type="email"
              value={email}
              placeholder="volunteer@codeyourfuture.io"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 text-white font-semibold py-2.5 hover:bg-slate-800 transition shadow-sm disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate Invite Link"}
          </button>
        </form>

        {inviteLink && (
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 space-y-2">
            <p className="text-sm font-semibold text-teal-800">Invite link ready</p>
            <p className="text-xs text-teal-700 break-all">{inviteLink}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(inviteLink)}
              className="text-xs font-medium text-teal-700 hover:underline"
            >
              Copy to clipboard
            </button>
          </div>
        )}

        <p className="text-xs text-slate-400 text-center">
          Invite links are valid for 7 days and can only be used once.
        </p>
      </div>
    </main>
  );
}

export default AdminInvitePage;
