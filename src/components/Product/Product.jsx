import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardMedia, CardContent, Button, Typography } from '@mui/material';
import ToggleButton from '@mui/lab/ToggleButton';
import ToggleButtonGroup from '@mui/lab/ToggleButtonGroup';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Product = () => {
    const [alignment, setAlignment] = useState('all');
    const [categories, setCategories] = useState([]);
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);

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
                    const data = await response.json(); // Await the JSON parsing
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
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Price: ${product.price}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => alert("Buy clicked!")}>
                    Buy Now
                </Button>
            </CardContent>
        </Card>
        </>
    );
};

export default Product;
