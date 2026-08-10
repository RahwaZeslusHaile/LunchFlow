import { useState, useEffect } from "react";
import getApiUrl from "../api";

function LeftoverManagement({ order_id }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);


  useEffect(() => {
  
    setLoading(true);
    setSuccess("");
    setIsDirty(false); 
    fetch(getApiUrl("/menu/menu-items"))
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
      const res = await fetch(getApiUrl("/leftovers"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token") && 
          { "Authorization": `Bearer ${localStorage.getItem("token")}` })
        },
        body: JSON.stringify({
          items: filtered.map(item => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            leftover_date: new Date().toISOString().split("T")[0],
            notes: ""
          })),
          order_id
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || `Server error ${res.status}`);
      }
      setSuccess("Saved successfully");
      setIsDirty(false);
      setItems(prev => prev.map(item => ({ ...item, quantity: 0 })));
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not save leftovers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-10 space-y-8 flex flex-col justify-between" style={{ minHeight: '600px' }}>
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-3 tracking-tight">
          Leftover Management
        </h2>

        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`w-full rounded-2xl py-3 text-lg font-bold text-white ${
            isDirty ? "bg-black hover:bg-gray-900" : "bg-gray-400 cursor-not-allowed"
          } transition`}
        >
          Save Leftovers
        </button>

        <div className="h-[36rem] border border-gray-300 rounded-2xl p-5 overflow-y-auto bg-gray-50">
          {loading && (
            <p className="text-center text-gray-400 mt-20 text-lg">
              Loading...
            </p>
          )}
          {!loading && items.length === 0 && (
            <p className="text-center text-gray-400 mt-20 text-lg">
              No menu items available
            </p>
          )}
          {!loading && (
            <div className="grid grid-cols-1 gap-5">
              {items.map(item => (
                <div
                  key={item.menu_item_id}
                  className="flex justify-between items-center bg-white p-5 mb-3 rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="flex-1 min-w-[7rem] max-w-[12rem]">
                    <p className="font-medium text-lg break-words">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                  <div className="flex items-center gap-4 min-w-[8rem] max-w-full">
                    <button
                      onClick={() => decreaseQuantity(item.menu_item_id)}
                      className="bg-gray-300 px-4 rounded-2xl text-xl"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-lg">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.menu_item_id)}
                      className="bg-blue-500 text-white px-4 rounded-2xl text-xl"
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
          <p className="text-red-600 text-lg font-medium text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-lg font-medium text-center">
            {success}
          </p>
        )}
      </div>
    </main>
  );
}

export default LeftoverManagement;