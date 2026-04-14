async function updateStepsFromForms(forms, order_id, volunteer_id) {
  if (!order_id) return;
  if (forms.includes("attendance")) await updateSingleStep(order_id, 1, "in_progress", volunteer_id);
  if (forms.includes("leftover")) await updateSingleStep(order_id, 2, "in_progress", volunteer_id);
  if (forms.includes("order")) await updateSingleStep(order_id, 3, "in_progress", volunteer_id);
}
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  createInvite,
  createUser,
  findActiveInviteByToken,
  findUserByEmail,
  markInviteAsUsed,
  validateInviteToken,
  findFormsByUserId,
  getAllInvites as getAllInvitesModel,
  updateUserForms,
} from "../models/authModel.js";
import { sendVolunteerInvite, sendVolunteerUpdateNotification } from "./mailService.js";
import { updateSingleStep } from "./eventStepsService.js";
import pool from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_in_prod";

function serviceError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function generateToken(user) {
  return jwt.sign(
    { userId: user.account_id, email: user.email, roleId: user.role_id },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

export async function signup({ token, password, confirmPass }) {
  if (!token) {
    throw serviceError(400, "An invite token is required to sign up");
  }

  if (!password || !password.trim()) {
    throw serviceError(400, "Password is required");
  }

  if (password !== confirmPass) {
    throw serviceError(400, "Passwords do not match");
  }

  const invite = await findActiveInviteByToken(token);
  if (!invite) {
    throw serviceError(400, "Invite link is invalid or has expired");
  }

  const existingUser = await findUserByEmail(invite.email);
  if (existingUser) {
    throw serviceError(400, "An account for this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser(invite.email, hashedPassword, 2, invite.forms || [], invite.name);
  await markInviteAsUsed(invite.invite_id);

  if (invite.order_id && newUser?.account_id) {
    await updateStepsFromForms(invite.forms || [], invite.order_id, newUser.account_id);
  }

  return { message: "Account created successfully" };
}

export async function login({ userName, password }) {
  if (!userName || !userName.trim()) {
    throw serviceError(400, "Username is required");
  }

  if (!password || !password.trim()) {
    throw serviceError(400, "Password is required");
  }

  const user = await findUserByEmail(userName);
  if (!user) {
    throw serviceError(400, "User does not exist");
  }

  const validPassword = await bcrypt.compare(password, user.pass);
  if (!validPassword) {
    throw serviceError(400, "Password is wrong");
  }

  return {
    message: "Login successful",
    token: generateToken(user),
    user: { email: user.email, roleId: user.role_id },
  };
}

export async function createVolunteerInvite({ email, name, createdBy, forms = [], order_id = null }) {
  if (!email || !email.trim()) {
    throw serviceError(400, "Email is required");
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    await updateUserForms(email, forms);
    
    const logToken = `updated_${crypto.randomBytes(16).toString("hex")}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await createInvite(email, logToken, expiresAt, createdBy, forms, name || existing.name, order_id);
    
    const newInvite = await findActiveInviteByToken(logToken);
    if (newInvite) {
      await markInviteAsUsed(newInvite.invite_id);
    }

    await updateStepsFromForms(forms, order_id, createdBy);

    try {
      await sendVolunteerUpdateNotification(email, forms);
    } catch (err) {
      console.error("Failed to send update notification:", err);
      return { message: "Volunteer forms updated, but notification email failed to send.", existing: true };
    }

    return { message: "Volunteer already has an account. Their assigned forms have been updated and they have been notified.", existing: true };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  console.log(`Creating volunteer invite for email: ${email}, name: ${name}, forms: ${forms}, order_id: ${order_id}`);
  
  await createInvite(email, token, expiresAt, createdBy, forms, name, order_id);
  await updateStepsFromForms(forms, order_id, createdBy);

  try {
    await sendVolunteerInvite(email, token, forms);
  } catch (err) {
    console.error("Failed to send email:", err);
    throw serviceError(500, `Invite created but email failed to send: ${err.message}`);
  }

  return { message: "Invite created and email sent", token };
}

export async function getUserForms(userId) {
  const userResult = await pool.query(
    `SELECT email FROM account WHERE account_id = $1`,
    [userId]
  );
  const userEmail = userResult.rows[0]?.email;
  if (!userEmail) return { forms: [] };

  const inviteResult = await pool.query(
    `SELECT order_id, forms
     FROM invites
     WHERE email = $1 AND used = TRUE
     ORDER BY expires_at DESC
     LIMIT 1`,
    [userEmail]
  );

  if (!inviteResult.rows.length) return { forms: [] };

  const { order_id, forms: rawForms } = inviteResult.rows[0];
  const forms = typeof rawForms === "string"
    ? JSON.parse(rawForms)
    : rawForms || [];

  if (!order_id || !forms.length) return { forms: [] };

  const FORM_TO_STEP = { attendance: 1, leftover: 2, order: 3 };

  const stepsResult = await pool.query(
    `SELECT step_position, step_status FROM event_steps WHERE order_id = $1`,
    [order_id]
  );
  const stepsMap = {};
  stepsResult.rows.forEach((s) => {
    stepsMap[s.step_position] = s.step_status;
  });

  const stepRows = forms
    .filter((f) => FORM_TO_STEP[f] != null)
    .map((f) => ({
      order_id,
      step_position: FORM_TO_STEP[f],
      step_status: stepsMap[FORM_TO_STEP[f]] || "in_progress",
    }));

  return { forms: stepRows };
}

export async function validateInvite(token) {
  const invite = await validateInviteToken(token);
  if (!invite) {
    throw serviceError(400, "Invite link is invalid or has expired");
  }

  return { email: invite.email, name: invite.name, forms: invite.forms, order_id: invite.order_id };
}

export function verifyJwt(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function getAllInvites() {
  const invites = await getAllInvitesModel();
  return invites;
}
