import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET /api/users
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
