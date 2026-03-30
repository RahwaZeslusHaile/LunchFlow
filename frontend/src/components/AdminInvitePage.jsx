import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  ShoppingCart,
  Users,
  Utensils,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Copy,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

import OrderManagement from "./OrderManagement";
import AttendanceSummary from "./AttendanceSummary";
import LeftoverManagement from "./LeftoverManagement";
import CreateMenu from "./CreateMenu";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { id: "InviteVolunteers", label: "Invite Volunteers", icon: <Bell size={20} /> },
  { id: "AttendanceSummary", label: "Attendance", icon: <Users size={20} /> },
  { id: "LeftoverManagement", label: "Leftover", icon: <Utensils size={20} /> },
  { id: "PlaceOrder", label: "Place Order", icon: <ShoppingCart size={20} /> },
  { id: "MenuManagement", label: "Menu Management", icon: <PlusCircle size={20} /> },
];

function AdminInvitePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/30">
              <Utensils size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              LunchFlow
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Menu
          </p>
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div
                    className={`${
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    } transition-colors`}
                  >
                    {item.icon}
                  </div>
                  {item.label}
                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="ml-auto text-indigo-400"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700 hover:shadow-sm group"
          >
            <div className="text-slate-400 group-hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </div>
            Log Out
          </button>
        </div>
      </aside>

      {}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header overlay */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:hidden z-40 relative">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
              <Utensils size={16} />
            </div>
            <span className="text-lg font-bold text-slate-800">LunchFlow</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition"
          >
            <Menu size={24} />
          </button>
        </header>

        {}
        <div className="flex-1 overflow-y-auto bg-slate-50 md:bg-[#f8fafc] p-6 md:p-10 relative">
          <div className="mx-auto max-w-6xl">
            {/* Header / Title */}
            <div className="mb-8 hidden md:block animate-in fade-in slide-in-from-top-4 duration-500">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {NAV_ITEMS.find((nav) => nav.id === activeTab)?.label ||
                  "Dashboard"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Manage your CYF Lunch operations efficiently.
              </p>
            </div>

            {}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "dashboard" && (
                <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <LayoutDashboard size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Welcome back, Admin
                    </h2>
                  </div>
                  <p className="text-slate-600 max-w-xl">
                    Here is your central hub for managing the LunchFlow
                    operations. Select any tool from the sidebar to review
                    orders, manage attendance, handle leftovers, or generate new
                    volunteer invites.
                  </p>
                </div>
              )}
              {activeTab === "PlaceOrder" && <OrderManagement />}
              {activeTab === "AttendanceSummary" && <AttendanceSummary />}
              {activeTab === "LeftoverManagement" && <LeftoverManagement />}
              {activeTab === "MenuManagement" && <CreateMenu />}

              {activeTab === "InviteVolunteers" && (
                <section className="rounded-[2rem] border border-slate-200/60 bg-white/90 backdrop-blur-xl overflow-hidden shadow-xl shadow-slate-200/50 p-8 max-w-2xl">
                  <div className="mb-8 flex items-center gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                      <Users size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        Generate Volunteer Invite
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Create a secure link to onboard new volunteers.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleInvite} className="space-y-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="inviteEmail"
                        className="text-sm font-semibold text-slate-700 ml-1"
                      >
                        Volunteer Email Address
                      </label>
                      <input
                        id="inviteEmail"
                        type="email"
                        value={email}
                        placeholder="volunteer@codeyourfuture.io"
                        onChange={handleEmailChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                      />
                    </div>
                    {error && (
                      <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2">
                        <X size={16} />
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-600 hover:shadow-indigo-500/25 disabled:opacity-60 disabled:hover:bg-slate-900"
                    >
                      {loading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                      ) : (
                        <>
                          Generate Fast Link
                          <ChevronRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </form>
                  {inviteLink && (
                    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl border border-emerald-200 bg-emerald-50 p-1 font-mono text-sm relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                      <div className="p-5 pl-7">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle2
                            size={24}
                            className="text-emerald-500"
                          />
                          <h3 className="font-semibold text-emerald-900 text-base font-sans">
                            Invite Link Ready
                          </h3>
                        </div>
                        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                          <p className="text-emerald-800 break-all mb-4 leading-relaxed">
                            {inviteLink}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              navigator.clipboard.writeText(inviteLink)
                            }
                            className="flex items-center gap-2 rounded-lg bg-emerald-100 px-4 py-2.5 font-sans font-semibold text-emerald-700 transition hover:bg-emerald-200 hover:text-emerald-800"
                          >
                            <Copy size={16} />
                            Copy to Clipboard
                          </button>
                        </div>
                        <p className="mt-4 font-sans text-xs font-medium text-emerald-700/80 flex items-center gap-1.5">
                          <Bell size={14} />
                          Valid for 7 days. Single use only.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      {}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminInvitePage;

