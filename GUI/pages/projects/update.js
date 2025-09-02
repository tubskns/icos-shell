import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import axios from 'axios';
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import config from '../../config.js';

const DeploymentUpdate = () => {
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const router = useRouter();
    const { deploymentId } = router.query;

    const controllerBaseUrl = config.controllerAddress;

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (!token) {
            router.push("/authentication/sign-in/");
        }
    }, [router]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = Cookies.get('authToken');

        if (!token) {
            setError("Authorization token is missing.");
            setOpenSnackbar(true);
            return;
        }

        const fileInput = event.target.elements.deploymentFile;
        if (fileInput.files.length === 0) {
            setError("No file selected.");
            setOpenSnackbar(true);
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const fileContent = reader.result;

            const payload = {
                content: fileContent,
                fileName: file.name,
                fileType: file.type
            };

            const axiosConfig = {
                method: 'put',
                url: `${controllerBaseUrl}/api/v3/deployment/${deploymentId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': token
                },
                data: JSON.stringify(payload),
            };

            axios.request(axiosConfig)
                .then((response) => {
                    console.log("Update success", response);
                    setError("");
                    setOpenSnackbar(false);
                    // Optionally redirect or show a success message
                })
                .catch((error) => {
                    console.error("Update failed", error);
                    setError("Error while updating the deployment.");
                    setOpenSnackbar(true);
                });
        };

        reader.onerror = () => {
            setError("Failed to read the file.");
            setOpenSnackbar(true);
        };

        reader.readAsText(file);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <div className={styles.pageTitle}>
                <h1>Update Deployment</h1>
                <ul>
                    <li>
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li>Update Deployment</li>
                </ul>
            </div>

            <Card sx={{ boxShadow: "none", borderRadius: "10px", p: 3, mb: 3 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
                    Upload New Deployment File
                </Typography>

                <Box component="form" noValidate onSubmit={handleSubmit}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                name="deploymentFile"
                                accept=".yaml, .yml"
                                required
                                style={{ display: 'block', marginBottom: '15px' }}
                            />
                        </Grid>

                        <Grid item xs={12} textAlign="end">
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    textTransform: "capitalize",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    fontSize: "13px",
                                    padding: "12px 20px",
                                    color: "#fff !important",
                                }}
                            >
                                <SaveIcon sx={{ position: "relative", top: "-2px" }} />{" "}
                                Update Deployment
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
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

export default DeploymentUpdate;
