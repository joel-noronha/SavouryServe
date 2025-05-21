import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const PlaceForm = ({ open, onClose, onSave, initialData }) => {
  const [place, setPlace] = useState({
    name: "",
    status: "active",
  });

  useEffect(() => {
    if (initialData) {
      setPlace(initialData);
    }
  }, [initialData]);

  const handleToggleStatus = () => {
    setPlace({
      ...place,
      status: place.status === "active" ? "inactive" : "active",
    });
  };

  const handleChange = (e) => {
    setPlace({ ...place, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(place);
    setPlace({ name: "", status: "active" });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? "Edit Place" : "Add Place"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Place Name"
              fullWidth
              name="name"
              value={place.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Status: {place.status}</Typography>
            <Switch
              checked={place.status === "active"}
              onChange={handleToggleStatus}
              color="primary"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {initialData ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PlaceManagement = () => {
  const [places, setPlaces] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);

  const fetchPlaces = async () => {
    const res = await axios.get("http://localhost:3003/api/place/place-all");
    setPlaces(res.data);
  };

  const handleSave = async (data) => {
    if (editingPlace) {
      const response = await axios.put(
        `http://localhost:3003/api/place/place-update/${editingPlace.place_id}`,
        {
          place_name: data.name,
          place_status: data.status,
        }
      );
      alert(response.data.message);
    } else {
      const response = await axios.post(
        "http://localhost:3003/api/place/place-add",
        {
          place_name: data.name,
          place_status: data.status,
        }
      );
      alert(response.data.message);
    }
    setFormOpen(false);
    setEditingPlace(null);
    fetchPlaces();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3003/api/place/delete-place/${id}`);
    fetchPlaces();
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
      <h1>Manage Place</h1>
      <hr />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => {
          setEditingPlace(null);
          setFormOpen(true);
        }}
        style={{
          marginBottom: "20px",
          borderRadius: "20px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        Add Place
      </Button>
      <TableContainer
        component={Paper}
        elevation={3}
        style={{ borderRadius: "12px" }}
      >
        <Table>
          <TableHead style={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Sr No.
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Place Name
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {places.map((place, index) => (
              <TableRow key={place.place_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{place.place_name}</TableCell>
                <TableCell>
                  <Chip
                    label={place.place_status}
                    color={
                      place.place_status === "active" ? "success" : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditingPlace({
                        place_id: place.place_id,
                        name: place.place_name,
                        status: place.place_status,
                      });
                      setFormOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(place.place_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {formOpen && (
        <PlaceForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingPlace(null);
          }}
          onSave={handleSave}
          initialData={editingPlace}
        />
      )}
    </div>
  );
};

export default PlaceManagement;
