import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "12px",
  boxShadow: 24,
  padding: "24px",
  width: 400,
  backdropFilter: "blur(5px)",
};
const ChangePassword = ({ open, handleClose }) => {
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
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Change Password</Typography>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
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
    </Modal>
  );
};

export default ChangePassword;
