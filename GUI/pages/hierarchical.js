import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import styles from '@/styles/PageTitle.module.css';
import HierarchicalView from '@/components/HierarchicalView';
import JobManagerView from '@/components/JobManagerView';
import config from '../config.js';

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
import {
    Box,
    Card,
    Typography,
    LinearProgress,
    Alert,
    Button
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const HierarchicalPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const fetchData = async () => {
        // Check if user is authenticated
        const authToken = Cookies.get("authToken");
        const authMethod = Cookies.get("authMethod");

        if (!authToken) {
            router.push("/authentication/sign-in");
            return;
        }

        setLoading(true);
        setError('');

        try {
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

            await axios.request(axiosConfig)
                .then((response) => {
                    console.log("✅ Hierarchical data:", response.data);
                    setData(response.data);
                    setError("");
                })
                .catch((error) => {
                    console.error("❌ Error fetching hierarchical data:", error);
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
                        setError(`Failed to fetch hierarchical data: ${error.response?.data?.error || error.message}`);
                    }
                });
        } catch (err) {
            console.error("Data fetch error:", err);
            if (err.response?.status === 401) {
                // Token expired, redirect to login
                Cookies.remove("authToken");
                Cookies.remove("authMethod");
                router.push("/authentication/sign-in");
            } else {
                setError("Failed to fetch hierarchical data from server. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [router]);

    const handleRefresh = () => {
        fetchData();
    };

    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>Hierarchical View</h1>
                <ul>
                    <li>
                        <a href="/">Dashboard</a>
                    </li>
                    <li>Hierarchical View</li>
                </ul>
            </div>

            {/* Success Message */}
            {!loading && !error && data && (
                <Alert 
                    severity="success" 
                    sx={{ mb: 2 }}
                    action={
                        <Button 
                            color="inherit" 
                            size="small" 
                            onClick={handleRefresh}
                            startIcon={<RefreshIcon />}
                        >
                            Refresh
                        </Button>
                    }
                >
                    ✅ Real hierarchical data is being displayed from ICOS Ecosystem
                </Alert>
            )}

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    ❌ {error}
                </Alert>
            )}

            {/* Loading */}
            {loading && (
                <Box sx={{ mb: 2 }}>
                    <LinearProgress />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        Loading hierarchical data...
                    </Typography>
                </Box>
            )}

            {/* Hierarchical View */}
            {!loading && data && (
                Array.isArray(data) ? (
                    <HierarchicalView data={convertJobManagerToTopology(data)} />
                ) : (
                    <HierarchicalView data={data} />
                )
            )}

            {/* No Data */}
            {!loading && !error && !data && (
                <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No hierarchical data available
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={handleRefresh}
                        sx={{ mt: 2 }}
                        startIcon={<RefreshIcon />}
                    >
                        Refresh Data
                    </Button>
                </Card>
            )}
        </>
    );
};

export default HierarchicalPage; 