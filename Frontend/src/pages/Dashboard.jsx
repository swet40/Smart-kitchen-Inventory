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
} from '@mui/icons-material';
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
        <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
            Kitchen Dashboard
        </Typography>

        <Grid container spacing={3}>
            {/* Inventory Stats */}
            <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <InventoryIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h4" component="div">
                    {stats.inventoryCount}
                    </Typography>
                </Box>
                <Typography color="textSecondary">
                    Total Inventory Items
                </Typography>
                </CardContent>
            </Card>
            </Grid>

            {/* Recipes Stats */}
            <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <RecipeIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h4" component="div">
                    {stats.recipesCount}
                    </Typography>
                </Box>
                <Typography color="textSecondary">
                    Total Recipes
                </Typography>
                </CardContent>
            </Card>
            </Grid>

            {/* Low Stock Warning */}
            <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <WarningIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h4" component="div" color="warning.main">
                    {stats.lowStockItems}
                    </Typography>
                </Box>
                <Typography color="textSecondary">
                    Low Stock Items
                </Typography>
                </CardContent>
            </Card>
            </Grid>

            {/* Can Make Recipes */}
            <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <ShoppingIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h4" component="div" color="success.main">
                    {stats.canMakeRecipes}
                    </Typography>
                </Box>
                <Typography color="textSecondary">
                    Recipes You Can Make
                </Typography>
                </CardContent>
            </Card>
            </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
            <Alert severity="info">
            <strong>Tip:</strong> Check your inventory regularly to avoid waste and plan meals efficiently.
            </Alert>
        </Box>
        </Container>
    );
}

export default Dashboard;