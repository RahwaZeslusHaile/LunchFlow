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
import StatusCard from "./StatusCard";
import CreateEvent from "./CreateEvent";
import OrderHistory from "./OrderHistory";




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
  const [selectedForms, setSelectedForms] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [invitesHistory, setInvitesHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [adminOrderId, setAdminOrderId] = useState(null);
  const [activeEventDate, setActiveEventDate] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.roleId !== 1) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "InviteVolunteers") {
      const token = localStorage.getItem("token");
      fetch("/api/order", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]));
    }
  }, [activeTab]);

  const handleEventCreated = (order_id, date) => {
    setAdminOrderId(order_id);
    setActiveEventDate(date);
    setSelectedOrderId(String(order_id)); 
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchInvites = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/invite/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInvitesHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "InviteVolunteers") {
      fetchInvites();
    }
  }, [activeTab]);


  const handleInvite = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (selectedForms.length === 0) {
      setError("Select at least one form to assign");
      return;
    }
    if (!selectedOrderId) {
      setError("Select an event (order) to assign");
      return;
    }

    setError("");
    setInviteLink("");
    setShowSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, forms: selectedForms, order_id: selectedOrderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(typeof data === "string" ? data : data.message);
        return;
      }

      setInviteLink("");
      setEmail("");
      setSelectedForms([]);
      setSelectedOrderId("");
      setShowSuccess(true);
      fetchInvites();
    } catch (err) {
      console.error(err);
      setError("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (showSuccess) setShowSuccess(false);
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
                  } ${item.id === "MenuManagement" ? "mt-7" : ""}`}
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
                Manage the CYF menu by adding or removing menu items.
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
                  <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2"> </h3>
                     
                    
                     {/* Add Event */}
                      <CreateEvent onEventCreated={handleEventCreated} />
                    <StatusCard eventId={adminOrderId} date={activeEventDate} />
                      

                      {/* Event List */}
                      <OrderHistory refreshKey={refreshKey} />
                 

                </div>
                </div>
              )}
              {/* ── Active event banner — shown on all form tabs ── */}
              {(activeTab === "AttendanceSummary" || activeTab === "LeftoverManagement" || activeTab === "PlaceOrder") && (
                <div className={`mb-4 flex items-center gap-3 rounded-2xl border px-5 py-3 ${
                  adminOrderId
                    ? "border-emerald-100 bg-emerald-50/60"
                    : "border-amber-100 bg-amber-50/60"
                }`}>
                  {adminOrderId ? (
                    <>
                      <span className="text-sm font-semibold text-emerald-700">Active event:</span>
                      <span className="text-sm text-emerald-800 font-mono">
                        {activeEventDate || `ID ${adminOrderId}`}
                      </span>
                      <span className="ml-auto text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
                        order #{adminOrderId}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-medium text-amber-700">
                      ⚠️ No active event — go to Dashboard and create an event first.
                    </span>
                  )}
                </div>
              )}

              {/* ── Place Order ── */}
              {activeTab === "PlaceOrder" && <OrderManagement />}

              {/* ── Attendance & Leftover: auto-use the active order_id ── */}
              {(activeTab === "AttendanceSummary" || activeTab === "LeftoverManagement") && (
                adminOrderId ? (
                  <>
                    {activeTab === "AttendanceSummary" && <AttendanceSummary order_id={adminOrderId} />}
                    {activeTab === "LeftoverManagement" && <LeftoverManagement order_id={adminOrderId} />}
                  </>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">
                    <p className="text-sm font-medium">Create an event on the Dashboard tab first.</p>
                  </div>
                )
              )}

              {activeTab === "MenuManagement" && <CreateMenu />}

              {activeTab === "InviteVolunteers" && (
                <div className="space-y-8">
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

                      {/* Active event — auto-set when admin creates event on Dashboard */}
                      {selectedOrderId ? (
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 mb-2">
                          <span className="text-sm font-semibold text-emerald-700">Event:</span>
                          <span className="text-sm text-emerald-800 font-mono">{activeEventDate || `Order #${selectedOrderId}`}</span>
                          <span className="ml-auto text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">order #{selectedOrderId}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 mb-2">
                          <span className="text-sm font-medium text-amber-700">
                            ⚠️ No active event — create an event on the Dashboard first.
                          </span>
                        </div>
                      )}

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

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">
                        Assign Forms
                      </label>
                      <div className="flex gap-4 flex-wrap">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedForms.includes("attendance")}
                            onChange={e => setSelectedForms(f => e.target.checked ? [...f, "attendance"] : f.filter(x => x !== "attendance"))}
                          /> Attendance
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedForms.includes("leftover")}
                            onChange={e => setSelectedForms(f => e.target.checked ? [...f, "leftover"] : f.filter(x => x !== "leftover"))}
                          /> Leftover Management
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedForms.includes("order")}
                            onChange={e => setSelectedForms(f => e.target.checked ? [...f, "order"] : f.filter(x => x !== "order"))}
                          /> Order Management
                        </label>
                      </div>
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
                          Send Invite
                          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>
                  {}
                  {showSuccess && !loading && !error && (
                    <div className="mt-8 text-green-700 font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <CheckCircle2 size={20} />
                      Invitation sent successfully!
                    </div>
                  )}
                </section>

                <section className="rounded-[2rem] border border-slate-200/60 bg-white/90 backdrop-blur-xl overflow-hidden shadow-xl shadow-slate-200/50 p-8 max-w-4xl">
                  <div className="mb-6 flex items-center gap-4">
                     <h2 className="text-xl font-bold text-slate-800">Invite History</h2>
                  </div>
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left text-sm text-slate-600 relative">
                      <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-4 py-3 font-medium bg-slate-50">Email</th>
                          <th className="px-4 py-3 font-medium bg-slate-50">Assigned Forms</th>
                          <th className="px-4 py-3 font-medium bg-slate-50">Status</th>
                          <th className="px-4 py-3 font-medium bg-slate-50">Expires At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loadingHistory ? (
                          <tr><td colSpan="4" className="text-center py-6 text-slate-400">Loading...</td></tr>
                        ) : invitesHistory.length === 0 ? (
                          <tr><td colSpan="4" className="text-center py-6 text-slate-400">No invites found.</td></tr>
                        ) : invitesHistory.map(invite => {
                          const isExpired = new Date(invite.expires_at) < new Date();
                          let statusLabel = invite.used ? "Active" : isExpired ? "Expired" : "Pending";
                          let statusColor = invite.used ? "bg-green-100 text-green-800" : isExpired ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";

                          return (
                          <tr key={invite.invite_id} className="hover:bg-slate-50/50 transition">
                            <td className="px-4 py-3 font-medium text-slate-700">{invite.email}</td>
                            <td className="px-4 py-3">
                               <div className="flex gap-1 flex-wrap">
                                 {(invite.forms || []).map(f => (
                                   <span key={f} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">{f}</span>
                                 ))}
                                 {(!invite.forms || invite.forms.length === 0) && <span className="text-slate-400 text-xs">None</span>}
                               </div>
                            </td>
                            <td className="px-4 py-3">
                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
                                 {statusLabel}
                               </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                              {new Date(invite.expires_at).toLocaleDateString()}
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                </section>
                </div>
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

