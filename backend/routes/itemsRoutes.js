const express = require("express");
const db = require("../db");
const router = express.Router();
const upload = require("../middleware/fileuploader");
// Add new item
router.post("/item-add", upload.single("item_image"), (req, res) => {
  const {
    category_id,
    item_name,
    item_description,
    item_price,
    item_status,
    item_measure,
  } = req.body;

  const item_image = req.file ? req.file.filename : null;
  if (
    !category_id ||
    !item_name ||
    !item_description ||
    !item_price ||
    !item_status ||
    !item_measure
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const sql = `INSERT INTO item 
    (category_id, item_name, item_image, item_description, item_price, item_status, item_measure) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      category_id,
      item_name,
      item_image,
      item_description,
      item_price,
      item_status,
      item_measure,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ message: "Item added successfully" });
    }
  );
});

// Update item
router.put("/item-update/:id", upload.single("item_image"), (req, res) => {
  const { id } = req.params;
  const {
    category_id,
    item_name,
    item_description,
    item_price,
    item_status,
    item_measure,
  } = req.body;
  console.log("Received file:", req.file);
  console.log("Request body:", req.body);
  const item_image = req.file ? req.file.filename : null;
  if (
    !category_id ||
    !item_name ||
    !item_description ||
    !item_price ||
    !item_status ||
    !item_measure
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const sql = `UPDATE item 
    SET category_id = ?, item_name = ?, item_image = ?, item_description = ?, item_price = ?, item_status = ?, item_measure = ?
    WHERE item_id = ?`;

  db.query(
    sql,
    [
      category_id,
      item_name,
      item_image,
      item_description,
      item_price,
      item_status,
      item_measure,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json({ message: "Item updated successfully" });
    }
  );
});

// Delete item
router.delete("/item-delete/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM item WHERE item_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  });
});

// Get all items
router.get("/item-all", (req, res) => {
  const sql = "SELECT * FROM item ORDER BY item_id DESC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.status(200).json(results);
  });
});

//Get items by category
router.get("/", (req, res) => {
  const { category_id } = req.query;

  let sql = `SELECT * FROM item WHERE item_status = 'active'`;
  let params = [];

  if (category_id) {
    sql += ` AND category_id = ?`;
    params.push(category_id);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
module.exports = router;
