const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM renters ORDER BY renter_id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.get("/:id", (req, res) => {
  db.query("SELECT * FROM renters WHERE renter_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Renter not found" });
    res.json(result[0]);
  });
});

router.post("/", (req, res) => {
  const { name, email, phone } = req.body;
  db.query(
    "INSERT INTO renters (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Renter added successfully", renterId: result.insertId });
    }
  );
});

router.put("/:id", (req, res) => {
  const { name, email, phone } = req.body;
  db.query(
    "UPDATE renters SET name = ?, email = ?, phone = ? WHERE renter_id = ?",
    [name, email, phone, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Renter updated successfully" });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM renters WHERE renter_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Renter deleted successfully" });
  });
});

module.exports = router;