const express = require("express");
const { pool } = require("../db.js");

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

module.exports = router;
