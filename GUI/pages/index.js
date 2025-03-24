import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from 'axios';
import TopologyGraph from './TopologyGraph.js';  // Import the TopologyGraph component

export default function eCommerce() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState(""); // State for managing the error message
    const [data, setData] = useState(null); // State for storing the fetched data
    const router = useRouter(); // Next.js router for navigation

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const token = Cookies.get('authToken');
        const controllerBaseUrl = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS;

        if (!token) {
            router.push("/authentication/sign-in/");
        } else {
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${controllerBaseUrl}/api/v3/resource/`,
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': token
                }
            };

            axios.request(config)
                .then((response) => {
                    setData(response.data); // Set the fetched data
                })
                .catch((error) => {
                    console.log(error);
                    setError("Failed to fetch data");
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
                {/*<Grid item xs={12} md={12} lg={12} xl={8}>*/}
                {/*    /!* Features *!/*/}
                {/*    <Features />*/}
                {/*    */}
                {/*    <iframe*/}
                {/*        src="http://37.32.29.40:3003"*/}
                {/*        style={{ border: 'white', borderRadius: '2%' }}*/}
                {/*        title="Example"*/}
                {/*        width="100%"*/}
                {/*        height="500px"*/}
                {/*    ></iframe>*/}
                {/*</Grid>*/}

                <Grid item xs={12} md={12} lg={12} xl={12}>
                    {/* ClusterNodesByCPUArchitecture */}
                    {/*<ClusterNodesByCPUArchitecture />*/}

                    {/* Topology Graph */}
                    {data && <TopologyGraph width="100%" height="500px" data={data} />}
                </Grid>
            </Grid>
        </>
    );
}
