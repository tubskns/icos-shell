import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const Controllers = () => {
    const [controllersData, setControllersData] = useState([]); // State to hold the fetched controllers data
    const [loading, setLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to hold error messages

    useEffect(() => {
        const fetchControllersData = async () => {
            const lighthouseAddress = process.env.NEXT_PUBLIC_LIGHTHOUSE_ADDRESS; // Read environment variable
            try {
                const response = await axios.get(`${lighthouseAddress}/api/v3/controller`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setControllersData(response.data); // Store the fetched data in state
                setLoading(false); // Set loading to false when data is fetched
            } catch (err) {
                setError('Failed to fetch controllers data'); // Handle error
                setLoading(false); // Stop loading on error
            }
        };

        fetchControllersData();
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

            {/* Loading and Error handling */}
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Display the Table when data is available */}
            {!loading && !error && (
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
};

export default Controllers;
