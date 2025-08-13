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
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#757FEF' : '#308fe8',
  },
}));

const MetricsDisplay = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      try {'${controllerBaseUrl}/api/v3/metrics/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(response.data);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load metrics.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
  };

  return (
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
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #EEF0F7',
          paddingBottom: '10px',
          marginBottom: '15px',
        }}
      >
        <Typography
          as="h3"
          sx={{
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          All Metrics
        </Typography>
      </Box>

      {loading ? (
        <BorderLinearProgress sx={{ marginBottom: '15px' }} />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 'none',
            maxHeight: '800px',
            overflowY: 'auto',
          }}
        >
          <Table
            sx={{ minWidth: 700 }}
            aria-label="metrics table"
          >
            <TableHead sx={{ background: '#F7FAFF' }}>
              <TableRow>
                <TableCell sx={{ fontSize: '13.5px' }}>Metric Name</TableCell>
                <TableCell sx={{ fontSize: '13.5px' }}>Value</TableCell>
                <TableCell sx={{ fontSize: '13.5px' }}>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {metrics.map((metric, index) => (
                <TableRow key={index}>
                  <TableCell>{metric.name ?? 'N/A'}</TableCell>
                  <TableCell>{metric.value ?? 'N/A'}</TableCell>
                  <TableCell>{metric.timestamp ?? 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default MetricsDisplay;
