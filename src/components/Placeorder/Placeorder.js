import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, Button, TextField, MenuItem, IconButton, InputAdornment, FormControl, Select, InputLabel, Stepper, Step, StepLabel, Box, Card } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../common/Navbar';
import Buttonui from '../../common/Buttonui';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from '@mui/icons-material/Search';

const OrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const admin = sessionStorage.getItem("isAdmin");
    
    // Get productId from the route (location.state or params)
    const { id, quantity } = location.state || {};  // Assuming productId is passed via location.state
    const token = sessionStorage.getItem('access-token');
    const [activeStep, setActiveStep] = useState(1);
    const [product, setProduct] = useState(null);  // State to store fetched product
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddressDetails, setNewAddressDetails] = useState({
        name: '', 
        contactNumber: '', 
        street: '', 
        city: '', 
        landmark: '', 
        state: '', 
        zipcode: ''
    });
    const [isAddingNew, setIsAddingNew] = useState(false);

    // Fetch product details by id
    useEffect(() => {
        if (!id) {
            toast.error('Product ID is missing');
            return;
        }
        
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);  // Save the product data
                } else {
                    toast.error('Failed to fetch product details');
                }
            } catch (error) {
                toast.error('An error occurred while fetching product details');
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id, token]);

    // Fetch addresses (similar to previous implementation)
    useEffect(() => {
        if (!token) {
            toast.error('You are not logged in. Please log in first.');
            navigate('/signin');
            return;
        }

        const fetchAddresses = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/addresses', {
                    method: 'GET',
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
                    toast.error('Failed to fetch addresses');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error('An error occurred while fetching addresses');
            }
        };

        fetchAddresses();
    }, [token]);

    // Handle address and new address form changes
    const handleAddressChange = (e) => setSelectedAddress(e.target.value);
    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddressDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Add new address and go to next step
    const handleAddNewAddress = async () => {
        if (!newAddressDetails.name || !newAddressDetails.contactNumber || !newAddressDetails.street || !newAddressDetails.city || !newAddressDetails.zipcode) {
            toast.error('Please fill out all address fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/addresses', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(newAddressDetails),
            });

            if (response.ok) {
                const data = await response.json();
                setAddresses((prev) => [...prev, data]);
                setSelectedAddress(data.id);
                toast.success('New address added successfully!');
                setIsAddingNew(false);
            } else {
                toast.error('Failed to add new address');
            }
        } catch (error) {
            toast.error('An error occurred while adding the address');
            console.error('Error adding address:', error);
        }
    };

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handlePlaceOrder = async () => {
        const userId = sessionStorage.getItem('userId');
        const orderData = {
            user: userId,
            product: id,
            address: selectedAddress || newAddressDetails,  // use selected address or the new address
            quantity: quantity,
        };

        try {
            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                toast.success('Order placed successfully!');
                navigate('/home');
            } else {
                
                navigate('/home');
            }
        } catch (error) {
            toast.error('An error occurred while placing the order');
            console.error('Error placing order:', error);
        }
    };

    if (!product) {
        return <Typography variant="h6" align="center">Loading product details...</Typography>;
    }

    return (
        <>
            <Navbar sx={{ backgroundColor: '#3f51b5' }}>
                <ShoppingCartIcon style={{ color: "white" }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ paddingLeft: "1%" }}>
                    upGrad E-shop
                </Typography>

                <TextField
                    variant="outlined"
                    size="small"
                    sx={{ marginRight: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Buttonui type="button" onClick={() => navigate("/home")}>Home</Buttonui>

                {admin && (
                    <Buttonui type="button" onClick={() => navigate("/addproducts")}>Add Products</Buttonui>
                )}

                <Buttonui logout="true" type="button" onClick={() => navigate("/logout")}>LogOut</Buttonui>
            </Navbar>

            <Stepper activeStep={activeStep} alternativeLabel>
                <Step completed={true}>
                    <StepLabel>Product Details</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Choose Address</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Review and Place Order</StepLabel>
                </Step>
            </Stepper>

            <Box sx={{ padding: 2 }}>
                {activeStep === 1 && (
                    <Box>
                        <Typography variant="h6">Product Details</Typography>
                        <Card sx={{ display: 'flex', flexDirection: 'column', padding: 2, marginBottom: 2, boxShadow: 3 }}>
                            {product.imageUrl && (
                                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', marginBottom: '20px' }} />
                            )}
                            <Typography variant="subtitle1"><strong>Product Name:</strong> {product.name}</Typography>
                            <Typography variant="subtitle2"><strong>Category:</strong> {product.category || "N/A"}</Typography>
                            <Typography variant="body2" sx={{ marginTop: 1 }}><strong>Description:</strong> {product.description || "No description available"}</Typography>
                            <Typography variant="h6" sx={{ marginTop: 1 }}><strong>Price per Item:</strong> {product.price.toFixed(2)}</Typography>
                            <Typography variant="h6" sx={{ marginTop: 1 }}><strong>Total Price:</strong> {(product.price * quantity).toFixed(2)}</Typography>
                        </Card>

                        <Box sx={{ marginTop: 3 }}>
                            <Button onClick={handleNext} variant="contained" color="primary">Next</Button>
                        </Box>
                    </Box>
                )}

                {activeStep === 2 && (
                    <Box>
                        <Typography variant="h6">Choose Address</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Select Address</InputLabel>
                            <Select value={selectedAddress} onChange={handleAddressChange} label="Select Address">
                                {addresses.map((address) => (
                                    <MenuItem key={address.id} value={address.id}>
                                        {address.street}, {address.city}, {address.zipcode}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {!isAddingNew && (
                            <Button onClick={() => setIsAddingNew(true)} variant="contained" color="primary" sx={{ marginBottom: 2 }}>
                                Add New Address
                            </Button>
                        )}
                        {isAddingNew && (
                            <Box>
                                <Typography variant="h6">Add New Address</Typography>
                                <TextField label="Name" name="name" value={newAddressDetails.name} onChange={handleNewAddressChange} fullWidth margin="normal" />
                                <TextField label="Contact Number" name="contactNumber" value={newAddressDetails.contactNumber} onChange={handleNewAddressChange} fullWidth margin="normal" />
                                <TextField label="Street" name="street" value={newAddressDetails.street} onChange={handleNewAddressChange} fullWidth margin="normal" />
                                <TextField label="City" name="city" value={newAddressDetails.city} onChange={handleNewAddressChange} fullWidth margin="normal" />
                                <TextField label="Landmark" name="landmark" value={newAddressDetails.landmark} onChange={handleNewAddressChange} fullWidth margin="normal" />
                                <TextField label="State" name="state" value={newAddressDetails.state} onChange={handleNewAddressChange} fullWidth margin="normal" />
                                <TextField label="Zipcode" name="zipcode" value={newAddressDetails.zipcode} onChange={handleNewAddressChange} fullWidth margin="normal" />
                                <Button onClick={handleAddNewAddress} variant="contained" color="primary" sx={{ marginTop: 2 }}>Add Address</Button>
                            </Box>
                        )}

                        <Box sx={{ marginTop: 3 }}>
                            <Button onClick={handleNext} variant="contained" color="primary">Next</Button>
                        </Box>
                    </Box>
                )}

                {activeStep === 3 && (
                    <Box>
                        <Card sx={{ padding: 2 }}>
                            <Typography variant="h6">Review Your Order</Typography>
                            <Typography variant="body1">Product: {product.name}</Typography>
                            <Typography variant="body1">Quantity: {quantity}</Typography>
                            <Typography variant="h6">Total Price: {(product.price * quantity).toFixed(2)}</Typography>
                            <Typography variant="h6">Shipping Address:</Typography>
                            <Typography variant="body1">
                                {selectedAddress
                                    ? `${addresses.find(address => address.id === selectedAddress)?.street}, 
                                       ${addresses.find(address => address.id === selectedAddress)?.city}, 
                                       ${addresses.find(address => address.id === selectedAddress)?.zipcode}`
                                    : `${newAddressDetails.street}, ${newAddressDetails.city}, ${newAddressDetails.zipcode}`}
                            </Typography>
                        </Card>
                        <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" onClick={handleBack}>Back</Button>
                            <Button variant="contained" color="primary" onClick={handlePlaceOrder}>Place Order</Button>
                        </Box>
                    </Box>
                )}
            </Box>

            <ToastContainer />
        </>
    );
};

export default OrderPage;
