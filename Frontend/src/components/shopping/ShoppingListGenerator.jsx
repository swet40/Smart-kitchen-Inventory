import React, { useState } from 'react';
import {
Box, Card, CardContent, Typography, Button,
List, ListItem, ListItemText, Chip, Alert
} from '@mui/material';
import { recipesAPI } from '../../services/api';
import useNotifications from '../../hooks/useNotifications';

function ShoppingListGenerator() {
const [selectedRecipes, setSelectedRecipes] = useState([]);
const [shoppingList, setShoppingList] = useState(null);
const [loading, setLoading] = useState(false);
const { showSuccess, showError } = useNotifications();

const generateShoppingList = async () => {
        if (selectedRecipes.length === 0) {
        showError('Please select at least one recipe');
        return;
        }

        setLoading(true);
        try {
        const response = await recipesAPI.generateShoppingList(selectedRecipes);
        setShoppingList(response.data);
        showSuccess('Shopping list generated successfully!');
        } catch (error) {
        showError('Failed to generate shopping list');
        } finally {
        setLoading(false);
        }
    };

    return (
        <Box>
        <Typography variant="h5" gutterBottom>
            🛒 Shopping List Generator
        </Typography>
        
        {/* Recipe selection interface */}
        <Button variant="contained" onClick={generateShoppingList} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Shopping List'}
        </Button>

        {shoppingList && (
            <Card sx={{ mt: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                Shopping List ({shoppingList.totalItemsNeeded} items needed)
                </Typography>
                <List>
                {shoppingList.neededItems.map((item, index) => (
                    <ListItem key={index}>
                    <ListItemText
                        primary={`${item.ingredientName} - ${item.needed} ${item.unit}`}
                    />
                    </ListItem>
                ))}
                </List>
            </CardContent>
            </Card>
        )}
        </Box>
    );
}

export default ShoppingListGenerator;