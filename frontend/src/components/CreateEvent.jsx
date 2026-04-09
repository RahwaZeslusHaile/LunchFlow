import { useState } from "react";

function CreateEvent() {
  const [date, setDate] = useState("");
  const handleCreate = async() => {
    if (!date) return alert("Please select a date");
    console.log("Event created for:", date);
    const eventPayload = {
      order_date: date,
      attendance:0,
      assigned_admin:1

      
    };
    try {
      const res = await fetch("/api/order/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventPayload)
      });

      if (!res.ok) throw new Error("Failed to create event");

      const responseData = await res.json();
      console.log("Response:", responseData);

      const resStepEvent = await fetch(`/api/eventStep/${responseData.order_id}`);
            if (!resStepEvent.ok) {
        const text = await resStepEvent.text();
        throw new Error(`Failed to fetch steps: ${text}`);
      }
      const dataStepEvent = await resStepEvent.json();


      console.log(dataStepEvent);
      

    } catch (err) {
      console.error(err);
    }

  }//end of CreateEvent
 
  return (
    <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm max-w-md">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Create Event
      </h3>

      <p className="text-slate-600 mb-4">
        Select a date to create a new event
      </p>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full mb-4 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={handleCreate}
        className="w-full rounded-xl bg-slate-900 text-white py-3 font-semibold hover:bg-indigo-600 transition"
      >
        Create Event
      </button>
    </div>
  );
}

export default CreateEvent;