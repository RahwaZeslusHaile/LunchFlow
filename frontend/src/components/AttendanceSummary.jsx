import { useState, useEffect } from "react";

function AttendanceSummary() {
  const [category, setCategory] = useState("");
  const [count, setCount] = useState("");
  const [volunteers, setVolunteers] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [classes, setClasses] = useState([]);
  const [isHalal, setIsHalal] = useState(false);
  const [halalCount, setHalalCount] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        const data = await res.json();
        setClasses(data.length ? data : []);
      } catch {
        setClasses([]);
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
      halal: isHalal ? Number(halalCount) : 0,
      volunteers: Number(volunteers) || 0,
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

    if (items.length === 0) {
      setError("No data to submit");
      return;
    }
    try {
      for (let item of items) {
        const classObj = classes.find(c => c.name === item.category);
        if (!classObj) continue;

    await fetch("api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
            class_id: classObj.class_id,
            trainee_count: item.count,
            volunteer_count: item.volunteers || 0
          })
    });
      }

      setSuccess("All data submitted successfully ");
    setError("");

      
      setItems([]);
      setVolunteers("");

    } catch (err) {
      setError("Error submitting data ");
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
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            Submit
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