import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import axios from "axios";

const BookingReportsTable = () => {
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3003/api/booking-report")
            .then((response) => {
                setReportData(response.data.report);
            })
            .catch((error) => {
                console.error("Error fetching booking report:", error);
            });
    }, []);

    const handlePrint = () => {
        const printContent = document.getElementById("reportTable").outerHTML;
        const newWin = window.open("", "_blank");
        newWin.document.open();
        newWin.document.write(
            `<html><head><title>Print Report</title></head><body>${printContent}</body></html>`
        );
        newWin.document.close();
        newWin.print();
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table id="reportTable">
                    <TableHead>
                        <TableRow>
                            <TableCell>SL.No</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Program Details</TableCell>
                            <TableCell>Place</TableCell>
                            <TableCell>Program Date</TableCell>
                            <TableCell>Booking Status</TableCell>
                            <TableCell>Booking Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.slNo}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell>{row.programDetails}</TableCell>
                                <TableCell>{row.place}</TableCell>
                                <TableCell>{row.programDate}</TableCell>
                                <TableCell>{row.bookingStatus}</TableCell>
                                <TableCell>{row.bookingDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="contained"
                color="primary"
                onClick={handlePrint}
                sx={{ mt: 2 }}
            >
                Print Report
            </Button>
        </>
    );
};

const BookingReports = () => {
    return (
        <>
            <Navbar />
            <Box sx={{ height: 70 }} />
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <BookingReportsTable />
                </Box>
            </Box>
        </>
    );
};

export default BookingReports;
