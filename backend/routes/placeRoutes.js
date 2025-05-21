const express = require("express");
const db = require("../db");
const router = express.Router();

//create place

router.post("/place-add", async (req, res) => {
  const { place_name, place_status } = req.body;

  if (!place_name || !place_status) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const allowedStatus = ["active", "inactive"];
  if (!allowedStatus.includes(place_status.toLowerCase())) {
    return res.status(400).json({ message: "Invalid place status" });
  }

  try {
    const result = await db.execute(
      "INSERT INTO place (place_name, place_status) VALUES (?, ?)",
      [place_name, place_status]
    );
    res.status(200).json({
      message: "place added successfully.",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "place already exists." });
    }
    console.error("DB error:", error);
    res.status(500).json({ message: error.message });
  }
});

//update place
router.put("/place-update/:id", (req, res) => {
  const { id } = req.params;
  const { place_name, place_status } = req.body;

  if (!place_name || !place_status) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const allowedStatus = ["active", "inactive"];
  if (!allowedStatus.includes(place_status.toLowerCase())) {
    return res.status(400).json({ message: "Invalid place status" });
  }

  const sql =
    "UPDATE place SET place_name = ?, place_status = ? WHERE place_id = ?";

  db.query(sql, [place_name, place_status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "place not found" });
    }

    res.status(200).json({ message: "place updated successfully." });
  });
});

//delete place
router.delete("/delete-place/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "place is required" });
  }

  const sql = "DELETE FROM place WHERE place_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "place not found" });
    }
    res.status(200).send("place deleted");
  });
});

//view place
router.get("/place-all", (req, res) => {
  const sql = "SELECT * FROM place ORDER BY place_id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(results);
  });
});

//view all active places
router.get("/place-active", (req, res) => {
  const sql = "SELECT * FROM place WHERE place_status = 'active'";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
