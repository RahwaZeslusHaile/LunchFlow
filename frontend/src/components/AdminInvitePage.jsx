import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminInvitePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f4f1ea] to-[#e5e7eb] p-3 md:p-6">
      <div
        className="mx-auto w-full max-w-2xl min-h-[85vh] rounded-[2rem] bg-[#f9fafb] p-5 md:p-6 shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
        style={{ fontFamily: "Outfit, Manrope, system-ui, sans-serif" }}
      >
        <header className="rounded-3xl bg-white p-3 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-700">
            <span className="rounded-xl bg-slate-900 px-3 py-2 text-white">LunchFlow</span>

            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`rounded-xl px-3 py-2 transition ${
                activeTab === "dashboard"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`rounded-xl px-3 py-2 transition ${
                activeTab === "notifications"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              Notifications
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </header>

        {activeTab === "notifications" && (
          <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Generate Invite Link</h2>

            <form onSubmit={handleInvite} className="mt-4 space-y-4">
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
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 text-white font-semibold py-3.5 hover:bg-slate-800 transition shadow-sm disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate Invite Link"}
              </button>
            </form>

            {inviteLink && (
              <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-5 space-y-3">
                <p className="text-base font-semibold text-teal-900">Invite link ready</p>
                <p className="text-sm text-teal-800 break-all">{inviteLink}</p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(inviteLink)}
                  className="inline-flex rounded-xl bg-white px-3 py-2 text-sm font-medium text-teal-800 hover:bg-teal-100"
                >
                  Copy link
                </button>
              </div>
            )}

            <p className="mt-4 text-xs text-slate-400">
              Invite links are valid for 7 days and can only be used once.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

export default AdminInvitePage;
