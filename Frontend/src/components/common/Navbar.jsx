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

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Inventory', path: '/inventory' },
    { label: 'Recipes', path: '/recipes' },
    { label: 'Waste Alerts', path: '/waste-alerts' },
    { label: 'Meal Planner', path: '/meal-planner' },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#6a1b9a', // Purple background
        boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
      }}
    >
      <Toolbar>
        <KitchenIcon sx={{ mr: 1.5, color: 'white' }} />
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: 'white',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          Smart Kitchen
        </Typography>

        <Box>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                mx: 0.7,
                color: 'white',
                fontWeight: 500,
                borderRadius: 2,
                backgroundColor:
                  location.pathname === item.path ? '#8e24aa' : 'transparent',
                '&:hover': {
                  backgroundColor:
                    location.pathname === item.path
                      ? '#9c27b0'
                      : 'rgba(255,255,255,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
