// import React, { useEffect, useState } from "react";
// import Sidebar from "../../Components/Sidebar";
// import { Box } from "@mui/system";
// import Navbar from "../../Components/Navbar";
// import Grid from "@mui/material/Grid2";
// import axios from "axios";
// import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// const NGORequests = () => {
//     const [requests, setRequests] = useState([]);

//     useEffect(() => {
//         // Fetch NGO requests from the backend
//         const fetchRequests = async () => {
//             try {
//                 const response = await axios.get("http://localhost:3003/api/ngo-requests-emp"); // Replace with your API endpoint
//                 setRequests(response.data);
//             } catch (error) {
//                 console.error("Error fetching requests:", error);
//             }
//         };

//         fetchRequests();
//     }, []);

//     const handleApprove = async (id, email, name) => {
//         try {
//             const response = await axios.put(`http://localhost:3003/api/approve-request/${id}`, { email, name });
//             alert(response.data.message);
//             // Refresh the requests list
//             setRequests((prev) =>
//                 prev.map((req) =>
//                     req.request_id === id ? { ...req, request_status: "Approved" } : req
//                 )
//             );
//         } catch (error) {
//             console.error("Error approving request:", error);
//         }
//     };

//     const handleDonate = async (id) => {
//         try {
//             const response = await axios.put(`http://localhost:3003/api/donate-request/${id}`);
//             alert(response.data.message);
//             // Refresh the requests list
//             setRequests((prev) =>
//                 prev.map((req) =>
//                     req.request_id === id ? { ...req, request_status: "Donated" } : req
//                 )
//             );
//         } catch (error) {
//             console.error("Error donating request:", error);
//         }
//     };

//     const handleReject = async (id) => {
//         try {
//             const response = await axios.put(`http://localhost:3003/api/reject-request/${id}`);
//             alert(response.data.message);
//             // Refresh the requests list
//             setRequests((prev) =>
//                 prev.map((req) =>
//                     req.request_id === id ? { ...req, request_status: "Rejected" } : req
//                 )
//             );
//         } catch (error) {
//             console.error("Error rejecting request:", error);
//         }
//     };

//     return (
//         <>
//             <Navbar />
//             <Box sx={{ height: 70 }} />
//             <Box sx={{ display: "flex" }}>
//                 <Sidebar role="employee" />
//                 <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
//                     <Grid container>
//                         <Grid item xs={12}>
//                             <h3>NGO Requests</h3>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>SL.No</TableCell>
//                                         <TableCell>Program Details</TableCell>
//                                         <TableCell>Place</TableCell>
//                                         <TableCell>Program Date</TableCell>
//                                         <TableCell>NGO Name</TableCell>
//                                         <TableCell>NGO Address</TableCell>
//                                         <TableCell>Request Status</TableCell>
//                                         <TableCell>Action</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {requests.map((request, index) => (
//                                         <TableRow key={request.request_id}>
//                                             <TableCell>{index + 1}</TableCell>
//                                             <TableCell>{request.program}</TableCell>
//                                             <TableCell>{request.place_name}</TableCell>
//                                             <TableCell>{request.program_date}</TableCell>
//                                             <TableCell>{request.name}</TableCell>
//                                             <TableCell>{request.ngo_address}</TableCell>
//                                             <TableCell>{request.request_status}</TableCell>
//                                             <TableCell>
//                                                 {request.request_status === "Initiated" && (
//                                                     <>
//                                                         <Button
//                                                             variant="contained"
//                                                             color="success"
//                                                             onClick={() =>
//                                                                 handleApprove(
//                                                                     request.request_id,
//                                                                     request.ngo_email_address,
//                                                                     request.ngo_name
//                                                                 )
//                                                             }
//                                                         >
//                                                             Approve
//                                                         </Button>
//                                                         <Button
//                                                             variant="contained"
//                                                             color="error"
//                                                             onClick={() => handleReject(request.request_id)}
//                                                             style={{ marginLeft: "10px" }}
//                                                         >
//                                                             Reject
//                                                         </Button>
//                                                     </>
//                                                 )}
//                                                 {request.request_status === "Approved" && (
//                                                     <Button
//                                                         variant="contained"
//                                                         color="primary"
//                                                         onClick={() => handleDonate(request.request_id)}
//                                                     >
//                                                         Donate
//                                                     </Button>
//                                                 )}
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </Grid>
//                     </Grid>
//                 </Box>
//             </Box>
//         </>
//     );
// };

