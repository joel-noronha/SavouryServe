import React from "react";
import Sidebar from "../../Components/Sidebar";
import { Box } from "@mui/system";
import Navbar from "../../Components/Navbar";
import Grid from "@mui/material/Grid2";
import NgoProf from "../../Components/NgoProfile/NgoProf";

const NgoProfile = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ height: 70 }} />
      <Box sx={{ display: "flex" }}>
        <Sidebar role="ngo" />
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <Grid container>
            <Grid size={12}>
              <NgoProf />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default NgoProfile;
