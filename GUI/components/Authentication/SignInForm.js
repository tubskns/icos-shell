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
import Cookies from "js-cookie";
import axios from "axios";
import styles from "@/components/Authentication/Authentication.module.css";

const SignInForm = () => {
    const [error, setError] = useState(""); // State for managing the error message
    const router = useRouter(); // Next.js router for navigation

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const email = data.get("email");
        const password = data.get("password");

        console.log(email, password);

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS}/api/v3/user/login?username=${email}&password=${password}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await axios.request(config);
            console.log(JSON.stringify(response.data));

            // Assuming the response contains the auth token
            const authToken = response.data;

            // Set the auth token in a session cookie
            Cookies.set("authToken", authToken, { expires: 1 }); // Expires in 1 day

            console.log(Cookies.get('authToken'));

            // Navigate to the desired page
            router.push("/");
        } catch (error) {
            console.error("Error:", error); // Log the error for debugging
            setError("An error occurred while trying to sign in. Please try again."); // Update the error message state
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
                                        control={<Checkbox color="primary" />}
                                        label="Remember me"
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
                                sx={{
                                    mt: 2,
                                    textTransform: "capitalize",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    fontSize: "16px",
                                    padding: "12px 10px",
                                    color: "#fff !important",
                                }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </div>
    );
};

export default SignInForm;
