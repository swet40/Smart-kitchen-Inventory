import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Alert,
    CircularProgress,
    Chip,
    Tabs,
    Tab,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    } from '@mui/material';
    import { recipesAPI } from '../../services/api';

    function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [selectedCuisine, setSelectedCuisine] = useState('Indian');
    const [selectedDiet, setSelectedDiet] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [open, setOpen] = useState(false);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpen = (recipe) => {
        setSelectedRecipe(recipe);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedRecipe(null);
        setOpen(false);
    };

    // Fetch recipes from Spoonacular API
    const fetchExternalRecipes = async () => {
        try {
        setLoading(true);
        const response = await recipesAPI.getExternalRecipes(selectedCuisine, selectedDiet);
        setRecipes(response.data);
        setError('');
        } catch (err) {
        console.error(err);
        setError('Failed to fetch recipes from Spoonacular API');
        } finally {
        setLoading(false);
        }
    };

    return (
        <Box>
        {/* Tabs */}
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="External Recipes" />
        </Tabs>

        {/* Filter Section */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
            <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Cuisine</InputLabel>
            <Select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                label="Cuisine"
            >
                {['Indian', 'Mexican', 'Thai', 'Chinese', 'Japanese', 'Italian'].map((c) => (
                <MenuItem key={c} value={c}>
                    {c}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Type</InputLabel>
            <Select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
                label="Type"
            >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                <MenuItem value="non-vegetarian">Non-Vegetarian</MenuItem>
            </Select>
            </FormControl>

            <Button
            variant="contained"
            sx={{
                backgroundColor: '#6a1b9a',
                '&:hover': { backgroundColor: '#8e24aa' },
                height: '56px',
            }}
            onClick={fetchExternalRecipes}
            >
            Fetch Recipes
            </Button>
        </Box>

        {/* Loading & Error */}
        {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
            </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Recipe Cards */}
        <Grid container spacing={3}>
            {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.name}>
                <Card
                onClick={() => handleOpen(recipe)}
                sx={{
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                    },
                }}
                >
                <CardContent sx={{ flexGrow: 1 }}>
                    {recipe.imageUrl && (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        }}
                    />
                    )}
                    <Typography variant="h6" gutterBottom>
                    {recipe.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                    {recipe.cuisine} • {recipe.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'} • Serves:{' '}
                    {recipe.serves || '-'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    Prep: {recipe.preparationTime} mins • {recipe.difficulty}
                    </Typography>
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>

        {/* Dialog — Recipe Details */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            {selectedRecipe && (
            <>
                <DialogTitle sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                {selectedRecipe.name}
                </DialogTitle>
                <DialogContent>
                {selectedRecipe.imageUrl && (
                    <Box display="flex" justifyContent="center" mb={2}>
                        <img
                        src={selectedRecipe.imageUrl}
                        alt={selectedRecipe.name}
                        style={{
                            width: '60%',
                            maxWidth: '350px',
                            borderRadius: '10px',
                            boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
                        }}
                        />
                    </Box>
                    )}


                <Typography variant="subtitle1" gutterBottom>
                    {selectedRecipe.cuisine} • {selectedRecipe.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedRecipe.description || 'No description available.'}
                </Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Ingredients
                </Typography>
                {selectedRecipe.ingredients?.length ? (
                    <ul>
                    {selectedRecipe.ingredients.map((i, index) => (
                        <li key={index}>
                        {i.ingredientName} — {i.quantity} {i.unit}
                        </li>
                    ))}
                    </ul>
                ) : (
                    <Typography color="text.secondary">No ingredients info.</Typography>
                )}

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Steps
                </Typography>
                {selectedRecipe.steps?.length ? (
                    <ol>
                    {selectedRecipe.steps.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                    </ol>
                ) : (
                    <Typography color="text.secondary">No steps available.</Typography>
                )}
                </DialogContent>
                <DialogActions>
                <Button
                    onClick={handleClose}
                    sx={{
                    backgroundColor: '#6a1b9a',
                    color: 'white',
                    '&:hover': { backgroundColor: '#8e24aa' },
                    }}
                >
                    Close
                </Button>
                </DialogActions>
            </>
            )}
        </Dialog>
        </Box>
    );
}

export default RecipeList;
