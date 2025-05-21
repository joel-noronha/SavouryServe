import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar";
import { Box } from "@mui/system";
import Navbar from "../../Components/Navbar";
import Grid from "@mui/material/Grid2";

const ProgramBooking = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    // Format date to DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        fetchBookings();
    }, [fromDate, toDate]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get("http://localhost:3003/api/bookings", {
                params: { from_date: fromDate, to_date: toDate },
            });
            setBookings(response.data);
            setError("");
        } catch (err) {
            setError("Unable to fetch bookings.");
            setBookings([]);
        }
    };

    const handleRequestFood = async (bookingId) => {
        const emailId = localStorage.getItem("emailId");
        const userId = localStorage.getItem("userId"); // Get user ID from localStorage
        
        if (!emailId || !userId) {
            alert("Kindly login to proceed!");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:3003/api/request-food", {
                emailId,
                bookingId,
                userId // Send userId to the API
            });
            alert(response.data.message);
        } catch (err) {
            alert(err.response?.data?.message || "Unable to process your request.");
        }
    };
    return (
        <>
            <Navbar />
            <Box sx={{ height: 70 }} />
            <Box sx={{ display: "flex" }}>
                <Sidebar role="ngo" />
                <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    <Grid container>
                        <Grid size={12}>
                            <div className="container">
                                <h3>Program Booking</h3>
                                <div className="row mb-4">
                                    <div className="col-md-4">
                                        <label>From</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label>To</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4 d-flex align-items-end">
                                        <button className="btn btn-primary" onClick={fetchBookings}>
                                            Filter
                                        </button>
                                    </div>
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>SL.No</th>
                                            <th>Program Details</th>
                                            <th>Place</th>
                                            <th>Program Date</th>
                                            <th>Booking Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                            
{bookings.map((booking, index) => (
    <tr key={booking.order_id}>
        <td>{index + 1}</td>
        <td>{booking.program}</td>
        <td>{booking.place_name}</td>
        <td>{formatDate(booking.program_date)}</td>
        <td>Confirmed</td>
        <td>
            <button
                className="btn btn-success btn-sm"
                onClick={() => handleRequestFood(booking.order_id)}
            >
                Request Food
            </button>
        </td>
    </tr>
))}
                                    </tbody>
                                </table>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
};

export default ProgramBooking;