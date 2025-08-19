import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
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
    Person as AgentIcon
} from '@mui/icons-material';
import NodeDetailModal from '../NodeDetailModal';
import ClusterDetailModal from '../ClusterDetailModal';

const HierarchicalTopologyGraph = ({ data }) => {
    const svgRef = useRef();
    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [clusterModalOpen, setClusterModalOpen] = useState(false);

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

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleClusterClick = (cluster, agent) => {
        setSelectedCluster({ cluster, agent });
        setClusterModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    const handleCloseClusterModal = () => {
        setClusterModalOpen(false);
        setSelectedCluster(null);
    };

    useEffect(() => {
        if (!data || !data.cluster) {
            console.error('No data available');
            setError('No topology data available');
            return;
        }

        console.log('HierarchicalTopologyGraph data:', data);

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove();

        // Create SVG with better dimensions and zoom support
        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", 1600)
            .attr("height", 900)
            .style("border", "1px solid #e0e0e0")
            .style("background-color", "#fafafa")
            .style("border-radius", "8px");

        // Add zoom functionality
        const zoom = d3.zoom()
            .scaleExtent([0.5, 3])
            .on("zoom", (event) => {
                svg.select("g").attr("transform", event.transform);
            });

        svg.call(zoom);

        // Create a group for all content
        const g = svg.append("g");

        // Organize data hierarchically based on icosAgentID
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

        // Create hierarchical visualization with better spacing
        const agents = Object.keys(hierarchicalData.agents);
        const totalWidth = 1400;
        const agentSpacing = Math.min(300, totalWidth / Math.max(agents.length, 1));
        const startX = 100;
        
        agents.forEach((agentId, agentIndex) => {
            const agent = hierarchicalData.agents[agentId];
            const agentX = startX + (agentIndex * agentSpacing);
            const agentY = 100;

            // Agent Hexagon with better styling
            const agentHexagon = d3.line()
                .x(d => d.x)
                .y(d => d.y);

            const agentPoints = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                agentPoints.push({
                    x: agentX + 50 * Math.cos(angle),
                    y: agentY + 50 * Math.sin(angle)
                });
            }

            // Draw agent hexagon with shadow
            g.append("defs").append("filter")
                .attr("id", "shadow")
                .append("feDropShadow")
                .attr("dx", "2")
                .attr("dy", "2")
                .attr("stdDeviation", "3")
                .attr("flood-color", "rgba(0,0,0,0.3)");

            g.append("path")
                .attr("d", agentHexagon(agentPoints) + "Z")
                .attr("fill", "#ff9800")
                .attr("stroke", "#f57c00")
                .attr("stroke-width", 3)
                .style("cursor", "pointer")
                .style("filter", "url(#shadow)")
                .on("click", () => handleItemClick({ type: 'agent', data: agent }))
                .on("mouseover", function() {
                    d3.select(this).attr("fill", "#ffb74d").attr("stroke-width", 4);
                })
                .on("mouseout", function() {
                    d3.select(this).attr("fill", "#ff9800").attr("stroke-width", 3);
                });

            // Agent label with better formatting
            let agentName = agent.name;
            if (agentName.includes("Agent:")) {
                agentName = agentName.replace("Agent:", "").trim();
            }
            if (agentName.length > 8) {
                agentName = agentName.substring(0, 6) + "..";
            }
            g.append("text")
                .attr("x", agentX)
                .attr("y", agentY + 8)
                .attr("text-anchor", "middle")
                .text(agentName)
                .attr("fill", "white")
                .style("font-size", "10px")
                .style("font-weight", "bold");

            // Agent clusters count
            const clusterCount = Object.keys(agent.clusters).length;
            g.append("text")
                .attr("x", agentX)
                .attr("y", agentY + 25)
                .attr("text-anchor", "middle")
                .text(`${clusterCount} clusters`)
                .attr("fill", "white")
                .style("font-size", "9px");

            // Process clusters for this agent with better spacing
            const clusters = Object.keys(agent.clusters);
            const clusterSpacing = Math.min(180, 300 / Math.max(clusters.length, 1));
            const clusterStartX = agentX - ((clusters.length - 1) * clusterSpacing) / 2;

            clusters.forEach((clusterId, clusterIndex) => {
                const cluster = agent.clusters[clusterId];
                const clusterX = clusterStartX + (clusterIndex * clusterSpacing);
                const clusterY = 250;

                // Cluster Diamond with better styling
                const clusterDiamond = d3.line()
                    .x(d => d.x)
                    .y(d => d.y);

                const clusterPoints = [
                    { x: clusterX, y: clusterY - 35 },
                    { x: clusterX + 35, y: clusterY },
                    { x: clusterX, y: clusterY + 35 },
                    { x: clusterX - 35, y: clusterY }
                ];

                // Draw cluster diamond with shadow
                g.append("path")
                    .attr("d", clusterDiamond(clusterPoints) + "Z")
                    .attr("fill", "#2196f3")
                    .attr("stroke", "#1976d2")
                    .attr("stroke-width", 3)
                    .style("cursor", "pointer")
                    .style("filter", "url(#shadow)")
                    .on("click", () => handleClusterClick(cluster, agent))
                    .on("mouseover", function() {
                        d3.select(this).attr("fill", "#42a5f5").attr("stroke-width", 4);
                    })
                    .on("mouseout", function() {
                        d3.select(this).attr("fill", "#2196f3").attr("stroke-width", 3);
                    });

                // Cluster label with better formatting
                let clusterName = cluster.name;
                if (clusterName.length > 6) {
                    clusterName = clusterName.substring(0, 5) + "..";
                }
                g.append("text")
                    .attr("x", clusterX)
                    .attr("y", clusterY + 8)
                    .attr("text-anchor", "middle")
                    .text(clusterName)
                    .attr("fill", "white")
                    .style("font-size", "9px")
                    .style("font-weight", "bold");

                // Cluster nodes count
                const nodeCount = Object.keys(cluster.nodes).length;
                g.append("text")
                    .attr("x", clusterX)
                    .attr("y", clusterY + 22)
                    .attr("text-anchor", "middle")
                    .text(`${nodeCount} nodes`)
                    .attr("fill", "white")
                    .style("font-size", "8px");

                // Connection line from agent to cluster with better styling
                g.append("line")
                    .attr("x1", agentX)
                    .attr("y1", agentY + 50)
                    .attr("x2", clusterX)
                    .attr("y2", clusterY - 35)
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 2)
                    .style("stroke-dasharray", "5,5");

                // Process nodes for this cluster with better spacing
                const nodes = Object.keys(cluster.nodes);
                const nodeSpacing = Math.min(80, 200 / Math.max(nodes.length, 1));
                const nodeStartX = clusterX - ((nodes.length - 1) * nodeSpacing) / 2;

                nodes.forEach((nodeId, nodeIndex) => {
                    const node = hierarchicalData.nodes[nodeId];
                    const nodeX = nodeStartX + (nodeIndex * nodeSpacing);
                    const nodeY = 400;

                    // Node circle with shadow
                    g.append("circle")
                        .attr("cx", nodeX)
                        .attr("cy", nodeY)
                        .attr("r", 18)
                        .attr("fill", "#4caf50")
                        .attr("stroke", "#388e3c")
                        .attr("stroke-width", 3)
                        .style("cursor", "pointer")
                        .style("filter", "url(#shadow)")
                        .on("click", () => handleItemClick({ type: 'node', data: node }))
                        .on("mouseover", function() {
                            d3.select(this).attr("fill", "#66bb6a").attr("stroke-width", 4);
                        })
                        .on("mouseout", function() {
                            d3.select(this).attr("fill", "#4caf50").attr("stroke-width", 3);
                        });

                    // Node label with better formatting
                    let nodeName = node.name;
                    if (nodeName.length > 5) {
                        nodeName = nodeName.substring(0, 4) + "..";
                    }
                    g.append("text")
                        .attr("x", nodeX)
                        .attr("y", nodeY + 6)
                        .attr("text-anchor", "middle")
                        .text(nodeName)
                        .attr("fill", "white")
                        .style("font-size", "8px")
                        .style("font-weight", "bold");

                    // Connection line from cluster to node with better styling
                    g.append("line")
                        .attr("x1", clusterX)
                        .attr("y1", clusterY + 35)
                        .attr("x2", nodeX)
                        .attr("y2", nodeY - 18)
                        .attr("stroke", "#ccc")
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", "3,3");
                });
            });
        });





        console.log('Hierarchical topology graph created successfully');

    }, [data]);

    return (
        <div style={{ padding: '20px' }}>
            {error && (
                <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
                    {error}
                </div>
            )}
            
            {!data && !error && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#666',
                    fontSize: '16px'
                }}>
                    Loading topology data...
                </div>
            )}
            
            {/* Title Section - Only show when data is available */}
            {data && (
                <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '20px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                }}>
                    <h2 style={{ 
                        color: '#1976d2', 
                        fontSize: '28px', 
                        fontWeight: 'bold',
                        margin: '0 0 10px 0'
                    }}>
                        ICOS Ecosystem - Hierarchical Topology
                    </h2>
                    <p style={{ 
                        color: '#666', 
                        fontSize: '16px',
                        margin: '0 0 20px 0'
                    }}>
                        Click on any element to view details • {Object.keys(data.cluster || {}).length} Agents • {Object.keys(data.cluster || {}).length} Clusters • {Object.values(data.cluster || {}).reduce((sum, cluster) => sum + Object.keys(cluster.node || {}).length, 0)} Nodes
                    </p>
                    
                    {/* Legend Section */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        gap: '60px',
                        padding: '15px',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        border: '1px solid #ddd'
                    }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg width="30" height="30" style={{ marginRight: '8px' }}>
                            <polygon
                                points="15,5 20,10 20,20 15,25 10,20 10,10"
                                fill="#ff9800"
                                stroke="#f57c00"
                                strokeWidth="2"
                            />
                        </svg>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Agent (Controller)</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg width="30" height="30" style={{ marginRight: '8px' }}>
                            <polygon
                                points="15,5 25,15 15,25 5,15"
                                fill="#2196f3"
                                stroke="#1976d2"
                                strokeWidth="2"
                            />
                        </svg>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Cluster (Group)</span>
                    </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#4caf50',
                                border: '2px solid #388e3c',
                                marginRight: '8px'
                            }}></div>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Node (Unit)</span>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Graph Container - Only show when data is available */}
            {data && (
                <div style={{ 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px', 
                    padding: '10px',
                    backgroundColor: '#fafafa',
                    marginBottom: '20px'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '10px',
                        padding: '0 10px'
                    }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                            <strong>Zoom Controls:</strong> Mouse wheel to zoom • Drag to pan • Double-click to reset
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                            Scale: 0.5x - 3x
                        </div>
                    </div>
                    <div ref={svgRef} style={{ 
                        overflow: 'hidden',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: 'white'
                    }}></div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedItem && (
                <Dialog 
                    open={modalOpen} 
                    onClose={handleCloseModal}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {selectedItem.type === 'agent' && <AgentIcon sx={{ mr: 1, color: '#ff9800' }} />}
                                {selectedItem.type === 'cluster' && <ClusterIcon sx={{ mr: 1, color: '#2196f3' }} />}
                                {selectedItem.type === 'node' && <NodeIcon sx={{ mr: 1, color: '#4caf50' }} />}
                                <Typography variant="h6">
                                    {selectedItem.type === 'agent' && 'Agent Information'}
                                    {selectedItem.type === 'cluster' && 'Cluster Information'}
                                    {selectedItem.type === 'node' && 'Node Information'}
                                </Typography>
                            </Box>
                            <IconButton onClick={handleCloseModal}>
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
                                                {selectedItem.data.name || selectedItem.data.id}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                ID
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                                                {selectedItem.data.id}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Type
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedItem.data.type || selectedItem.type}
                                            </Typography>
                                        </Grid>
                                        {selectedItem.type === 'agent' && (
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Clusters
                                                </Typography>
                                                <Typography variant="body1">
                                                    {Object.keys(selectedItem.data.clusters || {}).length}
                                                </Typography>
                                            </Grid>
                                        )}
                                        {selectedItem.type === 'cluster' && (
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Nodes
                                                </Typography>
                                                <Typography variant="body1">
                                                    {Object.keys(selectedItem.data.nodes || {}).length}
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Resources (for nodes) */}
                            {selectedItem.type === 'node' && selectedItem.data.resources && Object.keys(selectedItem.data.resources).length > 0 && (
                                <Grid item xs={12}>
                                    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#4caf50' }}>
                                            System Resources
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {selectedItem.data.resources.cpuCores && (
                                                <Grid item xs={4}>
                                                    <Paper elevation={0} sx={{ p: 1, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            CPU Cores
                                                        </Typography>
                                                        <Typography variant="h6" color="primary">
                                                            {selectedItem.data.resources.cpuCores}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )}
                                            {selectedItem.data.resources.RAMMemory && (
                                                <Grid item xs={4}>
                                                    <Paper elevation={0} sx={{ p: 1, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            RAM
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ color: '#4caf50' }}>
                                                            {formatResource(selectedItem.data.resources.RAMMemory, 'B')}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )}
                                            {selectedItem.data.resources.cpuArchitecture && (
                                                <Grid item xs={4}>
                                                    <Paper elevation={0} sx={{ p: 1, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Architecture
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ color: '#ff9800' }}>
                                                            {selectedItem.data.resources.cpuArchitecture}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Paper>
                                </Grid>
                            )}

                            {/* Metrics (for nodes) */}
                            {selectedItem.type === 'node' && selectedItem.data.metrics && Object.keys(selectedItem.data.metrics).length > 0 && (
                                <Grid item xs={12}>
                                    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#ff5722' }}>
                                            Metrics
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {Object.entries(selectedItem.data.metrics).map(([key, value]) => (
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
                                            {JSON.stringify(selectedItem.data, null, 2)}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    
                    <DialogActions>
                        <Button onClick={handleCloseModal} variant="contained">
                            CLOSE
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Cluster Detail Modal */}
            {selectedCluster && (
                <ClusterDetailModal
                    open={clusterModalOpen}
                    onClose={handleCloseClusterModal}
                    clusterData={selectedCluster.cluster}
                    agentData={selectedCluster.agent}
                />
            )}
        </div>
    );
};

export default HierarchicalTopologyGraph; 