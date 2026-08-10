import { useState, useEffect } from "react";
import getApiUrl from "../api";

function AttendanceSummary({ order_id }) {
  const [category, setCategory] = useState("");
  const [count, setCount] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [volunteersInput, setVolunteersInput] = useState("");
  const [classes, setClasses] = useState([]);
  const [isHalal, setIsHalal] = useState(false);
  const [halalCount, setHalalCount] = useState("");
  const [isVeg, setIsVeg] = useState(false);
  const [vegCount, setVegCount] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(getApiUrl("/classes"));
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

    if (isVeg && Number(vegCount) > Number(count)) {
      return setError("Vegetarian count cannot be greater than total number");
    }

    const newItem = {
      category,
      count: Number(count),
      halal: isHalal ? Number(halalCount) : 0,
      veg: isVeg ? Number(vegCount) : 0,
      volunteers: Number(volunteersInput) || 0,
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
    setVegCount("");
    setIsVeg(false);
    setError("");
    setSuccess("Added ");
    setVolunteersInput("");
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

        await fetch(getApiUrl("/attendance"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token") && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
          body: JSON.stringify({
            class_id: classObj.class_id,
            trainee_count: item.count,
            volunteer_count: item.volunteers,
            halal_count: item.halal,
            veg_count: item.veg,
            order_id
          }),
        });
      }

      setSuccess("All data submitted successfully ");
      setError("");
      setItems([]);
      setVolunteersInput("");

    } catch (err) {
      setError("Error submitting data ");
    }
  };

  const previewTotal =
    items.reduce((sum, i) => sum + i.count + (i.volunteers || 0), 0);

  const volunteerTotal = items.reduce((sum, i) => sum + (i.volunteers || 0), 0);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-10 space-y-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-3 tracking-tight">Attendance Summary</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-3 items-center gap-5">
            <label className="text-lg text-gray-600">Class</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-2 border border-gray-300 rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="" disabled>Select</option>
              {classes.map((c) => (
                <option key={c.class_id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 items-center gap-5">
            <label className="text-lg text-gray-600">Trainees Count</label>
            <input
              type="number"
              min="0"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="col-span-2 border border-gray-300 rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          {/* Halal Input */}
          <div className="grid grid-cols-3 items-center gap-5">
            <label className="text-lg text-gray-600">Halal</label>
            <div className="flex items-center gap-3 col-span-2">
              <input
                type="checkbox"
                checked={isHalal}
                onChange={(e) => {
                  setIsHalal(e.target.checked);
                  setHalalCount("");
                }}
                className="w-5 h-5"
              />
              <input
                type="number"
                min="0"
                value={halalCount}
                disabled={!isHalal}
                onChange={(e) => setHalalCount(e.target.value)}
                placeholder="Number"
                className={`w-full border border-gray-300 rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${!isHalal && "bg-gray-100 text-gray-400"}`}
              />
            </div>
          </div>

          {/* Vegetarian Input */}
          <div className="grid grid-cols-3 items-center gap-5">
            <label className="text-lg text-gray-600">Vegetarian</label>
            <div className="flex items-center gap-3 col-span-2">
              <input
                type="checkbox"
                checked={isVeg}
                onChange={(e) => {
                  setIsVeg(e.target.checked);
                  setVegCount("");
                }}
                className="w-5 h-5"
              />
              <input
                type="number"
                min="0"
                value={vegCount}
                disabled={!isVeg}
                onChange={(e) => setVegCount(e.target.value)}
                placeholder="Number"
                className={`w-full border border-gray-300 rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${!isVeg && "bg-gray-100 text-gray-400"}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-5">
            <label className="text-lg text-gray-600">Volunteers Count</label>
            <input
              type="number"
              min="0"
              value={volunteersInput}
              onChange={(e) => setVolunteersInput(e.target.value)}
              className="col-span-2 border border-gray-300 rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          <button
            onClick={addItem}
            className="w-full bg-blue-600 text-white rounded-2xl py-3 text-lg font-bold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            Add
          </button>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white rounded-2xl py-3 text-lg font-bold shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            Submit
          </button>
        </div>

        {error && <p className="text-red-500 text-lg font-medium text-center">{error}</p>}
        {success && <p className="text-green-600 text-lg font-medium text-center">{success}</p>}

        <div className="bg-gray-50 p-5 rounded-2xl text-lg mt-6">
          <div className="flex flex-wrap gap-5">
            {classes.map((c) => {
              const item = items.find((x) => x.category === c.name);
              const traineeCount = item ? item.count : 0;
              const volunteerCount = item ? item.volunteers : 0;
              return (
                <span key={c.class_id} className="font-bold">
                  {c.name}: T={traineeCount}, V={volunteerCount}
                </span>
              );
            })}
          </div>
          <div className="text-center font-bold mt-5">
            Total Volunteers: {volunteerTotal}
          </div>
          <div className="text-center font-bold mt-2">
            Total Attendees: {previewTotal}
          </div>
          <div className="text-lg text-gray-500 text-center mt-5">
            <span className="mr-6">T = Trainees</span>
            <span>V = Volunteers</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AttendanceSummary;