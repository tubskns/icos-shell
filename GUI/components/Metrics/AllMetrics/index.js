import React, { useEffect, useState } from "react";
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

const AllMetrics = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState([]);
    const router = useRouter();
    const APIBaseUrl = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS;

    const fetchMetrics = () => {
        const token = Cookies.get("authToken");
        if (!token) {
            router.push("/authentication/sign-in/");
            return;
        }

        setLoading(true);
        axios
            .get(`${APIBaseUrl}/metrics`, {
                headers: {
                    "Content-Type": "application/json",
                    api_key: token,
                },
            })
            .then((response) => {
                setMetrics(response.data || []);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch metrics.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchMetrics();
    }, [router]);

    const handleAction = async (actionType, metricId) => {
        try {
            await axios.post(`${APIBaseUrl}/metrics/${actionType}/${metricId}`, {}, {
                headers: {
                    api_key: Cookies.get("authToken"),
                },
            });
            alert(`${actionType.toUpperCase()} request sent.`);
            fetchMetrics();
        } catch (error) {
            console.error(`Failed to ${actionType} metric:`, error);
            alert(`Failed to ${actionType} metric.`);
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
                    All Metrics
                </Typography>
            </Box>

            {loading ? (
                <LinearProgress sx={{ marginBottom: "15px" }} />
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: "none", maxHeight: "800px", overflowY: "auto" }}>
                    <Table sx={{ minWidth: 650 }} aria-label="metrics table" className="dark-table">
                        <TableHead sx={{ background: "#F7FAFF" }}>
                            <TableRow>
                                <TableCell sx={{ fontSize: "13.5px" }}>Metric Name</TableCell>
                                <TableCell sx={{ fontSize: "13.5px" }} align="center">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {metrics.map((metric, index) => (
                                <TableRow key={index}>
                                    <TableCell>{metric.name ?? "N/A"}</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleAction("predict", metric.id)}
                                            >
                                                Predict
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleAction("delete", metric.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Card>
    );
};

export default AllMetrics;
