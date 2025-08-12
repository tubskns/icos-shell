import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Button,
    Alert,
    Chip,
    Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { linearProgressClasses } from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../config.js";
import { Refresh as RefreshIcon } from '@mui/icons-material';

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

const AllMetrics = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [metricsData, setMetricsData] = useState(null);
    const router = useRouter();

    const fetchMetrics = () => {
        const token = Cookies.get("authToken");
        if (!token) {
            router.push("/authentication/sign-in/");
            return;
        }

        setLoading(true);
        setError("");

        axios
            .get(`${config.controllerAddress}${config.apiEndpoints.metricsGet}` , {
                headers: {
                    "Content-Type": "application/json",
                    "api_key": token
                },
            })
            .then((response) => {
                console.log("Metrics data:", response.data);
                setMetricsData(response.data);
            })
            .catch((err) => {
                console.error("Error fetching metrics:", err);
                if (err.response && err.response.status === 401) {
                    setError("Authentication error. Please login again.");
                    router.push("/authentication/sign-in/");
                } else {
                    setError("Failed to fetch metrics from ICOS server.");
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (router) {
            fetchMetrics();
        }
    }, [router]);

    const handleAction = async (actionType, metricId) => {
        try {
            const token = Cookies.get("authToken");
            let endpoint = "";
            
            // Map action types to Intelligence service endpoints
            switch(actionType) {
                case 'predict':
                    endpoint = config.apiEndpoints.metricsPredict;
                    break;
                case 'delete':
                    endpoint = config.apiEndpoints.metricsDelete;
                    break;
                default:
                    throw new Error(`Unknown action type: ${actionType}`);
            }
            
            await axios.post(`${config.controllerAddress}${endpoint}`, { 
                metric_id: metricId 
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "api_key": token
                },
            });
            alert(`${actionType.toUpperCase()} request sent successfully.`);
            fetchMetrics();
        } catch (error) {
            console.error(`Failed to ${actionType} metric:`, error);
            alert(`Failed to ${actionType} metric. Please try again.`);
        }
    };

    const handleRefresh = () => {
        fetchMetrics();
    };

    // Convert models_list object to array for table display
    const metricsArray = metricsData?.models_list ? 
        Object.entries(metricsData.models_list).map(([id, name]) => ({
            id,
            name,
            type: 'ML Model',
            status: 'active'
        })) : [];

    if (!router) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {/* Success Message */}
            {!loading && !error && metricsData && (
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
                    ✅ Real metrics data is being displayed from ICOS Ecosystem
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
                    <BorderLinearProgress />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        Loading metrics data...
                    </Typography>
                </Box>
            )}

            {/* Metrics Summary Cards */}
            {!loading && !error && metricsData && (
                <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h4" color="primary">
                                    {metricsData.models_count || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Models
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h4" color="success.main">
                                    {metricsArray.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Active Models
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h4" color="info.main">
                                    {new Set(metricsArray.map(m => m.name.split('_')[0])).size}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Model Types
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Metrics Table */}
            {!loading && !error && metricsArray.length > 0 && (
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
                            ML Models ({metricsArray.length} models)
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={handleRefresh}
                            size="small"
                        >
                            Refresh
                        </Button>
                    </Box>

                    <TableContainer component={Paper} sx={{ boxShadow: "none", maxHeight: "800px", overflowY: "auto" }}>
                        <Table sx={{ minWidth: 650 }} aria-label="metrics table" className="dark-table">
                            <TableHead sx={{ background: "#F7FAFF" }}>
                                <TableRow>
                                    <TableCell sx={{ fontSize: "13.5px", fontWeight: "bold" }}>Model ID</TableCell>
                                    <TableCell sx={{ fontSize: "13.5px", fontWeight: "bold" }}>Model Name</TableCell>
                                    <TableCell sx={{ fontSize: "13.5px", fontWeight: "bold" }}>Type</TableCell>
                                    <TableCell sx={{ fontSize: "13.5px", fontWeight: "bold" }}>Status</TableCell>
                                    <TableCell sx={{ fontSize: "13.5px", fontWeight: "bold" }}>Category</TableCell>
                                    <TableCell sx={{ fontSize: "13.5px", fontWeight: "bold" }} align="center">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {metricsArray.map((metric, index) => {
                                    const modelName = metric.name;
                                    const category = modelName.split('_')[0] || 'Unknown';
                                    
                                    return (
                                        <TableRow key={index} hover>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#666' }}>
                                                    {metric.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                    {modelName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {metric.type}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={metric.status} 
                                                    color="success" 
                                                    size="small"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={category} 
                                                    variant="outlined" 
                                                    size="small"
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => handleAction("predict", metric.id)}
                                                    >
                                                        Predict
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleAction("delete", metric.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {/* No Metrics Available */}
            {!loading && !error && (!metricsData || metricsArray.length === 0) && (
                <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No Metrics Available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        There are currently no metrics registered in the ICOS Ecosystem.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<RefreshIcon />} 
                            onClick={handleRefresh}
                        >
                            Check Again
                        </Button>
                    </Box>
                </Card>
            )}
        </>
    );
};

export default AllMetrics;
