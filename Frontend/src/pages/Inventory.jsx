import React from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import InventoryTable from '../components/inventory/InventoryTable';

function Inventory() {
    return (
        <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 3 }}>
            Inventory Management
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
            Manage your kitchen inventory. Add, edit, or remove items as needed.
        </Alert>

        <InventoryTable />
        </Container>
    );
}

export default Inventory;