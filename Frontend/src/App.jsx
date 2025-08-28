import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';


const theme = createTheme({
    palette: {
        primary: {
        main: '#2E7D32', 
        },
        secondary: {
        main: '#FF5722', 
        },
    },
    });

    function App() {
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
            <div className="App">
            <Navbar />
            <main style={{ padding: '20px', marginTop: '64px' }}>
                <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/recipes" element={<Recipes />} />
                </Routes>
            </main>
            </div>
        </Router>
        </ThemeProvider>
    );
}

export default App;