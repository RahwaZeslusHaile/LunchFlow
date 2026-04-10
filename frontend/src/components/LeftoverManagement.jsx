import { useState, useEffect } from "react";

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
    
    fetch(`/api/menu/menu-items`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
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
          "Authorization": `Bearer ${localStorage.getItem("token")}`
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
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-white rounded-2xl shadow-md p-2 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-2xl font-bold text-center mb-2 sm:mb-4">
          Leftover Management
        </h2>

        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`w-full rounded-lg py-4 text-white font-bold text-base sm:text-lg transition-all ${
            isDirty ? "bg-black hover:bg-slate-800" : "bg-gray-400"
          }`}
        >
          Save Leftovers
        </button>

        <div className="h-[36rem] sm:h-[40rem] border border-gray-300 rounded-lg p-2 sm:p-4 overflow-y-auto bg-gray-50">
          {loading && (
            <div className="flex flex-col items-center mt-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
              <p className="text-gray-400 text-base sm:text-lg">Loading menu items...</p>
            </div>
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
                  className="flex justify-between items-center bg-white p-2 sm:p-4 mb-2 rounded-2xl shadow-sm border border-gray-100 transition-hover hover:border-indigo-200"
                >
                  <div className="flex-1 min-w-0 pr-4 text-left">
                    <p className="font-bold text-sm sm:text-base truncate text-slate-800">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-wider font-heavy text-slate-400">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.menu_item_id)}
                      className="bg-gray-100 p-2 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"/></svg>
                    </button>
                    <span className="w-6 text-center text-base sm:text-lg font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.menu_item_id)}
                      className="bg-slate-900 text-white p-2 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span className="text-red-600 text-xs sm:text-sm font-bold">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span className="text-green-700 text-xs sm:text-sm font-bold">✅ {success}</span>
          </div>
        )}
      </div>
    </main>
  );
}

export default LeftoverManagement;