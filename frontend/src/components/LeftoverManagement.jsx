import { useState, useEffect } from "react";

function LeftoverManagement() {
  const [date, setDate] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);


  useEffect(() => {
    if (!date) return;

    setLoading(true);
    setSuccess("");
    setIsDirty(false); 

    fetch(`/api/menu?date=${date}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch menu items");
        return res.json();
      })
      .then(data => {
        setError("");
        setItems(data || []);
      })
      .catch((err) => {
        setError("Could not load menu items.");
        setItems([]);
      })
      .finally(() => setLoading(false));

  }, [date]);

  const increaseQuantity = (id) => {
    setIsDirty(true);
    setItems(prev =>
      prev.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decreaseQuantity = (id) => {
    setIsDirty(true);
    setItems(prev =>
      prev.map(item =>
      item.id === id
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date,
          items: filtered.map(item => ({
            menu_item_id: item.id,
            quantity: item.quantity
          }))
        })
      });
      if (!res.ok) {
        throw new Error("Failed to save leftovers");
      }
      setSuccess("Saved successfully");
      setIsDirty(false);
    } catch (err) {
      setError("Could not save leftovers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 space-y-4">

        <h2 className="text-xl font-bold text-center">
          Leftover Management
        </h2>

        {/* date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />

        {/* save button */}
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`w-full rounded-lg py-2 text-white ${
            isDirty ? "bg-black" : "bg-gray-400"
          }`}
        >
          Save Leftovers
        </button>

        {/* box */}
        <div className="h-64 border border-gray-300 rounded-lg p-2 overflow-y-auto bg-gray-50">

          {!date && (
            <p className="text-center text-gray-400 mt-20">
              Select a date to load items
            </p>
          )}

          {loading && (
            <p className="text-center text-gray-400 mt-20">
              Loading...
            </p>
          )}

          {!loading && date && items.map(item => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-2 mb-2 rounded shadow-sm"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.type}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="bg-gray-300 px-2 rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="bg-blue-500 text-white px-2 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* error */}
        {error && (
          <p className="text-red-600 text-sm text-center">
            {error}
          </p>
        )}
        {/* success */}
        {success && (
          <p className="text-green-600 text-sm text-center">
            {success}
          </p>
        )}

      </div>
    </main>
  );
}

export default LeftoverManagement;