import { useState, useEffect } from "react";

function OrderManagement() {
  const fallbackAttendance = 100;

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
    "Bakery & Bases",
    "Fillings",
    "Fresh Produce",
    "Snacks",
    "Sweet Treats",
    "Drinks",
    "Non-Food Essentials",
    "Food Essentials",
  ];

  const fallbackMenu = [
    {
      id: 1,
      name: "Sainsburys Plain Tortilla Wraps",
      category: "Bakery & Bases",
    },
    { id: 2, name: "Packs of pita bread", category: "Bakery & Bases" },
    {
      id: 3,
      name: "Sainsburys Cooked Chicken Breast Chunks",
      category: "Fillings",
    },
    {
      id: 4,
      name: "Humza Signature Hot & Spicy Chicken Wings 600g",
      category: "Fillings",
    },
    { id: 5, name: "Sainsburys Falafels", category: "Fillings" },
    { id: 6, name: "Plant Pioneers (Vegan) Ham", category: "Fillings" },
    { id: 7, name: "Sainsburys Hummus", category: "Fillings" },
    { id: 8, name: "Sainsburys Creamy Coleslaw", category: "Fillings" },
    { id: 9, name: "Greek Feta Block", category: "Fillings" },
    { id: 10, name: "Soap", category: "Fresh Produce" },
    { id: 11, name: "Chips", category: "Fresh Produce" },
    { id: 12, name: "Large Cucumbers", category: "Fresh Produce" },
    {
      id: 13,
      name: "Packs of Small Ripe & Ready Avocados",
      category: "Fresh Produce",
    },
    { id: 14, name: "Lemons", category: "Fresh Produce" },
    { id: 15, name: "cheese grated", category: "Fresh Produce" },
    { id: 16, name: "Bags of Baby Spinach", category: "Fresh Produce" },
    { id: 17, name: "Mixed Leaf Salad", category: "Fresh Produce" },
    { id: 18, name: "Punnets Cherry Tomatoes", category: "Snacks" },
    {
      id: 19,
      name: "Large Bags of Tortilla Chips (Salted)",
      category: "Snacks",
    },
    { id: 20, name: "Large Bags of Sea Salt  Crisps", category: "Snacks" },
    { id: 21, name: "Jars of Salsa (Cool and Hot)", category: "Snacks" },
    {
      id: 22,
      name: "Packs of Assorted Biscuit Packs",
      category: "Sweet Treats",
    },
    { id: 23, name: "Large Bunches of Bananas", category: "Sweet Treats" },
    {
      id: 24,
      name: "Punnets of Seedless Grapes (Red & Green)",
      category: "Sweet Treats",
    },
    {
      id: 25,
      name: "Bags of Tangerines or Satsumas",
      category: "Sweet Treats",
    },
    {
      id: 26,
      name: "Sainsburys 100% Pure Orange/Apple Juice (1L Cartons)",
      category: "Drinks",
    },
    { id: 27, name: "Coca cola", category: "Drinks" },
    { id: 28, name: "Fanta", category: "Drinks" },
    { id: 29, name: "Sainsburys British Bottled Still Spring Water 5L Bottles", category: "Drinks" },
    { id: 30, name: "Semi-Skimmed Milk", category: "Drinks" },
    { id: 31, name: "Paper Towels", category: "Non-Food Essentials" },
    { id: 32, name: "Minky All Purpose Microfibre Cloths (6 pack)", category: "Non-Food Essentials" },
    { id: 33, name: "BRITA Marella 3.5L XL Water Filter Jug - White", category: "Non-Food Essentials" },
    { id: 34, name: "Ground Coffee", category: "Food Essentials" },

  ];

  useEffect(() => {
    setIsDirty(false);
    setSuccess("");
    setCanDownload(false);


    // attendance
    fetch("http://localhost:4000/api/order/active")
      .then((res) => res.json())
      .then((data) => {
        console.log("Active order:", data);

        const total = data?.total || fallbackAttendance;
        setAttendance(total);

        const halal = 30;
        const veg = 10;

        setDietStats({
          halal,
          veg,
          other: total - (halal + veg),
        });
      })
      .catch(() => {
        setAttendance(fallbackAttendance);
        setDietStats({
          halal: 30,
          veg: 10,
          other: fallbackAttendance - 40,
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

  }, [selectedCategory]);

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
Date: ${new Date().toLocaleDateString()}
Attendance: ${attendance}
Halal: ${dietStats.halal}
Veg: ${dietStats.veg}
Other: ${dietStats.other}

Items:
${filteredItems.map((i) => `${i.name}: ${i.quantity}`).join("\n")}
`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${new Date().toISOString()}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const filteredOrder = order.filter(item => item.quantity > 0);

  return (
    <main className="h-screen flex items-center justify-center bg-gray-300">
      <div className="w-full max-w-md h-[80vh] bg-white rounded-2xl shadow-lg flex flex-col">
        <div className="p-4 border-b space-y-2">
          <h2 className="text-xl font-bold text-center">Order Management</h2>
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
            <p className="text-green-600 text-sm text-center">{success}</p>
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

          {order.map((item) => (
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
                <button
                  onClick={() => decrease(item.id)}
                  className="bg-gray-300 px-2 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increase(item.id)}
                  className="bg-blue-500 text-white px-2 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 space-y-4">
            <h2 className="text-lg font-bold text-center">Order Summary</h2>

            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Attendance: {attendance}</p>

            <p>
              Halal: {dietStats.halal} | Veg: {dietStats.veg} | Other:{" "}
              {dietStats.other}
            </p>

            <div className="space-y-1">
              {filteredOrder.length === 0 && (
                <p className="text-gray-400 text-sm text-center">
                  No items selected
                </p>
              )}

              {filteredOrder.map((item) => (
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
