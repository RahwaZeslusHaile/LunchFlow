import { fetchAttendance, insertAttendance } from "../services/attendanceService.js";

function sendError(res, err) {
  console.error(err);

  if (err.status && err.message) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({ message: "Database error" });
}

export async function getAttendance(req, res) {
  try {
    const result = await fetchAttendance();
    return res.status(200).json(result);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function createAttendance(req, res) {
  try {
    const { class_id, trainee_count, volunteer_count, order_id } = req.body;

    if (
      !class_id ||
      trainee_count == null ||
      volunteer_count == null ||
      !order_id
    ) {
      return res.status(400).json({
        message:
          "Missing required fields (class_id, trainee_count, volunteer_count, order_id)",
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const newAttendance = await insertAttendance({
      class_id,
      trainee_count,
      volunteer_count,
      userId: req.user.userId,
      email: req.user.email,
      order_id,
    });

    return res.status(201).json(newAttendance);
  } catch (err) {
    return sendError(res, err);
  }
}