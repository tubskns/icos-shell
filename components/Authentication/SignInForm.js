import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import styles from "@/components/Authentication/Authentication.module.css";
import https from 'https';
import Link from 'next/link';

const SignInForm = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const username = formData.get("email");
        const password = formData.get("password");
        const otp = formData.get("otp");

        try {
            console.log("🔑 Attempting to get token from Keycloak...");
            
            // Get token from our API route (which calls ICOS Shell /user/login)
            const response = await axios.post('/api/auth/token', {
                username: username,
                password: password,
                otp: otp
            }, {
                timeout: 60000, // 60 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("✅ Token response:", response.data);
            const token = response.data.access_token;
            if (!token) throw new Error("No token received from IAM");
            
            // Clean the token to ensure it's in proper JWT format
            const cleanToken = token.trim().replace(/\s+/g, '');
            
            console.log("🔄 Setting cookies...");
            Cookies.set("authToken", cleanToken, { 
                expires: 1, 
                path: '/', 
                sameSite: 'lax' 
            });
            Cookies.set("authMethod", "api_key", { 
                expires: 1, 
                path: '/', 
                sameSite: 'lax' 
            });
            
            // Also save to localStorage as backup
            localStorage.setItem("authToken", cleanToken);
            localStorage.setItem("authMethod", "api_key");
            console.log("✅ Cookies and localStorage set");
            
            // Verify cookies are set
            const savedToken = Cookies.get("authToken");
            const savedMethod = Cookies.get("authMethod");
            console.log("🔍 Verification - Token:", savedToken ? "Present" : "Missing");
            console.log("🔍 Verification - Method:", savedMethod);
            
            if (!savedToken) {
                throw new Error("Failed to save token to cookies");
            }
            
            // Small delay to ensure cookies are set
            setTimeout(() => {
                console.log("🔄 Redirecting to Dashboard...");
                window.location.href = "/";
            }, 500);
        } catch (err) {
            console.error("❌ Token error:", err);
            console.error("❌ Error response:", err.response?.data);
            
            let errorMessage = "Failed to get token from IAM";
            if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
                errorMessage = "Connection timeout - please try again";
            } else if (err.response?.data?.error) {
                errorMessage = `IAM Error: ${err.response.data.error}`;
            } else if (err.response?.data?.axios_error && err.response?.data?.curl_error) {
                errorMessage = "Both connection methods failed - check network";
            } else {
                errorMessage = `Connection failed: ${err.message}`;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authenticationBox">
            <Box
                component="main"
                sx={{
                    maxWidth: "510px",
                    ml: "auto",
                    mr: "auto",
                    padding: "50px 0 100px",
                }}
            >
                <Grid item xs={12}>
                    <Box>
                        <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
                            Sign In{" "}
                            <img
                                src="/images/favicon.png"
                                alt="favicon"
                                className={styles.favicon}
                            />
                        </Typography>

                        <Box component="form" noValidate onSubmit={handleSubmit}>
                            <Box
                                sx={{
                                    background: "#fff",
                                    padding: "30px 20px",
                                    borderRadius: "10px",
                                    mb: "20px",
                                }}
                                className="bg-black"
                            >
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography
                                            component="label"
                                            sx={{
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                mb: "10px",
                                                display: "block",
                                            }}
                                        >
                                            Username
                                        </Typography>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Username"
                                            name="email"
                                            autoComplete="email"
                                            InputProps={{
                                                style: { borderRadius: 8 },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography
                                            component="label"
                                            sx={{
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                mb: "10px",
                                                display: "block",
                                            }}
                                        >
                                            Password
                                        </Typography>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            InputProps={{
                                                style: { borderRadius: 8 },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography
                                            component="label"
                                            sx={{
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                mb: "10px",
                                                display: "block",
                                            }}
                                        >
                                            OTP Code
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="otp"
                                            label="OTP Code (optional)"
                                            type="text"
                                            id="otp"
                                            autoComplete="one-time-code"
                                            InputProps={{
                                                style: { borderRadius: 8 },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {error && (
                                <Box
                                    sx={{
                                        background: "#f8d7da",
                                        color: "#721c24",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        mb: "20px",
                                    }}
                                >
                                    {error}
                                </Box>
                            )}

                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox value="remember" color="primary" />
                                        }
                                        label="Remember me."
                                    />
                                </Grid>

                                <Grid item xs={6} textAlign="end">
                                    <Link
                                        href="/authentication/forgot-password"
                                        className="primaryColor text-decoration-none"
                                    >
                                        Forgot your password?
                                    </Link>
                                </Grid>
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 2,
                                    textTransform: "capitalize",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    fontSize: "16px",
                                    padding: "12px 10px",
                                    color: "#fff !important",
                                }}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </div>
    );
};

export default SignInForm;

