import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar";
import { Box } from "@mui/system";
import Navbar from "../../Components/Navbar";
import Grid from "@mui/material/Grid2";

const YourRequests = () => {
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
    }, []);

    const fetchBookings = async () => {
        const ngoId = localStorage.getItem("userId"); // Assuming userId is the NGO ID

        if (!ngoId) {
            setError("NGO ID is missing. Please log in.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:3003/api/ngo-requests", {
                params: { ngo_id: ngoId },
            });
            setBookings(response.data);
            setError("");
        } catch (err) {
            setError("Unable to fetch NGO requests.");
            setBookings([]);
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
                                <h3>NGO Requests</h3>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>SL.No</th>
                                            <th>Program Details</th>
                                            <th>Place</th>
                                            <th>Program Date</th>
                                            <th>Booking Status</th>
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

export default YourRequests;
