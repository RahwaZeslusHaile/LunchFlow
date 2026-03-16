import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function VolunteerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user || user.roleId !== 2) {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">🍱 Volunteer Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-800 underline"
          >
            Log out
          </button>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1">
              Volunteer
            </span>
          </div>
          <p className="text-sm text-slate-600">
            You are logged in as a volunteer. Use this dashboard to manage your
            lunch orders for CYF London classes.
          </p>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">My Orders</h2>
          <p className="text-sm text-slate-500">
            No orders yet. Lunch ordering will appear here once it is set up by
            an admin.
          </p>
        </div>

      </div>
    </main>
  );
}

export default VolunteerDashboard;
