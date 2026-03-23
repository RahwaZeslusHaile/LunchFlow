import {
    fetchAttendance
} from "../services/attendanceService.js";

function sendError(res, err) {
  console.error(err);
  if (err.status) {
    return res.status(err.status).json(err.message);
  }
  return res.status(500).json("Database error");
}

export async function attendanceController(req, res) {
  try {
    const result = await fetchAttendance(req.body);
    return res.json(result);
  } catch (err) {
    return sendError(res, err);
  }
}
