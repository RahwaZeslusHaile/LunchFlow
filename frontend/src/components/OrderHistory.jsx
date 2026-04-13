import { useEffect, useState } from "react";

function OrderHistory({ refreshKey }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order/latest");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
}, [refreshKey]);

  return (
    <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-800">
          Order History
        </h3>
        <span className="text-sm text-slate-500">
          Recent orders
        </span>
      </div>

      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          
          <thead className="sticky top-0 bg-white z-10">
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
            {orders.map((order, index) => (
              <tr
                key={order.order_id}
                className={`border-b border-slate-100 transition
                ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                hover:bg-slate-100`}
              >
                <td className="py-4 px-4 font-semibold text-slate-500">
                  {index + 1}
                </td>

                <td className="py-4 px-4">
                  {new Date(order.event_date).toLocaleDateString()}
                </td>

                <td className="py-4 px-4">{order.attendees}</td>

                <td className="py-4 px-4">{order.admin_name}</td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
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
                    className="px-4 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-indigo-600 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            
            <h3 className="text-lg font-semibold mb-4">
              Order Details
            </h3>

            <p className="text-sm text-slate-500 mb-4">
              {new Date(selectedOrder.event_date).toLocaleDateString()}
            </p>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {selectedOrder.details.length > 0 ? (
                selectedOrder.details.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-slate-500">
                      {item.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">No items</p>
              )}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-indigo-600"
            >
              Close
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default OrderHistory;