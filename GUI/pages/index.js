import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from 'axios';
import TopologyGraph from './TopologyGraph.js';  // Import the TopologyGraph component

export default function eCommerce() {
    const [error, setError] = useState(""); // State for managing the error message
    const [data, setData] = useState(null); // State for storing the fetched data
    const router = useRouter(); // Next.js router for navigation

    useEffect(() => {
        const token = Cookies.get('authToken'); // Get auth token from cookies

        if (!token) {
            router.push("/authentication/sign-in/"); // Redirect to sign-in if no token is found
        } else {
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS}/api/v3/resource/`, // Use env variable for the API base URL
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': token // Include the token in headers
                }
            };

            axios.request(config)
                .then((response) => {
                    setData(response.data); // Set the fetched data
                })
                .catch((error) => {
                    console.log(error);
                    setError("Failed to fetch data"); // Set an error message if the request fails
                });
        }
    }, [router]);

    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>Topology</h1>
                <ul>
                    <li>
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li>Topology of clusters</li>
                </ul>
            </div>

            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                {/* Topology Graph */}
                {data && <TopologyGraph width="100%" height="500px" data={data} />}
            </Grid>

            {/* Error handling */}
            {error && (
                <div style={{ color: 'red', marginTop: '20px' }}>
                    {error}
                </div>
            )}
        </>
    );
}
