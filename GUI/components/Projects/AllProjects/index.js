import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { linearProgressClasses } from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

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
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const router = useRouter();
    const APIBaseUrl = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS;

    const handleChange = (event) => {
        setSelect(event.target.value);
    };

    const fetchDeployments = () => {
        const token = Cookies.get('authToken');
        if (!token) {
            router.push("/authentication/sign-in/");
            return;
        }

        setLoading(true);
        axios.get(`${APIBaseUrl}/api/v3/deployment/`, {
            headers: {
                'Content-Type': 'application/json',
                'api_key': token
            }
        })
        .then((response) => {
            console.log(response.data);
            setRows(response.data || []);
        })
        .catch((err) => {
            console.error(err);
            setError("Failed to fetch deployments.");
        })
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDeployments();
    }, [router]);

    const handleAction = async (actionType, jobId) => {
        try {
            await axios.post(`${APIBaseUrl}/deployments/${actionType}/${jobId}`, {}, {
                headers: {
                    'api_key': Cookies.get('authToken')
                }
            });
            alert(`${actionType.toUpperCase()} request sent.`);
            fetchDeployments(); // Refresh data after action
        } catch (error) {
            console.error(`Failed to ${actionType} job:`, error);
            alert(`Failed to ${actionType} deployment.`);
        }
    };

    return (
        <Card sx={{ boxShadow: "none", borderRadius: "10px", p: "25px", mb: "15px" }}>
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
                <Typography as="h3" sx={{ fontSize: 18, fontWeight: 500 }}>
                    All Deployments
                </Typography>
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="select-filter-label" sx={{ fontSize: "14px" }}>
                        Select
                    </InputLabel>
                    <Select
                        labelId="select-filter-label"
                        value={select}
                        label="Select"
                        onChange={handleChange}
                        sx={{ fontSize: "14px" }}
                    >
                        <MenuItem value={0}>Today</MenuItem>
                        <MenuItem value={1}>Last 7 Days</MenuItem>
                        <MenuItem value={2}>This Month</MenuItem>
                        <MenuItem value={3}>Last 12 Months</MenuItem>
                        <MenuItem value={4}>All Time</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <LinearProgress sx={{ marginBottom: "15px" }} />
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: "none", maxHeight: "800px", overflowY: "auto" }}>
                    <Table sx={{ minWidth: 700 }} aria-label="deployments table" className="dark-table">
                        <TableHead sx={{ background: "#F7FAFF" }}>
                            <TableRow>
                                <TableCell sx={{ fontSize: "13.5px" }}>Namespace</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }}>Job Group Name</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }} align="center">Orchestrator</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }} align="center">State</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }} align="right">Targets</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((rowData, index) =>
                                rowData.jobs?.map((job, jobIndex) => {
                                    const state = job.state;
                                    const jobId = job.ID;

                                    return (
                                        <TableRow key={`${index}-${jobIndex}`}>
                                            <TableCell>{job.namespace ?? "N/A"}</TableCell>
                                            <TableCell>{rowData.appName ?? "N/A"}</TableCell>
                                            <TableCell align="center">{job.orchestrator ?? "N/A"}</TableCell>
                                            <TableCell align="center">{state ?? "N/A"}</TableCell>
                                            <TableCell align="right">{job.targets?.cluster_name ?? "N/A"}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        disabled={state === "starting"}
                                                        onClick={() => handleAction("start", jobId)}
                                                    >
                                                        Start
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        size="small"
                                                        disabled={state !== "starting"}
                                                        onClick={() => handleAction("stop", jobId)}
                                                    >
                                                        Stop
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        disabled={state !== "stopping"}
                                                        onClick={() => handleAction("delete", jobId)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Card>
    );
};

export default AllProjects;

