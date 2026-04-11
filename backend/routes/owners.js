const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all owners
router.get("/", (req, res) => {
  db.query("SELECT * FROM owners ORDER BY owner_id DESC", (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to fetch owners", error: err });
    res.json(result);
  });
});

// GET single owner
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM owners WHERE owner_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to fetch owner", error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.json(result[0]);
  });
});

// CREATE owner
router.post("/", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email and phone are required" });
  }

  db.query(
    "INSERT INTO owners (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to add owner", error: err });

      res.json({
        message: "Owner added successfully",
        ownerId: result.insertId
      });
    }
  );
});

// UPDATE owner
router.put("/:id", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email and phone are required" });
  }

  db.query(
    "UPDATE owners SET name = ?, email = ?, phone = ? WHERE owner_id = ?",
    [name, email, phone, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to update owner", error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Owner not found" });
      }

      res.json({ message: "Owner updated successfully" });
    }
  );
});

// DELETE owner
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM owners WHERE owner_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete owner", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.json({ message: "Owner deleted successfully" });
  });
});

module.exports = router;