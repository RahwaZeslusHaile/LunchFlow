import { useState, useEffect } from "react";

function CreateMenu() {
  const USE_API = false;

  const [error, setError] = useState("");
  const [input, setInput] = useState("");
// will delete later
  const fallbackCategories = [
    { category_id: 1, name: "Bakery" },
    { category_id: 2, name: "Chilled Meals" },
    { category_id: 3, name: "Drinks" },
    { category_id: 4, name: "Food Essentials" },
    { category_id: 5, name: "Non-Food Essentials" },
    { category_id: 6, name: "Snacks" }
  ];
// will delete later

  const fallbackDiets = [
    { diet_id: 1, name: "Vegetarian" },
    { diet_id: 2, name: "Non-Vegetarian" },
    { diet_id: 3, name: "Halal" },
    { diet_id: 4, name: "N/A" }
  ];

  const [categories, setCategories] = useState([]);
  const [diets, setDiets] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");

// will delete later
  const [list, setList] = useState([
    { id: 1, name: "ham", category_id: 6, diet_id: 2 },
    { id: 2, name: "bread", category_id: 1, diet_id: 1 }
  ]);

  // ✅ load categories + diets
  useEffect(() => {
    const loadData = async () => {
      if (!USE_API) {
        setCategories(fallbackCategories);
        setDiets(fallbackDiets);
        return;
      }

      try {
        const [catRes, dietRes] = await Promise.all([
          fetch("/api/menu/categories"),
          fetch("/api/menu/diets")
        ]);

        if (!catRes.ok || !dietRes.ok) throw new Error();

        const catData = await catRes.json();
        const dietData = await dietRes.json();

        setCategories(catData.length ? catData : fallbackCategories);
        setDiets(dietData.length ? dietData : fallbackDiets);

      } catch {
        setCategories(fallbackCategories);
        setDiets(fallbackDiets);
      }
    };

    loadData();
  }, []);

  const addItem = async () => {
    if (!input.trim()) {
      setError("Food name is required");
      return;
    }

    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }

    if (!selectedDiet) {
      setError("Please select a diet");
      return;
    }

    const payload = {
      name: input,
      category_id: Number(selectedCategory),
      diet_id: Number(selectedDiet)
    };

    if (!USE_API) {
      const tempItem = {
        id: Date.now(),
        ...payload
      };

      setList([...list, tempItem]);
      resetForm();
      return;
    }

    try {
      const res = await fetch("/api/menu/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setList([...list, {
        id: data.menu_item_id,
        ...payload
      }]);

    } catch (err) {
      const tempItem = {
        id: Date.now(),
        ...payload
      };

      setList([...list, tempItem]);
    }

    resetForm();
  };

  const resetForm = () => {
    setInput("");
    setSelectedCategory("");
    setSelectedDiet("");
    setError("");
  };

  const removeItem = async (id) => {
    if (!confirm("Are you sure?")) return;

    if (USE_API) {
      try {
        await fetch(`/api/menu/${id}`, { method: "DELETE" });
      } catch {}
    }

    setList(list.filter(item => item.id !== id));
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 space-y-4">

        <h2 className="text-xl font-bold text-center">Create Menu</h2>

        {/* input */}
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="Enter food..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />

        {/* category */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setError("");
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select category...</option>
          {categories.map(cat => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* diet */}
        <select
          value={selectedDiet}
          onChange={(e) => {
            setSelectedDiet(e.target.value);
            setError("");
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select diet...</option>
          {diets.map(d => (
            <option key={d.diet_id} value={d.diet_id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* button */}
        <button
          onClick={addItem}
          className="w-full bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition"
        >
          Add
        </button>

        {/* list */}
        <ul className="space-y-2">
          {list.map((item, i) => {
            const categoryName =
              categories.find(c => c.category_id === item.category_id)?.name;

            const dietName =
              diets.find(d => d.diet_id === item.diet_id)?.name;

            return (
              <li
                key={item.id}
                className="flex justify-between items-center border border-gray-300 rounded-lg px-3 py-2"
              >
                <span>
                  {i + 1} - {item.name} ({categoryName} - {dietName})
                </span>

                <button
                  onClick={() => removeItem(item.id)}
                  className="border border-red-400 text-red-500 px-2 rounded hover:bg-red-500 hover:text-white transition"
                >
                  X
                </button>
              </li>
            );
          })}
        </ul>

      </div>
    </main>
  );
}

export default CreateMenu;