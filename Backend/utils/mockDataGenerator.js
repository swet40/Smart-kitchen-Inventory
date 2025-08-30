const mongoose = require('mongoose');
const InventoryItem = require('../model/InventoryItem.js');
const Recipe = require('../model/Recipe.js');

// Sample Indian grocery items
const sampleInventory = [
    // Grains
    { name: 'Basmati Rice', category: 'Grains', currentQuantity: 2000, unit: 'g', threshold: 500 },
    { name: 'Wheat Flour (Atta)', category: 'Grains', currentQuantity: 5000, unit: 'g', threshold: 1000 },
    { name: 'Rice Flour', category: 'Grains', currentQuantity: 1000, unit: 'g', threshold: 300 },
    { name: 'Urad Dal', category: 'Lentils', currentQuantity: 800, unit: 'g', threshold: 200 },
    { name: 'Chana Dal', category: 'Lentils', currentQuantity: 1000, unit: 'g', threshold: 300 },
    { name: 'Toor Dal', category: 'Lentils', currentQuantity: 800, unit: 'g', threshold: 200 },
    { name: 'Moong Dal', category: 'Lentils', currentQuantity: 600, unit: 'g', threshold: 200 },
    { name: 'Masoor Dal', category: 'Lentils', currentQuantity: 400, unit: 'g', threshold: 150 },

    // Spices
    { name: 'Turmeric Powder', category: 'Spices', currentQuantity: 100, unit: 'g', threshold: 20 },
    { name: 'Cumin Seeds', category: 'Spices', currentQuantity: 50, unit: 'g', threshold: 10 },
    { name: 'Coriander Powder', category: 'Spices', currentQuantity: 80, unit: 'g', threshold: 15 },
    { name: 'Red Chili Powder', category: 'Spices', currentQuantity: 60, unit: 'g', threshold: 12 },
    { name: 'Garam Masala', category: 'Spices', currentQuantity: 40, unit: 'g', threshold: 8 },
    { name: 'Mustard Seeds', category: 'Spices', currentQuantity: 30, unit: 'g', threshold: 5 },
    { name: 'Fenugreek Seeds', category: 'Spices', currentQuantity: 20, unit: 'g', threshold: 5 },
    { name: 'Asafoetida (Hing)', category: 'Spices', currentQuantity: 10, unit: 'g', threshold: 2 },

    // Vegetables & Fruits
    { name: 'Onion', category: 'Vegetables', currentQuantity: 10, unit: 'pieces', threshold: 3 },
    { name: 'Tomato', category: 'Vegetables', currentQuantity: 8, unit: 'pieces', threshold: 2 },
    { name: 'Potato', category: 'Vegetables', currentQuantity: 6, unit: 'pieces', threshold: 2 },
    { name: 'Cauliflower', category: 'Vegetables', currentQuantity: 2, unit: 'pieces', threshold: 1 },
    { name: 'Capsicum', category: 'Vegetables', currentQuantity: 4, unit: 'pieces', threshold: 1 },
    { name: 'Mushrooms', category: 'Vegetables', currentQuantity: 300, unit: 'g', threshold: 100 },
    { name: 'Ginger', category: 'Vegetables', currentQuantity: 200, unit: 'g', threshold: 50 },
    { name: 'Garlic', category: 'Vegetables', currentQuantity: 150, unit: 'g', threshold: 40 },
    { name: 'Green Chili', category: 'Vegetables', currentQuantity: 15, unit: 'pieces', threshold: 5 },
    { name: 'Coriander Leaves', category: 'Vegetables', currentQuantity: 2, unit: 'bunch', threshold: 1 },
    { name: 'Curry Leaves', category: 'Vegetables', currentQuantity: 1, unit: 'bunch', threshold: 0.5 },

    // Dairy & Others
    { name: 'Paneer', category: 'Dairy', currentQuantity: 400, unit: 'g', threshold: 100 },
    { name: 'Ghee', category: 'Dairy', currentQuantity: 200, unit: 'g', threshold: 50 },
    { name: 'Yogurt (Curd)', category: 'Dairy', currentQuantity: 500, unit: 'g', threshold: 100 },
    { name: 'Milk', category: 'Dairy', currentQuantity: 1000, unit: 'ml', threshold: 200 },
    { name: 'Fresh Cream', category: 'Dairy', currentQuantity: 200, unit: 'ml', threshold: 50 },
    { name: 'Vegetable Oil', category: 'Oils', currentQuantity: 500, unit: 'ml', threshold: 100 },
    { name: 'Salt', category: 'Other', currentQuantity: 200, unit: 'g', threshold: 30 },
    { name: 'Sugar', category: 'Other', currentQuantity: 300, unit: 'g', threshold: 50 },
    { name: 'Cashew Nuts', category: 'Other', currentQuantity: 100, unit: 'g', threshold: 20 },
    { name: 'Baking Soda', category: 'Other', currentQuantity: 50, unit: 'g', threshold: 10 },
    { name: 'Yeast', category: 'Other', currentQuantity: 20, unit: 'g', threshold: 5 }
    ];

    // Sample Indian recipes
    const sampleRecipes = [
    // South Indian Dishes
    {
        name: "Masala Dosa",
        description: "Crispy fermented crepe filled with spiced potato filling",
        category: "Breakfast",
        cuisine: "South Indian",
        serves: 4,
        preparationTime: 120,
        difficulty: "Medium",
        ingredients: [
        { ingredientName: "Rice Flour", quantity: 200, unit: "g" },
        { ingredientName: "Urad Dal", quantity: 50, unit: "g" },
        { ingredientName: "Fenugreek Seeds", quantity: 0.5, unit: "tsp" },
        { ingredientName: "Potato", quantity: 4, unit: "pieces" },
        { ingredientName: "Onion", quantity: 2, unit: "pieces" },
        { ingredientName: "Mustard Seeds", quantity: 1, unit: "tsp" },
        { ingredientName: "Turmeric Powder", quantity: 0.5, unit: "tsp" },
        { ingredientName: "Green Chili", quantity: 2, unit: "pieces" },
        { ingredientName: "Ginger", quantity: 10, unit: "g" },
        { ingredientName: "Curry Leaves", quantity: 10, unit: "pieces" },
        { ingredientName: "Salt", quantity: 1, unit: "tsp" },
        { ingredientName: "Vegetable Oil", quantity: 3, unit: "tbsp" }
        ],
        steps: [
        "Soak rice and urad dal separately for 6 hours",
        "Grind to make smooth batter, add salt and ferment overnight",
        "Boil and mash potatoes for filling",
        "Heat oil, add mustard seeds, curry leaves, and green chilies",
        "Add onions and sauté until golden, add turmeric",
        "Add mashed potatoes and mix well, keep filling aside",
        "Heat dosa tawa, pour batter and spread thinly",
        "Cook until crispy, add potato filling and fold",
        "Serve hot with sambar and chutney"
        ],
        possibleSubstitutes: [
        {
            original: "Urad Dal",
            substitutes: [
            { name: "Chana Dal", ratio: 1.0, notes: "Slightly different texture" }
            ]
        }
        ],
        tags: ["breakfast", "fermented", "crispy", "south indian"]
    },

    // North Indian Dishes
    {
        name: "Chole Bhature",
        description: "Spicy chickpeas with fluffy deep-fried bread",
        category: "Main Course",
        cuisine: "North Indian",
        serves: 4,
        preparationTime: 90,
        difficulty: "Medium",
        ingredients: [
        { ingredientName: "Chickpeas (Kabuli Chana)", quantity: 300, unit: "g" },
        { ingredientName: "Wheat Flour (Atta)", quantity: 400, unit: "g" },
        { ingredientName: "Yogurt (Curd)", quantity: 100, unit: "g" },
        { ingredientName: "Baking Soda", quantity: 0.5, unit: "tsp" },
        { ingredientName: "Onion", quantity: 2, unit: "pieces" },
        { ingredientName: "Tomato", quantity: 3, unit: "pieces" },
        { ingredientName: "Ginger", quantity: 10, unit: "g" },
        { ingredientName: "Garlic", quantity: 8, unit: "pieces" },
        { ingredientName: "Chole Masala", quantity: 2, unit: "tsp" },
        { ingredientName: "Tea Bag", quantity: 1, unit: "pieces" },
        { ingredientName: "Salt", quantity: 1, unit: "tsp" },
        { ingredientName: "Vegetable Oil", quantity: 200, unit: "ml" }
        ],
        steps: [
        "Soak chickpeas overnight with tea bag",
        "Pressure cook chickpeas until soft",
        "Make dough with flour, yogurt, baking soda and salt",
        "Prepare spicy gravy with onions, tomatoes and spices",
        "Add cooked chickpeas to gravy and simmer",
        "Roll bhature and deep fry until puffed and golden",
        "Serve hot chole with bhature and onions"
        ],
        tags: ["street food", "punjabi", "spicy", "festive"]
    },

    {
        name: "Kadai Paneer",
        description: "Paneer cubes in spicy gravy with capsicum",
        category: "Main Course",
        cuisine: "North Indian",
        serves: 4,
        preparationTime: 45,
        difficulty: "Medium",
        ingredients: [
        { ingredientName: "Paneer", quantity: 400, unit: "g" },
        { ingredientName: "Capsicum", quantity: 2, unit: "pieces" },
        { ingredientName: "Onion", quantity: 2, unit: "pieces" },
        { ingredientName: "Tomato", quantity: 4, unit: "pieces" },
        { ingredientName: "Ginger", quantity: 10, unit: "g" },
        { ingredientName: "Garlic", quantity: 6, unit: "pieces" },
        { ingredientName: "Kashmiri Red Chili", quantity: 2, unit: "pieces" },
        { ingredientName: "Coriander Seeds", quantity: 1, unit: "tsp" },
        { ingredientName: "Fresh Cream", quantity: 2, unit: "tbsp" },
        { ingredientName: "Kasuri Methi", quantity: 1, unit: "tsp" },
        { ingredientName: "Salt", quantity: 1, unit: "tsp" },
        { ingredientName: "Butter", quantity: 2, unit: "tbsp" }
        ],
        steps: [
        "Dry roast coriander seeds and Kashmiri chilies",
        "Grind to make kadai masala powder",
        "Sauté onions, ginger-garlic paste until golden",
        "Add tomatoes and cook until soft",
        "Add kadai masala and cook until oil separates",
        "Add paneer cubes and capsicum pieces",
        "Simmer for 5 minutes, add cream and kasuri methi",
        "Garnish with coriander leaves and serve hot"
        ],
        tags: ["restaurant style", "spicy", "creamy", "punjabi"]
    },

    {
        name: "Naan",
        description: "Soft leavened flatbread cooked in tandoor",
        category: "Bread",
        cuisine: "North Indian",
        serves: 4,
        preparationTime: 60,
        difficulty: "Medium",
        ingredients: [
        { ingredientName: "Wheat Flour (Atta)", quantity: 300, unit: "g" },
        { ingredientName: "All-purpose Flour", quantity: 100, unit: "g" },
        { ingredientName: "Yogurt (Curd)", quantity: 100, unit: "g" },
        { ingredientName: "Milk", quantity: 100, unit: "ml" },
        { ingredientName: "Yeast", quantity: 1, unit: "tsp" },
        { ingredientName: "Sugar", quantity: 1, unit: "tsp" },
        { ingredientName: "Baking Powder", quantity: 0.5, unit: "tsp" },
        { ingredientName: "Salt", quantity: 1, unit: "tsp" },
        { ingredientName: "Butter", quantity: 2, unit: "tbsp" }
        ],
        steps: [
        "Activate yeast in warm milk with sugar",
        "Mix flours, baking powder and salt",
        "Add yogurt and yeast mixture to make soft dough",
        "Let dough rise for 2 hours in warm place",
        "Divide dough into equal portions and roll into naan shape",
        "Cook on hot tawa or in oven until puffed and golden",
        "Brush with butter and serve hot"
        ],
        tags: ["leavened", "soft", "tandoori", "restaurant style"]
    },

    {
        name: "Mushroom Do Pyaza",
        description: "Mushrooms cooked with double onions in rich gravy",
        category: "Main Course",
        cuisine: "North Indian",
        serves: 4,
        preparationTime: 40,
        difficulty: "Easy",
        ingredients: [
        { ingredientName: "Mushrooms", quantity: 400, unit: "g" },
        { ingredientName: "Onion", quantity: 4, unit: "pieces" },
        { ingredientName: "Tomato", quantity: 2, unit: "pieces" },
        { ingredientName: "Ginger", quantity: 10, unit: "g" },
        { ingredientName: "Garlic", quantity: 6, unit: "pieces" },
        { ingredientName: "Cumin Seeds", quantity: 1, unit: "tsp" },
        { ingredientName: "Coriander Powder", quantity: 1, unit: "tsp" },
        { ingredientName: "Garam Masala", quantity: 1, unit: "tsp" },
        { ingredientName: "Red Chili Powder", quantity: 1, unit: "tsp" },
        { ingredientName: "Fresh Cream", quantity: 2, unit: "tbsp" },
        { ingredientName: "Salt", quantity: 1, unit: "tsp" },
        { ingredientName: "Vegetable Oil", quantity: 2, unit: "tbsp" }
        ],
        steps: [
        "Clean and slice mushrooms",
        "Chop 2 onions finely and slice 2 onions for garnish",
        "Heat oil, add cumin seeds, then add finely chopped onions",
        "Sauté until golden, add ginger-garlic paste",
        "Add tomatoes and spices, cook until oil separates",
        "Add mushrooms and cook for 10 minutes",
        "Add sliced onions and fresh cream, simmer for 5 minutes",
        "Garnish with coriander leaves and serve hot"
        ],
        tags: ["mushroom", "oniony", "creamy", "quick"]
    },

    {
        name: "Masala Chai",
        description: "Traditional Indian spiced tea",
        category: "Beverage",
        cuisine: "Indian",
        serves: 2,
        preparationTime: 15,
        difficulty: "Easy",
        ingredients: [
        { ingredientName: "Water", quantity: 2, unit: "cup" },
        { ingredientName: "Milk", quantity: 1, unit: "cup" },
        { ingredientName: "Tea Leaves", quantity: 2, unit: "tsp" },
        { ingredientName: "Sugar", quantity: 2, unit: "tsp" },
        { ingredientName: "Ginger", quantity: 5, unit: "g" },
        { ingredientName: "Cardamom", quantity: 2, unit: "pieces" },
        { ingredientName: "Cinnamon", quantity: 1, unit: "pieces" }
        ],
        steps: [
        "Crush ginger, cardamom, and cinnamon lightly",
        "Boil water with crushed spices for 2-3 minutes",
        "Add tea leaves and boil for 1 minute",
        "Add milk and sugar, bring to boil",
        "Simmer for 2 minutes, strain and serve hot"
        ],
        tags: ["beverage", "breakfast", "aromatic", "comforting"]
    }
    ];

    // Function to generate mock data
    const generateMockData = async () => {
    try {
        console.log('Starting mock data generation...');

        // Clear existing data
        await InventoryItem.deleteMany({});
        await Recipe.deleteMany({});
        console.log('Cleared existing data');

        // Insert inventory items
        const inventoryItems = await InventoryItem.insertMany(sampleInventory);
        console.log(`Added ${inventoryItems.length} inventory items`);

        // Insert recipes
        const recipes = await Recipe.insertMany(sampleRecipes);
        console.log(`Added ${recipes.length} recipes`);

        console.log(' Mock data generation completed successfully!');
        console.log('\nSummary:');
        console.log(`   - Inventory Items: ${inventoryItems.length}`);
        console.log(`   - Recipes: ${recipes.length}`);
        console.log('\nYour API is ready with sample data:');
        console.log('   GET http://localhost:8000/api/inventory');
        console.log('   GET http://localhost:8000/api/recipes');

        return { inventoryItems, recipes };
    } catch (error) {
        console.error('Error generating mock data:', error.message);
        throw error;
    }
    };

    // Function to check if data already exists
    const checkExistingData = async () => {
    const inventoryCount = await InventoryItem.countDocuments();
    const recipeCount = await Recipe.countDocuments();
    
    return {
        hasInventory: inventoryCount > 0,
        hasRecipes: recipeCount > 0,
        inventoryCount,
        recipeCount
    };
};

module.exports = { generateMockData, checkExistingData, sampleInventory, sampleRecipes };