import * as React from "react";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

// Styled AppBar with custom gradient and shadow
const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  color: "#fff",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
}));

export default function Navbar({ onToggleSidebar }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const userRole = localStorage.getItem("role");
    setUsername(name || "");
    setRole(userRole || "");
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={4}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" }, fontWeight: "bold" }}
          >
            SavoryServe
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {role === "Admin" && (
            <Button
              href="http://localhost:8501/"
              target="_blank"
              variant="contained"
              color="primary"
              sx={{ marginRight: 2 }}
            >
              Recipe Wizard
            </Button>
          )}
          <Typography variant="body1">Welcome {username}</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
