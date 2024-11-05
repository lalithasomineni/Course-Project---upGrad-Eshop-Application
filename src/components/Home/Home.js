import React, { useState, useEffect } from 'react';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Card, CardContent, CardMedia, Button, IconButton, Typography, Grid, ToggleButtonGroup, ToggleButton, Select, MenuItem, FormControl, InputLabel, Box, TextField, InputAdornment, IconButton as MuiIconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../../common/Navbar';
import Buttonui from '../../common/Buttonui';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [alignment, setAlignment] = useState('all');
    const [sortOption, setSortOption] = useState('none');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const admin = location.state?.admin;
    const token = sessionStorage.getItem("access-token");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/products");
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                    setFilteredProducts(data);  // Initial product list to show
                } else {
                    console.error("Error fetching products");
                }
            } catch (error) {
                console.error("Fetch error:", error);
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
                console.error("Error fetching categories:", error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        let filtered = products.filter(product => alignment === 'all' || product.category === alignment);

        // Apply search filtering
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        if (sortOption === 'new') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortOption === 'lh') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'hl') {
            filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
    }, [alignment, sortOption, products, searchTerm]);  // Adding searchTerm as dependency

    const handleEdit = (productId) => {
        navigate(`/editProduct/${productId}`, { state: { productId } });
    };

    const handleCategoryChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);  // Update searchTerm state as you type
    };

    const handleDeleteClick = (productId) => {
        setProductToDelete(productId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        // Proceed with the delete logic
        if (productToDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${productToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                });
                if (response.ok) {
                    // Filter out the deleted product from the state
                    setProducts(products.filter(product => product.id !== productToDelete));
                    setFilteredProducts(filteredProducts.filter(product => product.id !== productToDelete));
                } else {
                    console.error("Error deleting product");
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
        setDeleteDialogOpen(false); // Close the dialog after confirming
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false); // Close the dialog without deleting
    };

    // Helper function to truncate the description if it is too long
    const truncateDescription = (description, length = 100) => {
        return description.length > length ? description.substring(0, length) + '...' : description;
    };

    return (
        <>
            <Navbar style={{ backgroundColor: '#3f51b5' }}> {/* Lightened background color */}
                <ShoppingCartIcon style={{ color: "white" }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ paddingLeft: "1%" }}>
                    upGrad E-shop
                </Typography>

                {/* Search Bar next to "upGrad E-shop" */}
                <TextField
                    value={searchTerm}
                    onChange={handleSearchChange}
                    variant="outlined"
                    placeholder="Search Products"
                    size="small"
                    style={{ width: 250, marginLeft: "20px", backgroundColor: "white", borderRadius: 4 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MuiIconButton>
                                    <SearchIcon />
                                </MuiIconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Buttonui type="button" onClick={() => navigate("/")}>Home</Buttonui>

                {admin && (
                    <Buttonui type="button" onClick={() => navigate("/addproducts")}>Add Products</Buttonui>
                )}

                <Buttonui logout="true" type="button" onClick={() => navigate("/signin")}>LogOut</Buttonui>
            </Navbar>

            <div style={{ padding: '20px' }}>
                {/* Category Filter */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <ToggleButtonGroup
                        value={alignment}
                        exclusive
                        onChange={handleCategoryChange}
                        aria-label="Category Filter"
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        {categories.map((category) => (
                            <ToggleButton value={category} key={category} aria-label={category}>
                                {category}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </div>

                {/* Sort Dropdown */}
                <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '20px' }}>
                    <FormControl variant="outlined" style={{ minWidth: '200px' }}>
                        <InputLabel id="sort-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-label"
                            id="sort-select"
                            value={sortOption}
                            onChange={handleSortChange}
                            label="Sort By"
                        >
                            <MenuItem value="none">Default</MenuItem>
                            <MenuItem value="new">Newest</MenuItem>
                            <MenuItem value="lh">Price Low to High</MenuItem>
                            <MenuItem value="hl">Price High to Low</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* Product Cards Grid */}
                <Grid container spacing={4} justifyContent="center">
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <Card sx={{ maxWidth: 345 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.imageUrl}
                                    alt={product.name}
                                    style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '200px',
                                    }}
                                />
                                <CardContent style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: '10px', flexGrow: 1 }}>
                                        {truncateDescription(product.description, 100)}  {/* Truncate description */}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Price: ${product.price}
                                    </Typography>
                                </CardContent>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                                    <Button size="small" color="primary" variant="contained" onClick={() => navigate(`/products/${product.id}`)} style={{ fontSize: '0.8rem' }}>
                                        Buy
                                    </Button>

                                    {admin && (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <IconButton onClick={() => handleEdit(product.id)} style={{ padding: '5px' }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(product.id)} style={{ padding: '5px' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} aria-labelledby="delete-dialog-title">
                <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="secondary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Home;
