import pool from "../db.js";

export async function recordSubmission(accountId, email, formType, submissionData) {
  await pool.query(
    `INSERT INTO form_submissions (account_id, email, form_type, submission_data)
     VALUES ($1, $2, $3, $4)`,
    [accountId, email, formType, JSON.stringify(submissionData)]
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
