import React, { useState } from "react";
import {
  Card,
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

const CreateMetric = () => {
  const router = useRouter();
  const APIBaseUrl = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS;

  const [metricName, setMetricName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");

    if (!token) {
      router.push("/authentication/sign-in/");
      return;
    }

    const payload = {
      name: metricName,
      description,
    };

    setLoading(true);

    try {
      const response = await axios.post(
        `${APIBaseUrl}/api/v3/metrics`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "api_key": token,
          },
        }
      );
      setSnackbar({ open: true, message: "Metric created successfully.", severity: "success" });
      setMetricName("");
      setDescription("");
    } catch (error) {
      console.error("Metric creation failed:", error);
      setSnackbar({ open: true, message: "Failed to create metric.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 4, maxWidth: 600, margin: "0 auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Create New Metric
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Metric Name"
            fullWidth
            required
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Creating..." : "Create Metric"}
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default CreateMetric;

