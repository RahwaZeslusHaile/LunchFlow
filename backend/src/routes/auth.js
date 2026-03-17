import { Router } from "express";
import pool from "../db.js";
import  bcrypt from "bcrypt";

const router = Router();


async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM account WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

async function createUser(email, passwordHash, role_id) {
  await pool.query(
    "INSERT INTO account (email, pass, role_id) VALUES ($1,$2,$3)",
    [email, passwordHash, role_id]
  );
}


router.post("/signup", async (req, res) => {
  try {

  const { userName, password, confirmPass } = req.body;
  const role_id = 2; 

  if (!userName || !userName.trim()) {
    return res.status(400).json("Username is required");
  }

  if (!password || !password.trim()) {
    return res.status(400).json("Password is required");
  }

  if (password !== confirmPass) {
    return res.status(400).json("Passwords do not match");
  }

  const existingUser = await findUserByEmail(userName);

  if (existingUser) {
    return res.status(400).json("User already exists");
}
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(userName, hashedPassword, role_id);
    res.json({
      message: "User created successfully"
    });
  } catch (err) {
    console.error("Signup Auth Error:", err);
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

    res.json({
      message: "Login successful",
      user: user.email
    });

  } catch (err) {
    console.error("Login Auth Error:", err);
    res.status(500).json("Database error");
  }
});

export default router;