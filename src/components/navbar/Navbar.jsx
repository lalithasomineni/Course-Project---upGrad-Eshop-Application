import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, ButtonGroup, TextField, InputAdornment } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { logoutUser } from '../../assets/redux/authAction';

const Navbar = ({ onSearch }) => {  // Accept onSearch as a prop
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.isAuthenticated); 
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        dispatch(logoutUser());
        localStorage.removeItem('token'); 
    };

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        onSearch(term);  // Call the onSearch function passed from the parent component
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <ShoppingCartIcon sx={{ mr: 2 }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Upgrad E Shop
                </Typography>
                <TextField
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    sx={{ mr: 2, backgroundColor: 'white' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    value={searchTerm}
                    onChange={handleSearchChange}  // Update search term on change
                />
                <ButtonGroup variant="text" aria-label="text button group">
                    <Button 
                        component={Link} 
                        to="/" 
                        sx={{ color: 'blue' }}
                    >
                        Home
                    </Button>
                    {isAuthenticated ? (
                        <>
                            <Button 
                                component={Link} 
                                to="/add-product" 
                                sx={{ color: 'green' }}
                            >
                                Add Product
                            </Button>
                            <Button 
                                onClick={handleLogout} 
                                sx={{ color: 'red' }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button 
                                component={Link} 
                                to="/login" 
                                sx={{ color: 'orange' }}
                            >
                                Login
                            </Button>
                        </>
                    )}
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
