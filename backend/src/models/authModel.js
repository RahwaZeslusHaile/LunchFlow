import pool from "../db.js";

export async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM account WHERE email = $1", [email]);
  return result.rows[0];
}

export async function createUser(email, passwordHash, roleId, forms = []) {
  const result = await pool.query(
    "INSERT INTO account (email, pass, role_id, forms) VALUES ($1, $2, $3, $4) RETURNING account_id",
    [email, passwordHash, roleId, JSON.stringify(forms)]
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

export async function createInvite(email, token, expiresAt, createdBy, forms = []) {
  await pool.query(
    "INSERT INTO invites (email, token, expires_at, created_by, forms) VALUES ($1, $2, $3, $4, $5)",
    [email, token, expiresAt, createdBy, JSON.stringify(forms)]
  );
}

export async function findFormsByUserId(userId) {
  const result = await pool.query("SELECT forms FROM account WHERE account_id = $1", [userId]);
  return result.rows[0]?.forms || [];
}

export async function validateInviteToken(token) {
  const result = await pool.query(
    "SELECT email FROM invites WHERE token = $1 AND used = FALSE AND expires_at > NOW()",
    [token]
  );
  return result.rows[0];
}
