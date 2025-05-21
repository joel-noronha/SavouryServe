import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDash from "./pages/Admin/AdminDash";
import Settings from "./pages/Admin/Settings";
import ManageUsers from "./pages/Admin/ManageUsers";
import Home from "./pages/User/Home";
import About from "./pages/User/About";
import ManageSuppliers from "./pages/Admin/ManageSuppliers";
import ManagePlaces from "./pages/Admin/ManagePlaces";
import ManageCategory from "./pages/Admin/ManageCategory";
import ManageFoodItems from "./pages/Admin/ManageFoodItems";
import ManageBookings from "./pages/Admin/ManageBookings";
import EmployeeProfile from "./pages/Employee/EmployeeProfile";
import Cart from "./pages/User/Cart";
import Menu from "./pages/User/Menu";
import Bookings from "./pages/Employee/Bookings";
import Orders from "./pages/User/Orders";
import Loading from "./Components/Loader/Loading";

import NgoProfile from "./pages/NGO/NgoProfile";
import ProgramBooking from "./pages/NGO/ProgramBooking";
import YourRequests from "./pages/NGO/YourRequests";
import SettingsNGO from "./pages/NGO/SettingsNGO";

import NGORequests from "./pages/Employee/NGORequests";
import SettingsEMployee from "./pages/Employee/SettingsEmployee";

import Qoutation from './pages/User/Qoutation';
import Profile from "./pages/User/Profile";

import ItemReports from "./pages/Admin/ItemReports";
import BookingReports from "./pages/Admin/BookingReport";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/test" element={<Loading />} />
          <Route path="/About" element={<About />} />
          <Route path="/Menu" element={<Menu />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/AdminDash" element={<AdminDash />} />
          <Route path="/AdminDash/Settings" element={<Settings />} />
          <Route path="/AdminDash/ManageUsers" element={<ManageUsers />} />
          <Route
            path="/AdminDash/ManageFoodItems"
            element={<ManageFoodItems />}
          />
          <Route
            path="/AdminDash/ManageSuppliers"
            element={<ManageSuppliers />}
          />
          <Route
            path="/AdminDash/ManageCategory"
            element={<ManageCategory />}
          />
          <Route path="/AdminDash/ManagePlace" element={<ManagePlaces />} />
          <Route
            path="/AdminDash/ManageBookings"
            element={<ManageBookings />}
          />
          <Route path="/AdminDash/ItemReports" element={<ItemReports />} />
          <Route
            path="/AdminDash/BookingReports"
            element={<BookingReports />}/>
          <Route path="/Employee" element={<EmployeeProfile />} />
          <Route path="/Employee/Bookings" element={<Bookings />} />
          <Route path="/Employee/NGORequests" element={<NGORequests/>}/>
          <Route path="/Employee/Settings" element={<SettingsEMployee />} />

          <Route path="/NgoProfile" element={<NgoProfile />} />
          <Route path="/NgoProfile/ProgramBooking" element={<ProgramBooking />} />
          <Route path="/NgoProfile/Requests" element={<YourRequests />} />
          <Route path="/NgoProfile/Settings" element={<SettingsNGO />} />
          


<Route path="/quotation/:orderNumber" element={<Qoutation />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
