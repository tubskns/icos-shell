import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
const axios = require('axios');
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const ProjectCreate = () => {
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const router = useRouter();
    const controllerBaseUrl = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS;

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (!token) {
            router.push("/authentication/sign-in/");
        }
    }, [router]);

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log("submit_start");
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

            console.log(fileContent);

            const payload = {
                content: fileContent,
                fileName: file.name,
                fileType: file.type
            };

            const config = {
                method: 'post',
                url: `${controllerBaseUrl}/api/v3/deployment/`,
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': token
                },
                data: JSON.stringify(payload),
            };

            console.log(config);


            axios.request(config)
                .then((response) => {
                    console.log("success");
                    console.log(response);
                    setError("");
                    setOpenSnackbar(false);
                    // Optionally redirect or show a success message here
                })
                .catch((error) => {
                    console.log(error);
                    setError("Error while connecting to the component");
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
                    Upload Deployment File
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
                                Create Deployment
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

export default ProjectCreate;
