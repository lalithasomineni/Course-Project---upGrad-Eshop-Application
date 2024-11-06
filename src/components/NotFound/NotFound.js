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


const NotFound = () => {
  const admin = sessionStorage.getItem('isAdmin');
  const navigate = useNavigate();
  return (
    <div >
     <Navbar style={{ backgroundColor: '#3f51b5' }}> {/* Lightened background color */}
                <ShoppingCartIcon style={{ color: "white" }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ paddingLeft: "1%" }}>
                    upGrad E-shop
                </Typography>

                {/* Search Bar next to "upGrad E-shop" */}
                <TextField
                  
                   
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

                <Buttonui type="button" onClick={() => navigate("/Signup")}>Signup</Buttonui>

                
                <Buttonui  type="button" onClick={() => navigate("/Login")}>Login</Buttonui>
            </Navbar>

    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: '3rem',
    margin: '20px 0',
    color: '#dc3545',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  link: {
    fontSize: '1rem',
    color: '#007bff',
    textDecoration: 'none',
  }
};

export default NotFound;
