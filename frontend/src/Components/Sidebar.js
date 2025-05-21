import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
const drawerWidth = 240;

// const sidebarItems = [
//   { text: "Dashboard", icon: <DashboardIcon />, path: "/AdminDash" },
//   {
//     text: "Manage Users",
//     icon: <ManageAccountsIcon />,
//     path: "/AdminDash/ManageUsers",
//   },
//   {
//     text: "Manage Category",
//     icon: <ManageAccountsIcon />,
//     path: "/AdminDash/ManageCategory",
//   },
//   {
//     text: "Manage Place",
//     icon: <ManageAccountsIcon />,
//     path: "/AdminDash/ManagePlace",
//   },
//   {
//     text: "Manage Food items",
//     icon: <ManageAccountsIcon />,
//     path: "/AdminDash/ManageFoodItems",
//   },
//   {
//     text: "Manage Suppliers",
//     icon: <ManageAccountsIcon />,
//     path: "/AdminDash/ManageSuppliers",
//   },
//   {
//     text: "Manage Bookings",
//     icon: <ManageAccountsIcon />,
//     path: "/AdminDash/ManageBookings",
//   },
//   { text: "Settings", icon: <SettingsIcon />, path: "/AdminDash/Settings" },
//   { text: "Logout", icon: <LogoutIcon />, action: "logout" },
// ];
const getsidebarItems = (role) => {
  switch (role) {
    case "admin":
      return [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/AdminDash" },
        {
          text: "Manage Users",
          icon: <ManageAccountsIcon />,
          path: "/AdminDash/ManageUsers",
        },
        {
          text: "Manage Category",
          icon: <ManageAccountsIcon />,
          path: "/AdminDash/ManageCategory",
        },
        {
          text: "Manage Place",
          icon: <ManageAccountsIcon />,
          path: "/AdminDash/ManagePlace",
        },
        {
          text: "Manage Food items",
          icon: <ManageAccountsIcon />,
          path: "/AdminDash/ManageFoodItems",
        },
        {
          text: "Manage Suppliers",
          icon: <ManageAccountsIcon />,
          path: "/AdminDash/ManageSuppliers",
        },
        {
          text: "Manage Bookings",
          icon: <ManageAccountsIcon />,
          path: "/AdminDash/ManageBookings",
        },
        {
          text: "Item Reports",
          icon: <ManageAccountsIcon />,
          path: "/AdminDash/ItemReports",
        },
        {
          text: "Booking Reports",
          icon: <ManageAccountsIcon />,
          path: "/AdminDash/BookingReports",
        },
        {
          text: "Settings",
          icon: <SettingsIcon />,
          path: "/AdminDash/Settings",
        },

        { text: "Logout", icon: <LogoutIcon />, action: "logout" },
      ];
    case "employee":
      return [
        {
          text: "Bookings",
          icon: <ManageAccountsIcon />,
          path: "/Employee/Bookings",
        },
        { text: "Profile", icon: <DashboardIcon />, path: "/Employee" },

        {
          text: "NGO Requests",
          icon: <ManageAccountsIcon />,
          path: "/Employee/NGORequests",
        },
        {
          text: "Settings",
          icon: <SettingsIcon />,
          path: "/Employee/Settings",
        },
        { text: "Logout", icon: <LogoutIcon />, action: "logout" },
      ];
    case "ngo":
      return [
        { text: "Profile", icon: <DashboardIcon />, path: "/NGODash" },
        {
          text: "Requests",
          icon: <ManageAccountsIcon />,
          path: "/NgoProfile/Requests",
        },
        {
          text: "Program Booking",
          icon: <ManageAccountsIcon />,
          path: "/NgoProfile/ProgramBooking",
        },
        {
          text: "Settings",
          icon: <SettingsIcon />,
          path: "/NgoProfile/Settings",
        },
        { text: "Logout", icon: <LogoutIcon />, action: "logout" },
      ];
    default:
      return [];
  }
};

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function Sidebar({ role = "admin" }) {
  const theme = useTheme();

  const [open, setOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const sidebarItems = getsidebarItems(role);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(!open)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            const handleClick = () => {
              if (item.action === "logout") {
                alert("You have been logged out");
                navigate("/");
              } else {
                navigate(item.path);
              }
            };

            return (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
                onClick={handleClick}
              >
                <ListItemButton
                  selected={isActive}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    justifyContent: open ? "initial" : "center",
                    backgroundColor: isActive ? "#e3f2fd" : "inherit",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      mr: open ? 3 : "auto",
                      color: isActive ? "#1976d2" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: isActive ? "#1976d2" : "inherit",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}
