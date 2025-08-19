import React, { useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Grid,
    Paper,
    Divider,
    IconButton,
    Tooltip,
    Button
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Storage as ClusterIcon,
    Computer as NodeIcon,
    Person as AgentIcon,
    Info as InfoIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import NodeDetailModal from '../NodeDetailModal';

const HierarchicalView = ({ data }) => {
    const [expanded, setExpanded] = useState({});
    const [selectedNode, setSelectedNode] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded({
            ...expanded,
            [panel]: isExpanded
        });
    };

    const handleNodeClick = (node, cluster, agent) => {
        setSelectedNode({ node, cluster, agent });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedNode(null);
    };

    if (!data || !data.cluster) {
        return (
            <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No hierarchical data available
                </Typography>
            </Card>
        );
    }

    // Organize data hierarchically
    const hierarchicalData = {
        agents: {},
        clusters: {},
        nodes: {}
    };

            // Process clusters and their nodes
        Object.keys(data.cluster).forEach(clusterId => {
            const clusterData = data.cluster[clusterId];
            
            // Add cluster to clusters list
            hierarchicalData.clusters[clusterId] = {
                id: clusterId,
                name: clusterData.name || clusterId,
                type: clusterData.type || 'unknown',
                nodes: clusterData.node || {},
                icosAgentID: clusterData.icosAgentID || 'unknown'
            };

            // Process nodes in this cluster
            if (clusterData.node) {
                Object.keys(clusterData.node).forEach(nodeId => {
                    const nodeData = clusterData.node[nodeId];
                    hierarchicalData.nodes[nodeId] = {
                        id: nodeId,
                        name: nodeData.name || nodeId,
                        clusterId: clusterId,
                        clusterName: clusterData.name || clusterId,
                        type: nodeData.type || 'node',
                        resources: nodeData.staticMetrics || {},
                        metrics: nodeData.dynamicMetrics || {}
                    };
                });
            }

            // Group by icosAgentID
            const agentId = clusterData.icosAgentID || 'unknown';
            if (!hierarchicalData.agents[agentId]) {
                hierarchicalData.agents[agentId] = {
                    id: agentId,
                    name: `Agent: ${agentId}`,
                    clusters: {}
                };
            }
            hierarchicalData.agents[agentId].clusters[clusterId] = hierarchicalData.clusters[clusterId];
        });

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

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, color: '#1976d2' }}>
                ICOS Ecosystem - Hierarchical View
            </Typography>

            {/* Agents Level */}
            {Object.keys(hierarchicalData.agents).map((agentId) => {
                const agent = hierarchicalData.agents[agentId];
                const clusterCount = Object.keys(agent.clusters).length;
                const totalNodes = Object.values(agent.clusters).reduce((sum, cluster) => 
                    sum + Object.keys(cluster.nodes).length, 0);

                return (
                    <Accordion
                        key={agentId}
                        expanded={expanded[`agent-${agentId}`] || false}
                        onChange={handleAccordionChange(`agent-${agentId}`)}
                        sx={{ mb: 2 }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <AgentIcon sx={{ mr: 2, color: '#1976d2' }} />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">{agent.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {clusterCount} clusters • {totalNodes} nodes
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={`${clusterCount} clusters`} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                />
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {/* Clusters Level */}
                                {Object.keys(agent.clusters).map((clusterId) => {
                                    const cluster = agent.clusters[clusterId];
                                    const nodeCount = Object.keys(cluster.nodes).length;

                                    return (
                                        <Grid item xs={12} md={6} key={clusterId}>
                                            <Accordion
                                                expanded={expanded[`cluster-${clusterId}`] || false}
                                                onChange={handleAccordionChange(`cluster-${clusterId}`)}
                                            >
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                        <ClusterIcon sx={{ mr: 2, color: '#4caf50' }} />
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography variant="subtitle1">
                                                                {cluster.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {nodeCount} nodes • Type: {cluster.type}
                                                            </Typography>
                                                        </Box>
                                                        <Chip 
                                                            label={`${nodeCount} nodes`} 
                                                            size="small" 
                                                            color="success" 
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container spacing={1}>
                                                        {/* Nodes Level */}
                                                        {Object.keys(cluster.nodes).map((nodeId) => {
                                                            const node = hierarchicalData.nodes[nodeId];
                                                            const resources = node.resources || {};
                                                            const metrics = node.metrics || {};

                                                            return (
                                                                <Grid item xs={12} key={nodeId}>
                                                                    <Paper 
                                                                        elevation={1} 
                                                                        sx={{ 
                                                                            p: 2, 
                                                                            border: '1px solid #e0e0e0',
                                                                            borderRadius: 2
                                                                        }}
                                                                    >
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <NodeIcon sx={{ mr: 1, color: '#ff9800' }} />
                                                                            <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                                                                                {node.name}
                                                                            </Typography>
                                                                            <Button
                                                                                size="small"
                                                                                startIcon={<VisibilityIcon />}
                                                                                onClick={() => handleNodeClick(node, cluster, agent)}
                                                                                sx={{ mr: 1 }}
                                                                            >
                                                                                Details
                                                                            </Button>
                                                                            <Chip 
                                                                                label={node.type} 
                                                                                size="small" 
                                                                                color="warning" 
                                                                                variant="outlined"
                                                                            />
                                                                        </Box>
                                                                        
                                                                        <Divider sx={{ my: 1 }} />
                                                                        
                                                                        {/* Node Resources */}
                                                                        <Grid container spacing={2}>
                                                                            {resources.cpuCores && (
                                                                                <Grid item xs={4}>
                                                                                    <Typography variant="caption" color="text.secondary">
                                                                                        CPU Cores
                                                                                    </Typography>
                                                                                    <Typography variant="body2">
                                                                                        {resources.cpuCores}
                                                                                    </Typography>
                                                                                </Grid>
                                                                            )}
                                                                            {resources.RAMMemory && (
                                                                                <Grid item xs={4}>
                                                                                    <Typography variant="caption" color="text.secondary">
                                                                                        RAM
                                                                                    </Typography>
                                                                                    <Typography variant="body2">
                                                                                        {formatResource(resources.RAMMemory, 'B')}
                                                                                    </Typography>
                                                                                </Grid>
                                                                            )}
                                                                            {resources.cpuArchitecture && (
                                                                                <Grid item xs={4}>
                                                                                    <Typography variant="caption" color="text.secondary">
                                                                                        Architecture
                                                                                    </Typography>
                                                                                    <Typography variant="body2">
                                                                                        {resources.cpuArchitecture}
                                                                                    </Typography>
                                                                                </Grid>
                                                                            )}
                                                                        </Grid>

                                                                        {/* Node Metrics */}
                                                                        {Object.keys(metrics).length > 0 && (
                                                                            <>
                                                                                <Divider sx={{ my: 1 }} />
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    Metrics:
                                                                                </Typography>
                                                                                <Box sx={{ mt: 1 }}>
                                                                                    {Object.entries(metrics).map(([key, value]) => (
                                                                                        <Chip
                                                                                            key={key}
                                                                            label={`${key}: ${value}`}
                                                                                            size="small"
                                                                                            sx={{ mr: 0.5, mb: 0.5 }}
                                                                                        />
                                                                                    ))}
                                                                                </Box>
                                                                            </>
                                                                        )}
                                                                    </Paper>
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                );
            })}

            {/* Summary Statistics */}
            <Card sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>
                    Summary Statistics
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                            Total Agents
                        </Typography>
                        <Typography variant="h6" color="primary">
                            {Object.keys(hierarchicalData.agents).length}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                            Total Clusters
                        </Typography>
                        <Typography variant="h6" color="success.main">
                            {Object.keys(hierarchicalData.clusters).length}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                            Total Nodes
                        </Typography>
                        <Typography variant="h6" color="warning.main">
                            {Object.keys(hierarchicalData.nodes).length}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                            Data Source
                        </Typography>
                        <Typography variant="h6" color="info.main">
                            Real-time
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        {/* Node Detail Modal */}
        {selectedNode && (
            <NodeDetailModal
                open={modalOpen}
                onClose={handleCloseModal}
                nodeData={selectedNode.node}
                clusterData={selectedNode.cluster}
                agentData={selectedNode.agent}
            />
        )}
    </Box>
    );
};

export default HierarchicalView; 