import React, { useState, useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
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
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemForm = ({ open, setOpen, handleSave, formData, setFormData }) => {
  const isEdit = formData?.id;

  const handleSubmit = () => {
    handleSave(formData);
    setFormData({
      category_id: "",
      item_name: "",
      item_measure: "",
      item_price: "",
      item_description: "",
      item_status: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit item" : "Add item"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} marginTop={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Category ID"
              fullWidth
              value={formData.c_id}
              onChange={(e) =>
                setFormData({ ...formData, c_id: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Item Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Measure"
              fullWidth
              value={formData.measure}
              onChange={(e) =>
                setFormData({ ...formData, measure: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              fullWidth
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === "active"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.checked ? "active" : "inactive",
                    })
                  }
                  color="success"
                />
              }
              label={`Status: ${
                formData.status === "active" ? "active" : "inactive"
              }`}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              style={{ padding: "16px", borderRadius: "8px" }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.files[0] });
                }}
              />
            </Button>

            {/* Optional: Show selected file name */}
            {/* {formData.image && (
              <div style={{ marginTop: "8px", color: "#555" }}>
                Selected: {formData.image.name}
              </div>
            )} */}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {isEdit ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const FoodItemsManage = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    id: "",
    c_id: "",
    name: "",
    measure: "",
    price: "",
    description: "",
    status: "active",
  });

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/item/item-all");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (data) => {
    console.log(data);
    try {
      if (data.id) {
        // Update
        const response = await axios.put(
          `http://localhost:3003/api/item/item-update/${data.id}`,
          {
            category_id: data.c_id,
            item_name: data.name,
            item_measure: data.measure,
            item_price: data.price,
            item_description: data.description,
            item_status: data.status,
            item_image: data.image,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert(response.data.message);
      } else {
        // Add
        const response = await axios.post(
          "http://localhost:3003/api/item/item-add",
          {
            category_id: data.c_id,
            item_name: data.name,
            item_measure: data.measure,
            item_price: data.price,
            item_description: data.description,
            item_status: data.status,
            item_image: data.image,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert(response.data.message);
      }
      fetchItems();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3003/api/item/item-delete/${id}`
      );
      alert(response.data.message);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.item_id,
      c_id: item.category_id,
      name: item.item_name,
      measure: item.item_measure,
      price: item.item_price,
      description: item.item_description,
      status: item.item_status,
      image: item.item_image,
    });
    setOpen(true);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
      <h1>Manage Food Items</h1>
      <hr />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setFormData({
            id: "",
            c_id: "",
            name: "",
            measure: "",
            price: "",
            description: "",
            status: "active",
            image: "",
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
        Add Food Item
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
                Category id
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Item Name
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Price
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Measure
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={item.item_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.category_id}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.item_description}</TableCell>
                  <TableCell>{item.item_price}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.item_status}
                      color={
                        item.item_status === "active" ? "success" : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>{item.item_measure}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(item)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(item.item_id)}
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
      <TablePagination
        component="div"
        count={items.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <ItemForm
        open={open}
        setOpen={setOpen}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default FoodItemsManage;
