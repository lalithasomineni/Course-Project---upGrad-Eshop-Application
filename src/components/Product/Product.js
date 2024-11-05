import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Button, Typography, TextField, InputAdornment } from '@mui/material';
import ToggleButton from '@mui/lab/ToggleButton';
import ToggleButtonGroup from '@mui/lab/ToggleButtonGroup';

const Product = () => {
    const [alignment, setAlignment] = useState('all');
    const [categories, setCategories] = useState([]);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const navigate = useNavigate(); // Use useNavigate hook

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
                    localStorage.setItem('id', data.id);
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
        localStorage.setItem('quantity', value);
    };

    const handlePlaceOrder = () => {
        navigate('/address', { state: { id: product.id, quantity } }); // Navigate with state
    };

    return (
        <>
            <Typography variant="h6">Toggle Buttons</Typography>
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
            <Card sx={{ maxWidth: 600, margin: '20px auto' }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={product.imageUrl}
                    alt={product.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                        Available Items - {product.availableItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {product.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Price: ${product.price}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handlePlaceOrder}>
                        Place Order
                    </Button>
                    <TextField
                        onChange={handleQuantity}
                        value={quantity}
                        variant="outlined"
                        label="Select Quantity"
                        size="small"
                        sx={{ backgroundColor: 'white' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {/* Icon or element can go here */}
                                </InputAdornment>
                            ),
                        }}
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default Product;
