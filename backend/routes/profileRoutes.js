const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/user/:userId', (req, res) => {
    // Get user profile data
    const { userId } = req.params;
    
    const sql = 'SELECT id, name, email,phone,address FROM users WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Error occurred' });
      
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, user: result[0] });
    });
  });
  
  router.put('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const { name, email } = req.body;
  
    // Input validation
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
  
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
  
    // Check if email already exists for another user
    const checkEmailSql = 'SELECT * FROM users WHERE email = ? AND id != ?';
    db.query(checkEmailSql, [email, userId], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Error occurred' });
  
      if (result.length > 0) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
  
      // Update user profile
    const updateSql = 'UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?';
    const { phone, address } = req.body;

 
    db.query(updateSql, [name, email, phone, address, userId], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Failed to update profile' });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, message: 'Profile updated successfully' });
    });
    });
  });
  

  

module.exports = router;