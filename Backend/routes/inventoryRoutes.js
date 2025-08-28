const express = require('express');
const router = express.Router();
const InventoryItem = require('../model/InventoryItem.js');

// GET all inventory items
router.get('/', async (req, res) => {
    try {
        const items = await InventoryItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // GET single inventory item
    router.get('/:id', async (req, res) => {
    try {
        const item = await InventoryItem.findById(req.params.id);
        if (!item) {
        return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // POST create new inventory item
    router.post('/', async (req, res) => {
    try {
        const newItem = new InventoryItem({
        name: req.body.name,
        category: req.body.category,
        currentQuantity: req.body.currentQuantity,
        unit: req.body.unit,
        threshold: req.body.threshold || 0
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    });

    // PUT update inventory item
    router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await InventoryItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
        );
        
        if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
        }
        
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    });

    // DELETE inventory item
    router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);
        
        if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
        }
        
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;