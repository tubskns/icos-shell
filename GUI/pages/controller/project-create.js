import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
const axios = require('axios');
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import config from '../../config.js';
import AuthManager from '../../utils/auth-manager.js';

const RichTextEditor = dynamic(() => import('@mantine/rte'), {
    ssr: false,
});

const ProjectCreate = () => {
    const [error, setError] = useState(""); // State for managing the error message
    const [data, setData] = useState(null); // State for storing the fetched data
    const [priority, setPriority] = useState(''); // State for the select input
    const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar visibility
    const router = useRouter(); // Next.js router for navigation

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (!token) {
            router.push("/authentication/sign-in/");
        }
    }, [router]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Use AuthManager for automatic token handling
            await AuthManager.apiCallWithTokenRefresh(async (token) => {
                const formData = new FormData(event.target);
                const axiosConfig = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${config.controllerAddress}/api/v3/deployment/`,
                    headers: {
                        'api_key': token
                        // Content-Type will be set automatically for FormData
                    },
                    data: formData,
                };

                const response = await axios.request(axiosConfig);
                setData(response.data); // Set the fetched data
                setError(""); // Clear error if the request succeeds
                setOpenSnackbar(false); // Close Snackbar if successful
                return response;
            });
        } catch (error) {
            console.log(error);
            setError("Error while connecting to the component"); // Set the error message
            setOpenSnackbar(true); // Open Snackbar to show error
        }
    };

    const handleChange = (event) => {
        setPriority(event.target.value);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false); // Close the Snackbar
    };

    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>Deployment Create</h1>
                <ul>
                    <li>
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li>Deployment Create</li>
                </ul>
            </div>

            <Card
                sx={{
                    boxShadow: "none",
                    borderRadius: "10px",
                    p: "25px 20px 15px",
                    mb: "15px",
                }}
            >
                <Typography
                    as="h3"
                    sx={{
                        fontSize: 18,
                        fontWeight: 500,
                        mb: '15px',
                    }}
                >
                    Create Deployment
                </Typography>

                <Box component="form" noValidate onSubmit={handleSubmit}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography
                                as="h5"
                                sx={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    mb: "12px",
                                }}
                            >
                                Deployment Name
                            </Typography>
                            <TextField
                                autoComplete="project-name"
                                name="projectName"
                                required
                                fullWidth
                                id="projectName"
                                label="Deployment Name"
                                autoFocus
                                InputProps={{
                                    style: { borderRadius: 8 },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={12} lg={6}>
                            <Typography
                                as="h5"
                                sx={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    mb: "12px",
                                }}
                            >
                                ID
                            </Typography>
                            <TextField
                                autoComplete="id"
                                name="id"
                                required
                                fullWidth
                                id="id"
                                label="Enter ID"
                                InputProps={{
                                    style: { borderRadius: 8 },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={12} lg={6}>
                            <Typography
                                as="h5"
                                sx={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    mb: "12px",
                                }}
                            >
                                Status
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    id="status-select"
                                    value={priority}
                                    label="Status"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={'working'}>Working</MenuItem>
                                    <MenuItem value={'ended'}>Ended</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} textAlign="end">
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    mt: 1,
                                    textTransform: "capitalize",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    fontSize: "13px",
                                    padding: "12px 20px",
                                    color: "#fff !important",
                                }}
                            >
                                <AddIcon
                                    sx={{
                                        position: "relative",
                                        top: "-2px",
                                    }}
                                    className="mr-5px"
                                />{" "}
                                Create Project
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>

            {/* Snackbar for error */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000} // Snackbar will auto-close after 6 seconds
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProjectCreate;
