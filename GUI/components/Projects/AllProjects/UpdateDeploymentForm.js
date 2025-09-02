import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    TextField,
    Typography,
    CircularProgress,
    Alert
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const UpdateDeploymentForm = ({ deploymentId, initialData, onUpdate }) => {
    const [formData, setFormData] = useState(initialData || {});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const controllerBaseUrl = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        const token = Cookies.get("authToken");
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await axios.put(
                `${controllerBaseUrl}/deployment/${deploymentId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api_key": token,
                    },
                }
            );

            console.log("Update response:", response.data);
            setSuccess(true);
            if (onUpdate) onUpdate(); // Optional callback after update
        } catch (err) {
            console.error("Update failed:", err);
            setError("Failed to update deployment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
                Update Deployment
            </Typography>

            {/* Example fields - customize based on real deployment schema */}
            <TextField
                fullWidth
                name="appName"
                label="App Name"
                value={formData.appName || ""}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                fullWidth
                name="namespace"
                label="Namespace"
                value={formData.namespace || ""}
                onChange={handleChange}
                margin="normal"
            />

            {/* You can dynamically generate fields if schema is large */}

            <Box sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
            </Box>

            {success && <Alert sx={{ mt: 2 }} severity="success">Deployment updated successfully!</Alert>}
            {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
        </Card>
    );
};

export default UpdateDeploymentForm;
