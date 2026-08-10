import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import getApiUrl from "../api";

function OrderHistory({ refreshKey }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(getApiUrl(`/order/event/${orderId}`), { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      setSelectedOrder(null);
      setOrders(orders => orders.filter(o => o.order_id !== orderId));
    } catch (err) {
      setDeleteError("Failed to delete event. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(getApiUrl(`/order/latest?page=${currentPage}&limit=${limit}`));
        const data = await res.json();
      
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refreshKey, currentPage, limit]);

  const totalPages = Math.ceil(total / limit);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-800">
          Order History
        </h3>
        <div className="flex items-center gap-3">
          <select 
            value={limit} 
            onChange={handleLimitChange}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={5}>Show 5</option>
            <option value={10}>Show 10</option>
            <option value={20}>Show 20</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          
          <thead className="sticky top-0 bg-white z-10 shadow-sm">
            <tr className="text-slate-500 text-sm border-b border-slate-200">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Event Date</th>
              <th className="py-3 px-4">Attendees</th>
              <th className="py-3 px-4">Created By</th>
              <th className="py-3 px-4">Order Status</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>

          <tbody className="text-slate-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400">Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400">No orders found.</td>
              </tr>
            ) : orders.map((order, index) => (
              <tr
                key={order.order_id}
                className={`border-b border-slate-100 transition
                ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                hover:bg-slate-100`}
              >
                <td className="py-4 px-4 font-semibold text-slate-500">
                  {(currentPage - 1) * limit + index + 1}
                </td>

                <td className="py-4 px-4">
                  {(() => {
                    const d = new Date(order.event_date);
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = d.getFullYear();
                    return `${day}/${month}/${year}`;
                  })()}
                </td>

                <td className="py-4 px-4">{order.attendees}</td>

                <td className="py-4 px-4">{order.admin_name}</td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      order.order_status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-black transition shadow-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {}
      {!loading && total > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-900">{(currentPage - 1) * limit + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * limit, total)}</span> of <span className="text-slate-900">{total}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {}
              <span className="text-sm font-semibold text-slate-700 px-3 py-1 bg-slate-100 rounded-md">
                {currentPage}
              </span>
              <span className="text-sm text-slate-400">/</span>
              <span className="text-sm font-medium text-slate-500 pr-2">
                {totalPages}
              </span>
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Order Details
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                ID #{selectedOrder.order_id}
              </span>
            </div>

            <p className="text-base text-slate-500 mb-6 font-medium">
              Event Date: <span className="text-slate-900">{(() => {
                const d = new Date(selectedOrder.event_date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
              })()}</span>
            </p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Items Summary</h4>
              {selectedOrder.details.length > 0 ? (
                selectedOrder.details.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                    <span className="text-sm font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-indigo-600">
                      x{item.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 italic text-sm">No items found</div>
              )}
            </div>

            {deleteError && (
              <div className="mt-4 text-sm text-red-600 text-center">{deleteError}</div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-1/2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition shadow-lg active:scale-[0.98]"
                disabled={deleting}
              >
                Close Details
              </button>
              <button
                onClick={() => handleDeleteOrder(selectedOrder.order_id)}
                className="w-1/2 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition shadow-lg active:scale-[0.98] disabled:opacity-60"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;