import { useState, useEffect } from "react";

function OrderManagement() {
  const fallbackAttendance = 100;

  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState(0);
  const [order, setOrder] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [canDownload, setCanDownload] = useState(false);

  const [dietStats, setDietStats] = useState({
    halal: 0,
    veg: 0,
    other: 0
  });

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Bakery",
    "Chilled Meals",
    "Drinks",
    "Food Essentials",
    "Non-Food Essentials",
    "Snacks"
  ];

  const fallbackMenu = [
    { id: 1, name: "Bread", category: "Bakery" },
    { id: 2, name: "Croissant", category: "Bakery" },
    { id: 3, name: "Ready Pasta", category: "Chilled Meals" },
    { id: 4, name: "Salad Box", category: "Chilled Meals" },
    { id: 5, name: "Coke", category: "Drinks" },
    { id: 6, name: "Orange Juice", category: "Drinks" },
    { id: 7, name: "Flour", category: "Food Essentials" },
    { id: 8, name: "Sugar", category: "Food Essentials" },
    { id: 9, name: "Toilet Paper", category: "Non-Food Essentials" },
    { id: 10, name: "Soap", category: "Non-Food Essentials" },
    { id: 11, name: "Chips", category: "Snacks" },
    { id: 12, name: "Chocolate", category: "Snacks" }
  ];

  useEffect(() => {
    if (!date) return;

    setIsDirty(false);
    setSuccess("");
    setCanDownload(false);

    // attendance
    fetch(`http://localhost:4000/attendance?date=${date}`)
      .then(res => res.json())
      .then(data => {
        const total = data?.total || fallbackAttendance;
        setAttendance(total);

        const halal = 30;
        const veg = 10;

        setDietStats({
          halal,
          veg,
          other: total - (halal + veg)
        });
      })
      .catch(() => {
        setAttendance(fallbackAttendance);
        setDietStats({
          halal: 30,
          veg: 10,
          other: fallbackAttendance - 40
        });
      });

    const fallbackLeftovers = [
      { menu_item_id: 1, quantity: 5 },
      { menu_item_id: 5, quantity: 3 }
    ];

    let filtered = fallbackMenu;

    if (selectedCategory !== "All") {
      filtered = fallbackMenu.filter(
        item => item.category === selectedCategory
      );
    }

    const result = filtered.map(item => {
      const foundLeftover = fallbackLeftovers.find(
        l => l.menu_item_id === item.id
      );

      const existing = order.find(o => o.id === item.id);

      return {
        id: item.id,
        name: item.name,
        leftover: foundLeftover ? foundLeftover.quantity : 0,
        quantity: existing ? existing.quantity : 0
      };
    });

    setOrder(result);

  }, [date, selectedCategory]);

  const increase = (id) => {
    setIsDirty(true);
    setOrder(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrease = (id) => {
    setIsDirty(true);
    setOrder(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    const filteredItems = order
      .filter(item => item.quantity > 0)
      .map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity
      }));

    try {
      const res = await fetch("http://localhost:4000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date,
          attendance,
          items: filteredItems
        })
      });

      const data = await res.json();

      setSuccess(data.message || "Order saved");
      setShowModal(true);
      setIsDirty(false);
      setCanDownload(true);

    } catch (err) {
      setSuccess("Saved locally (backend later)");
      setShowModal(true);
      setIsDirty(false);
      setCanDownload(true);
    }
  };

  const downloadTxt = () => {
    const filteredItems = order.filter(i => i.quantity > 0);

    const text = `
Date: ${date || "Not selected"}
Attendance: ${attendance}
Halal: ${dietStats.halal}
Veg: ${dietStats.veg}
Other: ${dietStats.other}

Items:
${filteredItems.map(i => `${i.name}: ${i.quantity}`).join("\n")}
`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${date || "no-date"}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const filteredOrder = order.filter(item => item.quantity > 0);

  return (
    <main className="h-screen flex items-center justify-center bg-gray-300">
      <div className="w-full max-w-md h-[80vh] bg-white rounded-2xl shadow-lg flex flex-col">

        <div className="p-4 border-b space-y-2">
          <h2 className="text-xl font-bold text-center">
            Order Management
          </h2>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <div className="flex justify-center gap-3 text-sm font-medium">
            <p>Attendance: {attendance}</p>
            <p>|</p>
            <p>Halal: {dietStats.halal}</p>
            <p>|</p>
            <p>Veg: {dietStats.veg}</p>
            <p>|</p>
            <p>Other: {dietStats.other}</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isDirty}
            className={`w-full py-2 rounded text-white ${
              isDirty ? "bg-black" : "bg-gray-400"
            }`}
          >
            Submit Order
          </button>

          <button
            onClick={downloadTxt}
            disabled={!canDownload}
            className={`w-full py-2 rounded text-white ${
              canDownload ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            Generate File for Admin
          </button>

          {success && (
            <p className="text-green-600 text-sm text-center">
              {success}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {!date && (
            <p className="text-center text-gray-400">
              Select a date
            </p>
          )}

          {date && order.map(item => (
            <div
              key={item.id}
              className="bg-gray-100 p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Leftover: {item.leftover}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => decrease(item.id)} className="bg-gray-300 px-2 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increase(item.id)} className="bg-blue-500 text-white px-2 rounded">+</button>
              </div>
            </div>
          ))}

        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 space-y-4">

            <h2 className="text-lg font-bold text-center">Order Summary</h2>

            <p>Date: {date || "Not selected"}</p>
            <p>Attendance: {attendance}</p>

            <p>
              Halal: {dietStats.halal} | Veg: {dietStats.veg} | Other: {dietStats.other}
            </p>

            <div className="space-y-1">
              {filteredOrder.length === 0 && (
                <p className="text-gray-400 text-sm text-center">
                  No items selected
                </p>
              )}

              {filteredOrder.map(item => (
                <p key={item.id}>
                  {item.name}: {item.quantity}
                </p>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-black text-white py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </main>
  );
}

export default OrderManagement;
