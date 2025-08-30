import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardContent,
    Button, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, CircularProgress, Alert,
    List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
    Restaurant as RecipeIcon,
    Add as AddIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { recipesAPI } from '../../services/api';
import useNotifications from '../../hooks/useNotifications';

function MealPlanner() {
    const [mealPlan, setMealPlan] = useState(() => {
        // Load from localStorage if available
        const saved = localStorage.getItem('mealPlan');
        return saved ? JSON.parse(saved) : {};
    });
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const { showSuccess, showError } = useNotifications();

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        // Save to localStorage whenever mealPlan changes
        localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    }, [mealPlan]);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
        const response = await recipesAPI.getAll();
        setRecipes(response.data);
        } catch (error) {
        showError('Failed to load recipes');
        } finally {
        setLoading(false);
        }
    };

    const addToMealPlan = (recipe, day) => {
        setMealPlan(prev => ({
        ...prev,
        [day]: [...(prev[day] || []), recipe]
        }));
        setDialogOpen(false);
        showSuccess(`Added ${recipe.name} to ${day}`);
    };

    const removeFromMealPlan = (day, index) => {
        setMealPlan(prev => ({
        ...prev,
        [day]: prev[day].filter((_, i) => i !== index)
        }));
        showSuccess('Removed from meal plan');
    };

    const clearDay = (day) => {
        setMealPlan(prev => ({
        ...prev,
        [day]: []
        }));
        showSuccess(`Cleared ${day}'s meals`);
    };

    if (loading) {
        return (
        <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
        </Box>
        );
    }

    return (
        <Box>
        <Typography variant="h5" gutterBottom>
            📅 Weekly Meal Planner
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
            Plan your meals for the week. Your selections are automatically saved!
        </Alert>

        <Grid container spacing={3}>
            {daysOfWeek.map(day => (
            <Grid item xs={12} md={6} lg={4} key={day}>
                <Card variant="outlined">
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" color="primary">
                        {day}
                    </Typography>
                    {mealPlan[day]?.length > 0 && (
                        <Button 
                        size="small" 
                        color="error"
                        onClick={() => clearDay(day)}
                        startIcon={<ClearIcon />}
                        >
                        Clear
                        </Button>
                    )}
                    </Box>

                    {!mealPlan[day] || mealPlan[day].length === 0 ? (
                    <Box textAlign="center" py={2}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                        No meals planned
                        </Typography>
                        <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedDay(day);
                            setDialogOpen(true);
                        }}
                        >
                        Add Meal
                        </Button>
                    </Box>
                    ) : (
                    <Box>
                        <List dense>
                        {mealPlan[day].map((recipe, index) => (
                            <ListItem 
                            key={index}
                            secondaryAction={
                                <Button
                                size="small"
                                color="error"
                                onClick={() => removeFromMealPlan(day, index)}
                                >
                                Remove
                                </Button>
                            }
                            >
                            <ListItemIcon>
                                <RecipeIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary={recipe.name}
                                secondary={`Serves: ${recipe.serves} • ${recipe.preparationTime} mins`}
                            />
                            </ListItem>
                        ))}
                        </List>
                        <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedDay(day);
                            setDialogOpen(true);
                        }}
                        sx={{ mt: 1 }}
                        >
                        Add Another Meal
                        </Button>
                    </Box>
                    )}
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Add Recipe to {selectedDay}</DialogTitle>
            <DialogContent>
            <Box py={2}>
                <TextField
                placeholder="Search recipes..."
                fullWidth
                sx={{ mb: 2 }}
                />
                <List>
                {recipes.slice(0, 10).map(recipe => (
                    <ListItem
                    key={recipe._id}
                    button
                    onClick={() => addToMealPlan(recipe, selectedDay)}
                    >
                    <ListItemIcon>
                        <RecipeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                        primary={recipe.name}
                        secondary={`${recipe.category} • ${recipe.preparationTime} mins`}
                    />
                    </ListItem>
                ))}
                </List>
            </Box>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
        </Box>
    );
}

export default MealPlanner;