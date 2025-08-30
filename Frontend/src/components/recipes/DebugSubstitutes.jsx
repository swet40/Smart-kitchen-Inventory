import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Typography, Alert, Paper, Accordion,
    AccordionSummary, AccordionDetails, List, ListItem, ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { recipesAPI, inventoryAPI } from '../../services/api';

function DebugSubstitutes() {
    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
        const [recipeResponse, inventoryResponse, substitutesResponse] = await Promise.all([
            recipesAPI.getById(id),
            inventoryAPI.getAll(),
            recipesAPI.getSubstitutes(id)
        ]);

        setData({
            recipe: recipeResponse.data,
            inventory: inventoryResponse.data,
            substitutes: substitutesResponse.data
        });

        } catch (error) {
        console.error('Debug error:', error);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>🔍 Debug: Substitution System</Typography>

        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Recipe Data</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography variant="h6">Name: {data.recipe?.name}</Typography>
            <Typography variant="h6">Ingredients:</Typography>
            <List>
                {data.recipe?.ingredients?.map((ing, index) => (
                <ListItem key={index}>
                    <ListItemText primary={`${ing.ingredientName} - ${ing.quantity} ${ing.unit}`} />
                </ListItem>
                ))}
            </List>
            <Typography variant="h6">Possible Substitutes:</Typography>
            <pre>{JSON.stringify(data.recipe?.possibleSubstitutes, null, 2)}</pre>
            </AccordionDetails>
        </Accordion>

        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Inventory Data ({data.inventory?.length} items)</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <List>
                {data.inventory?.map((item, index) => (
                <ListItem key={index}>
                    <ListItemText primary={`${item.name} - ${item.currentQuantity} ${item.unit}`} />
                </ListItem>
                ))}
            </List>
            </AccordionDetails>
        </Accordion>

        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Substitutes Response</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <pre>{JSON.stringify(data.substitutes, null, 2)}</pre>
            </AccordionDetails>
        </Accordion>
        </Box>
    );
}

export default DebugSubstitutes;