const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/item-report', (req, res) => {
    const query = `
        SELECT i.*, c.category_name 
        FROM item i 
        JOIN category c ON i.category_id = c.category_id 
        ORDER BY i.item_id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching item report:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const reportData = results.map((row, index) => ({
            slNo: index + 1,
            categoryName: row.category_name,
            type: row.parent_id === 1 ? 'Veg' : 'Non-Veg',
            itemName: row.item_name,
            quantity: row.item_mesure,
            price: parseFloat(row.item_price).toFixed(2),
            status: row.item_status
        }));

        res.json({ report: reportData });
    });
});


router.get('/booking-report', (req, res) => {
    const query = `
        SELECT b.order_id, c.name, c.phone, b.program, p.place_name, 
               b.program_date, b.booking_status, b.booking_date
        FROM booking b
        JOIN place p ON b.place_id = p.place_id
        JOIN users c ON b.customer_id = c.id
        ORDER BY b.order_id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching booking report:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const reportData = results.map((row, index) => ({
            slNo: index + 1,
            name: row.name,
            phone: row.phone,
            programDetails: row.program,
            place: row.place_name,
            programDate: row.program_date,
            bookingStatus: row.booking_status,
            bookingDate: row.booking_date
        }));

        res.json({ report: reportData });
    });
});
module.exports = router;