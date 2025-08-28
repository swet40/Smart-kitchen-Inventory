import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    });

    // Add response interceptor for error handling
    api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
    );

    // Inventory endpoints
    export const inventoryAPI = {
    getAll: () => api.get('/inventory'),
    create: (item) => api.post('/inventory', item),
    update: (id, item) => api.put(`/inventory/${id}`, item),
    delete: (id) => api.delete(`/inventory/${id}`),
    getWastePrediction: () => api.get('/inventory/waste-prediction'),
    };

    // Recipes endpoints
    export const recipesAPI = {
    getAll: () => api.get('/recipes'),
    getWithServing: () => api.get('/recipes/with-serving-info'),
    getCanMake: () => api.get('/recipes/can-make'),
    getSubstitutes: (id) => api.get(`/recipes/${id}/substitutes`),
    findByIngredients: (ingredients) => api.get(`/recipes/use-ingredients?ingredients=${ingredients}`),
    getById: (id) => api.get(`/recipes/${id}`),
    generateShoppingList: (recipeIds) => api.post('/recipes/shopping-list', { recipeIds }),
    };

export default api;