import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Typography, Box, Alert, CircularProgress,
    Card, CardContent, List, ListItem, ListItemText,
    Chip, Button, Dialog, DialogTitle, DialogContent,
    Grid
} from '@mui/material';
import { recipesAPI } from '../services/api';
import SubstitutionSuggestions from '../components/recipes/SubstitutionSuggestions';

function RecipeDetailPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [substitutes, setSubstitutes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [subDialogOpen, setSubDialogOpen] = useState(false);

    useEffect(() => {
        fetchRecipeDetails();
    }, [id]);

    const fetchRecipeDetails = async () => {
        try {
            const [recipeResponse, substitutesResponse] = await Promise.all([
                recipesAPI.getById(id),
                recipesAPI.getSubstitutes(id)
            ]);

            setRecipe(recipeResponse.data);
            setSubstitutes(substitutesResponse.data);
        } catch (err) {
            setError('Failed to fetch recipe details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!recipe) return <Alert severity="warning">Recipe not found</Alert>;

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {recipe.name}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Chip label={recipe.category} color="primary" />
                    <Chip label={`Serves: ${recipe.serves}`} />
                    <Chip label={`Prep: ${recipe.preparationTime} mins`} />
                    <Chip label={recipe.difficulty} />
                </Box>

                {substitutes && substitutes.missingIngredients.length > 0 && (
                    <Alert 
                        severity="warning" 
                        action={
                            <Button color="inherit" size="small" onClick={() => setSubDialogOpen(true)}>
                                View Substitutes
                            </Button>
                        }
                        sx={{ mb: 3 }}
                    >
                        Missing {substitutes.missingIngredients.length} ingredients
                    </Alert>
                )}

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Ingredients
                                </Typography>
                                <List>
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={`${ingredient.ingredientName} - ${ingredient.quantity} ${ingredient.unit}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Cooking Steps
                                </Typography>
                                <List>
                                    {recipe.steps.map((step, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={`Step ${index + 1}: ${step}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Dialog open={subDialogOpen} onClose={() => setSubDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Ingredient Substitutions</DialogTitle>
                <DialogContent>
                    <SubstitutionSuggestions substitutes={substitutes} />
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default RecipeDetailPage;
