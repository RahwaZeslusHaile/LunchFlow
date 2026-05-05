import { useState } from "react";

const getNextSaturday = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = (6 - day + 7) % 7 || 7;
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + diff);
  return nextSaturday.toISOString().split("T")[0];
};


function CreateEvent({ onEventCreated }) {
  const [date] = useState(getNextSaturday());
  const [status, setStatus] = useState(null); 

  const handleCreate = async () => {
    if (!date) return alert("Please select a date");

    const eventPayload = {
      order_date: date,
      attendance: 0,
      assigned_admin: 1,
    };

    try {
      const res = await fetch("/api/order/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload),
      });

      if (!res.ok) throw new Error("Failed to create event");

      const responseData = await res.json();
      const order_id = responseData.order_id;

      setStatus("success");

      if (onEventCreated) {
        onEventCreated(order_id, date);
      }

    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="mt-6 max-w-md mx-auto rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-indigo-100/80 shadow-lg p-5 flex flex-col items-center">
      <div className="flex flex-col items-center mb-4">
        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow mb-2">
          {/* Calendar icon */}
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="5" width="18" height="16" rx="3" fill="#6366F1"/>
            <rect x="7" y="9" width="10" height="2" rx="1" fill="#fff"/>
            <rect x="7" y="13" width="6" height="2" rx="1" fill="#fff"/>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 text-center mb-0.5">Create New Event</h3>
        <p className="text-slate-500 text-center text-sm max-w-xs">Set up the next Saturday session and prepare for lunch orders.</p>
      </div>
      <div className="w-full bg-white/90 rounded-xl border border-indigo-100 p-3 mb-3 flex flex-col items-center">
        <span className="text-slate-700 font-semibold text-base mb-0.5">Next Event Date</span>
        <span className="text-indigo-700 text-lg font-bold tracking-wide mb-1">
          {(() => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
          })()}
        </span>
      </div>
      <button
        onClick={handleCreate}
        className="w-full rounded-xl bg-indigo-600 text-white py-2.5 font-semibold text-base shadow hover:bg-indigo-700 active:scale-[0.98] transition mb-1"
      >
        Create Event
      </button>
      {status === "success" && (
        <p className="mt-2 text-sm text-green-600 font-medium text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          ✅ Event created! All forms are now linked to this date and time.
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-500 font-medium text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          ❌ Failed to create event. Please try again.
        </p>
      )}
    </div>
  );
}

export default CreateEvent;