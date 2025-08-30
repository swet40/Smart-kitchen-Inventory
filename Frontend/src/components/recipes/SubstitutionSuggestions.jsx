import React from 'react';
import {
    Box, Typography, Alert, List, ListItem,
    ListItemText, Chip, Paper
} from '@mui/material';

function SubstitutionSuggestions({ substitutes }) {
    if (!substitutes || substitutes.missingIngredients.length === 0) {
        return (
        <Alert severity="success">
            You have all the ingredients needed for this recipe!
        </Alert>
        );
    }

    return (
        <Box>
        <Typography variant="h6" gutterBottom>
            Missing Ingredients and Substitutions
        </Typography>

        {substitutes.missingIngredients.map((missing, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                Missing: {missing.ingredientName} ({missing.quantity} {missing.unit})
            </Typography>

            {substitutes.substitutionSuggestions
                .filter(sub => sub.missingIngredient === missing.ingredientName)
                .map((suggestion, subIndex) => (
                <Box key={subIndex} sx={{ ml: 2, mt: 1 }}>
                    <Typography variant="body2" gutterBottom>
                    Suggested substitutes:
                    </Typography>
                    <List dense>
                    {suggestion.availableSubstitutes.map((substitute, availIndex) => (
                        <ListItem key={availIndex}>
                        <ListItemText
                            primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                label={substitute.name} 
                                color={substitute.isAvailable ? "success" : "default"}
                                size="small"
                                />
                                <Typography variant="body2">
                                Use {substitute.ratio * missing.quantity} {missing.unit}
                                {substitute.notes && ` - ${substitute.notes}`}
                                </Typography>
                            </Box>
                            }
                        />
                        </ListItem>
                    ))}
                    </List>
                </Box>
                ))}
            </Paper>
        ))}
        </Box>
    );
}

export default SubstitutionSuggestions;