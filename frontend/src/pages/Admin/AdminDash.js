import React from "react";
import "animate.css";
import Sidebar from "../../Components/Sidebar";
import { Box } from "@mui/system";
import Navbar from "../../Components/Navbar";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import GroupIcon from "@mui/icons-material/Group";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../Dashboard.css";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const AdminDash = () => {
  const [users, setUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3003/api/auth/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        //setError("Failed to fetch users. Please try again later.");
      });
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:3003/api/order/all");
        setRecentBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <>
      <div className="bg-color">
        {/* <Header /> */}
        <Navbar />
        <Box sx={{ height: 70 }} />
        <Box sx={{ display: "flex" }}>
          <Sidebar role="admin" />
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f4f6f8",
              width: "100%",
            }}
          >
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 8 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                  >
                    <Card
                      sx={{ minWidth: 35 + "%", height: 140 }}
                      className="card-color"
                    >
                      <CardContent>
                        <div className="icon-style ">
                          <PeopleIcon fontSize="large" />
                        </div>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          color="#ffffff"
                        >
                          {users.length}
                        </Typography>
                        <Typography
                          gutterBottom
                          variant="body2"
                          component="div"
                          sx={{ color: "white" }}
                        >
                          Users
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card
                      sx={{ minWidth: 35 + "%", height: 140 }}
                      className="card-color"
                    >
                      <CardContent>
                        <div className="icon-style">
                          <RestaurantMenuIcon fontSize="large" />
                        </div>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          color="#ffffff"
                        >
                          2
                        </Typography>
                        <Typography
                          gutterBottom
                          variant="body2"
                          component="div"
                          sx={{ color: "white" }}
                        >
                          Orders
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card
                      sx={{ minWidth: 35 + "%", height: 140 }}
                      className="card-color"
                    >
                      <CardContent>
                        <div className="icon-style">
                          <GroupIcon fontSize="large" />
                        </div>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          color="#ffffff"
                        >
                          2
                        </Typography>
                        <Typography
                          gutterBottom
                          variant="body2"
                          component="div"
                          sx={{ color: "white" }}
                        >
                          NGO
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card
                      sx={{ minWidth: 35 + "%", height: 140 }}
                      className="card-color"
                    >
                      <CardContent>
                        <div className="icon-style">
                          <FoodBankIcon fontSize="large" />
                        </div>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          color="#ffffff"
                        >
                          2
                        </Typography>
                        <Typography
                          gutterBottom
                          variant="body2"
                          component="div"
                          sx={{ color: "white" }}
                        >
                          Food donated
                        </Typography>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
                {/* <Grid size={{ xs: 6, md: 4 }}>
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    calendar
                  </Typography>
                </CardContent>
              </Card>
            </Grid> */}
              </Grid>
              <Box sx={{ height: 20 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 8 }}>
                  <Card sx={{ height: 55 + "vh", overflowY: "auto" }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recent Bookings
                      </Typography>

                      <List>
                        {recentBookings.map((booking, index) => (
                          <div key={index}>
                            <ListItem>
                              <ListItemIcon>
                                <NotificationsIcon
                                  color={
                                    booking.booking_status === "pending"
                                      ? "warning"
                                      : booking.booking_status === "confirmed"
                                      ? "success"
                                      : "error"
                                  }
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={`Order: ${booking.order_number}`}
                                secondary={`Status: ${booking.booking_status}`}
                              />
                            </ListItem>
                            <Divider />
                          </div>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <Card sx={{ height: 55 + "vh", overflowY: "auto" }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recent Transactions
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Order #12345"
                            secondary="2 hours ago"
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText
                            primary="Payment Received - ₹1200"
                            secondary="Yesterday"
                          />
                        </ListItem>
                        <Divider />
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </div>
        </Box>
      </div>
    </>
  );
};
export default AdminDash;
