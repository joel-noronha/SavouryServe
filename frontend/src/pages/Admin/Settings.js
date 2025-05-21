import Sidebar from "../../Components/Sidebar";
import { Box } from "@mui/system";
import Navbar from "../../Components/Navbar";
import ChangePassword from "../../Components/ChangePassword/ChangePassword";
import React, { useState } from "react";
import { Button } from "@mui/material";
const Settings = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Navbar />
      <Box sx={{ height: 70 }} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f4f6f8",
              height: "80vh",
            }}
          >
            <h1>Settings</h1>
            <hr />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "red",
                color: "white",
                "&:hover": {
                  backgroundColor: "red",
                  color: "black",
                },
              }}
              onClick={() => setOpen(true)}
            >
              Change Password
            </Button>

            <ChangePassword open={open} handleClose={() => setOpen(false)} />
          </div>
        </Box>
      </Box>
    </>
  );
};
export default Settings;
