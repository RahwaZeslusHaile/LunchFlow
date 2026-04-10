import {
  getLatestEventSteps,
  getEventStepsByOrderId,
} from "../services/eventStepsService.js";

function sendError(res, err) {
  console.error(err);
  return res.status(500).json({ message: "Database error" });
}

export async function fetchEventStep(req, res) {
  try {
    const { order_id } = req.params;
    const eventsStep = order_id
      ? await getEventStepsByOrderId(order_id)
      : await getLatestEventSteps();
    res.json(eventsStep);
  } catch (err) {
    sendError(res, err);
  }
}