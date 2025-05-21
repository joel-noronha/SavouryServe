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
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SupplierForm = ({ open, setOpen, handleSave, formData, setFormData }) => {
  const isEdit = formData?.id;

  const handleSubmit = () => {
    handleSave(formData);
    setFormData({
      place_id: "",
      supplier_name: "",
      supplier_gstin: "",
      supplier_phoneno: "",
      supplier_address: "",
      supplier_status: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} marginTop={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Place ID"
              fullWidth
              value={formData.pid}
              onChange={(e) =>
                setFormData({ ...formData, pid: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Supplier Name"
              fullWidth
              value={formData.sname}
              onChange={(e) =>
                setFormData({ ...formData, sname: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="GSTIN"
              fullWidth
              value={formData.sgstin}
              onChange={(e) =>
                setFormData({ ...formData, sgstin: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              fullWidth
              value={formData.sphoneno}
              onChange={(e) =>
                setFormData({ ...formData, sphoneno: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              fullWidth
              multiline
              minRows={2}
              value={formData.saddress}
              onChange={(e) =>
                setFormData({ ...formData, saddress: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.sstatus === "active"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sstatus: e.target.checked ? "active" : "inactive",
                    })
                  }
                  color="success"
                />
              }
              label={`Status: ${
                formData.sstatus === "active" ? "active" : "inactive"
              }`}
            />
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
const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    pid: "",
    sname: "",
    sgstin: "",
    sphoneno: "",
    saddress: "",
    sstatus: "",
  });

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3003/api/supplier/supplier-all"
      );
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSave = async (data) => {
    try {
      if (data.id) {
        // Update
        const response = await axios.put(
          `http://localhost:3003/api/supplier/supplier-update/${data.id}`,
          {
            place_id: data.pid,
            supplier_name: data.sname,
            supplier_gstin: data.sgstin,
            supplier_phoneno: data.sphoneno,
            supplier_address: data.saddress,
            supplier_status: data.sstatus,
          }
        );
        alert(response.data.message);
      } else {
        // Add
        const response = await axios.post(
          "http://localhost:3003/api/supplier/supplier-add",
          {
            place_id: data.pid,
            supplier_name: data.sname,
            supplier_gstin: data.sgstin,
            supplier_phoneno: data.sphoneno,
            supplier_address: data.saddress,
            supplier_status: data.sstatus,
          }
        );
        alert(response.data.message);
      }
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3003/api/supplier/supplier-delete/${id}`
      );
      alert(response.data.message);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      id: supplier.supplier_id,
      pid: supplier.place_id,
      sname: supplier.supplier_name,
      sgstin: supplier.supplier_gstin,
      sphoneno: supplier.supplier_phoneno,
      saddress: supplier.supplier_address,
      sstatus: supplier.supplier_status,
    });
    setOpen(true);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
      <h1>Manage Suppliers</h1>
      <hr />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setFormData({
            pid: "",
            sname: "",
            sgstin: "",
            sphoneno: "",
            saddress: "",
            sstatus: "active",
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
        Add Supplier
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
                Place id
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Gstin
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Phoneno.
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Address
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
            {suppliers.map((sup, index) => (
              <TableRow key={sup.supplier_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{sup.place_id}</TableCell>
                <TableCell>{sup.supplier_name}</TableCell>
                <TableCell>{sup.supplier_gstin}</TableCell>
                <TableCell>{sup.supplier_phoneno}</TableCell>
                <TableCell>{sup.supplier_address}</TableCell>
                <TableCell>
                  <Chip
                    label={sup.supplier_status}
                    color={
                      sup.supplier_status === "active" ? "success" : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(sup)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(sup.supplier_id)}
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

      <SupplierForm
        open={open}
        setOpen={setOpen}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default SupplierManagement;
