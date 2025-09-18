import React, { useEffect, useState } from 'react'
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
const axios = require('axios');
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import config from '../../config.js';
import AuthManager from '../../utils/auth-manager.js';

const ProjectCreate = () => {
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    // Use config for server address
    const controllerAddress = config.controllerAddress;
    
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            await uploadDeployment(content, file.name);
        };
        reader.readAsText(file);
    };

    const uploadDeployment = async (content, filename) => {
        setIsLoading(true);
        setError("");

        try {
            // Use AuthManager for automatic token handling
            await AuthManager.apiCallWithTokenRefresh(async (token) => {
                const authMethod = Cookies.get("authMethod") || "api_key";
                
                // Prepare headers based on authentication method  
                let headers = {
                    "Content-Type": "application/json"
                };

                // Use api_key header format as per project CLI convention
                headers["api_key"] = token;

                console.log("Uploading to:", controllerAddress);
                console.log("Headers:", headers);
                console.log("Content length:", content.length);

                const response = await axios.post(
                    `${controllerAddress}/deployment/`,
                    {
                        content: content,
                        filename: filename
                    },
                    {
                        headers: headers,
                        timeout: 10000
                    }
                );

                console.log("Upload response:", response.data);

                if (response.data.success || response.status === 201 || response.status === 200) {
                    setOpenSnackbar(true);
                    setError("");
                    // Redirect to projects page after successful upload
                    setTimeout(() => {
                        router.push('/projects');
                    }, 2000);
                    return response;
                } else {
                    throw new Error("Upload failed");
                }
            });

        } catch (err) {
            console.error("Upload error:", err);
            console.error("Error response:", err.response?.data);
            
            let errorMessage = "Error while connecting to the component";
            
            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.code === 'ECONNREFUSED') {
                errorMessage = "No response from server. Please check if the API server is running.";
            } else if (err.code === 'ENOTFOUND') {
                errorMessage = "Cannot connect to server. Please check the server address.";
            } else if (err.response?.status === 401) {
                errorMessage = "Authentication failed. Token has been automatically refreshed, please try again.";
            } else if (err.response?.status === 403) {
                errorMessage = "Access denied. You don't have permission to upload deployments.";
            } else if (err.response?.status === 400) {
                errorMessage = "Invalid deployment file. Please check the YAML format.";
            } else if (err.message?.includes('JWT') || err.message?.includes('token')) {
                errorMessage = "Token error resolved automatically. Please try uploading again.";
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>Create Deployment</h1>
                <ul>
                    <li>
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/projects">Projects</Link>
                    </li>
                    <li>Create Deployment</li>
                </ul>
            </div>

            <Card sx={{ boxShadow: "none", borderRadius: "10px", p: "25px", mb: "15px" }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Upload Deployment File
                    </Typography>
                    

                    {error && (
                        <div style={{
                            background: '#ffebee',
                            border: '1px solid #f44336',
                            borderRadius: '4px',
                            padding: '15px',
                            marginBottom: '20px',
                            color: '#c62828'
                        }}>
                            ❌ <strong>Error:</strong> {error}
                        </div>
                    )}

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ 
                                border: '2px dashed #ccc', 
                                borderRadius: '8px', 
                                p: 3, 
                                textAlign: 'center',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <input
                                    accept=".yml,.yaml"
                                    style={{ display: 'none' }}
                                    id="deployment-file-upload"
                                    type="file"
                                    onChange={handleFileUpload}
                                    disabled={isLoading}
                                />
                                <label htmlFor="deployment-file-upload">
                                    <Button
                                        variant="contained"
                                        component="span"
                                        startIcon={<AddIcon />}
                                        disabled={isLoading}
                                        sx={{ mb: 2 }}
                                    >
                                        {isLoading ? "Creating..." : "Choose YAML File"}
                                    </Button>
                                </label>
                                <Typography variant="body2" color="textSecondary">
                                    Upload a Kubernetes YAML deployment file (.yml or .yaml)
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Box sx={{ 
                                backgroundColor: '#f5f5f5', 
                                p: 2, 
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    📋 Instructions
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    1. Prepare your ICOS application descriptor YAML file
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    2. Click "Choose YAML File" button
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    3. Select your deployment descriptor file
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    4. File will be uploaded to ICOS Server
                                </Typography>
                                <Typography variant="body2">
                                    5. Check Projects page to see your deployment
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Card>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    Deployment created successfully! Redirecting to Projects page...
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProjectCreate;
