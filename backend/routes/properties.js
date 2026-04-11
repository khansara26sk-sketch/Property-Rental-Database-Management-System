const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all properties
router.get("/", (req, res) => {
  const sql = `
    SELECT properties.*, owners.name AS owner_name
    FROM properties
    LEFT JOIN owners ON properties.owner_id = owners.owner_id
    ORDER BY property_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to fetch properties", error: err });
    res.json(result);
  });
});

// GET single property
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM properties WHERE property_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to fetch property", error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(result[0]);
  });
});

// CREATE property
router.post("/", (req, res) => {
  const { type, owner_id, city } = req.body;

  if (!type || !owner_id || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "INSERT INTO properties (type, owner_id, city) VALUES (?, ?, ?)",
    [type, owner_id, city],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to add property", error: err });

      res.json({
        message: "Property added successfully",
        propertyId: result.insertId
      });
    }
  );
});

// UPDATE property
router.put("/:id", (req, res) => {
  const { type, owner_id, city } = req.body;

  if (!type || !owner_id || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "UPDATE properties SET type = ?, owner_id = ?, city = ? WHERE property_id = ?",
    [type, owner_id, city, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to update property", error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json({ message: "Property updated successfully" });
    }
  );
});

// DELETE property
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM properties WHERE property_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete property", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  });
});

module.exports = router;