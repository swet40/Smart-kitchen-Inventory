import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Alert
} from '@mui/material';
import { inventoryAPI } from '../../services/api';

function EditItemModal({ open, onClose, item, onItemUpdated }) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        currentQuantity: 0,
        unit: 'g',
        threshold: 0
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = ['Grains', 'Spices', 'Dairy', 'Vegetables', 'Fruits', 'Lentils', 'Oils', 'Other'];
    const units = ['g', 'kg', 'pieces', 'ml', 'l', 'tsp', 'tbsp', 'cup'];

    // Populate form when item changes or modal opens
    useEffect(() => {
        if (item && open) {
        setFormData({
            name: item.name || '',
            category: item.category || '',
            currentQuantity: item.currentQuantity || 0,
            unit: item.unit || 'g',
            threshold: item.threshold || 0
        });
        setError(''); // Clear any previous errors
        }
    }, [item, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
        await inventoryAPI.update(item._id, formData);
        onItemUpdated(); // Refresh the inventory list
        onClose(); // Close the modal
        } catch (err) {
        setError('Failed to update item: ' + (err.response?.data?.message || err.message));
        console.error('Update error:', err);
        } finally {
        setLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Inventory Item</DialogTitle>
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
                sx={{ mb: 2 }}
            />
            
            <TextField
                select
                margin="dense"
                label="Category"
                fullWidth
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{ mb: 2 }}
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
                onChange={(e) => setFormData({ ...formData, currentQuantity: parseFloat(e.target.value) || 0 })}
                sx={{ mb: 2 }}
            />

            <TextField
                select
                margin="dense"
                label="Unit"
                fullWidth
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                sx={{ mb: 2 }}
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
                onChange={(e) => setFormData({ ...formData, threshold: parseFloat(e.target.value) || 0 })}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
                Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Updating...' : 'Update Item'}
            </Button>
            </DialogActions>
        </form>
        </Dialog>
    );
    }

export default EditItemModal;