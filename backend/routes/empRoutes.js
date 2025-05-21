const express = require("express");
const db = require("../db");
const router = express.Router();

//view
router.get("/", (req, res) => {
  const sql = `
      SELECT * FROM booking
      WHERE booking_status = 'quotation_sent'
      ORDER BY booking_date DESC
    `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get booking details (including cart items)
router.get("/:order_number", (req, res) => {
  const { order_number } = req.params;

  const bookingSQL = `SELECT * FROM booking WHERE order_number = ?`;
  const itemsSQL = `
      SELECT ot.item_quantity, i.item_name, i.item_price,
             (i.item_price * ot.item_quantity) AS total_price
      FROM order_temp ot
      JOIN item i ON ot.item_id = i.item_id
      WHERE ot.order_number = ?
    `;

  db.query(bookingSQL, [order_number], (err1, bookingData) => {
    if (err1) return res.status(500).json({ error: err1.message });
    if (bookingData.length === 0)
      return res.status(404).json({ error: "Booking not found" });

    db.query(itemsSQL, [order_number], (err2, itemData) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({
        booking: bookingData[0],
        items: itemData,
      });
    });
  });
});

// Confirm booking and apply discount
router.post("/confirm", (req, res) => {
  const { order_number, discount } = req.body;

  if (!order_number || discount === undefined) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const cartSQL = `
    SELECT i.item_price, ot.item_quantity
    FROM order_temp ot
    JOIN item i ON ot.item_id = i.item_id
    WHERE ot.order_number = ?
  `;

  db.query(cartSQL, [order_number], (err, items) => {
    if (err) return res.status(500).json({ error: err.message });

    const grand_total = items.reduce(
      (sum, item) => sum + item.item_price * item.item_quantity,
      0
    );
    const discount_amount = (discount / 100) * grand_total;
    const final_total = grand_total - discount_amount;

    const updateSQL = `
      UPDATE booking
      SET discount = ?, grand_total = ?, final_total = ?, booking_status = 'confirmed'
      WHERE order_number = ?
    `;

    db.query(
      updateSQL,
      [discount, grand_total, final_total, order_number],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });

        res.json({
          message: "Booking confirmed",
          grand_total,
          discount_percent: discount,
          discount_amount,
          final_total,
        });
      }
    );
  });
});

module.exports = router;
