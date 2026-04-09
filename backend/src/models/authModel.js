import pool from "../db.js";

export async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM account WHERE email = $1", [email]);
  return result.rows[0];
}

export async function createUser(email, passwordHash, roleId, forms = [], name = null) {
  const result = await pool.query(
    "INSERT INTO account (email, pass, role_id, forms, name) VALUES ($1, $2, $3, $4, $5) RETURNING account_id",
    [email, passwordHash, roleId, JSON.stringify(forms), name]
  );
  return result.rows[0];
}

export async function updateUserForms(email, forms) {
  await pool.query(
    "UPDATE account SET forms = $1 WHERE email = $2",
    [JSON.stringify(forms), email]
  );
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

export async function createInvite(email, token, expiresAt, createdBy, forms = [], name = null) {
  await pool.query(
    "INSERT INTO invites (email, token, expires_at, created_by, forms, name) VALUES ($1, $2, $3, $4, $5, $6)",
    [email, token, expiresAt, createdBy, JSON.stringify(forms), name]
  );
}

export async function findFormsByUserId(userId) {
  const result = await pool.query("SELECT forms FROM account WHERE account_id = $1", [userId]);
  let forms = result.rows[0]?.forms || [];
  if (typeof forms === 'string') {
    try { forms = JSON.parse(forms); } catch (e) { forms = []; }
  }
  return Array.isArray(forms) ? forms : [];
}

export async function validateInviteToken(token) {
  const result = await pool.query(
    "SELECT email, forms, name FROM invites WHERE token = $1 AND used = FALSE AND expires_at > NOW()",
    [token]
  );
  const row = result.rows[0];
  if (row && typeof row.forms === 'string') {
    try { row.forms = JSON.parse(row.forms); } catch (e) { row.forms = []; }
  }
  return row;
}

export async function getAllInvites() {
  const result = await pool.query(
    "SELECT invite_id, email, name, used, expires_at, forms FROM invites ORDER BY expires_at DESC"
  );
  return result.rows.map(row => {
    if (typeof row.forms === 'string') {
      try { row.forms = JSON.parse(row.forms); } catch (e) { row.forms = []; }
    }
    if (!Array.isArray(row.forms)) row.forms = [];
    return row;
  });
}
