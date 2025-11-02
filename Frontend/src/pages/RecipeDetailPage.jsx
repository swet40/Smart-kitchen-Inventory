import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { recipesAPI } from '../services/api';
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip
} from '@mui/material';

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await recipesAPI.getById(id);
      setRecipe(res.data);
    } catch (err) {
      setError('Failed to load recipe details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!recipe) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>{recipe.name}</Typography>

          {recipe.imageUrl && (
            <Box mb={2}>
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  objectFit: 'cover'
                }}
              />
            </Box>
          )}

          <Typography color="textSecondary" gutterBottom>
            {recipe.cuisine} • {recipe.foodType || 'Veg'} • Serves: {recipe.serves}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {recipe.description}
          </Typography>

          {/* Tags */}
          <Box mb={2}>
            {recipe.tags?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                color={tag === 'Vegetarian' ? 'success' : 'error'}
                sx={{ mr: 1 }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Ingredients */}
          <Typography variant="h6" gutterBottom>Ingredients</Typography>
          <List dense>
            {recipe.ingredients?.map((ing, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${ing.ingredientName}`}
                  secondary={`${ing.quantity} ${ing.unit}`}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Steps */}
          <Typography variant="h6" gutterBottom>Cooking Steps</Typography>
          {recipe.steps?.length ? (
            <List>
              {recipe.steps.map((step, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText
                    primary={`Step ${index + 1}`}
                    secondary={step}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No step-by-step instructions available.</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default RecipeDetailPage;
