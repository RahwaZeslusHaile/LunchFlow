import { useState, useEffect } from "react";

function LeftoverManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);


  useEffect(() => {
  
    setLoading(true);
    setSuccess("");
    setIsDirty(false); 
    fetch(`/api/menu/menu-items`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch menu items");
        return res.json();
      })
      .then(data => {
        setError("");
        setItems((data || []).map(item => ({ ...item, quantity: 0 })));
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load menu items.");
        setItems([]);
      })
      .finally(() => setLoading(false));

  }, []);

  const increaseQuantity = (menu_item_id) => {
    setIsDirty(true);
    setItems(prev =>
      prev.map(item =>
      item.menu_item_id === menu_item_id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decreaseQuantity = (menu_item_id) => {
    setIsDirty(true);
    setItems(prev =>
      prev.map(item =>
      item.menu_item_id === menu_item_id
        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
        : item
    ));
  };

  const handleSave = async () => {
    const filtered = items.filter(item => item.quantity > 0);
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/leftovers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token") && 
          { "Authorization": `Bearer ${localStorage.getItem("token")}` })
        },
        body: JSON.stringify({
          items: filtered.map(item => ({
            menu_item_id: item.menu_item_id,
            class_id: item.class_id,    
            quantity: item.quantity,
            leftover_date: new Date().toISOString().split("T")[0],
            notes: ""
          }))
        })
      });
      if (!res.ok) {
        throw new Error("Failed to save leftovers");
      }
      setSuccess("Saved successfully");
      setIsDirty(false);
      setItems(prev => prev.map(item => ({ ...item, quantity: 0 })));
    } catch (err) {
      console.error(err);
      setError("Could not save leftovers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-white rounded-2xl shadow-md p-2 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-2xl font-bold text-center mb-2 sm:mb-4">
          Leftover Management
        </h2>

        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`w-full rounded-lg py-2 text-white text-base sm:text-lg ${
            isDirty ? "bg-black" : "bg-gray-400"
          }`}
        >
          Save Leftovers
        </button>

        <div className="h-[36rem] sm:h-[40rem] border border-gray-300 rounded-lg p-2 sm:p-4 overflow-y-auto bg-gray-50">
          {loading && (
            <p className="text-center text-gray-400 mt-20 text-base sm:text-lg">
              Loading...
            </p>
          )}
          {!loading && items.length === 0 && (
            <p className="text-center text-gray-400 mt-20 text-base sm:text-lg">
              No menu items available
            </p>
          )}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {items.map(item => (
                <div
                  key={item.menu_item_id}
                  className="flex justify-between items-center bg-white p-2 sm:p-4 mb-2 rounded shadow-sm border border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.menu_item_id)}
                      className="bg-gray-300 px-2 sm:px-3 rounded text-lg sm:text-xl"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-base sm:text-lg">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.menu_item_id)}
                      className="bg-blue-500 text-white px-2 sm:px-3 rounded text-lg sm:text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-600 text-sm sm:text-base text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm sm:text-base text-center">
            {success}
          </p>
        )}
      </div>
    </main>
  );
}

export default LeftoverManagement;