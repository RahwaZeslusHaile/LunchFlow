import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Utensils,
  ChevronRight,
  Inbox,
} from "lucide-react";

import AttendanceSummary from "./AttendanceSummary";
import LeftoverManagement from "./LeftoverManagement";
import OrderManagement from "./OrderManagement";

const FORM_CONFIG = {
  attendance: {
    id: "attendance",
    label: "Attendance",
    icon: <ClipboardList size={20} />,
    component: AttendanceSummary,
  },
  leftover: {
    id: "leftover",
    label: "Leftover Management",
    icon: <Package size={20} />,
    component: LeftoverManagement,
  },
  order: {
    id: "order",
    label: "Order Management",
    icon: <ShoppingCart size={20} />,
    component: OrderManagement,
  },
};

function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [assignedForms, setAssignedForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user || user.roleId !== 2) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    fetch("/api/auth/me/forms", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setAssignedForms(data.forms || []);
        setLoading(false);
      })
      .catch(() => {
        try {
          const stored = JSON.parse(localStorage.getItem("forms") || "[]");
          setAssignedForms(stored);
        } catch {
          setAssignedForms([]);
        }
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("forms");
    navigate("/login");
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    ...assignedForms
      .map((f) => FORM_CONFIG[f])
      .filter(Boolean),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
          <p className="text-sm text-slate-500 font-medium">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  const ActiveComponent =
    activeTab !== "dashboard" && FORM_CONFIG[activeTab]?.component;

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
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

        {}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            My Forms
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
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
                      ? "bg-emerald-50 text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div
                    className={`${
                      isActive
                        ? "text-emerald-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    } transition-colors`}
                  >
                    {item.icon}
                  </div>
                  {item.label}
                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="ml-auto text-emerald-400"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {assignedForms.length === 0 && (
            <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-4 text-center">
              <Inbox size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 font-medium">
                No forms assigned yet
              </p>
            </div>
          )}
        </div>

        {}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-slate-400 font-medium truncate">
              {user?.email}
            </p>
          </div>
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
        {}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:hidden z-40 relative">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md">
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
            {}
            <div className="mb-8 hidden md:block">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {navItems.find((nav) => nav.id === activeTab)?.label ||
                  "Dashboard"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Welcome to your volunteer portal. Fill out and submit your
                assigned forms.
              </p>
            </div>

            {}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <LayoutDashboard size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        Welcome back! 👋
                      </h2>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 max-w-xl">
                    You have been assigned{" "}
                    <strong className="text-emerald-700">
                      {assignedForms.length} form
                      {assignedForms.length !== 1 ? "s" : ""}
                    </strong>{" "}
                    to fill out. Use the sidebar to navigate to each form,
                    complete the required information, and submit.
                  </p>
                </div>

                {}
                {assignedForms.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {assignedForms.map((f) => {
                      const config = FORM_CONFIG[f];
                      if (!config) return null;
                      return (
                        <button
                          key={config.id}
                          onClick={() => setActiveTab(config.id)}
                          className="group flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-6 text-left shadow-sm transition-all hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                            {config.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {config.label}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Click to open →
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {assignedForms.length === 0 && (
                  <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-12 shadow-sm text-center">
                    <Inbox
                      size={48}
                      className="mx-auto text-slate-200 mb-4"
                    />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      No Forms Assigned
                    </h3>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">
                      It looks like no forms have been assigned to your account
                      yet. Please contact your admin if you believe this is an
                      error.
                    </p>
                  </div>
                )}
              </div>
            )}

            {}
            {ActiveComponent && (
              <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-sm">
                <ActiveComponent />
              </div>
            )}
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

export default VolunteerDashboard;
