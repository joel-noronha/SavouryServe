import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1E88E5", // Blue for primary buttons
    },
    secondary: {
      main: "#D81B60", // Pink for accents
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleOtpChange = (value, index) => {
    const otpArray = [...otp];
    otpArray[index] = value;
    setOtp(otpArray);
  };

  const sendOTP = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    try {
      await axios.post("http://localhost:3003/api/otp/forgot-password", {
        email,
      });
      alert("OTP sent to your email");
      setStep(2);
      setError("");
    } catch (error) {
      setError("Error sending OTP. Please try again.");
    }
  };

  const resetPassword = async () => {
    if (otp.includes("") || newPassword.length < 6) {
      setError(
        "Please enter a valid OTP and a password with at least 6 characters."
      );
      return;
    }
    try {
      const otpCode = otp.join("");
      await axios.post("http://localhost:3003/api/otp/reset-password", {
        email,
        otp: otpCode,
        newPassword,
      });
      alert("Password reset successful");
      navigate("/");
    } catch (error) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          background: "linear-gradient(to right, #1E3C72, #2A5298)", // Same gradient as login
        }}
      >
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            maxWidth: 400,
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Forgot Password
          </Typography>

          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {step === 1 && (
            <>
              <TextField
                label="Email Address"
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={sendOTP}
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  Send OTP
                </Button>
              </Box>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="h6" align="center" gutterBottom>
                Enter OTP
              </Typography>
              <Box display="flex" justifyContent="center" gap={1} mb={2}>
                {otp.map((value, index) => (
                  <TextField
                    key={index}
                    value={value}
                    onChange={(e) => {
                      handleOtpChange(e.target.value, index);
                      if (e.target.value && index < otp.length - 1) {
                        document.getElementById(`otp-${index + 1}`).focus();
                      }
                    }}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#1E88E5",
                      },
                    }}
                    id={`otp-${index}`}
                    sx={{
                      width: 45,
                      height: 50,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        borderColor: "#1E88E5",
                      },
                    }}
                  />
                ))}
              </Box>
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={resetPassword}
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  Reset Password
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ForgotPassword;
