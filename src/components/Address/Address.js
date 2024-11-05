import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stepper, Step, StepLabel, Typography, Box, MenuItem, Select, FormControl, TextField, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const PlaceOrder = () => {
    const steps = ['Items', 'Select Address', 'Confirm Order'];
    const location = useLocation();
    const navigate = useNavigate();
    const userName = sessionStorage.getItem('username');
    const token = localStorage.getItem('token');
    const { id, quantity } = location.state || {};

    const [activeStep, setActiveStep] = useState(1); // Start directly at step 2
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        contactNumber: '',
        landmark: '',
    });

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/addresses',{
                    
                        method: "GET",
                        headers: {
                          accept: "application/json",
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAddresses(data);
                } else {
                    console.error("Error fetching addresses");
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchAddresses();
    }, []);

    const handleNext = async (e) => {
        e.preventDefault();

        if (activeStep === 1 && selectedAddress === '' && !Object.values(newAddress).every(x => x.trim() !== '')) {
            toast.error("Please select or fill in an address!");
            return;
        }

        if (selectedAddress === '' && Object.values(newAddress).every(x => x.trim() !== '')) {
            try {
                await axios.post('http://localhost:8080/api/addresses', {
                    ...newAddress,
                    user: userName.id,
                });
                toast.success("New address added successfully!");
            } catch (error) {
                toast.error("Failed to add new address.");
                console.error("Error adding address:", error);
            }
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleConfirmOrder = () => {
        const orderDetails = {
            productId: id,
            quantity,
            selectedAddress: selectedAddress || newAddress,
        };
        console.log('Order confirmed:', orderDetails);
        toast.success('Order placed successfully!');
        navigate('/'); // Redirect after confirmation
    };

    return (
        <>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label} completed={index < activeStep}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ mt: 2 }}>
                {activeStep === 1 && (
                    <form onSubmit={handleNext}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Select
                                value={selectedAddress}
                                onChange={(e) => setSelectedAddress(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Select Address</em>
                                </MenuItem>
                                {addresses.map((address) => (
                                    <MenuItem key={address.id} value={address.id}>
                                        {`${address.street}, ${address.city}, ${address.state}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography variant="h6" sx={{ mb: 2 }}>Or Add a New Address</Typography>
                        <TextField
                            label="Street"
                            variant="outlined"
                            fullWidth
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="City"
                            variant="outlined"
                            fullWidth
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="State"
                            variant="outlined"
                            fullWidth
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Zipcode"
                            variant="outlined"
                            fullWidth
                            value={newAddress.zipcode}
                            onChange={(e) => setNewAddress({ ...newAddress, zipcode: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Contact Number"
                            variant="outlined"
                            fullWidth
                            value={newAddress.contactNumber}
                            onChange={(e) => setNewAddress({ ...newAddress, contactNumber: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        
                        <Button 
                            type="submit" // Submit button for the form
                            variant="contained" 
                            color="primary" 
                            sx={{ mt: 2 }}
                        >
                            Next
                        </Button>
                    </form>
                )}

                {activeStep === 2 && (
                    <div>
                        <Typography variant="h6">Confirm Order</Typography>
                        <Typography variant="body1">Product ID: {id}</Typography>
                        <Typography variant="body1">Quantity: {quantity}</Typography>
                        <Typography variant="body1">
                            Address: {selectedAddress || `${newAddress.street}, ${newAddress.city}, ${newAddress.state}`}
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleConfirmOrder} 
                            sx={{ mt: 2 }}
                        >
                            Place Order
                        </Button>
                    </div>
                )}
            </Box>
            <ToastContainer />
        </>
    );
};

export default PlaceOrder;
