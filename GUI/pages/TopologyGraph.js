import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
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

        const g = svg.append("g");

        const zoom = d3.zoom()
            .scaleExtent([0.5, 3])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom)
            .style("overflow", "hidden")
            .style("cursor", "default");

        svg.on("pointerdown", () => svg.style("cursor", "move"));
        svg.on("pointerup", () => svg.style("cursor", "default"));

        const simulation = d3.forceSimulation()
            .force("link", d3.forceLink()
                .id(d => d.id)
                .distance(50))
            .force("charge", d3.forceManyBody().strength(-150))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX(width / 2).strength(0.08))
            .force("y", d3.forceY(height / 2).strength(0.08));

        const clusters = Object.keys(data.cluster).map(clusterId => ({
            id: clusterId,
            group: 'cluster',
            name: `Cluster: ${clusterId}`
        }));

        const nodes = Object.keys(data.cluster).flatMap(clusterId => {
            const nodeEntries = Object.entries(data.cluster[clusterId].node);
            return nodeEntries.slice(0, 3).map(([nodeId, nodeData]) => ({
                id: nodeId,
                group: 'node',
                name: nodeData.name || nodeId,
                fullDetail: nodeData,
                clusterId: clusterId
            }));
        });

        const links = nodes.map(node => ({ source: node.clusterId, target: node.id }));

        const allNodes = [...clusters, ...nodes];

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

        node.append("path")
            .attr("d", d => {
                if (d.group === 'cluster') return d3.symbol().type(d3.symbolSquare).size(400)();
                if (d.group === 'node') return d3.symbol().type(d3.symbolCircle).size(100)();
                return d3.symbol().type(d3.symbolSquare).size(100)();
            })
            .attr("fill", d => {
                if (d.group === 'cluster') return 'blue';
                if (d.group === 'node') return 'green';
                return 'red';
            })
            .on('pointerover', function() {
                svg.style("cursor", "pointer");
            })
            .on('pointerout', function() {
                svg.style("cursor", "default");
            });

        node.append("text")
            .text(d => d.name)
            .attr("x", -25)
            .attr("y", -30)
            .attr("fill", "black");

        node.append("title")
            .text(d => d.name);

        simulation.nodes(allNodes)
            .on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                node.attr("transform", d => `translate(${d.x},${d.y})`);
            });

        simulation.force("link").links(links);

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

        const legendGroup = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(10, 20)");

        const legendItems = [
            { color: 'blue', label: 'Cluster' },
            { color: 'green', label: 'Node' }
        ];

        legendItems.forEach((item, index) => {
            const legendItem = legendGroup.append("g")
                .attr("transform", `translate(0, ${index * 20})`);

            legendItem.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", item.color);

            legendItem.append("text")
                .attr("x", 25)
                .attr("y", 15)
                .text(item.label);
        });

        return () => {
            simulation.nodes([]);
            simulation.force("link", null);
            simulation.stop();
        };
    }, [data]);

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