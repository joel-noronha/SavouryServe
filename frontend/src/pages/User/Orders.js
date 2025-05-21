// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
// } from "@mui/material";
// import Header from "../../Components/Header";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const customerId = localStorage.getItem("userId");
//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3003/api/order/customer-orders/${customerId}`
//       );
//       setOrders(response.data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div>
//       <Header />
//       <div
//         style={{ padding: "20px", backgroundColor: "#f4f6f8", height: "80vh" }}
//       >
//         <h1 style={{ textAlign: "center" }}>Customer Orders</h1>
//         <TableContainer
//           component={Paper}
//           style={{ width: "80%", margin: "auto" }}
//         >
//           <Table>
//             <TableHead style={{ backgroundColor: "#dba26b" }}>
//               <TableRow>
//                 <TableCell style={{ color: "white" }}>Order ID</TableCell>
//                 <TableCell style={{ color: "white" }}>Program</TableCell>
//                 <TableCell style={{ color: "white" }}>Program date</TableCell>
//                 <TableCell style={{ color: "white" }}>Booking status</TableCell>
//                 <TableCell style={{ color: "white" }}>Discount</TableCell>
//                 <TableCell style={{ color: "white" }}>Grand total</TableCell>
//                 <TableCell style={{ color: "white" }}>Final total</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {orders.map((order) => (
//                 <TableRow key={order.order_id}>
//                   <TableCell>{order.order_number}</TableCell>
//                   <TableCell>{order.program}</TableCell>
//                   <TableCell>
//                     {new Date(order.program_date).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={order.booking_status}
//                       color={
//                         order.booking_status === "pending"
//                           ? "warning"
//                           : order.booking_status === "confirmed"
//                           ? "success"
//                           : "error"
//                       }
//                     />
//                   </TableCell>
//                   <TableCell>{order.discount}%</TableCell>
//                   <TableCell>₹{order.grand_total}</TableCell>
//                   <TableCell>₹{order.final_total}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
//     </div>
//   );
// };

// export default Orders;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  Button
} from "@mui/material";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const customerId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3003/api/order/customer-orders/${customerId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleViewQuotation = (orderNumber) => {
    navigate(`/quotation/${orderNumber}`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <h3>Customer Orders</h3>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Program</TableCell>
                    <TableCell>Program date</TableCell>
                    <TableCell>Booking status</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Grand total</TableCell>
                    <TableCell>Final total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.order_number}>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>{order.program}</TableCell>
                      <TableCell>
                        {new Date(order.program_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.booking_status}
                          color={
                            order.booking_status === "confirmed"
                              ? "success"
                              : order.booking_status === "pending"
                              ? "warning"
                              : "error"
                          }
                        />
                      </TableCell>
                      <TableCell>{order.discount}%</TableCell>
                      <TableCell>₹{order.grand_total}</TableCell>
                      <TableCell>₹{order.final_total}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={() => handleViewQuotation(order.order_number)}
                        >
                          Quotation
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;