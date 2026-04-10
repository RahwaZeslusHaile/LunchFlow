import { useState, useEffect } from "react";

function CreateMenu() {


  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  


  const [categories, setCategories] = useState([]);
  const [diets, setDiets] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");


  // load categories + diets
  useEffect(() => {
    const loadData = async () => {
   

      try {
        const [catRes, dietRes, menuRes] = await Promise.all([
          fetch("/api/menu/categories"),
          fetch("/api/menu/dietary-restrictions"),
          fetch("/api/menu/menu-items"),
        ]);

        if (!catRes.ok) {
          throw new Error("Failed to fetch categories");
        }

        if (!dietRes.ok) {
          throw new Error("Failed to fetch diets");
        }

        if (!menuRes.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const catData = await catRes.json();
        const dietData = await dietRes.json();
        const menuData = await menuRes.json();



        setCategories(catData);
        setDiets(dietData);
        setMenuItems(menuData);

      } catch {
          setError("Failed to load data");
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
      name: input.trim(),
      category_id: Number(selectedCategory),
      diet_id: Number(selectedDiet)
    };

 
    try {
      const res = await fetch("http://localhost:4000/api/menu/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const newItem = await res.json();

      const categoryName = categories.find(c => c.category_id === newItem.category_id)?.name;
      const dietName = diets.find(d => d.diet_id === newItem.diet_id)?.name;

      setMenuItems((prev) => {
        const index = prev.findIndex(
          (item) =>
            item.name === newItem.name &&
            item.category === categoryName &&
            item.diet === dietName
        );

        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            quantity: newItem.quantity
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              menu_item_id: newItem.menu_item_id,
              name: newItem.name,
              category: categoryName,
              diet: dietName,
              quantity: newItem.quantity

            }
          ];

        }

      })

      resetForm();

    } catch (err) {
      setError("Failed to add item");

    }

 
  };

  const resetForm = () => {
    setInput("");
    setSelectedCategory("");
    setSelectedDiet("");
    setError("");
  };

  const removeItem = async (id) => {
    if (!confirm("Are you sure?")) return;

    
      try {
        const res = await fetch(`http://localhost:4000/api/menu/menu-items/${id}`, { method: "DELETE" });

        if (!res.ok) throw new Error();

        setMenuItems((prev) => prev.filter((item) => item.menu_item_id !== id));

      } catch {
        setError("Failed to delete item");
      }
      
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-2 tracking-tight">Create Menu Items</h2>

        {/* input */}
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="Enter item"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 text-gray-700 shadow-sm"
        />

        {/* category */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setError("");
          }}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-700 shadow-sm"
        >
          <option value="">Select category...</option>
          {categories.map((cat) => (
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
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-700 shadow-sm"
        >
          <option value="">Select diet...</option>
          {diets.map((d) => (
            <option key={d.diet_id} value={d.diet_id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* error */}
        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

        {/* button */}
        <button
          onClick={addItem}
          className="w-full bg-blue-600 text-white rounded-xl py-2 font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Add
        </button>

        {/* list Of menu */}
        <div className="max-h-64 overflow-y-auto space-y-2 border-t border-gray-200 pt-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <ul>
            {menuItems.map((item, i) => {
              const categoryName = item.category;
              const dietName = item.diet;
              return (
                <li
                  key={item.menu_item_id}
                  className="flex justify-between items-center border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 shadow-sm hover:shadow-md transition"
                >
                  <span className="text-gray-700">
                    {i + 1} - <span className="font-semibold">{item.name}</span> <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">{categoryName}</span> <span className="ml-1 inline-block px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{dietName}</span> <span className="ml-1 text-gray-500">Qty: {item.quantity}</span>
                  </span>
                  <button
                    onClick={() => removeItem(item.menu_item_id)}
                    className="border border-red-300 text-red-500 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition font-bold shadow-sm"
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default CreateMenu;