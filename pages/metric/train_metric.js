import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import config from '../../config.js';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#757FEF' : '#308fe8',
  },
}));

const TrainMetrics = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleTrain = async () => {
    setLoading(true);
    const token = Cookies.get('authToken');
    if (!token) {
      router.push('/authentication/sign-in/');
      return;
    }

    try {
      const response = await axios.post(`${config.controllerAddress}${config.apiEndpoints.metricsTrain}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'api_key': token
        },
        timeout: config.controllerTimeout
      });
      setSuccess('Training initiated successfully on ICOS server.');
    } catch (err) {
      console.error('Error starting training:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication error. Please login again.');
        router.push('/authentication/sign-in/');
      } else {
        setError(`Failed to start training: ${err.response?.data?.message || err.message}`);
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
        <h1>Train Metrics</h1>
        <p>ICOS Ecosystem Metrics Training</p>
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
            Train Metrics
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Click the button below to start training metrics on the ICOS server. This will initiate the training process for all available metrics.
        </Typography>

        {loading && <BorderLinearProgress sx={{ mb: 2 }} />}

        <Button
          variant="contained"
          color="primary"
          onClick={handleTrain}
          disabled={loading}
          size="large"
          sx={{ minWidth: '200px' }}
        >
          {loading ? 'Starting Training...' : 'Start Training'}
        </Button>

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

export default TrainMetrics;
