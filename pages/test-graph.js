import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TestGraph = () => {
    const svgRef = useRef();

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove();

        // Create a simple test graph
        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", 400)
            .attr("height", 300)
            .style("border", "1px solid black");

        // Add a simple circle
        svg.append("circle")
            .attr("cx", 200)
            .attr("cy", 150)
            .attr("r", 50)
            .attr("fill", "blue");

        // Add text
        svg.append("text")
            .attr("x", 200)
            .attr("y", 160)
            .attr("text-anchor", "middle")
            .text("D3.js Test")
            .attr("fill", "white");

        console.log("D3.js test graph created successfully");
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>D3.js Test Graph</h2>
            <div ref={svgRef}></div>
        </div>
    );
};

export default TestGraph; 