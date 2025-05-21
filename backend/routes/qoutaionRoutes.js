const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/quotation/:orderNumber', (req, res) => {
    const orderNumber = req.params.orderNumber;
    console.log(`Received request for orderNumber: ${orderNumber}`);

    // Fetch booking details
    const bookingQuery = 'SELECT * FROM booking WHERE order_number = ?';
    db.query(bookingQuery, [orderNumber], (err, bookingResults) => {
        if (err) {
            console.error('Error fetching booking details:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!bookingResults || bookingResults.length === 0) {
            console.warn('No booking found for orderNumber:', orderNumber);
            return res.status(404).json({ message: 'Booking not found' });
        }
        const booking = bookingResults[0];

        // Fetch customer details
        const customerQuery = 'SELECT * FROM users WHERE id = ?';
        db.query(customerQuery, [booking.customer_id], (err, customerResults) => {
            if (err) {
                console.error('Error fetching customer details:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!customerResults || customerResults.length === 0) {
                console.warn('No customer found for customer_id:', booking.customer_id);
                return res.status(404).json({ message: 'Customer not found' });
            }
            const customer = customerResults[0];

            // Fetch place details
            const placeQuery = 'SELECT * FROM place WHERE place_id = ?';
            db.query(placeQuery, [booking.place_id], (err, placeResults) => {
                if (err) {
                    console.error('Error fetching place details:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                if (!placeResults || placeResults.length === 0) {
                    console.warn('No place found for place_id:', booking.place_id);
                    return res.status(404).json({ message: 'Place not found' });
                }
                const place = placeResults[0];

                // Fetch supplier details
                const supplierQuery = 'SELECT * FROM suppliers WHERE place_id = ?';
                db.query(supplierQuery, [booking.place_id], (err, supplierResults) => {
                    if (err) {
                        console.error('Error fetching supplier details:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    if (!supplierResults || supplierResults.length === 0) {
                        console.warn('No supplier found for place_id:', booking.place_id);
                        return res.status(404).json({ message: 'Supplier not found' });
                    }
                    const supplier = supplierResults[0];

                    // Fetch product details
                    const productQuery = `
                        SELECT i.*, t.item_quantity 
                        FROM item i 
                        JOIN order_temp t ON i.item_id = t.item_id 
                        WHERE t.order_number = ?
                    `;
                    db.query(productQuery, [orderNumber], (err, products) => {
                        if (err) {
                            console.error('Error fetching product details:', err);
                            return res.status(500).json({ message: 'Internal server error' });
                        }

                        // Calculate totals
                        let subtotal = 0;
                        const productDetails = products.map((product, index) => {
                            const amount = parseFloat(product.item_price) * product.item_quantity;
                            subtotal += amount;
                            return {
                                slNo: index + 1,
                                name: product.item_name,
                                price: parseFloat(product.item_price),
                                quantity: product.item_quantity,
                                total: amount,
                            };
                        });

                        const discount = booking.discount || 0;
                        const grandTotal = subtotal - discount;

                        // Return JSON response
                        res.json({
                            customer: {
                                name: customer.name, // Corrected field name
                                phone: customer.phone, // Corrected field name
                                email: customer.email, // Corrected field name
                                address: customer.address // Corrected field name
                            },
                            booking: {
                                program: booking.program,
                                program_date: booking.program_date,
                                discount: discount
                            },
                            place: {
                                place_name: place.place_name
                            },
                            supplier: {
                                supplier_name: supplier.supplier_name,
                                supplier_gstin: supplier.supplier_gstin,
                                supplier_phone_number: supplier.supplier_phoneno, // Match DB field
                                supplier_address: supplier.supplier_address
                            },
                            products: productDetails,
                            totals: {
                                subtotal: subtotal,
                                discount: discount,
                                grandTotal: grandTotal
                            }
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;