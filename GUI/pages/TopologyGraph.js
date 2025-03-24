import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Typography, Modal, Button } from "@mui/material";

const TopologyGraph = ({ data }) => {
    const svgRef = useRef();
    const [open, setOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [visiblePods, setVisiblePods] = useState(25); // Start with 25 visible pods

    const handleOpen = (content) => {
        setModalContent(content);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalContent('');
    };

    // Handle scrolling to increase the number of visible pods
    const handleScroll = () => {
        const container = svgRef.current.parentElement;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            // If scrolled to the bottom, increase the number of visible pods
            setVisiblePods(prev => Math.min(prev + 4, Object.keys(data.cluster).flatMap(clusterId => Object.keys(data.cluster[clusterId].pod || {})).length)); // Increase by 4
        }
    };

    useEffect(() => {
        const parent = svgRef.current.parentElement;
        const width = parent.clientWidth;
        const height = parent.clientHeight;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("background-color", "white");

        // Create a group element to apply zoom transformations
        const g = svg.append("g");

        // Enable zoom and pan
        const zoom = d3.zoom()
            .scaleExtent([0.5, 3]) // Adjust the scale range for zoom
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom)
            .style("overflow", "hidden") // Hide the scrollbars
            .style("cursor", "default"); // Set cursor style to default

        // Cursor handling for zooming
        svg.on("pointerdown", () => svg.style("cursor", "move")); // Closed hand when dragging starts
        svg.on("pointerup", () => svg.style("cursor", "default")); // Open hand when dragging ends

        const simulation = d3.forceSimulation()
            .force("link", d3.forceLink()
                .id(d => d.id)
                .distance(d => d.group === 'cluster' ? 20 : 38) // Closer links between clusters
            )
            .force("charge", d3.forceManyBody().strength(-150)) // Reduce repulsion strength
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX(width / 2).strength(0.08)) // Pull clusters towards center on the x-axis
            .force("y", d3.forceY(height / 2).strength(0.08)); // Pull clusters towards center on the y-axis


        const clusters = Object.keys(data.cluster).map(clusterId => ({
            id: clusterId,
            group: 'cluster',
            name: `Cluster: ${clusterId}`
        }));

        const nodes = Object.keys(data.cluster).flatMap(clusterId => {
            const nodeIds = Object.keys(data.cluster[clusterId].node);
            // Select up to 3 nodes from each cluster
            return nodeIds.slice(0, 3).map(nodeId => ({
                id: nodeId,
                group: 'node',
                name: '',
                fullDetail: data.cluster[clusterId].node[nodeId],
                RAMMemory: "" + data.cluster[clusterId].node[nodeId].staticMetrics.RAMMemory,
                cpuArchitecture: data.cluster[clusterId].node[nodeId].staticMetrics.cpuArchitecture,
                clusterId: clusterId
            }));
        });

        // Update pods based on the current number of visible pods
        const pods = clusters.flatMap(cluster =>
            Object.entries(data.cluster[cluster.id].pod || {})
                .slice(0, visiblePods) // Use the visiblePods state to determine how many to show
                .map(([podId, podInfo]) => ({
                    id: podId,
                    group: 'pod',
                    name: '',
                    fullDetail: podInfo,
                    clusterId: cluster.id
                }))
        );

        const links = [
            ...nodes.map(node => ({ source: node.clusterId, target: node.id })),
            ...pods.map(pod => ({ source: pod.clusterId, target: pod.id }))
        ];

        const allNodes = [...clusters, ...nodes, ...pods];

        const link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", 2)
            .attr("stroke", "#999");

        const node = g.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(allNodes)
            .enter().append("g")
            .on('click', showFullName);

        // Append path elements for nodes and pods, and apply event listeners
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
                if (d.group === 'pod') return 'black';
                return 'red';
            })
            .on('pointerover', function() {
                svg.style("cursor", "pointer"); // Change to pointer when hovering over nodes
            })
            .on('pointerout', function() {
                svg.style("cursor", "default"); // Revert to default cursor when leaving nodes
            });

        node.filter(d => d.group === 'cluster').append("text")
            .text(d => d.name)
            .attr("x", -30)
            .attr("y", -15)
            .attr("fill", "blue");

        node.filter(d => d.group === 'node').append("text")
            .text(d => d.name)
            .attr("x", -25)
            .attr("y", -50)
            .attr("fill", "black");

        node.filter(d => d.group === 'pod').append("text")
            .text(d => d.name)
            .attr("x", 20)
            .attr("y", -20)
            .attr("fill", "black");

        node.append("title")
            .text(d => d.id);

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

        function showFullName(event, d) {
            const data = d3.select(this).datum();
            const clonedData = { ...data };

            delete clonedData.group;
            delete clonedData.name;
            delete clonedData.clusterId;
            delete clonedData.x;
            delete clonedData.y;
            delete clonedData.vx;
            delete clonedData.vy;

            const fullNameFormatted = formatObject(clonedData);
            handleOpen(fullNameFormatted);
        }

        // Add event listener for scrolling
        const container = svgRef.current.parentElement;
        container.addEventListener('scroll', handleScroll);

        // Create the legend group within the SVG
        const legendGroup = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(10, 20)"); // Position the legend

        // Define legend items
        const legendItems = [
            { color: 'blue', label: 'Cluster' },
            { color: 'green', label: 'Node' },
            { color: 'black', label: 'Pod' }
        ];

        // Create legend items
        legendItems.forEach((item, index) => {
            const legendItem = legendGroup.append("g")
                .attr("transform", `translate(0, ${index * 20})`);

            // Add colored square
            legendItem.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", item.color);

            // Add label
            legendItem.append("text")
                .attr("x", 25)
                .attr("y", 15) // Align the text vertically
                .text(item.label);
        });

        return () => {
            simulation.nodes([]);
            simulation.force("link", null);
            simulation.stop();
            container.removeEventListener('scroll', handleScroll); // Clean up scroll event listener
        };
    }, [data, visiblePods]); // Re-run effect when visiblePods changes

    return (
        <>
            <div ref={svgRef} style={{ width: '100%', height: '400px', maxHeight: '400px', overflow: 'auto' }}></div>
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
                    width: 800,
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
