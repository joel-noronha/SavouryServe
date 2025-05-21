import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  Chip,
  TextField,
} from "@mui/material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const EmpBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [discount, setDiscount] = useState(0); // Discount value from user input
  const [finalTotal, setFinalTotal] = useState(0); // Final total after discount

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/order/all");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleOpen = async (booking) => {
    try {
      const res = await axios.get(
        `http://localhost:3003/api/order/details/${booking.order_number}`
      );
      console.log("Order details:", res.data);
      setSelectedBooking(res.data); // Set the order details in the state
      setNewStatus(res.data.booking_status); // Set the current status of the order
      setDiscount(res.data.discount || 0); // Set the initial discount value from the order
      setFinalTotal(res.data.final_total || 0); // Set the initial final total from the order
      setOpen(true); // Open the modal to show details
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
  };

  const calculateFinalTotal = () => {
    if (!selectedBooking || !selectedBooking.items) return 0;

    // Calculate total amount from items
    const itemsTotal = selectedBooking.items.reduce((total, item) => {
      return total + item.item_price * item.item_quantity;
    }, 0);

    // Apply discount to the total
    const discountAmount = (discount / 100) * itemsTotal;
    return itemsTotal - discountAmount;
  };

  //   const handleStatusChange = async () => {
  //     try {
  //       // Calculate the final total based on discount and update the status
  //       const newFinalTotal = calculateFinalTotal();

  //       await axios.put(
  //         `http://localhost:3003/api/booking/${selectedBooking.booking_id}`,
  //         {
  //           booking_status: newStatus,
  //           discount: discount, // Send discount if you want it to be saved
  //           final_total: newFinalTotal, // Send final total after discount
  //         }
  //       );
  //       fetchBookings(); // Refresh the bookings table
  //       handleClose(); // Close the modal
  //     } catch (err) {
  //       console.error("Error updating status:", err);
  //     }
  //   };
  const handleStatusChange = async () => {
    try {
      const newFinalTotal = calculateFinalTotal(); // Recalculate final total with discount

      // Send the update request to the backend
      await axios.put(
        `http://localhost:3003/api/order/booking/${selectedBooking.order_id}`,
        {
          booking_status: newStatus, // New booking status
          discount: discount, // Discount applied
          final_total: newFinalTotal, // Updated final total after discount
        }
      );
      fetchBookings(); // Refresh the bookings table to reflect the change
      handleClose(); // Close the modal after the update
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
      <div style={{ padding: "20px" }}>
        <h1>Orders</h1>
        <hr />
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Order No.
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Booking Date
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Program
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Program Date
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.booking_id}>
                  <TableCell>{booking.order_number}</TableCell>
                  <TableCell>
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{booking.program}</TableCell>
                  <TableCell>
                    {new Date(booking.program_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.booking_status}
                      color={
                        booking.booking_status === "pending"
                          ? "warning"
                          : booking.booking_status === "confirmed"
                          ? "success"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpen(booking)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal */}
        <Modal open={open} onClose={handleClose}>
          <Box sx={{ ...style, width: 400 }}>
            {selectedBooking && (
              <>
                <Typography variant="h6" component="h2">
                  Order No: {selectedBooking.order_number}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Program: {selectedBooking.program}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Status: {selectedBooking.booking_status}
                </Typography>

                {/* Items Section */}
                <Typography sx={{ mt: 3, fontWeight: "bold" }}>
                  Items Ordered:
                </Typography>
                <ul>
                  {selectedBooking.items &&
                    selectedBooking.items.map((item, idx) => (
                      <li key={idx}>
                        {item.item_name} - Qty: {item.item_quantity} - Price: ₹
                        {item.item_price} - Total: ₹
                        {item.item_price * item.item_quantity}
                      </li>
                    ))}
                </ul>
                <Typography sx={{ mt: 3, fontWeight: "bold" }}>
                  Grand Total: ₹{selectedBooking.grand_total}
                </Typography>
                {/* Discount Section */}
                <Box sx={{ mt: 2 }}>
                  <Typography>Discount:</Typography>
                  <TextField
                    label="Discount (%)"
                    fullWidth
                    type="number"
                    value={discount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ mt: 3, fontWeight: "bold" }}
                  >
                    Final Total: ₹{calculateFinalTotal()}
                  </Typography>
                </Box>

                {/* Status Update Section */}
                <Box sx={{ mt: 2 }}>
                  <Typography>Change Status:</Typography>
                  <Select
                    fullWidth
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleStatusChange}
                  >
                    Update Status
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default EmpBooking;
