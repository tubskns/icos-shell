import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Button,
    Switch,
    FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { linearProgressClasses } from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../config.js";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === "light" ? "#757FEF" : "#308fe8",
    },
}));

const AllProjects = () => {
    const [select, setSelect] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const router = useRouter();
    
    // Shell base URL
    const APIBaseUrl = config.controllerAddress;

    const handleChange = (event) => {
        setSelect(event.target.value);
    };

    const getAuthHeaders = () => {
        // Always use real server with dynamic authentication
        const authToken = Cookies.get("authToken");
        let headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        };

        if (authToken) headers["api_key"] = authToken;
        
        return headers;
    };

    const fetchDeployments = async () => {
        setLoading(true);
        setError("");
        
        try {
            const response = await axios.get(`${APIBaseUrl}${config.apiEndpoints.deployments}`, {
                headers: getAuthHeaders(),
                timeout: config.controllerTimeout
            });
            const data = response.data;
            console.log("✅ Deployments data:", data);
            setRows(Array.isArray(data) ? data : (data || []));
        } catch (err) {
            console.error("❌ Deployments fetch error:", err);
            
            if (err.response?.status === 401) {
                const errorMessage = "Authentication failed! Please login again.";
                setError(errorMessage);
                // Clear cookies and redirect to login
                Cookies.remove("authToken");
                Cookies.remove("authMethod");
                router.push("/authentication/sign-in/");
            } else if (err.code === 'ECONNREFUSED') {
                setError("Server is not accessible. Please check your connection to ICOS server.");
            } else if (err.code === 'ECONNABORTED') {
                setError("Connection timed out. ICOS server is not responding.");
            } else {
                const errorMessage = `Failed to fetch data from ICOS Shell. Error: ${err.response?.data?.error || err.message}`;
                setError(errorMessage);
            }
            
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeployments();
    }, []); // Fetch once on component mount

    // Error boundary for component
    if (!router) {
        return <div>Loading...</div>;
    }

    const handleAction = async (actionType, deploymentId) => {
        try {
            let url = '';
            if (actionType === 'start') url = `${APIBaseUrl}${config.apiEndpoints.startDeployment(deploymentId)}`;
            else if (actionType === 'stop') url = `${APIBaseUrl}${config.apiEndpoints.stopDeployment(deploymentId)}`;
            else if (actionType === 'delete') url = `${APIBaseUrl}${config.apiEndpoints.deploymentById(deploymentId)}`;
            const method = actionType === 'delete' ? 'delete' : 'put';

            await axios({ method, url, headers: getAuthHeaders(), timeout: config.controllerTimeout });
            alert(`${actionType.toUpperCase()} request sent successfully.`);
            fetchDeployments(); // Refresh data after action
        } catch (error) {
            console.error(`Failed to ${actionType} job:`, error);
            alert(`Failed to ${actionType} deployment. Please try again.`);
        }
    };

    return (
        <Card sx={{ boxShadow: "none", borderRadius: "10px", p: "25px", mb: "15px" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #EEF0F7",
                    paddingBottom: "10px",
                    marginBottom: "15px",
                }}
                className="for-dark-bottom-border"
            >
                <Typography as="h3" sx={{ fontSize: 18, fontWeight: 500 }}>
                    All Deployments
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="select-filter-label" sx={{ fontSize: "14px" }}>
                            Select
                        </InputLabel>
                        <Select
                            labelId="select-filter-label"
                            value={select}
                            label="Select"
                            onChange={handleChange}
                            sx={{ fontSize: "14px" }}
                        >
                            <MenuItem value={0}>Today</MenuItem>
                            <MenuItem value={1}>Last 7 Days</MenuItem>
                            <MenuItem value={2}>This Month</MenuItem>
                            <MenuItem value={3}>Last 12 Months</MenuItem>
                            <MenuItem value={4}>All Time</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Server Status */}

            {error && (
                <div style={{
                    background: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '4px',
                    padding: '10px',
                    marginBottom: '20px',
                    color: '#c62828'
                }}>
                    ❌ <strong>Error:</strong> {error}
                </div>
            )}
            
            {!loading && !error && rows.length > 0 && (
                <div style={{
                    background: '#e8f5e8',
                    border: '1px solid #4caf50',
                    borderRadius: '4px',
                    padding: '10px',
                    marginBottom: '20px',
                    color: '#2e7d32'
                }}>
                    ✅ <strong>Success!</strong> Deployment data loaded successfully
                </div>
            )}

            {!loading && !error && rows.length === 0 && (
                <div style={{
                    background: '#fff3e0',
                    border: '1px solid #ff9800',
                    borderRadius: '4px',
                    padding: '10px',
                    marginBottom: '20px',
                    color: '#e65100'
                }}>
                    📋 <strong>No Deployments Found</strong><br />
                    No deployments are currently available on the ICOS Server.<br />
                    You can upload a deployment using the Create Deployment page.
                </div>
            )}

            {!loading && !error && rows.length > 0 && (
                <div style={{
                    background: '#f3f3f3',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '15px',
                    marginBottom: '20px'
                }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Deployment Summary</h4>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div>
                            <strong>Total Deployments:</strong> {rows.length}
                        </div>
                        <div>
                            <strong>Total Jobs:</strong> {rows.reduce((total, deployment) => total + (deployment.jobs?.length || 0), 0)}
                        </div>
                        <div>
                            <strong>Deployed:</strong> {rows.reduce((total, deployment) => 
                                total + (deployment.jobs?.filter(job => job.state === 'deployed').length || 0), 0)}
                        </div>
                        <div>
                            <strong>Degraded:</strong> {rows.reduce((total, deployment) => 
                                total + (deployment.jobs?.filter(job => job.state === 'degraded').length || 0), 0)}
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <LinearProgress sx={{ marginBottom: "15px" }} />
            ) : rows.length === 0 ? (
                <div style={{
                    background: '#fff3e0',
                    border: '1px solid #ff9800',
                    borderRadius: '4px',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#e65100'
                }}>
                    📋 <strong>No Job Groups Found</strong><br />
                    No job groups are currently available from the ICOS Job Manager.
                </div>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: "none", maxHeight: "800px", overflowY: "auto" }}>
                    <Table sx={{ minWidth: 700 }} aria-label="deployments table" className="dark-table">
                        <TableHead sx={{ background: "#F7FAFF" }}>
                            <TableRow>
                                <TableCell sx={{ fontSize: "13.5px" }}>Namespace</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }}>Job Name</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }}>App Name</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }} align="center">Orchestrator</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }} align="center">State</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }} align="center">Cluster</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }} align="center">Node</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((rowData, index) =>
                                rowData.jobs?.map((job, jobIndex) => {
                                    const state = rowData.status || job.state;
                                    const deploymentId = rowData.id || job.deploymentId || job.id;

                                    return (
                                        <TableRow key={`${index}-${jobIndex}`}>
                                            <TableCell>{job.namespace ?? "N/A"}</TableCell>
                                            <TableCell>{job.name ?? "N/A"}</TableCell>
                                            <TableCell>{rowData.appName ?? "N/A"}</TableCell>
                                            <TableCell align="center">{job.orchestrator ?? "N/A"}</TableCell>
                                            <TableCell align="center">
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: 
                                                        state === 'deployed' ? '#4caf50' :
                                                        state === 'degraded' ? '#ff9800' :
                                                        state === 'starting' ? '#2196f3' :
                                                        state === 'stopping' ? '#f44336' :
                                                        '#9e9e9e',
                                                    color: 'white'
                                                }}>
                                                    {state?.toUpperCase() ?? "UNKNOWN"}
                                                </span>
                                            </TableCell>
                                            <TableCell align="center">{job.clustername ?? "N/A"}</TableCell>
                                            <TableCell align="center">{job.nodename ?? "N/A"}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        disabled={state === "deployed" || state === "starting"}
                                                        onClick={() => handleAction("start", deploymentId)}
                                                    >
                                                        Start
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        size="small"
                                                        disabled={state !== "deployed"}
                                                        onClick={() => handleAction("stop", deploymentId)}
                                                    >
                                                        Stop
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        disabled={state === "degraded"}
                                                        onClick={() => handleAction("delete", deploymentId)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

        </Card>
    );
};

export default AllProjects;

