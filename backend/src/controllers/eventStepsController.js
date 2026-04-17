import {
  getLatestEventSteps,
  getEventStepsByOrderId,
  updateSingleStep,
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

export async function updateStepStatus(req, res) {
  try {
    const { order_id } = req.params;
    const { step_position, step_status } = req.body;
    const userId = req.user?.userId;

    if (!order_id || !step_position || !step_status) {
      return res.status(400).json({ message: "Invalid input" });
    }

    await updateSingleStep(order_id, step_position, step_status, userId);
    res.json({ message: "Step status updated successfully" });
  } catch (err) {
    sendError(res, err);
  }
}