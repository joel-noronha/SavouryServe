import React from "react";
import Sidebar from "../../Components/Sidebar";
import { Box } from "@mui/system";
import Navbar from "../../Components/Navbar";
import Grid from "@mui/material/Grid2";
import PlaceManagement from "../../Components/ManagePlace/PlaceManagement";

const ManagePlaces = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ height: 70 }} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <PlaceManagement />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default ManagePlaces;
