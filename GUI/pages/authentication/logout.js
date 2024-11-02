import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import { destroyCookie } from 'nookies';
import Cookies from "js-cookie";

export default function Logout() {

    Cookies.remove('authToken');
    console.log(Cookies.get('authToken'));

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
                            textAlign: "center"
                        }}
                        className="bg-black"
                    >
                        <Box>
                            <img
                                src="/images/logo.png"
                                alt="Black logo"
                                className="black-logo"
                            />

                            <img
                                src="/images/logo-white.png"
                                alt="White logo"
                                className="white-logo"
                            />
                        </Box>

                        <Typography as="h1" fontSize="20px" fontWeight="500" mb={1}>
                            You are Logged Out
                        </Typography>

                        <Typography>
                            Thank you for using ICOS web panel
                        </Typography>

                        <Button
                            href="/authentication/sign-in/"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                textTransform: "capitalize",
                                borderRadius: "8px",
                                fontWeight: "500",
                                fontSize: "16px",
                                padding: "12px 10px",
                                color: "#fff !important"
                            }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </div>
        </>
    );
}
