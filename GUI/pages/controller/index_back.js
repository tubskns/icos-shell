import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Sample data
const controllersData = [
    {
        "name": "staging-a",
        "address": "127.0.0.1:8080"
    }
];

const Controllers = () => {
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

            {/* Simple Table with Data */}
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
        </>
    );
}

export default Controllers;
