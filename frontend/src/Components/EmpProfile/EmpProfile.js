import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmpProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(`http://localhost:3003/api/user/${userId}`);
        if (response.data.success) {
          setName(response.data.user.name);
          setEmail(response.data.user.email);
          setPhone(response.data.user.phone);
          setAddress(response.data.user.address);
        } else {
          setErrorMessage('Failed to fetch profile data.');
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again.');
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const handleProfileUpdate = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.put(`http://localhost:3003/api/users/${userId}`, {
        name,
        email,
        phone,
        address,
      });

      if (response.data.success) {
        setSuccessMessage('Profile updated successfully!');
        setErrorMessage('');
        setIsEditing(false);
      } else {
        setErrorMessage('Failed to update profile.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div style={{ backgroundColor: '#f7f9f6' }}>
        <Container maxWidth="sm" backgroundColor="#f7f9f6">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '72vh',
              backgroundColor: '#f7f9f6',
            }}
          >
            <Box sx={{ width: '100%', mt: 4 }}>
              <Typography variant="h4" gutterBottom align="center">
                Edit Profile
                <IconButton onClick={() => setIsEditing(!isEditing)}>
                  <EditIcon />
                </IconButton>
              </Typography>
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}
              {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
              )}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: '#006400',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 24,
                  mb: 2,
                  mx: 'auto',
                }}
              >
                {name.charAt(0).toUpperCase()}
              </Box>
              <TextField
                label="Name"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
                disabled={!isEditing}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                disabled={!isEditing}
              />
              <TextField
                label="Phone"
                fullWidth
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{ mb: 2 }}
                disabled={!isEditing}
              />
              <TextField
                label="Address"
                fullWidth
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ mb: 2 }}
                disabled={!isEditing}
              />
              {isEditing && (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#006400', color: '#fff' }}
                  fullWidth
                  onClick={handleProfileUpdate}
                >
                  Update Profile
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EmpProfile;
