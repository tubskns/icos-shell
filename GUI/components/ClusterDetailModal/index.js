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
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent
} from '@mui/material';
import {
    Close as CloseIcon,
    Storage as ClusterIcon,
    Computer as NodeIcon,
    Inventory as PodIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const ClusterDetailModal = ({ open, onClose, clusterData, agentData }) => {
    if (!clusterData) return null;

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

    const nodes = clusterData.nodes || {};
    const pods = clusterData.pod || {};

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ClusterIcon sx={{ mr: 1, color: '#2196f3' }} />
                        <Typography variant="h6">Cluster Information</Typography>
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
                        <Card sx={{ p: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <InfoIcon sx={{ mr: 1, color: '#1976d2' }} />
                                <Typography variant="h6" sx={{ color: '#1976d2' }}>
                                    Basic Information
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        {clusterData.name || clusterData.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        ID
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                                        {clusterData.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Type
                                    </Typography>
                                    <Typography variant="body1">
                                        {clusterData.type || 'cluster'}
                                    </Typography>
                                </Grid>
                                {clusterData.icosAgentID && (
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Agent ID
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#ff9800' }}>
                                            {clusterData.icosAgentID}
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Nodes
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#4caf50' }}>
                                        {Object.keys(nodes).length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Pods
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#9c27b0' }}>
                                        {Object.keys(pods).length}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    {/* Nodes Section */}
                    {Object.keys(nodes).length > 0 && (
                        <Grid item xs={12}>
                            <Card sx={{ p: 2, mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <NodeIcon sx={{ mr: 1, color: '#4caf50' }} />
                                    <Typography variant="h6" sx={{ color: '#4caf50' }}>
                                        Nodes ({Object.keys(nodes).length} nodes)
                                    </Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    {Object.entries(nodes).map(([nodeId, nodeData]) => {
                                        const staticMetrics = nodeData.staticMetrics || {};
                                        const dynamicMetrics = nodeData.dynamicMetrics || {};
                                        
                                        return (
                                            <Grid item xs={12} md={6} key={nodeId}>
                                                <Paper 
                                                    elevation={1} 
                                                    sx={{ 
                                                        p: 2, 
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: 2,
                                                        bgcolor: '#f8f9fa'
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                        {nodeData.name || nodeId}
                                                    </Typography>
                                                    
                                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                                        {staticMetrics.cpuCores && (
                                                            <Grid item xs={4}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    CPU Cores
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {staticMetrics.cpuCores}
                                                                </Typography>
                                                            </Grid>
                                                        )}
                                                        {staticMetrics.RAMMemory && (
                                                            <Grid item xs={4}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Total RAM
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                                                    {formatResource(staticMetrics.RAMMemory, 'B')}
                                                                </Typography>
                                                            </Grid>
                                                        )}
                                                        {dynamicMetrics.freeRAM && (
                                                            <Grid item xs={4}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Free RAM
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                                                                    {formatResource(dynamicMetrics.freeRAM, 'B')}
                                                                </Typography>
                                                            </Grid>
                                                        )}
                                                        {staticMetrics.cpuArchitecture && (
                                                            <Grid item xs={4}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Architecture
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {staticMetrics.cpuArchitecture}
                                                                </Typography>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </Paper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Card>
                        </Grid>
                    )}

                    {/* Pods Section */}
                    {Object.keys(pods).length > 0 && (
                        <Grid item xs={12}>
                            <Card sx={{ p: 2, mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <PodIcon sx={{ mr: 1, color: '#9c27b0' }} />
                                    <Typography variant="h6" sx={{ color: '#9c27b0' }}>
                                        Pods ({Object.keys(pods).length} pods)
                                    </Typography>
                                </Box>
                                <TableContainer component={Paper} elevation={1} sx={{ maxHeight: '400px', overflow: 'auto' }}>
                                    <Table size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Pod Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>IP Address</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>CPU Usage</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Containers</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.entries(pods).map(([podId, podData]) => {
                                                // Calculate total CPU usage from all containers
                                                let totalCpuUsage = 0;
                                                if (podData.container) {
                                                    Object.values(podData.container).forEach(container => {
                                                        if (container.cpuUsage) {
                                                            totalCpuUsage += container.cpuUsage;
                                                        }
                                                    });
                                                }

                                                return (
                                                    <TableRow key={podId} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                                {podData.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#666' }}>
                                                                {podData.ip || '-'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={podData.status || 'Unknown'} 
                                                                color={getStatusColor(podData.status)}
                                                                size="small"
                                                                sx={{ 
                                                                    fontWeight: 'bold',
                                                                    minWidth: '80px'
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ 
                                                                fontWeight: 'bold',
                                                                color: totalCpuUsage > 0.01 ? '#f57c00' : '#4caf50'
                                                            }}>
                                                                {totalCpuUsage > 0 ? `${(totalCpuUsage * 100).toFixed(3)}%` : '-'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                {podData.numberOfContainers || Object.keys(podData.container || {}).length}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                
                                {/* Pods Summary */}
                                <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={3}>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Pods
                                            </Typography>
                                            <Typography variant="h6" color="primary">
                                                {Object.keys(pods).length}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body2" color="text.secondary">
                                                Running
                                            </Typography>
                                            <Typography variant="h6" color="success.main">
                                                {Object.values(pods).filter(pod => pod.status === 'Running').length}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Containers
                                            </Typography>
                                            <Typography variant="h6" color="info.main">
                                                {Object.values(pods).reduce((sum, pod) => 
                                                    sum + (pod.numberOfContainers || Object.keys(pod.container || {}).length), 0
                                                )}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body2" color="text.secondary">
                                                Avg CPU Usage
                                            </Typography>
                                            <Typography variant="h6" color="warning.main">
                                                {(() => {
                                                    const totalCpu = Object.values(pods).reduce((sum, pod) => {
                                                        if (pod.container) {
                                                            return sum + Object.values(pod.container).reduce((containerSum, container) => 
                                                                containerSum + (container.cpuUsage || 0), 0
                                                            );
                                                        }
                                                        return sum;
                                                    }, 0);
                                                    const avgCpu = totalCpu / Object.keys(pods).length;
                                                    return avgCpu > 0 ? `${(avgCpu * 100).toFixed(3)}%` : '0%';
                                                })()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    )}

                    {/* Debug Information */}
                    <Grid item xs={12}>
                        <Card sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <InfoIcon sx={{ mr: 1, color: '#607d8b' }} />
                                <Typography variant="h6" sx={{ color: '#607d8b' }}>
                                    Debug Information
                                </Typography>
                            </Box>
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
                                    {JSON.stringify(clusterData, null, 2)}
                                </Typography>
                            </Box>
                        </Card>
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

export default ClusterDetailModal; 