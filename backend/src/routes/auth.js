import { Router } from "express";
import pool from "../db.js";
import  bcrypt from "bcrypt"



const router = Router();
router.post("/signup", async (req, res) => {
  try {

    const { userName, password,confirmPass,role_id} = req.body;
    
  
     if (password !== confirmPass) {
      return res.status(400).json("Passwords do not match");
    }

        const hashedPassword = await bcrypt.hash(password, 10);
          await pool.query(
        "INSERT INTO account (email, pass,role_id) VALUES ($1,$2,$3)",
        [userName, hashedPassword,role_id]
          );

    
  
    res.json("DONE");

  } catch (err) {

    console.error(err);
    res.status(500).json("database error");

  }
});

export default router;