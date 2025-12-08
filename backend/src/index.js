const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const itemsRouter = require("./routes/items.js");
const usersRouter = require("./routes/users.js");
const { pool } = require("./db.js");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

// 健康检查接口
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch {
    res.status(500).json({ status: "error" });
  }
});

// 挂载路由
app.use("/api/items", itemsRouter);
app.use("/api/users", usersRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on ${port}`));
