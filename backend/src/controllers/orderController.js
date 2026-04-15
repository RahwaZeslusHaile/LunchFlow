
import {updateOrderWithItems, getOrdersByDate, createOrder, createOrderWithSteps, getLatestOrder, deleteOrderById}  from "../services/orderService.js";
import { sendOrderSummary } from "../services/mailService.js";

export async function getActiveOrder(req, res) {
  try {
    const order = await getLatestOrder();
    if (!order) {
      return res.status(404).json({ message: "No active event found" });
    }
    res.json(order);
  } catch (err) {
    sendError(res, err);
  }
}

function sendError(res, err) {
  console.error(err);

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({ message: "Database error" });
}

export async function addItems(req, res) {
  try {
    const { order_id, attendance, items } = req.body;

    if (!order_id || attendance == null || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const updatedOrderId = await updateOrderWithItems(
      order_id, 
      Number(attendance), 
      items, 
      req.user.userId, 
      req.user.email
    );

    res.json({
      message: "Order updated successfully",
      order_id: updatedOrderId
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


export async function createEvent(req, res) {
  try {
    const { order_date, attendance,assigned_admin } = req.body;

    if  (!order_date || attendance == null || assigned_admin == null)  { 
    return res.status(400).json({ message: "Invalid input" });
    }

    const order_id = await createOrderWithSteps(order_date, attendance,assigned_admin);

    res.json({
      message: "Event created successfully",
      order_id
    });

  } catch (err) {
    sendError(res, err);
  }
}


// Delete order record

export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    await deleteOrderById(id);

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting order" });
  }
}

export async function shareOrderEmail(req, res) {
  try {
    const { email, orderData } = req.body;
    if (!email || !orderData) {
      return res.status(400).json({ message: "Email and order data are required" });
    }
    await sendOrderSummary(email, orderData);
    res.json({ message: "Order summary sent successfully to " + email });
  } catch (err) {
    sendError(res, err);
  }
}