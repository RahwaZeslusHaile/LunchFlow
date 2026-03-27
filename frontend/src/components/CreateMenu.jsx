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
        const [catRes, dietRes,menuRes] = await Promise.all([
          fetch("/api/menu/categories"),
          fetch("/api/menu/dietary-restrictions"),
          fetch("/api/menu/menu-items")

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
      const res = await fetch("/api/menu/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      
        const categoryName = categories.find(
          c => c.category_id === payload.category_id
        )?.name;

        const dietName = diets.find(
          d => d.diet_id === payload.diet_id
        )?.name;

      setMenuItems(prev => [...prev, {
        menu_item_id: data.menu_item_id,
        name: payload.name,
        category: categoryName,
        diet: dietName
      }]);
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
        await fetch(`/api/menu/menu-items/${id}`, { method: "DELETE" });
      } catch {}
    

    setMenuItems(prev => prev.filter(item => item.menu_item_id !== id));  
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

        {/* list Of menu */}
        <ul className="space-y-2">
          {menuItems.map((item, i) => {
            const categoryName = item.category;

            const dietName = item.diet

            return (
              <li
                key={item.menu_item_id}
                className="flex justify-between items-center border border-gray-300 rounded-lg px-3 py-2"
              >
                <span>
                  {i + 1} - {item.name} ({categoryName} - {dietName})
                </span>

                <button
                  onClick={() => removeItem(item.menu_item_id)}
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