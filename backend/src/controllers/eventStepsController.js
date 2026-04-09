import {
  getLatestEventSteps

} from "../services/eventStepsService.js";
export async function fetchEventStep(req, res) {
  try {
    // const { order_id } = req.params;
    const eventsStep= await getLatestEventSteps();
    res.json(eventsStep);
  } catch (err) {
    sendError(res, err);
  }
}