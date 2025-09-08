import React, { useEffect, useState } from 'react';
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
  Alert,
  Button,
  Chip,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import config from '../../config.js';
import Cookies from 'js-cookie';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#757FEF' : '#308fe8',
  },
}));

const MetricsDisplay = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchMetrics = async () => {
    setLoading(true);
    
    // Check if user is authenticated
    const authToken = Cookies.get("authToken");
    const authMethod = Cookies.get("authMethod");

    console.log("🔍 Metrics: Checking authentication...");
    console.log("🔍 Token present:", authToken ? "YES" : "NO");
    console.log("🔍 Auth method:", authMethod);

    if (!authToken) {
      console.log("❌ No token found, redirecting to login");
      router.push("/authentication/sign-in");
      return;
    }
    
    try {
      const response = await axios.get(
        `${config.controllerAddress}${config.apiEndpoints.metricsGet}`,
        {
          headers: {
            "api_key": authToken,
            "Content-Type": "application/json"
          },
          timeout: config.controllerTimeout
        }
      );
      console.log('✅ Metrics API Success!');
      console.log('📊 Response data:', response.data);
      console.log('📊 Models count:', response.data.models_count);
      
      setMetricsData(response.data);
    } catch (err) {
      console.error('❌ Error fetching metrics:', err);
      if (err.response?.status === 401) {
        setError("Authentication failed! Please login again.");
        Cookies.remove("authToken");
        Cookies.remove("authMethod");
        router.push("/authentication/sign-in");
      } else if (err.code === 'ECONNREFUSED') {
        setError("Server is not accessible. Please check your connection to ICOS server.");
      } else if (err.code === 'ECONNABORTED') {
        setError("Connection timed out. ICOS server is not responding.");
      } else {
        setError(`Failed to load metrics: ${err.response?.data?.error || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router) {
      fetchMetrics();
    }
  }, [router]);



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
      {/* Page title */}
      <div style={{ marginBottom: '20px' }}>
        <h1>Metrics</h1>
        <p>ICOS Ecosystem Metrics Management</p>
      </div>

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
        <Card sx={{ boxShadow: 'none', borderRadius: '10px', p: '25px', mb: '15px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #EEF0F7',
              paddingBottom: '10px',
              marginBottom: '15px',
            }}
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

          <TableContainer
            component={Paper}
            sx={{
              boxShadow: 'none',
              maxHeight: '800px',
              overflowY: 'auto',
            }}
          >
            <Table sx={{ minWidth: 700 }} aria-label="metrics table">
              <TableHead sx={{ background: '#F7FAFF' }}>
                <TableRow>
                  <TableCell sx={{ fontSize: '13.5px', fontWeight: 'bold' }}>Model ID</TableCell>
                  <TableCell sx={{ fontSize: '13.5px', fontWeight: 'bold' }}>Model Name</TableCell>
                  <TableCell sx={{ fontSize: '13.5px', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontSize: '13.5px', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontSize: '13.5px', fontWeight: 'bold' }}>Category</TableCell>
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

export default MetricsDisplay;
