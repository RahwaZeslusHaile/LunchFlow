import {
  createVolunteerInvite,
  login,
  signup,
  validateInvite,
  getUserForms,
} from "../services/authService.js";

function sendError(res, err) {
  console.error(err);
  if (err.status) {
    return res.status(err.status).json(err.message);
  }
  return res.status(500).json("Database error");
}

export async function signupController(req, res) {
  try {
    const result = await signup(req.body);
    return res.json(result);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function loginController(req, res) {
  try {
    const result = await login(req.body);
    return res.json(result);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function createInviteController(req, res) {
  try {
    const result = await createVolunteerInvite({
      email: req.body.email,
      forms: req.body.forms,
      createdBy: req.user.userId,
    });
    return res.json(result);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getUserFormsController(req, res) {
  try {
    const result = await getUserForms(req.user.userId);
    return res.json(result);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function validateInviteController(req, res) {
  try {
    const result = await validateInvite(req.params.token);
    return res.json(result);
  } catch (err) {
    return sendError(res, err);
  }
}
