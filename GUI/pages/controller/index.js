import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';

const Controllers = () => {
    const [controllersData, setControllersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const lighthouseUrl = process.env.NEXT_PUBLIC_LIGHTHOUSE_ADDRESS;

    useEffect(() => {
        setLoading(true); // Start loading
        axios.get(`${lighthouseUrl}/api/v3/controller/`)
            .then((response) => {
                console.log("Controllers data:", response.data);
                setControllersData(response.data); // Update state with the fetched data
            })
            .catch((error) => {
                console.error("Error fetching controllers data:", error);
                setError("Failed to load controllers data.");
            })
            .finally(() => setLoading(false)); // End loading
    }, []);

    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>Controllers</h1>
                <ul>
                    <li>
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li>Controllers</li>
                </ul>
            </div>

            {/* Display loading indicator or error message */}
            {loading ? (
                <LinearProgress sx={{ marginBottom: "15px" }} />
            ) : error ? (
                <Typography color="error" variant="body1">{error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="controllers table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {controllersData.map((controller, index) => (
                                <TableRow key={index}>
                                    <TableCell>{controller.name}</TableCell>
                                    <TableCell>{controller.address}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}

export default Controllers;
