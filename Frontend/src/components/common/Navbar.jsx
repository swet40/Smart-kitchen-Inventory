import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import KitchenIcon from '@mui/icons-material/Kitchen';

function Navbar() {
    const location = useLocation();

    return (
        <AppBar position="fixed">
        <Toolbar>
            <KitchenIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Kitchen
            </Typography>
            <Box>
            <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{ 
                mx: 1,
                backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
            >
                Dashboard
            </Button>
            <Button
                color="inherit"
                component={Link}
                to="/inventory"
                sx={{ 
                mx: 1,
                backgroundColor: location.pathname === '/inventory' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
            >
                Inventory
            </Button>
            <Button
                color="inherit"
                component={Link}
                to="/recipes"
                sx={{ 
                mx: 1,
                backgroundColor: location.pathname === '/recipes' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
            >
                Recipes
            </Button>
            {/* ADD THESE NEW BUTTONS */}
            <Button
                color="inherit"
                component={Link}
                to="/waste-alerts"
                sx={{ 
                mx: 1,
                backgroundColor: location.pathname === '/waste-alerts' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
            >
                Waste Alerts
            </Button>
            <Button
                color="inherit"
                component={Link}
                to="/meal-planner"
                sx={{ 
                mx: 1,
                backgroundColor: location.pathname === '/meal-planner' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
            >
                Meal Planner
            </Button>
            </Box>
        </Toolbar>
        </AppBar>
    );
}

export default Navbar;