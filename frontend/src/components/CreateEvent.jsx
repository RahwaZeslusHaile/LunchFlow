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
  const [status, setStatus] = useState(null); // null | "success" | "error"

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
    <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm max-w-md">
 
      <p className="mb-4 text-slate-700 font-medium text-center">
        Next Event Date: {date}
      </p>

      <button
        onClick={handleCreate}
        className="w-full rounded-xl bg-slate-900 text-white py-3 font-semibold hover:bg-indigo-600 transition"
      >
        Create Event
      </button>

      {status === "success" && (
        <p className="mt-3 text-sm text-green-600 font-medium text-center">
          ✅ Event created! All forms are now linked to this date.
        </p>
      )}

      {status === "error" && (
        <p className="mt-3 text-sm text-red-500 font-medium text-center">
          ❌ Failed to create event. Please try again.
        </p>
      )}
    </div>
  );
}

export default CreateEvent;