// export default NGORequests;


import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { Box } from "@mui/system";
import Navbar from "../../Components/Navbar";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const NGORequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch NGO requests from the backend
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3003/api/ngo-requests-emp");
                
                // Log the response data structure to understand the field names
                console.log("API Response:", response.data);
                
                setRequests(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching requests:", error);
                setError("Failed to load requests. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleApprove = async (id, email, name) => {
        try {
            // Debug values
            console.log("Approving request with:", { id, email, name });
            
            // Validate inputs
            if (!email || !name) {
                alert("Missing required email or name data");
                return;
            }
            
            const response = await axios.put(`http://localhost:3003/api/approve-request/${id}`, { 
                email, 
                name 
            });
            
            alert(response.data.message);
            // Refresh the requests list
            setRequests((prev) =>
                prev.map((req) =>
                    req.request_id === id ? { ...req, request_status: "Approved" } : req
                )
            );
        } catch (error) {
            console.error("Error approving request:", error);
            if (error.response) {
                alert(`Error: ${error.response.data.message || "Request failed"}`);
            } else {
                alert("Error approving request. Check console for details.");
            }
        }
    };

    const handleDonate = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3003/api/donate-request/${id}`);
            alert(response.data.message);
            // Refresh the requests list
            setRequests((prev) =>
                prev.map((req) =>
                    req.request_id === id ? { ...req, request_status: "Donated" } : req
                )
            );
        } catch (error) {
            console.error("Error donating request:", error);
            alert("Error updating donation status. Please try again.");
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3003/api/reject-request/${id}`);
            alert(response.data.message);
            // Refresh the requests list
            setRequests((prev) =>
                prev.map((req) =>
                    req.request_id === id ? { ...req, request_status: "Rejected" } : req
                )
            );
        } catch (error) {
            console.error("Error rejecting request:", error);
            alert("Error rejecting request. Please try again.");
        }
    };

    if (loading) return <div>Loading requests...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Navbar />
            <Box sx={{ height: 70 }} />
            <Box sx={{ display: "flex" }}>
                <Sidebar role="employee" />
                <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <h3>NGO Requests</h3>
                            {requests.length === 0 ? (
                                <p>No requests found.</p>
                            ) : (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>SL.No</TableCell>
                                            <TableCell>Program Details</TableCell>
                                            <TableCell>Place</TableCell>
                                            <TableCell>Program Date</TableCell>
                                            <TableCell>NGO Name</TableCell>
                                            <TableCell>NGO Address</TableCell>
                                            <TableCell>Request Status</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {requests.map((request, index) => (
                                            <TableRow key={request.request_id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{request.program}</TableCell>
                                                <TableCell>{request.place_name}</TableCell>
                                                <TableCell>{request.program_date}</TableCell>
                                                <TableCell>{request.name}</TableCell>
                                                <TableCell>{request.ngo_address}</TableCell>
                                                <TableCell>{request.request_status}</TableCell>
                                                <TableCell>
                                                    {request.request_status === "Initiated" && (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                onClick={() =>
                                                                    handleApprove(
                                                                        request.request_id,
                                                                        request.email,  // Updated field
                                                                        request.name    // Updated field
                                                                    )
                                                                }
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                onClick={() => handleReject(request.request_id)}
                                                                style={{ marginLeft: "10px" }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    {request.request_status === "Approved" && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleDonate(request.request_id)}
                                                        >
                                                            Donate
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
};

export default NGORequests;