import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../../common/Navbar';
import Buttonui from '../../common/Buttonui';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const EditProduct = () => {
    // Get the productId passed via state from navigation
    const location = useLocation();
    const { productId } = location.state || {};  // If productId exists, get it from location state
    const admin = true;

    // States for the product fields
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [availableItems, setAvailableItems] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = sessionStorage.getItem("access-token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!productId) {
            setError("Product ID is missing.");
            setLoading(false);
            return;
        }

        // Fetch product data when the component mounts
        const fetchProductData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Populate the fields with the fetched data
                    setName(data.name);
                    setCategory(data.category);
                    setManufacturer(data.manufacturer);
                    setAvailableItems(data.availableItems);
                    setPrice(data.price);
                    setImageUrl(data.imageUrl);
                    setDescription(data.description);
                    setLoading(false);
                } else {
                    setError("Failed to fetch product data");
                    setLoading(false);
                }
            } catch (error) {
                setError("Error fetching product data");
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId, token]);  // Dependency on productId and token

    // Handler for form submission
    const handleModifyProduct = async (event) => {
        event.preventDefault();

        const modifiedProduct = {
            name,
            category,
            manufacturer,
            availableItems,
            price,
            imageUrl,
            description,
        };

        try {
            const response = await axios.put(`http://localhost:8080/api/products/${productId}`, modifiedProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success("Product modified successfully!");
                navigate("/home"); // Navigate to the home page after successful update
            } else {
                toast.error("Failed to modify product.");
            }
        } catch (error) {
            toast.error("Error modifying product.");
        }
    };

    // Loading state and error handling
    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (<><Navbar>
        <ShoppingCartIcon style={{ color: "white" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ paddingLeft: "1%" }}>
            upGrad E-shop
        </Typography>

        <br></br>
        <Buttonui type="button" onClick={() => navigate("/")}>
            Home
        </Buttonui>

        {admin && (
            <Buttonui
                type="button"
                onClick={() => navigate("/addproducts")}
            >
                Add Products
            </Buttonui>
        )}

        <Buttonui
            logout="true"
            type="button"
            onClick={() => navigate("/signin")}
        >
            LogOut
        </Buttonui>
    </Navbar>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
                Modify Product
            </Typography>
            <form onSubmit={handleModifyProduct}>
                <Grid container spacing={2}>
                    {/* Product Name */}
                    <Grid item xs={12}>
                        <TextField
                            label="Product Name"
                            variant="outlined"
                            fullWidth
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <MenuItem value="electronics">Electronics</MenuItem>
                                <MenuItem value="fashion">Fashion</MenuItem>
                                <MenuItem value="home">Home</MenuItem>
                                <MenuItem value="toys">Toys</MenuItem>
                                <MenuItem value="books">Books</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Manufacturer */}
                    <Grid item xs={12}>
                        <TextField
                            label="Manufacturer"
                            variant="outlined"
                            fullWidth
                            required
                            value={manufacturer}
                            onChange={(e) => setManufacturer(e.target.value)}
                        />
                    </Grid>

                    {/* Available Items */}
                    <Grid item xs={12}>
                        <TextField
                            label="Available Items"
                            variant="outlined"
                            fullWidth
                            required
                            type="number"
                            value={availableItems}
                            onChange={(e) => setAvailableItems(e.target.value)}
                        />
                    </Grid>

                    {/* Price */}
                    <Grid item xs={12}>
                        <TextField
                            label="Price"
                            variant="outlined"
                            fullWidth
                            required
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Grid>

                    {/* Image URL */}
                    <Grid item xs={12}>
                        <TextField
                            label="Image URL"
                            variant="outlined"
                            fullWidth
                            required
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </Grid>

                    {/* Product Description */}
                    <Grid item xs={12}>
                        <TextField
                            label="Product Description"
                            variant="outlined"
                            fullWidth
                            required
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                        >
                            Modify Product
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div></>
    );
};

export default EditProduct;
