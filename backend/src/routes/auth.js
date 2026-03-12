import { Router } from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_in_prod";


async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM account WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

async function createUser(email, passwordHash, role_id) {
  const result = await pool.query(
    "INSERT INTO account (email, pass, role_id) VALUES ($1, $2, $3) RETURNING account_id",
    [email, passwordHash, role_id]
  );
  return result.rows[0];
}

function generateToken(user) {
  return jwt.sign(
    { userId: user.account_id, email: user.email, roleId: user.role_id },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}


function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json("Authorisation required");
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.roleId !== 1) {
      return res.status(403).json("Admin access required");
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json("Invalid or expired token");
  }
}


router.post("/signup", async (req, res) => {
  try {
    const { token, password, confirmPass } = req.body;

    if (!token) {
      return res.status(400).json("An invite token is required to sign up");
    }

    if (!password || !password.trim()) {
      return res.status(400).json("Password is required");
    }

    if (password !== confirmPass) {
      return res.status(400).json("Passwords do not match");
    }

    const inviteResult = await pool.query(
      "SELECT * FROM invites WHERE token = $1 AND used = FALSE AND expires_at > NOW()",
      [token]
    );
    const invite = inviteResult.rows[0];

    if (!invite) {
      return res.status(400).json("Invite link is invalid or has expired");
    }

    const existingUser = await findUserByEmail(invite.email);
    if (existingUser) {
      return res.status(400).json("An account for this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(invite.email, hashedPassword, 2); // role_id 2 = Volunteer

    await pool.query(
      "UPDATE invites SET used = TRUE WHERE invite_id = $1",
      [invite.invite_id]
    );

    res.json({ message: "Account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Database error");
  }
});


router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !userName.trim()) {
      return res.status(400).json("Username is required");
    }

    if (!password || !password.trim()) {
      return res.status(400).json("Password is required");
    }

    const user = await findUserByEmail(userName);

    if (!user) {
      return res.status(400).json("User does not exist");
    }

    const validPassword = await bcrypt.compare(password, user.pass);

    if (!validPassword) {
      return res.status(400).json("Password is wrong");
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { email: user.email, roleId: user.role_id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Database error");
  }
});


router.post("/invite", requireAdmin, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json("Email is required");
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json("An account with this email already exists");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      "INSERT INTO invites (email, token, expires_at, created_by) VALUES ($1, $2, $3, $4)",
      [email, token, expiresAt, req.user.userId]
    );

    res.json({ message: "Invite created", token });
  } catch (err) {
    console.error(err);
    res.status(500).json("Database error");
  }
});


router.get("/invite/validate/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const result = await pool.query(
      "SELECT email FROM invites WHERE token = $1 AND used = FALSE AND expires_at > NOW()",
      [token]
    );
    if (!result.rows[0]) {
      return res.status(400).json("Invite link is invalid or has expired");
    }
    res.json({ email: result.rows[0].email });
  } catch (err) {
    console.error(err);
    res.status(500).json("Database error");
  }
});

export default router;