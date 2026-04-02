import {
    fetchAttendance, insertAttendance
} from "../services/attendanceService.js";

function sendError(res, err) {
  console.error(err);
  if (err.status) {
    return res.status(err.status).json(err.message);
  }
  return res.status(500).json("Database error");
}

export async function getAttendance(req, res) {
  try {
    const { date } = req.query;
    const result = await fetchAttendance(date);
    return res.json(result);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function createAttendance(req, res) {
  try {
    const { class_id, trainee_count, volunteer_count } = req.body;

    if (!class_id || trainee_count == null || volunteer_count == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAttendance = await insertAttendance({ class_id, trainee_count, volunteer_count });
    return res.status(201).json(newAttendance);
    
  } catch (err) {
    return sendError(res, err);
  }
}
