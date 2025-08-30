import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Box, Alert, CircularProgress, IconButton
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { inventoryAPI } from '../../services/api';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';

function InventoryTable() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
        const response = await inventoryAPI.getAll();
        setInventory(response.data);
        } catch (err) {
        setError('Failed to fetch inventory');
        } finally {
        setLoading(false);
        }
    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
        await inventoryAPI.delete(id);
        setInventory(inventory.filter(item => item._id !== id));
        } catch (err) {
        setError('Failed to delete item');
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <div>
        <Box mb={2}>
            <Button variant="contained" color="primary" onClick={() => setAddModalOpen(true)}>
            Add New Item
            </Button>
        </Box>

        <AddItemModal
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onItemAdded={fetchInventory}
        />

        <EditItemModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            item={selectedItem}
            onItemUpdated={fetchInventory}
        />

        <TableContainer component={Paper}>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Threshold</TableCell>
                <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {inventory.map((item) => (
                <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.currentQuantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.threshold}</TableCell>
                    <TableCell>
                    <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditClick(item)}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(item._id)}
                    >
                        <Delete />
                    </IconButton>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </div>
    );
    }

export default InventoryTable;