const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all agreements
router.get("/", (req, res) => {
  const sql = `
    SELECT agreements.*, renters.name AS renter_name, properties.type AS property_type
    FROM agreements
    LEFT JOIN renters ON agreements.renter_id = renters.renter_id
    LEFT JOIN properties ON agreements.property_id = properties.property_id
    ORDER BY agreement_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch agreements",
        error: err
      });
    }

    res.json(result);
  });
});

// GET single agreement
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM agreements WHERE agreement_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch agreement",
          error: err
        });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Agreement not found" });
      }

      res.json(result[0]);
    }
  );
});

// CREATE agreement
router.post("/", (req, res) => {
  const { renter_id, property_id, start_date, end_date } = req.body;

  if (!renter_id || !property_id || !start_date || !end_date) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  db.query(
    "INSERT INTO agreements (renter_id, property_id, start_date, end_date) VALUES (?, ?, ?, ?)",
    [renter_id, property_id, start_date, end_date],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to add agreement",
          error: err
        });
      }

      res.json({
        message: "Agreement added successfully",
        agreementId: result.insertId
      });
    }
  );
});

// UPDATE agreement
router.put("/:id", (req, res) => {
  const { renter_id, property_id, start_date, end_date } = req.body;

  if (!renter_id || !property_id || !start_date || !end_date) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  db.query(
    "UPDATE agreements SET renter_id = ?, property_id = ?, start_date = ?, end_date = ? WHERE agreement_id = ?",
    [renter_id, property_id, start_date, end_date, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to update agreement",
          error: err
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Agreement not found" });
      }

      res.json({ message: "Agreement updated successfully" });
    }
  );
});

// DELETE agreement
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM agreements WHERE agreement_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to delete agreement",
          error: err
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Agreement not found" });
      }

      res.json({ message: "Agreement deleted successfully" });
    }
  );
});

module.exports = router;