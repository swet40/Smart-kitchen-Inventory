import React, { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography, Alert,
    Button, CircularProgress
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
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
        // Set empty array to prevent further errors
        setWasteItems([]);
        } finally {
        setLoading(false);
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
            Waste Prevention Alerts
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
            <Typography variant="h6">Excellent Inventory Management!</Typography>
            <Typography>
                No items are at risk of waste. Keep up the good work!
            </Typography>
            </Alert>
        ) : (
            <>
            <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="h6">Attention Needed</Typography>
                <Typography>
                Found {wasteItems.length} items that might need your attention to prevent waste.
                </Typography>
            </Alert>

            {wasteItems.map((item, index) => (
                <Card key={item._id || index} sx={{ 
                mb: 2, 
                borderLeft: 4, 
                borderColor: item.wasteRisk === 'high' ? 'error.main' : 'warning.main',
                backgroundColor: item.wasteRisk === 'high' ? '#ffebee' : '#fff8e1'
                }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="h6" color="primary">
                        {item.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                        {item.category} • {item.currentQuantity} {item.unit} 
                        {item.threshold && ` (Threshold: ${item.threshold} ${item.unit})`}
                        </Typography>
                    </Box>
                    <Box 
                        sx={{ 
                        px: 2, 
                        py: 1, 
                        backgroundColor: item.wasteRisk === 'high' ? 'error.main' : 'warning.main',
                        color: 'white',
                        borderRadius: 1
                        }}
                    >
                        <Typography variant="body2" fontWeight="bold">
                        {item.wasteRisk.toUpperCase()} RISK
                        </Typography>
                    </Box>
                    </Box>

                    <Box mt={2}>
                    <Typography variant="body2" fontWeight="bold">
                        Concerns:
                    </Typography>
                    {item.reasons.map((reason, reasonIndex) => (
                        <Typography key={reasonIndex} variant="body2" sx={{ ml: 2 }}>
                        • {reason}
                        </Typography>
                    ))}
                    </Box>

                    <Box mt={2}>
                    <Typography variant="body2" fontWeight="bold">
                        Suggestions:
                    </Typography>
                    <Typography variant="body2">
                        {item.wasteRisk === 'high' 
                        ? 'Use immediately or consider preserving/freezing'
                        : 'Plan meals around this ingredient this week'
                        }
                    </Typography>
                    </Box>
                </CardContent>
                </Card>
            ))}
            </>
        )}

        {/* Help section for first-time users */}
        {wasteItems.length === 0 && (
            <Card sx={{ mt: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                How to Use Waste Predictions
                </Typography>
                <Typography variant="body2" paragraph>
                The waste prediction system analyzes your inventory to identify items that might go to waste.
                </Typography>
                <Typography variant="body2" paragraph>
                <strong>To get predictions:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ ml: 2 }}>
                • Set <strong>threshold values</strong> for your inventory items<br/>
                • Items with very low usage (below 30% of threshold) will be flagged<br/>
                • Items with excess quantity (over 3x threshold) will be flagged<br/>
                • The system will suggest actions to prevent waste
                </Typography>
            </CardContent>
            </Card>
        )}
        </Box>
    );
}

export default WasteAlerts;