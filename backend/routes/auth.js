const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const insertSql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(insertSql, [name, email, password, role], (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Signup successful",
        userId: result.insertId
      });
    });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result[0];

    res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});
router.post("/reset", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    db.query(
      "UPDATE users SET password = '123456' WHERE email = ?",
      [email],
      (err2) => {
        if (err2) {
          return res.status(500).json({ message: "Failed to reset password", error: err2 });
        }

        res.json({ message: "Password reset to 123456 (demo)" });
      }
    );
  });
});
module.exports = router;