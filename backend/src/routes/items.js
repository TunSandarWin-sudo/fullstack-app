import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET /api/items
 * 获取所有菜单项
 */
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM items");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/items
 * 新增菜单项 (Create)
 */
router.post("/", async (req, res) => {
  const { name, price } = req.body;

  // 简单校验
  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO items (name, price) VALUES (?, ?)",
      [name, price]
    );
    res.json({ id: result.insertId, name, price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/items/:id
 * 更新菜单项 (Update)
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE items SET name = ?, price = ? WHERE id = ?",
      [name, price, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ id, name, price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/items/:id
 * 删除菜单项 (Delete)
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM items WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
