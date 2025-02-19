import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
import axios from "axios";

const SignInForm = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // State for managing loading animation
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Start the loading animation
        setError(""); // Clear previous errors

        const controllerBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const data = new FormData(event.currentTarget);

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${controllerBaseUrl}/api/v3/user/login?username=${data.get("email")}&password=${data.get("password")}&otp=${data.get("otp")}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await axios.request(config);
            const authToken = response.data;

            Cookies.set("authToken", authToken, { expires: 1 });
            router.push("/");
        } catch (error) {
            console.error("Error:", error);
            setError("Authentication Failed! please try again.");
            setLoading(false);
        } finally {
            // setLoading(false); // Stop the loading animation after completion
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
                <Grid item xs={12} md={12} lg={12} xl={12}>
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
                                            OTP
                                        </Typography>

                                        <TextField
                                            required
                                            fullWidth
                                            name="otp"
                                            label="otp"
                                            type="otp"
                                            id="otp"
                                            autoComplete=""
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
                                <Grid item xs={6} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox value="allowExtraEmails" color="primary" />
                                        }
                                        label="Remember me."
                                    />
                                </Grid>

                                <Grid item xs={6} sm={6} textAlign="end">
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
                                disabled={loading} // Disable button when loading
                                sx={{
                                    mt: 2,
                                    textTransform: "capitalize",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    fontSize: "16px",
                                    padding: "12px 10px",
                                    color: "#fff !important",
                                }}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />} // Add spinner as start icon
                            >
                                {loading ? "Signing In..." : "Sign In"} {/* Update button text when loading */}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </div>
    );
};

export default SignInForm;
