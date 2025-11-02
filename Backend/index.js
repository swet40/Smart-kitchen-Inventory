const InventoryItem = require('./model/InventoryItem.js');
const Recipe = require('./model/Recipe.js');
const recipeRoutes = require('./routes/recipeRoutes');
const spoonacularRoutes = require('./routes/spoonacularRoutes');

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 8000;
const uri = process.env.DB_URL;

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/iot', require('./routes/iotRoutes'));
app.use('/api/recipes', recipeRoutes);
app.use('/api/external', spoonacularRoutes);



    // Basic route for testing
    app.get("/", (req, res) => {
    res.json({ 
        message: "Smart Kitchen API is running!",
        endpoints: {
        inventory: "/api/inventory",
        docs: "Coming soon..."
        }
    });
    });

    // Connect to MongoDB and start server
    const startServer = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
        
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Inventory API: http://localhost:${PORT}/api/inventory`);
        });
        
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

startServer();