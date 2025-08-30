import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import RecipeDetailPage from './pages/RecipeDetailPage';
import DebugSubstitutes from './components/recipes/DebugSubstitutes';
import { AppStateProvider } from './contexts/AppState';
import WasteAlerts from './components/dashboard/WasteAlerts';
import MealPlanner from './components/meal/MealPlanner';



const theme = createTheme({
    palette: {
        primary: {
        main: '#2e507dff', 
        },
        secondary: {
        main: '#22fff0ff', 
        },
    },
    });

    function App() {
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
        }}
        autoHideDuration={3000}
        >
        <AppStateProvider>
        <Router>
            <div className="App">
            <Navbar />
            <main style={{ padding: '20px', marginTop: '64px' }}>
                <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                <Route path="/debug/:id" element={<DebugSubstitutes />} />
                <Route path="/waste-alerts" element={<WasteAlerts />} />
                <Route path="/meal-planner" element={<MealPlanner />} />
                </Routes>
            </main>
            </div>
        </Router>
        </AppStateProvider>
        </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;