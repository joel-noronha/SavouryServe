const express = require("express");
const db = require("../db");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/request-food", async (req, res) => {
    const { emailId, bookingId, userId } = req.body;

    if (!emailId) {
        return res.status(400).json({ message: "Email ID is required." });
    }
    if (!bookingId) {
        return res.status(400).json({ message: "Booking ID is required." });
    }
    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        // Verify user exists (optional additional check)
        const userQuery = "SELECT * FROM users WHERE email = ? AND id = ? AND role = 'Ngo'";
        db.query(userQuery, [emailId, userId], async (err, userResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Unable to process your request." });
            }

            if (userResult.length === 0) {
                return res.status(404).json({ message: "NGO user not found." });
            }

            const insertQuery = `
                INSERT INTO food_request (user_id, booking_id, request_status, request_date)
                VALUES (?, ?, 'Initiated', NOW())
            `;
            
            db.query(insertQuery, [userId, bookingId], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Unable to process your request." });
                }
                
                res.status(200).json({ message: "Your request was sent successfully!" });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to process your request." });
    }
});
router.get("/bookings", async (req, res) => {
    const { from_date, to_date } = req.query;

    try {
        let query = `
            SELECT o.*, p.* 
            FROM booking o
            JOIN place p ON p.place_id = o.place_id
            WHERE o.booking_status = 'confirmed'
        `;
        const params = [];

        if (from_date && to_date) {
            query += " AND o.program_date BETWEEN ? AND ?";
            params.push(from_date, to_date);
        } else if (from_date) {
            query += " AND o.program_date >= ?";
            params.push(from_date);
        } else if (to_date) {
            query += " AND o.program_date <= ?";
            params.push(to_date);
        }

        db.query(query, params, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Unable to fetch bookings." });
            }
            
            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to fetch bookings." });
    }
});

router.get("/ngo-requests", async (req, res) => {
    const { ngo_id } = req.query;

    if (!ngo_id) {
        return res.status(400).json({ message: "NGO ID is required." });
    }

    try {
        const query = `
            SELECT o.*, p.*, f.* 
            FROM booking o
            JOIN place p ON p.place_id = o.place_id
            JOIN food_request f ON f.booking_id = o.order_id
            WHERE f.user_id = ?
        `;

        db.query(query, [ngo_id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Unable to fetch NGO requests." });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to fetch NGO requests." });
    }
});

router.get("/ngo-requests-emp", async (req, res) => {
    try {
        const query = `
          SELECT o.*, p.*, f.*, n.* 
          FROM booking o
          JOIN place p ON p.place_id = o.place_id
          JOIN food_request f ON f.booking_id = o.order_id
          JOIN users n ON n.id = f.user_id
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Unable to fetch NGO requests." });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to fetch NGO requests." });
    }
});

router.put("/approve-request/:id", async (req, res) => {
    const { id } = req.params;
    const { email, name } = req.body;

    if (!id || !email || !name) {
        return res.status(400).json({ message: "Request ID, email, and name are required." });
    }

    try {
        const updateQuery = "UPDATE food_request SET request_status = 'Approved' WHERE request_id = ?";
        db.query(updateQuery, [id], async (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Unable to approve the request." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Request not found." });
            }

            // Send email notification
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "haitulunadu@gmail.com",
                    pass: "oynqcivlwgswtyrn",
                },
            });

            const mailOptions = {
                from: '"Online Catering" <haitulunadu@gmail.com>',
                to: email,
                subject: "Food Request Approved",
                html: `Dear ${name},<br>Your food request has been approved.<br><br>Thank you,<br>Team Online Catering`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: "Request approved, but email notification failed." });
                }

                res.status(200).json({ message: "Request approved successfully and email sent!" });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to process your request." });
    }
});

router.put("/donate-request/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Request ID is required." });
    }

    try {
        const updateQuery = "UPDATE food_request SET request_status = 'Donated' WHERE request_id = ?";
        db.query(updateQuery, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Unable to update the request status to 'Donated'." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Request not found." });
            }

            res.status(200).json({ message: "Request status updated to 'Donated' successfully!" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to process your request." });
    }
});

router.put("/reject-request/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Request ID is required." });
    }

    try {
        const updateQuery = "UPDATE food_request SET request_status = 'Rejected' WHERE request_id = ?";
        db.query(updateQuery, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Unable to update the request status to 'Rejected'." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Request not found." });
            }

            res.status(200).json({ message: "Request status updated to 'Rejected' successfully!" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to process your request." });
    }
});

module.exports = router;