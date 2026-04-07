function OrderHistory() {
const dummyOrders = [
  {
    id: 1,
    date: "01 Apr 2026",
    attendees: 45,
    createdBy: "Admin",
    status: "Completed",
    update: "yesterday"
  },
  {
    id: 2,
    date: "31 Mar 2026",
    attendees: 38,
    createdBy: "Aida",
    status: "Pending",
    update: "yesterday"
  },
];
  return (
    <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-800">
          Order History
        </h3>
        <span className="text-sm text-slate-500">
          Recent events & orders
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          
          {/* Head */}
          <thead>
            <tr className="text-slate-500 text-sm border-b border-slate-200">
              <th className="py-3 px-4 font-medium">Event Date</th>
              <th className="py-3 px-4 font-medium">Attendees</th>
              <th className="py-3 px-4 font-medium">Created By</th>
              <th className="py-3 px-4 font-medium">Order Status</th>
              <th className="py-3 px-4 font-medium">Last Update</th>
              <th className="py-3 px-4 font-medium">Details</th>

            </tr>
          </thead>

          {/* Body (dummy code) */}
            <tbody className="text-slate-700">
                {dummyOrders.map((order) => (
                    <tr
                    key={order.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                    <td className="py-4 px-4">{order.date}</td>
                    <td className="py-4 px-4">{order.attendees}</td>
                    <td className="py-4 px-4">{order.createdBy}</td>

                    <td className="py-4 px-4">
                        <span
                        className={`px-3 py-1 text-xs rounded-full ${
                            order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        >
                        {order.status}
                        </span>
                    </td>
                    <td className="py-4 px-4">{order.update}</td>

                    <td className="py-4 px-4">
                        <button className="px-4 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-indigo-600 transition">
                        View
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
  

        </table>
      </div>
    </div>
  );
}

export default OrderHistory;