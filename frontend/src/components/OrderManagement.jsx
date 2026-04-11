
import { useState, useEffect } from "react";

function OrderManagement() {
  const [activeEvent, setActiveEvent] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [leftovers, setLeftovers] = useState([]);
  const [order, setOrder] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [canDownload, setCanDownload] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dietStats, setDietStats] = useState({
    halal: 0,
    veg: 0,
    attendance: 0
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

  useEffect(() => {
    const fetchActiveEvent = async () => {
      try {
        const res = await fetch("/api/order/active");
        if (res.ok) {
          const data = await res.json();
          setActiveEvent(data);
        }
      } catch (err) {
        console.error("Failed to fetch active event:", err);
      }
    };

    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/menu/menu-items");
        if (res.ok) {
          const data = await res.json();
          setMenuItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    };

    Promise.all([fetchActiveEvent(), fetchMenu()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeEvent) return;

    const fetchLeftovers = async () => {
      try {
        const res = await fetch(`/api/leftovers/${activeEvent.order_id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setLeftovers(data);
        }
      } catch (err) {
        console.error("Failed to fetch leftovers:", err);
      }
    };

    const fetchAttendanceStats = async () => {
      try {
        const res = await fetch(`/api/attendance/stats/${activeEvent.order_id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setDietStats({
            attendance: Number(data.total_attendance),
            halal: Number(data.total_halal),
            veg: Number(data.total_veg)
          });
        }
      } catch (err) {
        console.error("Failed to fetch attendance stats:", err);
      }
    };

    fetchLeftovers();
    fetchAttendanceStats();
  }, [activeEvent]);

  useEffect(() => {
    if (menuItems.length === 0) return;

    let filtered = menuItems;
    if (selectedCategory !== "All") {
      filtered = menuItems.filter(item => item.category === selectedCategory);
    }

    const result = filtered.map(item => {
      const foundLeftover = leftovers.find(l => l.menu_item_id === item.menu_item_id);
      const existing = order.find(o => o.menu_item_id === item.menu_item_id);

      return {
        menu_item_id: item.menu_item_id,
        name: item.name,
        category: item.category,
        leftover: foundLeftover ? foundLeftover.quantity : 0,
        quantity: existing ? existing.quantity : 0
      };
    });

    setOrder(result);
  }, [menuItems, leftovers, selectedCategory]);

  const increase = (id) => {
    setIsDirty(true);
    setOrder(prev =>
      prev.map(item =>
        item.menu_item_id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrease = (id) => {
    setIsDirty(true);
    setOrder(prev =>
      prev.map(item =>
        item.menu_item_id === id
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    const filteredItems = order
      .filter(item => item.quantity > 0)
      .map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity
      }));

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          order_id: activeEvent.order_id,
          date: activeEvent.order_date,
          attendance: dietStats.attendance,
          items: filteredItems
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(data.message || "Order saved successfully");
        setShowModal(true);
        setIsDirty(false);
        setCanDownload(true);
      } else {
            const data = await res.json();
          console.log("BACKEND ERROR:", data);
          throw new Error(data.message || "Failed to save order");
      }

    } catch (err) {
      setSuccess("Error saving order. Please try again.");
      setShowModal(true);
    }
  };

  const otherDietCount = Math.max(0, dietStats.attendance - (dietStats.halal + dietStats.veg));

  const downloadOrderFile = () => {
    const filteredItems = order.filter(i => i.quantity > 0);
    const dateStr = activeEvent ? new Date(activeEvent.order_date).toLocaleDateString("en-GB") : "N/A";

    const text = `
LUNCHFLOW ORDER SUMMARY
-----------------------
Date: ${dateStr}
Event ID: ${activeEvent?.order_id}
Total Attendance: ${dietStats.attendance}

DIETARY BREAKDOWN:
- Halal: ${dietStats.halal}
- Vegetarian: ${dietStats.veg}
- Other: ${otherDietCount}

ORDERED ITEMS:
${filteredItems.map(i => `- ${i.name} (${i.category}): ${i.quantity}`).join("\n")}

Generated on: ${new Date().toLocaleString("en-GB")}
`;
  const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-summary-${activeEvent?.order_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredOrder = order.filter(item => item.quantity > 0);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-8 px-4 font-sans selection:bg-indigo-100">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {}
        <header className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Order Management
            </h1>
            <p className="text-slate-500 font-medium">
              Manage inventory and supplies for current events
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {activeEvent ? (
              <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-indigo-700 font-bold text-sm">
                  Active Event: {new Date(activeEvent.order_date).toLocaleDateString("en-GB")}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 bg-red-50 px-6 py-6 rounded-2xl border border-red-100">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-400 mb-2">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8M12 8v8" />
                </svg>
                <span className="text-red-500 font-bold text-sm">No Active Event Found</span>
                <span className="text-red-400 text-xs text-center">Create an event to get started with attendance, leftovers, and orders.</span>
              </div>
            )}
          </div>
        </header>

        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Attendance" value={dietStats.attendance} color="blue" />
          <StatCard label="Halal" value={dietStats.halal} color="amber" />
          <StatCard label="Vegetarian" value={dietStats.veg} color="green" />
          <StatCard label="Other" value={otherDietCount} color="slate" />
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-start">
          
          {}
          <section className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-slate-800">Menu Catalog</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-gray-200 text-sm font-semibold rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer shadow-sm"
                >
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {order.length === 0 ? (
                  <div className="py-20 text-center space-y-2">
                    <p className="text-slate-400 font-medium">No items found in this category</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 p-2">
                    {order.map(item => (
                      <div
                        key={item.menu_item_id}
                        className="group flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm md:text-base">{item.name}</h4>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] uppercase tracking-wider font-heavy text-slate-400">
                                {item.category}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-bold">
                                Leftover: {item.leftover}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                          <button 
                            onClick={() => decrease(item.menu_item_id)} 
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"/></svg>
                          </button>
                          <span className="w-10 text-center font-bold text-slate-800">{item.quantity}</span>
                          <button 
                            onClick={() => increase(item.menu_item_id)} 
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm shadow-indigo-200 transition-all active:scale-95"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>


          {}
          <aside className="space-y-4">
            <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold tracking-tight">Summary</h3>
                <p className="text-indigo-300 text-sm font-medium">Review your order before submission</p>
              </div>

              <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar-light">
                {filteredOrder.length === 0 ? (
                  <p className="text-center py-6 text-indigo-400 italic text-sm">No items selected yet</p>
                ) : (
                  filteredOrder.map(item => (
                    <div key={item.menu_item_id} className="flex justify-between items-center py-2 border-b border-indigo-800 last:border-0">
                      <span className="text-sm font-medium truncate max-w-[150px]">{item.name}</span>
                      <span className="text-sm font-bold bg-white/10 px-2 py-0.5 rounded-lg">x{item.quantity}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={!isDirty || filteredOrder.length === 0}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                    isDirty && filteredOrder.length > 0
                      ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-900/40 active:scale-95"
                      : "bg-indigo-800/50 text-indigo-400 cursor-not-allowed border border-indigo-800"
                  }`}
                >
                  Confirm & Submit Order
                </button>

                <button
                  onClick={downloadOrderFile}
                  disabled={!canDownload}
                  className={`w-full py-3 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
                    canDownload
                      ? "bg-white text-indigo-900 hover:bg-indigo-50 border-white active:scale-95 shadow-lg"
                      : "bg-transparent text-indigo-300 border-indigo-800 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Generate Admin File
                </button>
              </div>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <p className="text-green-800 font-bold text-sm">{success}</p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {}
            <div className="relative bg-indigo-600 pt-16 pb-8 px-8 text-center text-white overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
              
              <div className="relative space-y-2">
                <div className="w-16 h-16 bg-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">Order Confirmed!</h2>
                <p className="text-indigo-100 font-medium">Summary for {new Date(activeEvent?.order_date).toLocaleDateString("en-GB")}</p>
              </div>
            </div>

            {}
            <div className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Total</p>
                  <p className="text-lg font-extrabold text-slate-800">{dietStats.attendance}</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Halal</p>
                  <p className="text-lg font-extrabold text-slate-800">{dietStats.halal}</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Veg</p>
                  <p className="text-lg font-extrabold text-slate-800">{dietStats.veg}</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Other</p>
                  <p className="text-lg font-extrabold text-slate-800">{otherDietCount}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest pl-1">Items Breakdown</h4>
                <div className="bg-slate-50 rounded-3xl p-4 max-h-40 overflow-y-auto custom-scrollbar">
                  {filteredOrder.map(item => (
                    <div key={item.menu_item_id} className="flex justify-between items-center py-2 px-2 border-b border-white last:border-0 hover:bg-white/50 rounded-xl transition-colors">
                      <span className="text-slate-600 font-bold text-sm">{item.name}</span>
                      <span className="text-indigo-600 font-extrabold text-sm">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        
        .custom-scrollbar-light::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />

    </main>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    green: "bg-green-50 text-green-700 border-green-100",
    slate: "bg-slate-50 text-slate-700 border-slate-100"
  };

  return (
    <div className={`p-5 rounded-3xl border ${colors[color]} shadow-sm flex flex-col items-center justify-center space-y-1 transition-transform hover:scale-[1.02]`}>
      <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">{label}</span>
      <span className="text-3xl font-black">{value}</span>
    </div>
  );
}

export default OrderManagement;


