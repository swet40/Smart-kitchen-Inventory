import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Alert
} from '@mui/material';
import { inventoryAPI } from '../../services/api';

function AddItemModal({ open, onClose, onItemAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        currentQuantity: 0,
        unit: 'g',
        threshold: 0
    });
    const [error, setError] = useState('');

    const categories = ['Grains', 'Spices', 'Dairy', 'Vegetables', 'Fruits', 'Lentils', 'Oils', 'Other'];
    const units = ['g', 'kg', 'pieces', 'ml', 'l', 'tsp', 'tbsp', 'cup'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await inventoryAPI.create(formData);
        onItemAdded();
        onClose();
        setFormData({ name: '', category: '', currentQuantity: 0, unit: 'g', threshold: 0 });
        } catch (err) {
        setError('Failed to add item');
        }
    };

return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add New Inventory Item</DialogTitle>
        <form onSubmit={handleSubmit}>
            <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TextField
                autoFocus
                margin="dense"
                label="Item Name"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            
            <TextField
                select
                margin="dense"
                label="Category"
                fullWidth
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
                {categories.map((category) => (
                <MenuItem key={category} value={category}>
                    {category}
                </MenuItem>
                ))}
            </TextField>

            <TextField
                margin="dense"
                label="Quantity"
                type="number"
                fullWidth
                required
                value={formData.currentQuantity}
                onChange={(e) => setFormData({ ...formData, currentQuantity: parseFloat(e.target.value) })}
            />

            <TextField
                select
                margin="dense"
                label="Unit"
                fullWidth
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            >
                {units.map((unit) => (
                <MenuItem key={unit} value={unit}>
                    {unit}
                </MenuItem>
                ))}
            </TextField>

            <TextField
                margin="dense"
                label="Low Stock Threshold"
                type="number"
                fullWidth
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: parseFloat(e.target.value) })}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">Add Item</Button>
            </DialogActions>
        </form>
        </Dialog>
    );
    }

export default AddItemModal;