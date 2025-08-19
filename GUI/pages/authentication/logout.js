import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import { destroyCookie } from 'nookies';
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Logout() {
    const router = useRouter();
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    const handleLogout = () => {
        // Remove all authentication cookies
        Cookies.remove('authToken');
        Cookies.remove('authMethod');
        Cookies.remove('username');
        console.log('All authentication cookies removed');
        setIsLoggedOut(true);
        
        // Redirect to sign-in after a short delay
        setTimeout(() => {
            router.push('/authentication/sign-in');
        }, 1500);
    };

    return (
        <>
            <div className="authenticationBox">
                <Box
                    component="main"
                    sx={{
                        padding: "70px 0 100px",
                    }}
                >
                    <Box
                        sx={{
                            background: "#fff",
                            padding: "30px 20px",
                            borderRadius: "10px",
                            maxWidth: "510px",
                            ml: "auto",
                            mr: "auto",
                            textAlign: "center",
                        }}
                        className="bg-black"
                    >
                        <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
                            {isLoggedOut ? "Logged Out Successfully" : "Logout Confirmation"}
                        </Typography>

                        {!isLoggedOut ? (
                            <>
                                <Typography fontSize="15px" mb="30px">
                                    Are you sure you want to logout from ICOS Ecosystem?
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        onClick={handleLogout}
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            fontWeight: "500",
                                            fontSize: "16px",
                                            padding: "12px 30px",
                                        }}
                                    >
                                        Yes, Logout
                                    </Button>
                                    
                                    <Button
                                        onClick={() => router.push('/')}
                                        variant="outlined"
                                        sx={{
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            fontWeight: "500",
                                            fontSize: "16px",
                                            padding: "12px 30px",
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography fontSize="15px" mb="30px" color="success.main">
                                    ✅ You have been successfully logged out. Redirecting to sign-in page...
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </div>
        </>
    );
}
