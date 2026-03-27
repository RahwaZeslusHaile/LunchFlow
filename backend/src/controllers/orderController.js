import {createOrderWithItems,getOrdersByDate}  from "../services/orderService.js";


function sendError(res, err) {
  console.error(err);

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({ message: "Database error" });
}



export async function addItems(req, res) {
  try {
    const { date, attendance, items } = req.body;

    if (!date || !attendance || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const order_id = await createOrderWithItems(date, attendance, items);

    res.json({
      message: "Order created successfully",
      order_id
    });

  } catch (err) {
    sendError(res, err);
  }
}

export async function fetchOrders(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const data = await getOrdersByDate(date);

    res.json(data);

  } catch (err) {
    sendError(res, err);
  }
}