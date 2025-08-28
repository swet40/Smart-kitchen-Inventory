const express = require('express');
const router = express.Router();
const Recipe = require('../model/Recipe');

// GET all recipes with optional filtering
router.get('/', async (req, res) => {
    try {
        const { category, cuisine, difficulty, search } = req.query;
        let filter = {};

        if (category) filter.category = category;
        if (cuisine) filter.cuisine = cuisine;
        if (difficulty) filter.difficulty = difficulty;
        if (search) {
        filter.$text = { $search: search };
        }

        const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // GET single recipe by ID
    router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // POST create new recipe
    router.post('/', async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    });

    // PUT update recipe
    router.put('/:id', async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
        );
        
        if (!updatedRecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
        }
        
        res.json(updatedRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    });

    // DELETE recipe
    router.delete('/:id', async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        
        if (!deletedRecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
        }
        
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // GET recipes by available ingredients (Smart Kitchen Feature)
    router.get('/suggestions/available', async (req, res) => {
    try {
        // This will be implemented after we create the algorithm
        res.json({ message: 'This endpoint will suggest recipes based on available ingredients' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // GET recipes that can be made with current inventory
    router.get('/suggestions/can-make', async (req, res) => {
    try {
        // This will be implemented after we create the algorithm
        res.json({ message: 'This endpoint will show recipes you can make now' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

module.exports = router;