const express = require("express");
const db = require("../db");
const router = express.Router();

//create category

router.post("/category-add", async (req, res) => {
  const { category_name, category_status } = req.body;

  if (!category_name || !category_status) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const allowedStatus = ["active", "inactive"];
  if (!allowedStatus.includes(category_status.toLowerCase())) {
    return res.status(400).json({ message: "Invalid category status" });
  }

  try {
    const result = await db.execute(
      "INSERT INTO category (category_name, category_status) VALUES (?, ?)",
      [category_name, category_status]
    );
    res.status(200).json({
      message: "Category added successfully.",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Category already exists." });
    }
    console.error("DB error:", error);
    res.status(500).json({ message: error.message });
  }
});

//delete category
router.delete("/delete-cat/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Category is required" });
  }

  const sql = "DELETE FROM category WHERE category_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category is deleted" });
  });
});

//update category
router.put("/category-update/:id", (req, res) => {
  const { id } = req.params;
  const { category_name, category_status } = req.body;

  if (!category_name || !category_status) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const allowedStatus = ["active", "inactive"];
  if (!allowedStatus.includes(category_status.toLowerCase())) {
    return res.status(400).json({ message: "Invalid category status" });
  }

  const sql =
    "UPDATE category SET category_name = ?, category_status = ? WHERE category_id = ?";

  db.query(sql, [category_name, category_status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully." });
  });
});

//view category
router.get("/category-all", (req, res) => {
  const sql = "SELECT * FROM category ORDER BY category_id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(results);
  });
});

//view all active categories
router.get("/category-active", (req, res) => {
  const sql = "SELECT * FROM category WHERE category_status = 'active'";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(results);
  });
});
module.exports = router;
