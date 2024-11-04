// src/components/Home.jsx

import React, { useState, useEffect } from 'react';
import ToggleButton from '@mui/lab/ToggleButton';
import ToggleButtonGroup from '@mui/lab/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { Card, CardMedia, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = ({ searchTerm }) => {
    const [alignment, setAlignment] = useState('all');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sortby, setSortby] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/products");
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.log("Error occurred while fetching products.");
                }
            } catch (error) {
                console.log("Fetch error:", error);
            }
        };

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

        fetchProducts();
        fetchCategories();
    }, []);

    const filterProducts = () => {
        let filtered = alignment === "all" ? products : products.filter(product => product.category === alignment);

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const handleBuy = () =>{
        
    }

    return (
        <div>
            <Typography variant="h6">Toggle Buttons</Typography>
            <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={(event, newAlignment) => setAlignment(newAlignment)}
                aria-label="text alignment"
            >
                {categories.map(category => (
                    <ToggleButton key={category} value={category} aria-label={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {filterProducts().length > 0 ? (
                    filterProducts().map(product => (
                        <Card sx={{ maxWidth: 345 }} key={product.id}>
                            <CardMedia
                                component="img"
                                height="140"
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
                                    {product.price}
                                </Typography>
                            </CardContent>
                            <Button size="small" color="primary" variant="contained" onClick = {() => navigate(`/products/${product.id}`)}>
                                Buy
                            </Button>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        No products available.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default Home;
