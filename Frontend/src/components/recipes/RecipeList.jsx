import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Button, Box,
    Alert, CircularProgress, Chip
} from '@mui/material';
import { recipesAPI } from '../../services/api';

function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

useEffect(() => {
    fetchRecipes();
}, []);

const fetchRecipes = async () => {
        try {
        const response = await recipesAPI.getAll();
        setRecipes(response.data);
        } catch (err) {
        setError('Failed to fetch recipes');
        } finally {
        setLoading(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Grid container spacing={3}>
        {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
            <Card>
                <CardContent>
                <Typography variant="h6" gutterBottom>
                    {recipe.name}
                </Typography>
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
                <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                    View Details
                </Button>
                </CardContent>
            </Card>
            </Grid>
        ))}
        </Grid>
    );
}

export default RecipeList;