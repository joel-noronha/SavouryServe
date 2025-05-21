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

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!user.name || !user.email || !user.password || !user.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (user.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await axios.post("http://localhost:3003/api/register", user);
      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again.");
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
          background: "linear-gradient(to right, #1E3C72, #2A5298)", // Same as login page
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
            Register
          </Typography>

          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            label="Full Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />

          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
              sx={{
                width: "100%",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              Register
            </Button>
          </Box>

          <Typography align="center" mt={2}>
            Already have an account?{" "}
            <Button
              onClick={() => navigate("/")}
              sx={{
                color: "#D81B60",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Login
            </Button>
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Register;
