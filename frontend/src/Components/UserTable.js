import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:3003/api/auth/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        //setError("Failed to fetch users. Please try again later.");
      });
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setOpenEditModal(true);
  };

  const handleOpenModal = (id) => {
    setSelectedUserId(id);
    setOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedUserId(null);
  };

  const handleDelete = () => {
    if (selectedUserId) {
      axios
        .delete(`http://localhost:3003/api/auth/users/${selectedUserId}`)
        .then(() => {
          setUsers(users.filter((user) => user.id !== selectedUserId));
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
    handleCloseModal();
  };

  const handleEditSubmit = () => {
    axios
      .put(`http://localhost:3003/api/auth/users/${editUser.id}`, editUser)
      .then(() => {
        fetchUsers();

        setOpenEditModal(false);
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
      <TableContainer
        component={Paper}
        elevation={3}
        style={{ marginTop: "20px", borderRadius: "12px" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#1976d2", color: "#fff" }}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Name
              </TableCell>
              <TableCell
                align="right"
                style={{ fontWeight: "bold", color: "#fff" }}
              >
                email
              </TableCell>
              <TableCell
                align="right"
                style={{ fontWeight: "bold", color: "#fff" }}
              >
                role
              </TableCell>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", color: "#fff" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.role}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={3} justifyContent="center">
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<DeleteIcon />}
                      onClick={() => handleOpenModal(row.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={editUser?.name || ""}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={editUser?.email || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
          />
          <TextField
            label="Role"
            fullWidth
            margin="dense"
            value={editUser?.role || ""}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
