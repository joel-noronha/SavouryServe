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

const ItemReportsTable = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3003/api/item-report")
      .then((response) => {
        setReportData(response.data.report);
      })
      .catch((error) => {
        console.error("Error fetching item report:", error);
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
              <TableCell>Category Name</TableCell>
              <TableCell>Veg / Non-Veg</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Item Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.slNo}</TableCell>
                <TableCell>{row.categoryName}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.itemName}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.status}</TableCell>
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

const ItemReports = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ height: 70 }} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <ItemReportsTable />
        </Box>
      </Box>
    </>
  );
};

export default ItemReports;
