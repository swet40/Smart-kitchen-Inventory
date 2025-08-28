import React from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import RecipeList from '../components/recipes/RecipeList';

function Recipes() {
    return (
        <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 3 }}>
            Recipe Browser
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
            Browse recipes and see what you can make with your current inventory.
        </Alert>

        <RecipeList />
        </Container>
    );
}

export default Recipes;