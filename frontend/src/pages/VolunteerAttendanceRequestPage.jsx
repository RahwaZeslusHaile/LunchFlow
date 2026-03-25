import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AttendanceSummary from "../components/AttendanceSummary";

function VolunteerAttendanceRequestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const secureToken = useMemo(
    () => searchParams.get("token") || searchParams.get("requestId"),
    [searchParams]
  );
  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.roleId !== 2) {
      const nextPath = secureToken
        ? `/volunteer/attendance?token=${encodeURIComponent(secureToken)}`
        : "/volunteer/attendance";
      navigate(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    if (!secureToken) {
      setError("Missing secure token. Please open the link from your email.");
      setLoading(false);
      return;
    }

    const loadRequest = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/attendance-requests/${encodeURIComponent(secureToken)}`, {
          method: "GET",
          headers: getAuthHeaders()
        });

        const raw = await response.text();
        let data = null;

        try {
          data = raw ? JSON.parse(raw) : null;
        } catch {
          data = null;
        }

        if (!response.ok) {
          const message =
            typeof data === "string"
              ? data
              : data?.message || raw || "Could not load attendance request.";
          throw new Error(message);
        }

        setRequestData(data);

        await fetch(`/api/attendance-requests/${encodeURIComponent(secureToken)}/opened`, {
          method: "PATCH",
          headers: getAuthHeaders()
        });
      } catch (err) {
        setError(err.message || "Could not load attendance request.");
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [navigate, secureToken]);

  const handleSubmitSuccess = () => {
    setSuccess("Attendance submitted successfully. Thank you.");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <p className="text-slate-600">Loading attendance request...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h1 className="text-xl font-semibold text-slate-800">Volunteer Attendance Request</h1>
          {requestData?.email && (
            <p className="text-sm text-slate-500 mt-1">Request for: {requestData.email}</p>
          )}
          {requestData?.session_date && (
            <p className="text-sm text-slate-500">Session date: {requestData.session_date}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
            {success}
          </div>
        )}

        {!error && (
          <AttendanceSummary
            initialDate={requestData?.session_date || ""}
            lockDate={Boolean(requestData?.session_date)}
            requestId={secureToken}
            onSubmissionSuccess={handleSubmitSuccess}
          />
        )}

        <div className="text-center">
          <Link to="/volunteer" className="text-sm text-teal-700 hover:underline">
            Back to volunteer dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

export default VolunteerAttendanceRequestPage;
