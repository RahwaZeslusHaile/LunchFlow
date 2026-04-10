import { useEffect, useState } from "react";
import AttendanceSummary from "../components/AttendanceSummary";
import LeftoverManagement from "../components/LeftoverManagement";
import OrderManagement from "../components/OrderManagement";

function VolunteerRequestPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setError("Invalid or missing invite token.");
      setLoading(false);
      return;
    }
    fetch(`/api/auth/invite/validate/${token}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setForms(data.forms || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Invalid or expired invite link.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="space-y-8 p-4 max-w-3xl mx-auto">
      {forms.includes("attendance") && <AttendanceSummary />}
      {forms.includes("leftover") && <LeftoverManagement />}
      {forms.includes("order") && <OrderManagement />}
      {forms.length === 0 && (
        <div className="text-center text-gray-500">No forms assigned to this invite.</div>
      )}
    </div>
  );
}

export default VolunteerRequestPage;
