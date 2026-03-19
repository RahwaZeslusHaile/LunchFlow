import { useState } from "react";

function AttendanceSummary() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [count, setCount] = useState("");
  const [volunteers, setVolunteers] = useState("");
  const [items, setItems] = useState([]);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const addItem = () => {
    setSuccess("");

    if (!category) {
      setError("Please select a category");
      return;
    }

    if (!count || Number(count) < 0) {
      setError("Enter a valid number (0 or more)");
      return;
    }

    const existingIndex = items.findIndex(
      (item) => item.category === category
    );

    if (existingIndex !== -1) {
      const confirmUpdate = window.confirm(
        `${category} already added. Do you want to update it?`
      );

      if (!confirmUpdate) return;

      const updatedItems = [...items];
      updatedItems[existingIndex].count = Number(count);

      setItems(updatedItems);
    } else {
      const newItem = {
        category,
        count: Number(count)
      };

      setItems([...items, newItem]);
    }

    setCount("");
    setCategory("");
    setError("");
  };
const handleSubmit = async () => {
  if (!date) {
    setError("Please select a date");
    setSuccess("");
    return;
  }

  const breakdown = {
    ITD: 0,
    ITP: 0,
    SDC: 0,
    LAUNCH: 0,
    PISCINE: 0
  };

  items.forEach(item => {
    breakdown[item.category] = item.count;
  });

  const itemsTotal = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const total = itemsTotal + (Number(volunteers) || 0);

  setReport({
    date,
    breakdown,
    volunteers: Number(volunteers) || 0,
    total
  });

  try {
    await fetch("http://localhost:4000/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ date, total })
    });

    setSuccess("Saved (or will work when backend is ready)");
    setError("");

  } catch (err) {
    console.log("Backend not ready yet ✔️");
    setSuccess("Saved locally (backend later)");
  }
};

  // preview
  const breakdownPreview = {
    ITD: 0,
    ITP: 0,
    SDC: 0,
    LAUNCH: 0,
    PISCINE: 0
  };

  items.forEach(item => {
    breakdownPreview[item.category] = item.count;
  });

  const previewTotal =
    Object.values(breakdownPreview).reduce((a, b) => a + b, 0) +
    (Number(volunteers) || 0);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 space-y-4">

        <h2 className="text-xl font-bold text-center">
          Attendance Summary
        </h2>

        {/* date */}
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSuccess("");
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />

        {/* dropdown + input + add */}
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setError("");
              setSuccess("");
            }}
            className="border border-gray-300 rounded-lg px-2 py-2"
          >
            <option value="" disabled>Select</option>
            <option value="ITD">ITD</option>
            <option value="ITP">ITP</option>
            <option value="PISCINE">PISCINE</option>
            <option value="SDC">SDC</option>
            <option value="LAUNCH">LAUNCH</option>
          </select>

          <input
            type="number"
            min="0"
            value={count}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || Number(val) >= 0) {
                setCount(val);
                setError("");
                setSuccess("");
              }
            }}
            placeholder="Number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <button
            onClick={addItem}
            className="bg-blue-500 text-white px-3 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* volunteers */}
        <input
          type="number"
          min="0"
          value={volunteers}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || Number(val) >= 0) {
              setVolunteers(val);
              setError("");
              setSuccess("");
            }
          }}
          placeholder="Volunteers"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white rounded-lg py-2"
        >
          Submit
        </button>

        {/* success message */}
        {success && (
          <p className="text-green-600 text-sm text-center">
            {success}
          </p>
        )}

        {/* report */}
        <div className="bg-gray-100 p-3 rounded-lg text-center text-sm space-y-1">

          <div>
            ITD {(report?.breakdown || breakdownPreview).ITD} | 
            ITP {(report?.breakdown || breakdownPreview).ITP} | 
            PISCINE {(report?.breakdown || breakdownPreview).PISCINE} | 
            SDC {(report?.breakdown || breakdownPreview).SDC} | 
            LAUNCH {(report?.breakdown || breakdownPreview).LAUNCH} | 
            VOL {(report?.volunteers ?? (Number(volunteers) || 0))}
          </div>

          <div>
            Total <span className="font-bold">
              {report ? report.total : previewTotal}
            </span>{" "}
            people{" "}
            {(report?.date || date) && (
              <>on <span className="font-bold">{report?.date || date}</span></>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}

export default AttendanceSummary;