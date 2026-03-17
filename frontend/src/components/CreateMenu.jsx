import { useState } from "react";

function CreateMenu() {
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [diet, setDiet] = useState("");
  const [list, setList] = useState([
    { id: 1, name: "ham", diet: "VEG" },
    { id: 2, name: "bread", diet: "VEG" }
  ]);

  const addItem = (selectedDiet) => {
    if (!input.trim()) { setError("Food name is required"); return; }
    if (!selectedDiet.trim()) { setError("Please select a diet"); return; }

    const lastId = list.length > 0
      ? list[list.length - 1].id
      : 0;

    const newId = lastId + 1;

    setList([
      ...list,
      { id: newId, name: input, diet: selectedDiet }
    ]);

    setInput("");
    setDiet("");  
  };

  const removeItem = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setList(list.filter(item => item.id !== id));
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 space-y-4">

        <h2 className="text-xl font-bold text-center">Create Menu</h2>

        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="Enter food..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />

        <label htmlFor="diet" className="text-sm font-medium">
          Choose:
        </label>

        <select
          id="diet"
          name="diet"
          value={diet}
          onChange={(e) => {
            setDiet(e.target.value);
            setError("");
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="" disabled>Select option...</option>
          <option value="VEG">VEG</option>
          <option value="HALAL">HALAL</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={() => addItem(diet)}
          className="w-full bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition"
        >
          Add
        </button>

        <ul className="space-y-2">
          {list.map((item, i) => (
            <li
              key={item.id}
              className="flex justify-between items-center border border-gray-300 rounded-lg px-3 py-2"
            >
              <span>
                {i + 1} - {item.name} ({item.diet})
              </span>

              <button
                onClick={() => removeItem(item.id)}
                className="border border-red-400 text-red-500 px-2 rounded hover:bg-red-500 hover:text-white transition"
              >
                X
              </button>
            </li>
          ))}
        </ul>

      </div>
    </main>
  );
}

export default CreateMenu;