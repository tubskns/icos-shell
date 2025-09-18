import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const SimpleTopologyGraph = ({ data }) => {
    const svgRef = useRef();
    const [error, setError] = useState('');

    useEffect(() => {
        if (!data || !data.cluster) {
            console.error('No data available');
            setError('No topology data available');
            return;
        }

        console.log('SimpleTopologyGraph data:', data);

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove();

        // Create SVG
        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", 1200)
            .attr("height", 600)
            .style("border", "1px solid #ccc")
            .style("background-color", "white");

        // Get clusters
        const clusters = Object.keys(data.cluster);
        console.log('Clusters found:', clusters.length);

        // Create detailed visualization
        clusters.forEach((clusterId, index) => {
            const clusterData = data.cluster[clusterId];
            const x = 150 + (index * 300);
            const y = 300;

            // Count nodes in this cluster
            const nodeCount = clusterData.node ? Object.keys(clusterData.node).length : 0;
            const clusterName = clusterData.name || clusterId.substring(0, 12) + "...";

            // Add cluster circle
            svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 40)
                .attr("fill", "#4CAF50")
                .attr("stroke", "#2E7D32")
                .attr("stroke-width", 3);

            // Add cluster name
            svg.append("text")
                .attr("x", x)
                .attr("y", y - 10)
                .attr("text-anchor", "middle")
                .text(clusterName)
                .attr("fill", "white")
                .style("font-size", "11px")
                .style("font-weight", "bold");

            // Add node count
            svg.append("text")
                .attr("x", x)
                .attr("y", y + 5)
                .attr("text-anchor", "middle")
                .text(`${nodeCount} nodes`)
                .attr("fill", "white")
                .style("font-size", "10px");

            // Add cluster type
            svg.append("text")
                .attr("x", x)
                .attr("y", y + 20)
                .attr("text-anchor", "middle")
                .text(clusterData.type || "unknown")
                .attr("fill", "white")
                .style("font-size", "9px");

            // Add cluster ID (shortened)
            svg.append("text")
                .attr("x", x)
                .attr("y", y + 60)
                .attr("text-anchor", "middle")
                .text(clusterId.substring(0, 8) + "...")
                .attr("fill", "#666")
                .style("font-size", "9px");

            // Add nodes visualization
            if (clusterData.node) {
                const nodes = Object.keys(clusterData.node);
                nodes.slice(0, 5).forEach((nodeId, nodeIndex) => {
                    const nodeData = clusterData.node[nodeId];
                    const nodeX = x - 80 + (nodeIndex * 30);
                    const nodeY = y + 100;

                    // Add node circle
                    svg.append("circle")
                        .attr("cx", nodeX)
                        .attr("cy", nodeY)
                        .attr("r", 8)
                        .attr("fill", "#2196F3")
                        .attr("stroke", "#1976D2")
                        .attr("stroke-width", 1);

                    // Add node name
                    svg.append("text")
                        .attr("x", nodeX)
                        .attr("y", nodeY + 20)
                        .attr("text-anchor", "middle")
                        .text(nodeData.name || nodeId.substring(0, 6))
                        .attr("fill", "#333")
                        .style("font-size", "8px");

                    // Add connection line
                    svg.append("line")
                        .attr("x1", x)
                        .attr("y1", y + 40)
                        .attr("x2", nodeX)
                        .attr("y2", nodeY - 8)
                        .attr("stroke", "#ccc")
                        .attr("stroke-width", 1);
                });
            }
        });

        // Add title
        svg.append("text")
            .attr("x", 600)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .text("ICOS Cluster Topology - Server Data")
            .attr("fill", "#333")
            .style("font-size", "18px")
            .style("font-weight", "bold");

        // Add subtitle
        svg.append("text")
            .attr("x", 600)
            .attr("y", 60)
            .attr("text-anchor", "middle")
            .text(`Showing ${clusters.length} clusters with real-time data`)
            .attr("fill", "#666")
            .style("font-size", "12px");

        console.log('Enhanced topology graph created successfully');

    }, [data]);

    return (
        <div style={{ padding: '20px' }}>
            {error && (
                <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
                    {error}
                </div>
            )}
            <div ref={svgRef} style={{ overflow: 'auto' }}></div>
        </div>
    );
};

export default SimpleTopologyGraph; 
