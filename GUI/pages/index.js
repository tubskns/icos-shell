import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import HierarchicalTopologyGraph from "@/components/HierarchicalTopologyGraph"; // Import the HierarchicalTopologyGraph component
import JobManagerView from "@/components/JobManagerView";
import config from "../config.js";

// Function to convert Job Manager data to HierarchicalTopologyGraph format
const convertJobManagerToTopology = (jobManagerData) => {
    if (!jobManagerData || !Array.isArray(jobManagerData)) {
        return { cluster: {} };
    }

    const clusters = {};
    
    jobManagerData.forEach((group, groupIndex) => {
        if (group.jobs && Array.isArray(group.jobs)) {
            group.jobs.forEach((job, jobIndex) => {
                const clustername = job.clustername || `cluster-${groupIndex}-${jobIndex}`;
                const agentId = job.icosagent || 'unknown-agent';
                const nodeName = job.nodename || `node-${jobIndex}`;
                
                // Create cluster if not exists
                if (!clusters[clustername]) {
                    clusters[clustername] = {
                        name: clustername,
                        type: job.type || 'Kubernetes',
                        icosAgentID: agentId,
                        node: {}
                    };
                }
                
                // Add node to cluster
                clusters[clustername].node[nodeName] = {
                    name: nodeName,
                    type: 'worker',
                    staticMetrics: {
                        state: job.state || 'unknown',
                        orchestrator: job.orchestrator || 'ocm',
                        namespace: job.namespace || 'default',
                        appName: group.appName || 'unknown',
                        jobName: job.name || 'unnamed'
                    },
                    dynamicMetrics: {
                        lastUpdated: new Date().toISOString(),
                        deploymentId: group.id,
                        jobId: job.id
                    }
                };
            });
        }
    });

    return { cluster: clusters };
};

