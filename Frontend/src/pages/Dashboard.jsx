import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Restaurant as RecipeIcon,
    Inventory as InventoryIcon,
    ShoppingCart as ShoppingIcon,
    Warning as WarningIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { inventoryAPI, recipesAPI } from '../services/api';

function Dashboard() {
    const [stats, setStats] = useState({
        inventoryCount: 0,
        recipesCount: 0,
        lowStockItems: 0,
        canMakeRecipes: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [inventoryResponse, recipesResponse, canMakeResponse] = await Promise.all([
                inventoryAPI.getAll(),
                recipesAPI.getAll(),
                recipesAPI.getCanMake()
            ]);

            const inventory = inventoryResponse.data;
            const lowStockItems = inventory.filter(item => item.currentQuantity < item.threshold).length;

            setStats({
                inventoryCount: inventory.length,
                recipesCount: recipesResponse.data.length,
                lowStockItems,
                canMakeRecipes: canMakeResponse.data.canMakeNow.length
            });

        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
    <Container
        maxWidth="xl"
        sx={{
        py: 5,
        px: { xs: 2, md: 6 },
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8f5ff 0%, #ffffff 100%)',
        }}
    >
        {/* HEADER */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography
            variant="h4"
            sx={{
            fontWeight: 800,
            color: '#6a1b9a',
            mb: 1,
            fontSize: { xs: '1.9rem', md: '2.4rem' },
            }}
        >
            Smart Kitchen Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
            Manage, monitor, and optimize your kitchen — all in one place.
        </Typography>
        </Box>

        {/* QUICK ACCESS */}
        <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ mb: 5, textAlign: 'center' }}
        >
        {[
            {
            title: 'Waste Alerts',
            desc: 'Prevent food waste',
            icon: <WarningIcon sx={{ fontSize: 50 }} />,
            color: '#8e24aa',
            link: '/waste-alerts',
            },
            {
            title: 'Meal Planner',
            desc: 'Plan your week',
            icon: <CalendarIcon sx={{ fontSize: 50 }} />,
            color: '#6a1b9a',
            link: '/meal-planner',
            },
        ].map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Box
                component={Link}
                to={card.link}
                sx={{
                textDecoration: 'none',
                display: 'block',
                p: 3,
                borderRadius: 4,
                transition: '0.3s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                background: '#fff',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 25px rgba(106,27,154,0.2)',
                    background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%)',
                },
                }}
            >
                <Box sx={{ color: card.color }}>{card.icon}</Box>
                <Typography
                variant="h6"
                sx={{ mt: 1, fontWeight: 600, color: '#4a148c' }}
                >
                {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {card.desc}
                </Typography>
            </Box>
            </Grid>
        ))}
        </Grid>

        {/* METRIC CARDS (CENTERED & RESPONSIVE) */}
        <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ textAlign: 'center', mb: 4 }}
        >
        {[
            {
            title: 'Total Inventory Items',
            value: stats.inventoryCount,
            icon: <InventoryIcon sx={{ color: '#7b1fa2', fontSize: 40 }} />,
            },
            {
            title: 'Total Recipes',
            value: stats.recipesCount,
            icon: <RecipeIcon sx={{ color: '#9c27b0', fontSize: 40 }} />,
            },
            {
            title: 'Low Stock Items',
            value: stats.lowStockItems,
            icon: <WarningIcon sx={{ color: '#f06292', fontSize: 40 }} />,
            },
            {
            title: 'Recipes You Can Make',
            value: stats.canMakeRecipes,
            icon: <ShoppingIcon sx={{ color: '#6a1b9a', fontSize: 40 }} />,
            },
        ].map((stat) => (
            <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={stat.title}
            sx={{ display: 'flex', justifyContent: 'center' }}
            >
            <Card
                sx={{
                width: { xs: '90%', sm: '80%', md: '90%' },
                p: 3,
                borderRadius: 4,
                textAlign: 'center',
                boxShadow: '0 6px 15px rgba(106,27,154,0.1)',
                transition: '0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(106,27,154,0.2)',
                },
                }}
            >
                <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 1,
                }}
                >
                {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#4a148c' }}>
                {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {stat.title}
                </Typography>
            </Card>
            </Grid>
        ))}
        </Grid>

        {/* INFO TIP */}
        {/* FOOTER TIP */}
    {/* FOOTER TIP */}
<Box
  sx={{
    mt: 6,
    display: 'flex',
    justifyContent: 'center',
  }}
>
  <Box
    sx={{
      py: 1.8,
      px: 3,
      borderRadius: 4,
      background: 'linear-gradient(90deg, #f8f5ff, #f3e5f5)',
      boxShadow: '0 2px 6px rgba(106,27,154,0.15)',
      display: 'inline-block',
      textAlign: 'center',
    }}
  >
    <Typography
      variant="body1"
      sx={{ color: '#6a1b9a', fontWeight: 500, fontSize: '0.95rem' }}
    >
      💡 Smart tip: Keep your pantry updated for a waste-free kitchen.
    </Typography>
  </Box>
</Box>


    </Container>
);

}

export default Dashboard;
