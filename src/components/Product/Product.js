import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, TextField, InputAdornment, IconButton, Box, Button } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Navbar from '../../common/Navbar';
import Buttonui from '../../common/Buttonui';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from '@mui/icons-material/Search';
import Logout from '../Login/Logout';

const Product = () => {
    const [alignment, setAlignment] = useState('all');
    const [categories, setCategories] = useState([]);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const navigate = useNavigate();
    const admin = sessionStorage.getItem("isAdmin");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/products/categories");
                if (response.ok) {
                    const data = await response.json();
                    setCategories(["all", ...data]);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    console.log("Error while fetching product.");
                }
            } catch (error) {
                console.log("Fetch error:", error);
            }
        };

        fetchCategories();
        fetchProduct();
    }, [id]);

    if (!product) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
        }
    };

    const handleQuantity = (event) => {
        const value = event.target.value;
        setQuantity(value);
        sessionStorage.setItem("quantity", quantity);
    };

    const handlePlaceOrder = () => {
        if (quantity <= 0) {
            alert('Please select a valid quantity');
            return;
        }

        navigate('/placeorder', { state: { id: product.id, quantity, price: product.price, name: product.name } });
    };

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
            <br/> 
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                >
                    {categories.map(category => (
                        <ToggleButton key={category} value={category} aria-label={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>
          
            <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', paddingRight: 4 }}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                            maxWidth: '300px',
                            height: 'auto',
                            objectFit: 'contain',
                            borderRadius: '10px'
                        }}
                    />
                </Box>

                <Box sx={{ flex: 1, padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="h4" component="div" sx={{ marginBottom: 1 }}>
                        {product.name}
                    </Typography>

                    <Box sx={{
                        padding: '5px 10px',
                        backgroundColor: '#3f51b5',
                        color: 'white',
                        borderRadius: '20px',
                        marginBottom: 2
                    }}>
                        <Typography variant="body2">{`Available Items - ${product.availableItems}`}</Typography>
                    </Box>

                    <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 2 }}>
                        {product.description}
                    </Typography>

                    <Typography variant="h6" sx={{ color: 'red', marginBottom: 2 }}>
                        {product.price}
                    </Typography>

                    <TextField
                        onChange={handleQuantity}
                        value={quantity}
                        variant="outlined"
                        label="Select Quantity"
                        size="small"
                        sx={{ backgroundColor: 'white', marginBottom: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#3f51b5' }}
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default Product;