export default function MainPage() {
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [hasRedirected, setHasRedirected] = useState(false);
    const router = useRouter();

    useEffect(() => {
        console.log("🔄 Starting authentication check...");
        if (hasRedirected) {
            console.log("⚠️ Already redirected, skipping auth check");
            return;
        }
        
        // Small delay to ensure any cookies from redirect are available
        setTimeout(() => {
            // Check if user is authenticated
            let authToken = Cookies.get("authToken");
            let authMethod = Cookies.get("authMethod");
            
            // Fallback to localStorage if cookies not found
            if (!authToken && typeof window !== 'undefined') {
                authToken = localStorage.getItem("authToken");
                authMethod = localStorage.getItem("authMethod");
                console.log("🔄 Using localStorage fallback");
            }

            console.log("🔍 Auth check - Token:", authToken ? `Present (${authToken.substring(0, 20)}...)` : "Missing");
            console.log("🔍 Auth check - Method:", authMethod);
            console.log("🔍 Auth check - All cookies:", document.cookie);

            if (!authToken) {
                console.log("❌ No token found, redirecting to sign-in");
                setHasRedirected(true);
                setIsAuthChecking(false);
                router.push("/authentication/sign-in");
                return;
            }

            console.log("✅ Token found, user is authenticated");
            setIsAuthChecking(false);
        }, 100);
    }, [router, hasRedirected]);

    useEffect(() => {
        if (isAuthChecking) return; // Wait for auth check to complete

        let authToken = Cookies.get("authToken");
        let authMethod = Cookies.get("authMethod");
        
        // Fallback to localStorage if cookies not found
        if (!authToken && typeof window !== 'undefined') {
            authToken = localStorage.getItem("authToken");
            authMethod = localStorage.getItem("authMethod");
            console.log("🔄 Data fetch using localStorage fallback");
        }

        if (!authToken) return; // Skip if no token

        // Shell base URL
        const serverUrl = config.controllerAddress;
        
        // Prepare headers based on authentication method
        let headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        };

        if (authMethod === "client_secret") {
            headers["client_secret"] = authToken;
        } else {
            headers["api_key"] = authToken;
        }

        const axiosConfig = {
            method: "get",
            url: `${serverUrl}${config.apiEndpoints.deployments}`,
            headers: {
                "api_key": authToken,
                "Content-Type": "application/json"
            }
        };

        console.log('Making request to:', axiosConfig.url);
        console.log('Using auth method:', authMethod);

        axios
            .request(axiosConfig)
            .then((response) => {
                console.log("✅ Data fetched successfully:", response.data);
                console.log("✅ Response status:", response.status);
                
                // Handle different response types
                if (response.status === 204 || response.data === null || response.data === undefined) {
                    // No content but successful connection
                    setData({ message: "Connected to ICOS server successfully - No deployments found", status: "no_data", deployments: [] });
                } else if (Array.isArray(response.data)) {
                    // Array response
                    setData({ message: "Deployments received from ICOS server", status: "success", deployments: response.data });
                } else if (typeof response.data === 'object') {
                    // Object response
                    setData({ message: "Data received from ICOS server", status: "success", ...response.data });
                } else {
                    // Other response types
                    setData({ message: "Data received from ICOS server", status: "success", raw: response.data });
                }
                setError("");
            })
            .catch((error) => {
                console.error("❌ Error fetching data:", error);
                if (error.response?.status === 401) {
                    setError("Authentication failed! Please login again.");
                    Cookies.remove("authToken");
                    Cookies.remove("authMethod");
                    router.push("/authentication/sign-in");
                } else if (error.code === 'ECONNREFUSED') {
                    setError("Server is not accessible. Please check your connection to ICOS server.");
                } else if (error.code === 'ECONNABORTED') {
                    setError("Connection timed out. ICOS server is not responding.");
                } else {
                    setError(`Failed to fetch data: ${error.response?.data?.error || error.message}`);
                }
            });
    }, [router, isAuthChecking]);

    return (
        <>
            {isAuthChecking ? (
                <div style={{ padding: "20px", textAlign: "center" }}>
                    <div style={{ display: "inline-block" }}>
                        <div style={{ 
                            border: "4px solid #f3f3f3", 
                            borderTop: "4px solid #3498db", 
                            borderRadius: "50%", 
                            width: "40px", 
                            height: "40px", 
                            animation: "spin 2s linear infinite",
                            margin: "0 auto 10px"
                        }}></div>
                        <p>🔐 Checking authentication...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Page title */}
                    <div className={styles.pageTitle}>
                        <h1>ICOS Ecosystem</h1>
                        <ul>
                            <li>
                                <Link href="/">Dashboard</Link>
                            </li>
                            <li>Topology of clusters</li>
                        </ul>
                    </div>

                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                        <Grid item xs={12}>
                            {data ? (
                                <div style={{ padding: '20px' }}>
                                    <div style={{
                                        background: data.status === 'no_data' ? '#fff3e0' : '#e8f5e8',
                                        border: `1px solid ${data.status === 'no_data' ? '#ff9800' : '#4caf50'}`,
                                        borderRadius: '4px',
                                        padding: '10px',
                                        marginBottom: '20px',
                                        color: data.status === 'no_data' ? '#f57c00' : '#2e7d32'
                                    }}>
                                        {data.status === 'no_data' ? '⚠️' : '✅'} <strong>{data.status === 'no_data' ? 'Connected!' : 'Success!'}</strong> {data.message}
                                    </div>
                                    
                                    {data.status === 'no_data' ? (
                                        <div style={{ textAlign: 'center', padding: '40px' }}>
                                            <h3>🔗 Connected to ICOS Ecosystem</h3>
                                            <p>Server is responding but no deployments are currently available.</p>
                                            <p>This means the connection is working correctly but no deployments are registered in the system yet.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {/* Convert Job Manager data to topology format and show original graph */}
                                            {Array.isArray(data) ? (
                                                <HierarchicalTopologyGraph data={convertJobManagerToTopology(data)} />
                                            ) : data.deployments && data.deployments.length > 0 ? (
                                                <div>
                                                    <HierarchicalTopologyGraph data={convertJobManagerToTopology(data.deployments)} />
                                                </div>
                                            ) : data.controllers && data.controllers.length > 0 ? (
                                                <div>
                                                    <p>Showing {data.controllers.length} controllers</p>
                                                    <HierarchicalTopologyGraph data={data} />
                                                </div>
                                            ) : data.cluster ? (
                                                <div>
                                                    <p>Showing {Object.keys(data.cluster).length} clusters</p>
                                                    <HierarchicalTopologyGraph data={data} />
                                                </div>
                                            ) : (
                                                <div>
                                                    <h3>ICOS Ecosystem</h3>
                                                    <HierarchicalTopologyGraph data={convertJobManagerToTopology(data)} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : error ? (
                                <div style={{ 
                                    color: "white", 
                                    backgroundColor: "#f44336", 
                                    padding: "20px", 
                                    borderRadius: "4px",
                                    margin: "20px"
                                }}>
                                    ❌ <strong>Error:</strong> {error}
                                </div>
                            ) : (
                                <div style={{ padding: "20px", textAlign: "center" }}>
                                    <div style={{ display: "inline-block" }}>
                                        <div style={{ 
                                            border: "4px solid #f3f3f3", 
                                            borderTop: "4px solid #3498db", 
                                            borderRadius: "50%", 
                                            width: "40px", 
                                            height: "40px", 
                                            animation: "spin 2s linear infinite",
                                            margin: "0 auto 10px"
                                        }}></div>
                                        <p>🔄 Connecting to ICOS server...</p>
                                        <p style={{ fontSize: "14px", color: "#666" }}>Fetching real-time data from ICOS Ecosystem</p>
                                    </div>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
}

