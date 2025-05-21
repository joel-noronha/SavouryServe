const express = require("express");
const db = require("../db");
const router = express.Router();

//  Add item to cart
router.post("/add", (req, res) => {
  const { order_number, item_id, item_quantity } = req.body;

  if (!order_number || !item_id || !item_quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Step 1: Check if the item is already in the cart
  const checkSQL = `SELECT * FROM order_temp WHERE order_number = ? AND item_id = ?`;
  db.query(checkSQL, [order_number, item_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      // Item exists, update quantity
      const existingQty = results[0].item_quantity;
      const newQty = existingQty + item_quantity;

      const updateSQL = `UPDATE order_temp SET item_quantity = ? WHERE order_number = ? AND item_id = ?`;
      db.query(updateSQL, [newQty, order_number, item_id], (updateErr) => {
        if (updateErr)
          return res.status(500).json({ error: updateErr.message });

        res.json({ message: "Cart updated with new quantity" });
      });
    } else {
      // Item does not exist, insert new
      const insertSQL = `INSERT INTO order_temp (order_number, item_id, item_quantity) VALUES (?, ?, ?)`;
      db.query(
        insertSQL,
        [order_number, item_id, item_quantity],
        (insertErr, result) => {
          if (insertErr)
            return res.status(500).json({ error: insertErr.message });

          res.json({ message: "Item added to cart", temp_id: result.insertId });
        }
      );
    }
  });
});

