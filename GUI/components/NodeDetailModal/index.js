import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Paper,
    Chip,
    Divider,
    IconButton
} from '@mui/material';
import {
    Close as CloseIcon,
    Computer as NodeIcon,
    Storage as ClusterIcon,
    Person as AgentIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const NodeDetailModal = ({ open, onClose, nodeData, clusterData, agentData }) => {
    if (!nodeData) return null;

    const formatResource = (value, unit = '') => {
        if (typeof value === 'number') {
            if (value >= 1024 * 1024 * 1024) {
                return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
            } else if (value >= 1024 * 1024) {
                return `${(value / (1024 * 1024)).toFixed(1)} MB`;
            } else if (value >= 1024) {
                return `${(value / 1024).toFixed(1)} KB`;
            }
            return `${value}${unit}`;
        }
        return value;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'running':
            case 'active':
            case 'healthy':
                return 'success';
            case 'degraded':
            case 'warning':
                return 'warning';
            case 'stopped':
            case 'error':
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NodeIcon sx={{ mr: 1, color: '#ff9800' }} />
                        <Typography variant="h6">Node Information</Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            
            <DialogContent>
                <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                                Basic Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {nodeData.name || nodeData.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        ID
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                                        {nodeData.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Type
                                    </Typography>
                                    <Typography variant="body1">
                                        {nodeData.type || 'node'}
                                    </Typography>
                                </Grid>
                                {nodeData.status && (
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Status
                                        </Typography>
                                        <Chip 
                                            label={nodeData.status} 
                                            color={getStatusColor(nodeData.status)}
                                            size="small"
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* System Resources */}
                    {nodeData.resources && Object.keys(nodeData.resources).length > 0 && (
                        <Grid item xs={12}>
                            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#4caf50' }}>
                                    System Resources
                                </Typography>
                                <Grid container spacing={2}>
                                    {nodeData.resources.cpuCores && (
                                        <Grid item xs={4}>
                                            <Paper elevation={0} sx={{ p: 1, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    CPU Cores
                                                </Typography>
                                                <Typography variant="h6" color="primary">
                                                    {nodeData.resources.cpuCores}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    )}
                                    {nodeData.resources.RAMMemory && (
                                        <Grid item xs={4}>
                                            <Paper elevation={0} sx={{ p: 1, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    GB RAM
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#4caf50' }}>
                                                    {formatResource(nodeData.resources.RAMMemory, 'B')}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    )}
                                    {nodeData.resources.cpuArchitecture && (
                                        <Grid item xs={4}>
                                            <Paper elevation={0} sx={{ p: 1, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Architecture
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#ff9800' }}>
                                                    {nodeData.resources.cpuArchitecture}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        </Grid>
                    )}

                    {/* Hierarchy Information */}
                    <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#9c27b0' }}>
                                Hierarchy Information
                            </Typography>
                            <Grid container spacing={2}>
                                {clusterData && (
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <ClusterIcon sx={{ mr: 1, color: '#4caf50' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Cluster
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1">
                                            {clusterData.name || clusterData.id}
                                        </Typography>
                                    </Grid>
                                )}
                                {agentData && (
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <AgentIcon sx={{ mr: 1, color: '#1976d2' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Agent
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1">
                                            {agentData.name || agentData.id}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Metrics */}
                    {nodeData.metrics && Object.keys(nodeData.metrics).length > 0 && (
                        <Grid item xs={12}>
                            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#ff5722' }}>
                                    Metrics
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {Object.entries(nodeData.metrics).map(([key, value]) => (
                                        <Chip
                                            key={key}
                                            label={`${key}: ${value}`}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                        />
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
                    )}

                    {/* Debug Information */}
                    <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#607d8b' }}>
                                Debug Information
                            </Typography>
                            <Box sx={{ 
                                bgcolor: '#f5f5f5', 
                                p: 2, 
                                borderRadius: 1,
                                fontFamily: 'monospace',
                                fontSize: '0.8em',
                                maxHeight: '200px',
                                overflow: 'auto'
                            }}>
                                <Typography variant="body2">
                                    {JSON.stringify(nodeData, null, 2)}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    CLOSE
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NodeDetailModal; 