import pool from "../db.js";

export async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM account WHERE email = $1", [email]);
  return result.rows[0];
}

export async function createUser(email, passwordHash, roleId) {
  const result = await pool.query(
    "INSERT INTO account (email, pass, role_id) VALUES ($1, $2, $3) RETURNING account_id",
    [email, passwordHash, roleId]
  );
  return result.rows[0];
}

export async function findActiveInviteByToken(token) {
  const result = await pool.query(
    "SELECT * FROM invites WHERE token = $1 AND used = FALSE AND expires_at > NOW()",
    [token]
  );
  return result.rows[0];
}

export async function markInviteAsUsed(inviteId) {
  await pool.query("UPDATE invites SET used = TRUE WHERE invite_id = $1", [inviteId]);
}

export async function createInvite(email, token, expiresAt, createdBy) {
  await pool.query(
    "INSERT INTO invites (email, token, expires_at, created_by) VALUES ($1, $2, $3, $4)",
    [email, token, expiresAt, createdBy]
  );
}

export async function validateInviteToken(token) {
  const result = await pool.query(
    "SELECT email FROM invites WHERE token = $1 AND used = FALSE AND expires_at > NOW()",
    [token]
  );
  return result.rows[0];
}
