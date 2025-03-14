import React, { useEffect, useState } from "react";
import { Box, Card, Typography, InputLabel, MenuItem, FormControl, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import DeployRowComponent from './DeployRowComponent'; // Adjust the import path as needed

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

const AllProjects = () => {
    const [select, setSelect] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // New loading state
    const router = useRouter();
    const [rows, setRows] = useState([]);
    const controllerBaseUrl = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS;

    const handleChange = (event) => {
        setSelect(event.target.value);
    };

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (!token) {
            router.push("/authentication/sign-in/");
        } else {
            setLoading(true); // Start loading
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${controllerBaseUrl}/api/v3/deployment/`,
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': token
                }
            };

            axios.request(config)
                .then((response) => {
                    console.log("Deployment:", response.data);
                    setRows(response.data); // Update rows with response data
                })
                .catch((error) => {
                    console.error(error);
                    setError("Failed to fetch deployments.");
                })
                .finally(() => setLoading(false)); // End loading
        }
    }, [router]);

    return (
        <>
            <Card
                sx={{
                    boxShadow: "none",
                    borderRadius: "10px",
                    p: "25px",
                    mb: "15px",
                }}
            >
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
                    <Typography
                        as="h3"
                        sx={{
                            fontSize: 18,
                            fontWeight: 500,
                        }}
                    >
                        All Deployments
                    </Typography>
                    <Box>
                        <FormControl sx={{ minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small" sx={{ fontSize: "14px" }}>
                                Select
                            </InputLabel>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={select}
                                label="Select"
                                onChange={handleChange}
                                sx={{ fontSize: "14px" }}
                            >
                                <MenuItem value={0} sx={{ fontSize: "14px" }}>
                                    Today
                                </MenuItem>
                                <MenuItem value={1} sx={{ fontSize: "14px" }}>
                                    Last 7 Days
                                </MenuItem>
                                <MenuItem value={2} sx={{ fontSize: "14px" }}>
                                    This Month
                                </MenuItem>
                                <MenuItem value={3} sx={{ fontSize: "14px" }}>
                                    Last 12 Months
                                </MenuItem>
                                <MenuItem value={4} sx={{ fontSize: "14px" }}>
                                    All Time
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {loading ? ( // Show loading indicator while data is being fetched
                    <LinearProgress sx={{ marginBottom: "15px" }} />
                ) : (
                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: "none",
                            maxHeight: "800px",
                            overflowY: "auto",
                        }}
                    >
                        <Table
                            sx={{ minWidth: 700 }}
                            aria-label="simple table"
                            className="dark-table"
                        >
                            <TableHead sx={{ background: "#F7FAFF" }}>
                                <TableRow>
                                    <TableCell sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px" }}>
                                        Namespace
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px" }}>
                                        Job Group Name
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px" }} align="center">
                                        Orchestrator
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px" }} align="center">
                                        State
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px" }} align="right">
                                        Targets
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody id="table-body">
                                {rows.map((rowData, index) =>
                                    rowData.jobs.map((job, jobIndex) => (
                                        <TableRow key={`${index}-${jobIndex}`}>
                                            <TableCell>{job.namespace ?? "N/A"}</TableCell>
                                            <TableCell>{rowData.appName ?? "N/A"}</TableCell>
                                            <TableCell align="center">{job.orchestrator ?? "N/A"}</TableCell>
                                            <TableCell align="center">{job.state ?? "N/A"}</TableCell>
                                            <TableCell align="right">{job.targets?.cluster_name ?? "N/A"}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>
        </>
    );
};

export default AllProjects;
