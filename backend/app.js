const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const placeRoutes = require("./routes/placeRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const itemsRoutes = require("./routes/itemsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const empRoutes = require("./routes/empRoutes");
const foodRequestRoutes = require("./routes/foodRequestRoutes");
const profileRoutes=require("./routes/profileRoutes");
const qoutationRoutes=require("./routes/qoutaionRoutes");
const reportRoutes = require("./routes/reportRoutes");

const path = require("path");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.static("public"));
//routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/cat", categoryRoutes);
app.use("/api/place", placeRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/item", itemsRoutes);
app.use("/api/order", cartRoutes);
app.use("/api/emp", empRoutes);
app.use("/api", foodRequestRoutes);
app.use("/api",profileRoutes);
app.use("/api/order",qoutationRoutes);
app.use("/api", reportRoutes);
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
