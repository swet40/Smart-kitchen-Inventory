import React, { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography, Alert,
    Button, CircularProgress, Chip
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';
import { inventoryAPI } from '../../services/api';
import useNotifications from '../../hooks/useNotifications';

function WasteAlerts() {
    const [wasteItems, setWasteItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showError } = useNotifications();

    useEffect(() => {
        fetchWastePrediction();
    }, []);

    const fetchWastePrediction = async () => {
        setLoading(true);
        try {
        const response = await inventoryAPI.getWastePrediction();
        setWasteItems(response.data);
        } catch (error) {
        showError('Failed to load waste predictions. Please make sure you have items with thresholds set.');
        console.error('Waste prediction error:', error);
        setWasteItems([]);
        } finally {
        setLoading(false);
        }
    };

    const getSeverity = (risk) => {
        switch (risk) {
        case 'high': return 'error';
        case 'medium': return 'warning';
        case 'low': return 'info';
        default: return 'info';
        }
    };

    const getSuggestions = (item) => {
        if (item.perishable) {
        return [
            ' Use within a few days',
            ' Make recipes that use this ingredient',
        ];
        } else {
        return [
            ' Store in airtight container',
            ' Check expiration date periodically'
        ];
        }
    };

    if (loading) {
        return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Analyzing inventory...</Typography>
        </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
            <WarningIcon color="warning" sx={{ fontSize: 32 }} />
            <Typography variant="h4">
            Smart Waste Prevention
            </Typography>
            <Button 
            variant="outlined" 
            onClick={fetchWastePrediction}
            sx={{ ml: 2 }}
            >
            Refresh Analysis
            </Button>
        </Box>

        {wasteItems.length === 0 ? (
            <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6"> Excellent Inventory Management!</Typography>
            <Typography>
                No items are at risk of waste. Keep up the good work!
            </Typography>
            </Alert>
        ) : (
            <>
            <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="h6"> Smart Waste Alerts</Typography>
                <Typography>
                Found {wasteItems.length} items that might need attention. 
                <strong> Non-perishable items</strong> (rice, dal, spices) show fewer alerts as they don't spoil quickly.
                </Typography>
            </Alert>

            {wasteItems.map((item, index) => (
                <Card key={item._id || index} sx={{ 
                mb: 3, 
                borderLeft: 4, 
                borderColor: getSeverity(item.wasteRisk) + '.main',
                backgroundColor: item.wasteRisk === 'high' ? '#ffebee' : 
                                item.wasteRisk === 'medium' ? '#fff8e1' : '#e3f2fd'
                }}>
                <CardContent>
                    {/* Item Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h6" color="primary" gutterBottom>
                        {item.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                        {item.category} • {item.currentQuantity} {item.unit} 
                        {item.threshold && ` (Threshold: ${item.threshold} ${item.unit})`}
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                        <Chip 
                        label={item.wasteRisk.toUpperCase() + ' RISK'} 
                        color={getSeverity(item.wasteRisk)}
                        size="small"
                        />
                        
                        <Chip
                        icon={item.perishable ? <AccessTimeIcon /> : <ShieldIcon />}
                        label={item.perishable ? 'Perishable' : 'Non-perishable'}
                        color={item.perishable ? 'warning' : 'info'}
                        variant="outlined"
                        size="small"
                        />
                    </Box>
                    </Box>

                    <Box mb={2}>
                    <Typography variant="body2" fontWeight="bold">
                        Usage: {item.usagePercentage}% of threshold • 
                        {item.perishable ? '  Spoils quickly' : '  Long shelf life'}
                    </Typography>
                    </Box>

                    {/* Concerns */}
                    <Box mb={2}>
                    <Typography variant="body2" fontWeight="bold" color="textSecondary">
                        Concerns:
                    </Typography>
                    {item.reasons.map((reason, reasonIndex) => (
                        <Typography key={reasonIndex} variant="body2" sx={{ ml: 2, mt: 0.5 }}>
                        • {reason}
                        </Typography>
                    ))}
                    </Box>

                    {/* Smart Suggestions */}
                    <Box mb={2}>
                    <Typography variant="body2" fontWeight="bold" color="textSecondary">
                        Smart Suggestions:
                    </Typography>
                    {getSuggestions(item).map((suggestion, suggestionIndex) => (
                        <Typography key={suggestionIndex} variant="body2" sx={{ ml: 2, mt: 0.5 }}>
                        • {suggestion}
                        </Typography>
                    ))}
                    </Box>

                    {/* Item Type Explanation */}
                    <Box mt={2} p={1} bgcolor="#f5f5f5" borderRadius={1}>
                    <Typography variant="caption" color="textSecondary">
                        {item.perishable 
                        ? ' This item spoils quickly. Use it soon to prevent waste.'
                        : ' This item has a long shelf life. No immediate worry.'
                        }
                    </Typography>
                    </Box>
                </CardContent>
                </Card>
            ))}
            </>
        )}

        {/* Educational Section */}
        <Card sx={{ mt: 4 }}>
            <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
                How Smart Waste Prediction Works
            </Typography>
            <Typography variant="body2" paragraph>
                Our system intelligently differentiates between perishable and non-perishable items:
            </Typography>
            
            <Box sx={{ ml: 2 }}>
                <Typography variant="body2" gutterBottom>
                <strong> Perishable Items</strong> (Vegetables, Fruits, Dairy):
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }} component="div">
                • Alerts at 30% usage or 2x threshold<br/>
                • Urgent actions: Use quickly, freeze, cook immediately
                </Typography>

                <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                <strong> Non-Perishable Items</strong> (Rice, Dal, Spices, Atta, Oils):
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }} component="div">
                • Alerts only at 10% usage or 5x threshold<br/>
                • Relaxed actions: Proper storage, consider sharing
                </Typography>
            </Box>

            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                Your rice, dal, and spices won't trigger unnecessary alerts! 
            </Typography>
            </CardContent>
        </Card>
        </Box>
    );
}

export default WasteAlerts;