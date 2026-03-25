import { addOrder, addOrderItems}  from "../services/orderService.js";

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
    const newOrder = await addOrder(date, attendance);
    const order_id = newOrder.order_id;
    for (const item of items){
        await addOrderItems(
        order_id,
        item.menu_item_id,
        item.quantity
      );
    }
    res.json({
      message: "Order created successfully",
      order_id
    });

 } catch (err) {
    sendError(res, err);
  }
}