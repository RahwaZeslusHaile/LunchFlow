import pool from "../db.js";

export async function recordSubmission(accountId, email, formType, submissionData, order_id = null) {
  await pool.query(
    `INSERT INTO form_submissions (account_id, email, form_type, submission_data, order_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [accountId, email, formType, JSON.stringify(submissionData), order_id]
  );
}

export async function getRecentSubmissions() {
  const result = await pool.query(
    `SELECT 
       submission_id, 
       email, 
       form_type, 
       submission_data, 
       submitted_at 
     FROM form_submissions 
     ORDER BY submitted_at DESC 
     LIMIT 50`
  );
  return result.rows;
}
