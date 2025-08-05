import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import SimpleTopologyGraph from "./SimpleTopologyGraph.js"; // Import the SimpleTopologyGraph component

export default function MainPage() {
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const router = useRouter();
    const controllerAddress = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS

    useEffect(() => {
        const token = Cookies.get("authToken");

        if (!token) {
            router.push("/authentication/sign-in/");
        } else {
            // Direct connection to real server
            const config = {
                method: "get",
                maxBodyLength: Infinity,
                url: `${controllerAddress}/api/v3/resource/`,
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                    "api_key": token
                }
            };

            console.log('Making request to:', config.url);

            axios
                .request(config)
                .then((response) => {
                    console.log('Data received:', response.data);
                    setData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setError("Failed to fetch data: " + error.message);
                });
        }
    }, [router]);

    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>ICOS Ecosystem</h1>
                <ul>
                    <li>
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li>Topology of clusters</li>
                </ul>
            </div>

            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                <Grid item xs={12}>
                    {data ? (
                        <div style={{ padding: '20px' }}>
                            <h3>ICOS Cluster Topology</h3>
                            <p>Showing {Object.keys(data.cluster || {}).length} clusters</p>
                            <SimpleTopologyGraph data={data} />
                        </div>
                    ) : error ? (
                        <div style={{ color: "red", padding: "20px" }}>{error}</div>
                    ) : (
                        <div style={{ padding: "20px", textAlign: "center" }}>
                            <p>Loading topology data...</p>
                        </div>
                    )}
                </Grid>
            </Grid>
        </>
    );
}

