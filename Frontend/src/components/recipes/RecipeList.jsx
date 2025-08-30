import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Button, Box,
    Alert, CircularProgress, Chip, Tabs, Tab
} from '@mui/material';
import { recipesAPI, inventoryAPI } from '../../services/api';

function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [smartRecipes, setSmartRecipes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
        const [recipesResponse, inventoryResponse, smartResponse] = await Promise.all([
            recipesAPI.getAll(),
            inventoryAPI.getAll(),
            recipesAPI.getCanMake()
        ]);

        setRecipes(recipesResponse.data);
        setInventory(inventoryResponse.data);
        setSmartRecipes(smartResponse.data);
        } catch (err) {
        setError('Failed to fetch data');
        } finally {
        setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    const displayRecipes = tabValue === 0 ? recipes : 
                            tabValue === 1 ? smartRecipes?.canMakeNow || [] :
                            smartRecipes?.canMakeWithSubstitutes || [];

    return (
        <Box>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="All Recipes" />
            <Tab label="Can Make Now" />
            <Tab label="With Substitutes" />
        </Tabs>

        <Grid container spacing={3}>
            {displayRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                    {recipe.name}
                    </Typography>
                    
                    {recipe.servingInfo && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Can serve {recipe.servingInfo.maxServing} people
                    </Alert>
                    )}

                    <Typography color="textSecondary" gutterBottom>
                    {recipe.category} • Serves: {recipe.serves}
                    </Typography>
                    
                    <Box mb={2}>
                    {recipe.tags?.map((tag) => (
                        <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary">
                    Prep: {recipe.preparationTime} mins • {recipe.difficulty}
                    </Typography>
                    
                    <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ mt: 2 }}
                    onClick={() => window.location.href = `/recipes/${recipe._id}`}
                    >
                    View Details & Cooking Steps
                    </Button>
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>
        </Box>
    );
}

export default RecipeList;