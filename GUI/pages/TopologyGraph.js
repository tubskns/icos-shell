import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Card from "@mui/material/Card";
import { Box, Typography, Modal, Button } from "@mui/material";

const TopologyGraph = ({ data }) => {
    const svgRef = useRef();
    const [open, setOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleOpen = (content) => {
        setModalContent(content);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalContent('');
    };

    useEffect(() => {
        const width = 600;
        const height = 500;

        // Remove any existing SVG elements in the ref
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(d => d.id).distance(75)) // Adjust distance here
            .force("charge", d3.forceManyBody().strength(-40)) // Adjust strength here
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Extract clusters from data
        const clusters = Object.keys(data.cluster).map(clusterId => ({
            id: clusterId,
            group: 'cluster',
            name: `Cluster: ${clusterId}` // Full name for cluster
        }));

        // Extract nodes (only first node per cluster)
        const nodes = Object.keys(data.cluster).flatMap(clusterId => {
            const nodeIds = Object.keys(data.cluster[clusterId].node);
            if (nodeIds.length > 0) {
                const nodeId = nodeIds[0]; // Only pick the first node for each cluster
                return [{
                    id: nodeId,
                    group: 'node',
                    name: 'Node', // Simplified label for nodes
                    fullDetail: data.cluster[clusterId].node[nodeId] ,
                    RAMMemory: ""+data.cluster[clusterId].node[nodeId].staticMetrics.RAMMemory , // Full name for nodes
                    cpuArchitecture: data.cluster[clusterId].node[nodeId].staticMetrics.cpuArchitecture , // Full name for nodes
                    clusterId: clusterId
                }];
            }
            return [];
        });

        // Extract pods inside each cluster (up to 3 pods per cluster for demonstration)
        const pods = clusters.flatMap(cluster =>
            Object.entries(data.cluster[cluster.id].pod || {})
                .slice(0, 12) // Limit to first 3 pods for demonstration
                .map(([podId, podInfo]) => ({
                    id: podId,
                    group: 'pod',
                    name: 'Pod', // Simplified label for pods
                    fullDetail: podInfo, // Full name for pods
                    clusterId: cluster.id
                }))
        );

        // Construct links array
        const links = [
            ...nodes.map(node => ({ source: node.clusterId, target: node.id })),
            ...pods.map(pod => ({ source: pod.clusterId, target: pod.id }))
        ];

        // Combine all nodes (clusters, nodes, and pods)
        const allNodes = [...clusters, ...nodes, ...pods];

        // Append links to SVG
        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", 2)
            .attr("stroke", "#999");

        // Append nodes (clusters, nodes, and pods) to SVG
        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(allNodes)
            .enter().append("g")
            .on('click', showFullName); // Attach click event handler

        // Append symbols (shapes) for clusters, nodes, and pods
        node.append("path")
            .attr("d", d => {
                if (d.group === 'cluster') return d3.symbol().type(d3.symbolSquare).size(400)();
                if (d.group === 'node') return d3.symbol().type(d3.symbolCircle).size(100)();
                if (d.group === 'pod') return d3.symbol().type(d3.symbolCircle).size(50)();
                return d3.symbol().type(d3.symbolSquare).size(100)();
            })
            .attr("fill", d => {
                if (d.group === 'cluster') return 'blue';
                if (d.group === 'node') return 'green';
                if (d.group === 'pod') return 'black'; // Color for pods
                return 'red';
            });

        // Add text for clusters
        node.filter(d => d.group === 'cluster').append("text")
            .text(d => d.name)
            .attr("x", -30)
            .attr("y", -15) // Adjust vertical position
            .attr("fill", "blue");

        // Add text for nodes
        node.filter(d => d.group === 'node').append("text")
            .text(d => d.name)
            .attr("x", -25)
            .attr("y", -50) // Adjust vertical position
            .attr("fill", "black");

        // Add text for pods
        node.filter(d => d.group === 'pod').append("text")
            .text(d => d.name)
            .attr("x", 20)
            .attr("y", -20) // Adjust vertical position
            .attr("fill", "black");

        // Add title for hover
        node.append("title")
            .text(d => d.id);

        // Define simulation behavior
        simulation.nodes(allNodes)
            .on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                node.attr("transform", d => `translate(${d.x},${d.y})`);
            });

        simulation.force("link")
            .links(links);

        // Function to format object into string
        function formatObject(obj, indentLevel = 0) {
            let formatted = '';
            const indent = '\t'.repeat(indentLevel);
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'object' && value !== null) {
                    formatted += `${indent}${key}:\n${formatObject(value, indentLevel + 1)}`;
                } else {
                    formatted += `${indent}${key}: ${value}\n`;
                }
            }
            return formatted;
        }

        // Function to show full name on click
        function showFullName(event, d) {
            const data = d3.select(this).datum();

            // Clone the object to avoid mutating the original data
            const clonedData = { ...data };

            // Remove the key you want to exclude, e.g., 'cpuArchitecture'
            delete clonedData.group;
            delete clonedData.name;
            delete clonedData.clusterId;
            delete clonedData.x;
            delete clonedData.y;
            delete clonedData.vx;
            delete clonedData.vy;

            // Convert the modified object to a formatted string
            const fullNameFormatted = formatObject(clonedData);

            handleOpen(fullNameFormatted);
        }

        return () => {
            // Clean up simulation on unmount
            simulation.nodes([]);
            simulation.force("link", null);
            simulation.stop();
        };
    }, [data]);

    return (
        <>
            <div ref={svgRef} style={{ width: '80%', height: '500px' }}></div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="simple-modal-title" variant="h6" component="h2">
                        Full Detail
                    </Typography>
                    <Typography id="simple-modal-description" component="pre" sx={{ mt: 2 }}>
                        {modalContent}
                    </Typography>
                    <Button onClick={handleClose}>Close</Button>
                </Box>
            </Modal>
        </>
    );
};

export default TopologyGraph;
