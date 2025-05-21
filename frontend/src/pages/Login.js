import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Link,
  CircularProgress,
  ThemeProvider,
  createTheme,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0057D9",
    },
    secondary: {
      main: "#FFC107",
    },
    background: {
      default: "#f4f6f9",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:3003/api/auth/login`,
        {
          email,
          password,
        }
      );
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("emailId", email);
      const role = response.data.role;

      switch (role) {
        case "Admin":
          navigate("/AdminDash");
          break;
        case "Employee":
          navigate("/Employee");
          break;
        case "User":
          navigate("/Home");
          break;
        case "Ngo":
          navigate("/NgoProfile");
          break;
        default:
          setError("Role not recognized");
      }
    } catch (error) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          background: "linear-gradient(to right, #0057D9, #002B5B)",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "90%",
            maxWidth: "900px",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Grid container>
            {/* Left Side - Image */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: {
                  xs: "none", // hide on extra-small and small screens
                  md: "flex", // show on medium and up
                },
                alignItems: "center",
                justifyContent: "center",
                background: "#E3F2FD",
                padding: 2,
              }}
            >
              <img
                src="catering.png"
                alt="Login Illustration"
                style={{
                  width: "100%",
                  maxWidth: "350px",
                  borderRadius: "8px",
                }}
              />
            </Grid>

            {/* Right Side - Login Form */}
            <Grid item xs={12} md={6} sx={{ padding: 4 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary"
                gutterBottom
                textAlign="center"
              >
                Welcome Back
              </Typography>

              {error && (
                <Typography
                  color="error"
                  sx={{ mb: 2, fontSize: "14px", textAlign: "center" }}
                >
                  {error}
                </Typography>
              )}

              <TextField
                label="Email Address"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
              />

              <Box mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
                  disabled={loading}
                  size="large"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow: "0px 4px 10px rgba(0, 87, 217, 0.3)",
                    "&:hover": {
                      backgroundColor: "#0047B3",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </Box>

              <Box mt={3} textAlign="center">
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    underline="hover"
                    color="secondary"
                    fontWeight="bold"
                  >
                    Register here
                  </Link>
                </Typography>
                <Typography variant="body2" mt={1}>
                  <Link
                    href="/forgot-password"
                    underline="hover"
                    color="secondary"
                    fontWeight="bold"
                  >
                    Forgot Password?
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
