import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import styles from '@/styles/PageTitle.module.css';
import config from '../../config.js';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    LinearProgress, 
    Typography,
    Box,
    Alert,
    Button,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const Controllers = () => {
    const [controllersData, setControllersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    const fetchControllers = async () => {
        // Check if user is authenticated
        const authToken = Cookies.get("authToken");
        const authMethod = Cookies.get("authMethod");

        if (!authToken) {
            router.push("/authentication/sign-in/");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Use lighthouseAddress for controllers, fall back to controllerAddress if not set
            const baseUrl = config.lighthouseAddress || config.controllerAddress;
            const axiosConfig = {
                method: 'get',
                url: `${baseUrl}${config.apiEndpoints.controllers}`,
                headers: { 'Content-Type': 'application/json', 'api_key': authToken },
                timeout: config.controllerTimeout
            };

            const response = await axios(axiosConfig);
            console.log("✅ Controllers data:", response.data);
            setControllersData(response.data || []);
            setError("");
        } catch (err) {
            console.error("❌ Error fetching controllers:", err);
            if (err.response && err.response.status === 204) {
                // 204 No Content means no controllers available
                setControllersData([]);
                setError("");
            } else if (err.response?.status === 401) {
                setError("Authentication failed! Please login again.");
                Cookies.remove("authToken");
                Cookies.remove("authMethod");
                router.push("/authentication/sign-in/");
            } else if (err.code === 'ECONNREFUSED') {
                setError("Server is not accessible. Please check your connection to ICOS server.");
            } else if (err.code === 'ECONNABORTED') {
                setError("Connection timed out. ICOS server is not responding.");
            } else {
                setError(`Failed to fetch controllers: ${err.response?.data?.error || err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (router) {
            fetchControllers();
        }
    }, [router]);

    // Early return if router is not ready
    if (!router) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>Controllers</h1>
                <ul>
                    <li>
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li>Controllers</li>
                </ul>
            </div>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Success Message */}

            {/* Loading State */}
            {loading && (
                <Box sx={{ mb: 2 }}>
                    <LinearProgress />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        Loading controllers data...
                    </Typography>
                </Box>
            )}

            {/* No Data Message */}
            {!loading && !error && controllersData.length === 0 && (
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" align="center">
                            No Controllers Available
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                            There are currently no controllers registered in the ICOS Ecosystem.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                            Controllers will appear here once they are added to the system.
                        </Typography>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={fetchControllers}
                                size="small"
                            >
                                Check Again
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Controllers Table */}
            {!loading && !error && controllersData.length > 0 && (
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" color="primary">
                                Controllers ({controllersData.length} controllers)
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={fetchControllers}
                                size="small"
                            >
                                Refresh
                            </Button>
                        </Box>

                        <TableContainer component={Paper} elevation={1}>
                            <Table sx={{ minWidth: 650 }} aria-label="controllers table">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Version</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {controllersData.map((controller, index) => (
                                        <TableRow 
                                            key={index}
                                            hover
                                            sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                    {controller.name || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#666' }}>
                                                    {controller.address || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 'bold',
                                                        color: controller.status === 'active' ? '#4caf50' : '#f57c00'
                                                    }}
                                                >
                                                    {controller.status || 'Unknown'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {controller.type || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {controller.version || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {/* Controllers Summary */}
            {!loading && !error && controllersData.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="primary">
                                    {controllersData.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Controllers
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="success.main">
                                    {controllersData.filter(c => c.status === 'active').length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Active Controllers
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="warning.main">
                                    {controllersData.filter(c => c.status !== 'active').length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Inactive Controllers
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="info.main">
                                    {new Set(controllersData.map(c => c.type)).size}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Controller Types
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </>
    );
}

// Error wrapper component
const ControllersWithErrorHandling = () => {
    try {
        return <Controllers />;
    } catch (error) {
        console.error('Error in Controllers component:', error);
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                background: '#fff3e0',
                border: '1px solid #ff9800',
                borderRadius: '8px',
                margin: '20px'
            }}>
                <h2>Error Loading Controllers</h2>
                <p>There was an error loading the controllers page. Please try refreshing.</p>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '10px 20px',
                        background: '#ff9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Refresh
                </button>
            </div>
        );
    }
};

export default ControllersWithErrorHandling;
