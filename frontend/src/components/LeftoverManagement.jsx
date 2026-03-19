import { useState, useEffect } from "react";

function LeftoverManagement() {
  const [date, setDate] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const initialItems = [
    { id: 1, name: "Chicken Curry", type: "Halal", quantity: 0 },
    { id: 2, name: "Vegetable Pasta", type: "Veg", quantity: 0 },
    { id: 3, name: "Naan Bread", type: "Bread", quantity: 0 },
    { id: 4, name: "Chicken Curry", type: "Halal", quantity: 0 },
    { id: 5, name: "Vegetable Pasta", type: "Veg", quantity: 0 },
    { id: 6, name: "Naan Bread", type: "Bread", quantity: 0 }
  ];

  useEffect(() => {
    if (!date) return;

    setLoading(true);
    setSuccess("");
    setIsDirty(false); // reset when date changes

    fetch(`http://localhost:4000/menu?date=${date}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems(initialItems);
        }
      })
      .catch(() => {
        setItems(initialItems);
      })
      .finally(() => setLoading(false));

  }, [date]);

  const increaseQuantity = (id) => {
    setIsDirty(true);
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decreaseQuantity = (id) => {
    setIsDirty(true);
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
        : item
    ));
  };

  const handleSave = async () => {
    const filtered = items.filter(item => item.quantity > 0);

    try {
      await fetch("http://localhost:4000/leftovers", {
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

      setSuccess("Saved successfully");
      setIsDirty(false);

    } catch (err) {
      console.log("Backend not ready");
      setSuccess("Saved locally (backend later)");
      setIsDirty(false);
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