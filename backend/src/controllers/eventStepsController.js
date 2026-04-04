import {
  getEventStep

} from "../services/eventStepsService.js";
export async function fetchEventStep(req, res) {
  try {
    const { order_id } = req.params;
    const eventsStep= await getEventStep(order_id);
    res.json(eventsStep);
  } catch (err) {
    sendError(res, err);
  }
}