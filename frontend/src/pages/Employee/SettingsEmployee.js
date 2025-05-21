import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { Box } from "@mui/system";
import Navbar from "../../Components/Navbar";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { Button, Typography,Alert,TextField } from "@mui/material";

const SettingsEMployee = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const handlePasswordChange = async () => {
      // Basic validation
      if (newPassword !== confirmPassword) {
        setErrorMessage("New password and confirm password do not match.");
        return;
      }
      if (newPassword.length < 6) {
        setErrorMessage("Password should be at least 6 characters long.");
        return;
      }
  
      const user_id = localStorage.getItem("userId"); // Get user_id from local storage
  
      try {
        const response = await axios.post(
          "http://localhost:3003/api/auth/change-password",
          {
            user_id,
            currentPassword,
            newPassword,
          }
        );
  
        if (response.data.success) {
          setSuccessMessage("Password changed successfully!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setErrorMessage("");
        } else {
          setErrorMessage("Incorrect current password.");
        }
      } catch (error) {
        setErrorMessage("An error occurred. Please try again.");
      }
    };

    return (
        <>
            <Navbar />
            <Box sx={{ height: 70 }} />
            <Box sx={{ display: "flex" }}>
                <Sidebar role="employee" />
                <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Change Password</Typography>

       
        </Box>

        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePasswordChange}
          >
            Update Password
          </Button>
        </Box>
                </Box>
            </Box>
        </>
    );
};

export default SettingsEMployee;