// list all booking for admin
router.get("/all", (req, res) => {
  const sql = `SELECT * FROM booking ORDER BY booking_date DESC`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// In your backend (assuming Express.js)
router.put("/booking/:order_id", (req, res) => {
  const orderId = req.params.order_id;
  const { booking_status, discount, final_total } = req.body;

  // Construct SQL query to update the booking status, discount, and final total
  const sql = `
    UPDATE booking
    SET booking_status = ?, discount = ?, final_total = ?
    WHERE order_id = ?
  `;

  db.query(
    sql,
    [booking_status, discount, final_total, orderId],
    (err, result) => {
      if (err) {
        console.error("Error updating booking:", err);
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows > 0) {
        return res
          .status(200)
          .json({ message: "Booking updated successfully" });
      } else {
        return res.status(404).json({ message: "Booking not found" });
      }
    }
  );
});

//
router.get("/details/:order_number", (req, res) => {
  const orderNumber = req.params.order_number;

  // Query to fetch the booking details along with items grouped for each order_number
  const sql = `
    SELECT b.*, i.item_name, i.item_price, ot.item_quantity
    FROM booking AS b
    JOIN order_temp AS ot ON b.order_number = ot.order_number
    JOIN item AS i ON ot.item_id = i.item_id
    WHERE b.order_number = ?`;

  db.query(sql, [orderNumber], (err, results) => {
    if (err) {
      console.error("Error fetching order details:", err);
      return res.status(500).json({ error: err.message });
    }

    // Group the results by order_number
    const orderDetails = results.reduce((acc, row) => {
      // Find an existing order object for the current order_number
      const order = acc.find((o) => o.order_number === row.order_number);
      if (!order) {
        // If this is the first item for this order_number, create the order object
        acc.push({
          order_id: row.order_id,
          customer_id: row.customer_id,
          order_number: row.order_number,
          booking_status: row.booking_status,
          booking_date: row.booking_date,
          program_date: row.program_date,
          place_id: row.place_id,
          program: row.program,
          discount: row.discount,
          grand_total: row.grand_total,
          final_total: row.final_total,
          items: [
            {
              item_name: row.item_name,
              item_price: row.item_price,
              item_quantity: row.item_quantity,
            },
          ],
        });
      } else {
        // If the order already exists, add the item to the 'items' array
        order.items.push({
          item_name: row.item_name,
          item_price: row.item_price,
          item_quantity: row.item_quantity,
        });
      }
      return acc;
    }, []);

    // Send the grouped order details as the response
    res.json(orderDetails[0]); // Send the first (and only) order
  });
});

// View cart by order_number (with item details + price)
router.get("/:order_number", (req, res) => {
  const { order_number } = req.params;

  const sql = `
      SELECT ot.temp_id, ot.item_id, ot.item_quantity, 
             i.item_name, i.item_price, 
             (i.item_price * ot.item_quantity) AS total_price
      FROM order_temp ot
      JOIN item i ON ot.item_id = i.item_id
      WHERE ot.order_number = ?
    `;

  db.query(sql, [order_number], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const total = results.reduce((sum, item) => sum + item.total_price, 0);

    res.json({ items: results, grand_total: total });
  });
});

// Update item quantity in cart
router.put("/update-quantity", (req, res) => {
  const { temp_id, item_quantity } = req.body;

  const sql = `UPDATE order_temp SET item_quantity = ? WHERE temp_id = ?`;
  db.query(sql, [item_quantity, temp_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Quantity updated" });
  });
});

// Update item quantity
router.post("/update", (req, res) => {
  const { temp_id, item_quantity } = req.body;

  if (!temp_id || !item_quantity) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = `UPDATE order_temp SET item_quantity = ? WHERE temp_id = ?`;

  db.query(sql, [item_quantity, temp_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Cart item updated" });
  });
});

//delete cart item
router.delete("/remove/:temp_id", (req, res) => {
  const { temp_id } = req.params;

  const sql = `DELETE FROM order_temp WHERE temp_id = ?`;

  db.query(sql, [temp_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Item removed from cart" });
  });
});

//checkout items from cart
router.post("/checkout", (req, res) => {
  const { order_number, customer_id, program_date, place_id, program } =
    req.body;

  if (!order_number || !customer_id || !program_date || !place_id || !program) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Get cart items and calculate subtotal
  const cartSQL = `
    SELECT i.item_price, ot.item_quantity
    FROM order_temp ot
    JOIN item i ON ot.item_id = i.item_id
    WHERE ot.order_number = ?
  `;

  db.query(cartSQL, [order_number], (err, cartItems) => {
    if (err) return res.status(500).json({ error: err.message });
    if (cartItems.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.item_price * item.item_quantity,
      0
    );

    // Insert or update booking
    const insertSQL = `
      INSERT INTO booking (
        customer_id, order_number, booking_status, booking_date, program_date,
        place_id, program, discount, grand_total
      ) VALUES (?, ?, 'pending', NOW(), ?, ?, ?, 0, ?)
      ON DUPLICATE KEY UPDATE
        customer_id = VALUES(customer_id),
        program_date = VALUES(program_date),
        place_id = VALUES(place_id),
        program = VALUES(program),
        booking_status = 'pending',
        discount = 0,
        grand_total = VALUES(grand_total)
    `;

    const params = [
      customer_id,
      order_number,
      program_date,
      place_id,
      program,
      subtotal,
    ];

    db.query(insertSQL, params, (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({
        message: "Checkout complete. Quotation sent.",
        grand_total: subtotal,
      });
    });
  });
});

// search by order number
router.get("/:order_number", (req, res) => {
  const { order_number } = req.params;

  const sql = `SELECT * FROM booking WHERE order_number = ?`;

  db.query(sql, [order_number], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(results[0]);
  });
});

router.get("/customer-orders/:customerId", (req, res) => {
  const { customerId } = req.params;

  const sql = `SELECT 
    order_number, booking_status, booking_date, program_date, program, discount, grand_total, final_total
    FROM booking
    WHERE customer_id = ?
    ORDER BY booking_date DESC`;

  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error("Error fetching customer orders:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
    }

    res.status(200).json(result);
  });
});

router.get("/by-customer/:customer_id", (req, res) => {
  const { customer_id } = req.params;
  const sql = `SELECT * FROM booking WHERE customer_id = ? ORDER BY booking_date DESC LIMIT 1`;

  db.query(sql, [customer_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
});

module.exports = router;
