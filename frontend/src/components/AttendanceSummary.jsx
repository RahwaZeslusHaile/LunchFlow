import { useState, useEffect } from "react";

function AttendanceSummary() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [count, setCount] = useState("");
  const [volunteers, setVolunteers] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [classes, setClasses] = useState([]);
  const [isHalal, setIsHalal] = useState(false);
  const [halalCount, setHalalCount] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes", {
          headers: getAuthHeaders()
        });

        if (!res.ok) {
          throw new Error("Failed to load classes");
        }

        const data = await res.json();
        setClasses(data.length ? data : []);
      } catch {
        setClasses([
          { class_id: 1, name: "ITD" },
          { class_id: 2, name: "ITP" },
          { class_id: 3, name: "PISCINE" },
          { class_id: 4, name: "SDC" },
          { class_id: 5, name: "LAUNCH" }
        ]);
      }
    };
    fetchClasses();
  }, []);

  const addItem = () => {
    if (!category) return setError("Select class");
    if (!count || Number(count) < 0) return setError("Enter valid number");

    if (isHalal && Number(halalCount) > Number(count)) {
      return setError("Halal count cannot be greater than total number");
    }

    const newItem = {
      category,
      count: Number(count),
      halal: isHalal ? Number(halalCount) : 0
    };

    const existing = items.findIndex(i => i.category === category);

    if (existing !== -1) {
      const updated = [...items];
      updated[existing] = newItem;
      setItems(updated);
    } else {
      setItems([...items, newItem]);
    }

    setCategory("");
    setCount("");
    setHalalCount("");
    setIsHalal(false);
    setError("");
    setSuccess("Added ");
  };

  const handleSubmit = async () => {
    if (!date) {
      setError("Please select a date");
      return;
    }

    if (items.length === 0) {
      setError("No data to submit");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      for (let item of items) {
        const classObj = classes.find(c => c.name === item.category);
        if (!classObj) continue;

        const response = await fetch("/api/attendance", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            session_date: date,
            class_id: classObj.class_id,
            trainee_count: item.count,
            volunteer_count: Number(volunteers) || 0,
            halal_count: item.halal
          })
        });

        if (!response.ok) {
          throw new Error("Failed to submit attendance");
        }
      }

      setSuccess("All data submitted successfully ");
      setError("");

      setItems([]);
      setVolunteers("");
      setCategory("");
      setCount("");
      setIsHalal(false);
      setHalalCount("");

    } catch (err) {
      setError("Error submitting attendance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewTotal =
    items.reduce((sum, i) => sum + i.count, 0) +
    (Number(volunteers) || 0);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-5">

        <h2 className="text-lg font-bold text-center">
          Attendance Summary
        </h2>

        {}
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);

            setItems([]);
            setVolunteers("");
            setSuccess("");
            setError("");
          }} 
         className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />

        {}
        <div className="space-y-4">

          {}
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="text-sm text-gray-600">Class</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-2 border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="" disabled>Select</option>
              {classes.map(c => (
                <option key={c.class_id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {}
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="text-sm text-gray-600">Number</label>
            <input
              type="number"
              min="0"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="col-span-2 border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {}
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="text-sm text-gray-600">Halal</label>

            <div className="flex items-center gap-2 col-span-2">
              <input
                type="checkbox"
                checked={isHalal}
                onChange={(e) => {
                  setIsHalal(e.target.checked);
                  setHalalCount("");
                }}
              />

              <input
                type="number"
                min="0"
                value={halalCount}
                disabled={!isHalal}
                onChange={(e) => setHalalCount(e.target.value)}
                placeholder="Number"
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                  !isHalal && "bg-gray-100 text-gray-400"
                }`}
              />
            </div>
          </div>

          {}
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="text-sm text-gray-600">Volunteers</label>
            <input
              type="number"
              min="0"
              value={volunteers}
              onChange={(e) => setVolunteers(e.target.value)}
              className="col-span-2 border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {}
          <button
            onClick={addItem}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            Add
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        {}
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <div>
            {classes.map((c) => {
              const item = items.find(x => x.category === c.name);

              return (
                <span key={c.class_id}>
                  {c.name} {item ? item.count : 0} |{" "}
                </span>
              );
            })}
            VOL {Number(volunteers) || 0}
          </div>

          <div className="text-center font-bold mt-2">
            Total: {previewTotal}
          </div>
        </div>

      </div>
    </main>
  );
}

export default AttendanceSummary;