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
} from "../models/authModel.js";
import { sendVolunteerInvite } from "./mailService.js";

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
  await createUser(invite.email, hashedPassword, 2, invite.forms || []);
  await markInviteAsUsed(invite.invite_id);

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

export async function createVolunteerInvite({ email, createdBy, forms = [] }) {
  if (!email || !email.trim()) {
    throw serviceError(400, "Email is required");
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw serviceError(400, "An account with this email already exists");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await createInvite(email, token, expiresAt, createdBy, forms);
  
  let emailSent = true;
  try {
    await sendVolunteerInvite(email, token, forms);
  } catch (err) {
    emailSent = false;
    console.error("Failed to send email:", err);
  }

  return { message: emailSent 
              ? "Invite created and email sent" 
              : "Invite created but email failed to send", token };
}

export async function getUserForms(userId) {
  const forms = await findFormsByUserId(userId);
  return { forms: forms || [] };
}

export async function validateInvite(token) {
  const invite = await validateInviteToken(token);
  if (!invite) {
    throw serviceError(400, "Invite link is invalid or has expired");
  }

  return { email: invite.email };
}

export function verifyJwt(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function getAllInvites() {
  const invites = await getAllInvitesModel();
  return invites;
}
