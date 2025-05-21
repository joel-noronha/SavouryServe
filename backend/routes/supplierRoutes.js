const express = require("express");
const db = require("../db");
const router = express.Router();

//create place

router.post("/supplier-add", async (req, res) => {
  const {
    place_id,
    supplier_name,
    supplier_gstin,
    supplier_phoneno,
    supplier_address,
    supplier_status,
  } = req.body;

  if (
    !place_id ||
    !supplier_name ||
    !supplier_gstin ||
    !supplier_phoneno ||
    !supplier_address ||
    !supplier_status
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const allowedStatus = ["active", "inactive"];
  if (!allowedStatus.includes(supplier_status.toLowerCase())) {
    return res.status(400).json({ message: "Invalid Supplier status" });
  }

  try {
    const sql = `INSERT INTO suppliers 
    (place_id, supplier_name, supplier_gstin, supplier_phoneno, supplier_address, supplier_status) 
    VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(
      sql,
      [
        place_id,
        supplier_name,
        supplier_gstin,
        supplier_phoneno,
        supplier_address,
        supplier_status,
      ],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: "Supplier created successfully" });
      }
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Supplier already exists." });
    }
    console.error("DB error:", error);
    res.status(500).json({ message: error.message });
  }
});

//update place
router.put("/supplier-update/:id", (req, res) => {
  const { id } = req.params;
  const {
    place_id,
    supplier_name,
    supplier_gstin,
    supplier_phoneno,
    supplier_address,
    supplier_status,
  } = req.body;

  if (
    !place_id ||
    !supplier_name ||
    !supplier_gstin ||
    !supplier_phoneno ||
    !supplier_address ||
    !supplier_status
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const allowedStatus = ["active", "inactive"];
  if (!allowedStatus.includes(supplier_status.toLowerCase())) {
    return res.status(400).json({ message: "Invalid supplier status" });
  }

  const sql =
    "UPDATE suppliers SET place_id = ?, supplier_name = ?, supplier_gstin = ?, supplier_phoneno = ?, supplier_address = ?, supplier_status = ? WHERE supplier_id = ?";

  db.query(
    sql,
    [
      place_id,
      supplier_name,
      supplier_gstin,
      supplier_phoneno,
      supplier_address,
      supplier_status,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      res.status(200).json({ message: "Supplier updated successfully." });
    }
  );
});

//delete supplier
router.delete("/supplier-delete/:supplier_id", async (req, res) => {
  const { supplier_id } = req.params;

  if (!supplier_id) {
    return res.status(400).json({ message: "Supplier is required" });
  }

  const sql = `DELETE FROM suppliers WHERE supplier_id = ?`;

  db.query(sql, [supplier_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "supplier not found" });
    }
    res.status(200).json({ message: "Supplier Deleted" });
  });
});

//view place
router.get("/supplier-all", (req, res) => {
  const sql = "SELECT * FROM suppliers ORDER BY supplier_id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
