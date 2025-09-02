import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.js';

const TestSimple = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const APIBaseUrl = config.controllerAddress;
                console.log('Fetching from:', APIBaseUrl);
                
                const response = await axios.get(`${APIBaseUrl}/api/data`);
                console.log('Response:', response.data);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Test Simple Data Fetch</h1>
            
            {loading && <p>Loading...</p>}
            
            {error && (
                <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
                    Error: {error}
                </div>
            )}
            
            {data && (
                <div>
                    <h2>Data Received:</h2>
                    <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                    
                    <h3>Clusters Found:</h3>
                    <ul>
                        {data.cluster && Object.keys(data.cluster).map(clusterId => (
                            <li key={clusterId}>
                                <strong>Cluster ID:</strong> {clusterId}
                                <br />
                                <strong>Name:</strong> {data.cluster[clusterId].name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TestSimple; 