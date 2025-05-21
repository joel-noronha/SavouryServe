// Quotation.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';

const Qoutation = () => {
    const { orderNumber } = useParams();
    const [quotation, setQuotation] = useState(null);

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                const response = await axios.get(`http://localhost:3003/api/order/quotation/${orderNumber}`);
                console.log('API Response:', response.data);
                setQuotation(response.data);
            } catch (error) {
                console.error('Error fetching quotation:', error);
            }
        };

        fetchQuotation();
    }, [orderNumber]);

    const handlePrint = () => {
        window.print();
    };

    if (!quotation) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1>Order Quotation</h1>
                <p>Invoice #{orderNumber}</p>
            </div>

            {/* Customer and Company Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h3>Customer Details</h3>
                    <p><strong>Name:</strong> {quotation.customer.name}</p>
                    <p><strong>Phone:</strong> {quotation.customer.phone}</p>
                    <p><strong>Email:</strong> {quotation.customer.email}</p>
                    <p><strong>Address:</strong> {quotation.customer.address}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h3>Online Catering</h3>
                    <p>5th Floor, Shalimar complex</p>
                    <p>Kankanady, Mangalore 576666</p>
                    <p>john.doe@example.com</p>
                </div>
            </div>

            {/* Program and Supplier Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h4>Program Details</h4>
                    <p><strong>Program:</strong> {quotation.booking.program}</p>
                    <p><strong>Date:</strong> {new Date(quotation.booking.program_date).toLocaleDateString()}</p>
                    <p><strong>Place:</strong> {quotation.place.place_name}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h4>Supplier Details</h4>
                    <p>{quotation.supplier.supplier_name}</p>
                    <p>GSTIN - {quotation.supplier.supplier_gstin}</p>
                    <p>PH - {quotation.supplier.supplier_phone_number}</p>
                    <p>{quotation.supplier.supplier_address}</p>
                </div>
            </div>

            {/* Products Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>SL.NO</th>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Product</th>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Price</th>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Quantity</th>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {quotation.products.map((product, index) => (
                        <tr key={index}>
                            <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{product.slNo}</td>
                            <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                            <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{product.price.toFixed(2)}</td>
                            <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{product.quantity}</td>
                            <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{product.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="4" style={{ borderTop: '1px solid #ddd', padding: '8px' }}>Subtotal</td>
                        <td style={{ borderTop: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{quotation.totals.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="4" style={{ borderTop: '1px solid #ddd', padding: '8px' }}>Discount</td>
                        <td style={{ borderTop: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{quotation.totals.discount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="4" style={{ borderTop: '1px solid #ddd', padding: '8px' }}>Total</td>
                        <td style={{ borderTop: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{quotation.totals.grandTotal.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>Thank you for your order!</p>
            </div>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={handlePrint}>
                    Print
                </Button>
            </div>
        </div>
    );
};

export default Qoutation;
