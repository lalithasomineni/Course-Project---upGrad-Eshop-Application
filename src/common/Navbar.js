import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import classes from'./Navbar.module.css'
export default function Navbar(props) {
  return (
    
    <Box sx={{ flexGrow: 1 }} className={`${classes.navbar} ${props.className}`}style={{color:"#3f51b5"}}>
      <AppBar
        style={{ top: 0, position: "sticky", backgroundColor: "#3f51b5" }}
      >
        <Toolbar style={{color:"white"}}>
        {props.children}
        </Toolbar>
      </AppBar>
    </Box>
  );
}