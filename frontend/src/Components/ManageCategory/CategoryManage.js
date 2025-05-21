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

const CategoryForm = ({ open, setOpen, handleSave, formData, setFormData }) => {
  const isEdit = formData?.id;

  const handleSubmit = () => {
    handleSave(formData);
    setFormData({ name: "", status: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Category Name"
          fullWidth
          margin="dense"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          label="Status"
          fullWidth
          margin="dense"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", status: "" });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/cat/category-all");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (data) => {
    try {
      if (data.id) {
        // Update
        const response = await axios.put(
          `http://localhost:3003/api/cat/category-update/${data.id}`,
          {
            category_name: data.name,
            category_status: data.status,
          }
        );
        alert(response.data.message);
      } else {
        // Add
        const response = await axios.post(
          "http://localhost:3003/api/cat/category-add",
          {
            category_name: data.name,
            category_status: data.status,
          }
        );
        alert(response.data.message);
      }
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3003/api/cat/delete-cat/${id}`
      );
      alert(response.data.message);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      id: category.category_id,
      name: category.category_name,
      status: category.category_status,
    });
    setOpen(true);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
      <h1>Manage Category</h1>
      <hr />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setFormData({ name: "", status: "" });
          setOpen(true);
        }}
        startIcon={<AddIcon />}
        style={{
          marginBottom: "20px",
          borderRadius: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        Add Category
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
                Category Name
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
            {categories.map((cat, index) => (
              <TableRow key={cat.category_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{cat.category_name}</TableCell>
                <TableCell>
                  <Chip
                    label={cat.category_status}
                    color={
                      cat.category_status === "active" ? "success" : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(cat)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(cat.category_id)}
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

      <CategoryForm
        open={open}
        setOpen={setOpen}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default CategoryManage;
