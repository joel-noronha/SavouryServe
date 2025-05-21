import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  Chip,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UserForm = ({ open, setOpen, handleSave, formData, setFormData }) => {
  const isEdit = formData?.id;

  const handleSubmit = () => {
    handleSave(formData);
    setFormData({ name: "", email: "", role: "",password:"" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <TextField
          label="User Name"
          fullWidth
          margin="dense"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          label="Email"
          fullWidth
          margin="dense"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          label="Role"
          fullWidth
          margin="dense"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
        <TextField
          label="Password"
          fullWidth
          margin="dense"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {isEdit ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" ,password:""});

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (data) => {
    try {
      if (data.id) {
        // Update
        const response = await axios.put(
          `http://localhost:3003/api/auth/users/${data.id}`,
          {
            name: data.name,
            email: data.email,
            role: data.role,
            password: data.password,
          }
        );
        alert(response.data.message);
      } else {
        // Add
        const response = await axios.post(
          "http://localhost:3003/api/auth/register",
          {
            name: data.name,
            email: data.email,
            role: data.role,
            password: data.password,
          }
        );
        alert(response.data.message);
      }
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3003/api/auth/users/${id}`
      );
      alert(response.data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
    });
    setOpen(true);
  };
  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
      <h1>Manage Users</h1>
      <hr />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setFormData({ name: "", email: "", role: "" });
          setOpen(true);
        }}
        startIcon={<AddIcon />}
        style={{
          marginBottom: "20px",
          borderRadius: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        Add User
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
                User Name
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Role
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.user_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === "User" ? "secondary" : "success"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(user.id)}
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

      <UserForm
        open={open}
        setOpen={setOpen}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default UserManagement;
