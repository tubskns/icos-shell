import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import config from '../../../config.js';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#757FEF' : '#308fe8',
  },
}));

const MetricCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    unit: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const token = Cookies.get('authToken');
    if (!token) {
      router.push('/authentication/sign-in/');
      return;
    }

    try {
      const response = await axios.post(`${config.controllerAddress}${config.apiEndpoints.metricsPredict}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'api_key': token
        },
      });
      setSuccess('Metric created successfully on ICOS server.');
      setFormData({
        name: '',
        description: '',
        type: '',
        unit: '',
      });
    } catch (err) {
      console.error('Error creating metric:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication error. Please login again.');
        router.push('/authentication/sign-in/');
      } else {
        setError(`Failed to create metric: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSuccess('');
    setError('');
  };

  return (
    <>
      {/* Page title */}
      <div style={{ marginBottom: '20px' }}>
        <h1>Create Metric</h1>
        <p>ICOS Ecosystem Metric Creation</p>
      </div>

      <Card
        sx={{
          boxShadow: 'none',
          borderRadius: '10px',
          p: '25px',
          mb: '15px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #EEF0F7',
            pb: '10px',
            mb: '15px',
          }}
        >
          <Typography
            as="h3"
            sx={{
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            Create New Metric
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Fill in the form below to create a new metric in the ICOS Ecosystem.
        </Typography>

        {loading && <BorderLinearProgress sx={{ mb: 2 }} />}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Metric Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Metric Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ mb: 2 }}
                placeholder="e.g., counter, gauge, histogram"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mb: 2 }}
                placeholder="e.g., seconds, bytes, percentage"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 3 }}
                placeholder="Describe what this metric measures..."
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !formData.name || !formData.type}
            size="large"
            sx={{ minWidth: '200px' }}
          >
            {loading ? 'Creating Metric...' : 'Create Metric'}
          </Button>
        </form>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={success ? 'success' : 'error'}
            sx={{ width: '100%' }}
          >
            {success || error}
          </Alert>
        </Snackbar>
      </Card>
    </>
  );
};

export default MetricCreate;

