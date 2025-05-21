import {
  Button,
  Chip,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import axios from "axios";

const BookingForm = ({
  open,
  setOpen,
  handleSave,
  formData,
  setFormData,
  loading,
}) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    handleSave(formData);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>
        {formData.booking_id ? "Edit Booking" : "Add Booking"}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Order Number"
          name="order_number"
          fullWidth
          value={formData.order_number}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          type="date"
          label="Program Date"
          name="program_date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formData.program_date}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Place ID"
          name="place_id"
          fullWidth
          value={formData.place_id}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          select
          label="Program"
          name="program"
          fullWidth
          value={formData.program}
          onChange={handleChange}
        >
          <MenuItem value="Birthday">Birthday</MenuItem>
          <MenuItem value="Wedding">Wedding</MenuItem>
          <MenuItem value="Corporate Event">Corporate Event</MenuItem>
          <MenuItem value="Anniversary">Anniversary</MenuItem>
          <MenuItem value="Festival Celebration">Festival Celebration</MenuItem>
        </TextField>
        <TextField
          margin="dense"
          label="Customer ID"
          name="customer_id"
          fullWidth
          value={formData.customer_id}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Booking Status"
          name="booking_status"
          fullWidth
          value={formData.booking_status}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BookingManage = () => {
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    order_number: "",
    program_date: "",
    place_id: "",
    program: "",
    customer_id: "",
    booking_status: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/order/all");
      console.log(res);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSave = async (data) => {
    setLoading(true);
    try {
      if (data.booking_id) {
        const response = await axios.put(
          `http://localhost:3003/api/book/booking-update/${data.booking_id}`,
          data
        );
        setSnackbar({ open: true, message: response.data.message });
      } else {
        const response = await axios.post(
          "http://localhost:3003/api/book/bookings",
          data
        );
        setSnackbar({ open: true, message: response.data.message });
      }
      setOpen(false);
      fetchBookings();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3003/api/book/delete/${id}`
      );
      setSnackbar({ open: true, message: response.data.message });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (booking) => {
    setFormData({ ...booking });
    setOpen(true);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
      <h1>Manage Bookings</h1>
      <hr />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setFormData({
            order_number: "",
            program_date: "",
            place_id: "",
            program: "",
            customer_id: "",
            booking_status: "",
          });
          setOpen(true);
        }}
        startIcon={<AddIcon />}
        style={{
          marginBottom: "20px",
          borderRadius: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        Add Booking
      </Button>

      <TableContainer
        component={Paper}
        elevation={3}
        style={{ borderRadius: "12px" }}
      >
        <Table>
          <TableHead style={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              {[
                "Sr. No.",
                "Order No",
                "Program Date",
                "Place ID",
                "Program",
                "Customer ID",
                "Status",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  style={{ color: "#fff", fontWeight: "bold" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b, index) => (
              <TableRow key={b.order_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{b.order_number}</TableCell>
                <TableCell>
                  {dayjs(b.program_date).format("DD MMM YYYY")}{" "}
                </TableCell>
                <TableCell>{b.place_id}</TableCell>
                <TableCell>{b.program}</TableCell>
                <TableCell>{b.customer_id}</TableCell>
                <TableCell>
                  <Chip
                    label={b.booking_status}
                    color={
                      b.booking_status?.trim() === "confirmed"
                        ? "success"
                        : b.booking_status?.trim() === "pending"
                        ? "warning"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(b)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(b.order_id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BookingForm
        open={open}
        setOpen={setOpen}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default BookingManage;
