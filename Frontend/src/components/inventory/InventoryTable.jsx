import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Box, Alert, CircularProgress, IconButton,
  TextField, InputAdornment, Typography
} from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import { inventoryAPI } from '../../services/api';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import useNotifications from '../../hooks/useNotifications';

function InventoryTable() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const fetchInventory = async () => {
    try {
      const response = await inventoryAPI.getAll();
      setInventory(response.data);
      setFilteredInventory(response.data);
    } catch (err) {
      setError('Failed to fetch inventory');
      showError('Failed to load inventory items');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await inventoryAPI.delete(id);
      setInventory(inventory.filter(item => item._id !== id));
      showSuccess(`"${name}" deleted successfully!`);
    } catch (err) {
      showError(`Failed to delete "${name}"`);
    }
  };

  const handleAddSuccess = () => {
    fetchInventory();
    showSuccess('Item added successfully!');
  };

  const handleEditSuccess = () => {
    fetchInventory();
    showSuccess('Item updated successfully!');
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );
  
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      {/* Search Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Button variant="contained" color="primary" onClick={() => setAddModalOpen(true)}>
          Add New Item
        </Button>
      </Box>

      {/* Results count */}
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary">
          Showing {filteredInventory.length} of {inventory.length} items
          {searchTerm && ` for "${searchTerm}"`}
        </Typography>
      </Box>

      <AddItemModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onItemAdded={handleAddSuccess}
      />

      <EditItemModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedItem}
        onItemUpdated={handleEditSuccess}
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
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {searchTerm ? 'No items found matching your search' : 'No inventory items found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
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
                      title="Edit item"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(item._id, item.name)}
                      title="Delete item"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default InventoryTable;