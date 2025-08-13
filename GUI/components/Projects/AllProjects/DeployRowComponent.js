// components/TableRowComponent.js
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import LinearProgress, {
    linearProgressClasses,
} from "@mui/material/LinearProgress";
import {styled} from "@mui/material/styles";


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor:
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === "light" ? "#757FEF" : "#308fe8",
    },
}));

const DeployRowComponent = ({ data }) => {
    console.log(data);
    return (
        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell sx={{ borderBottom: "1px solid #F7FAFF" }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        as="h5"
                        fontWeight="500"
                        fontSize="13px"
                        className="ml-1"
                    >
                        {data.namespace}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell sx={{ borderBottom: "1px solid #F7FAFF" }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        as="h5"
                        fontWeight="500"
                        fontSize="13px"
                        className="ml-1"
                    >
                        {data.job_group_name}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell
                align="center"
                sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13px" }}
            >
                {data.orchestrator}
            </TableCell>

            <TableCell
                align="center"
                sx={{
                    fontWeight: 500,
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "12px",
                }}
            >
                <span className="primaryBadge">{data.state}</span>
            </TableCell>



            <TableCell
                align="right"
                sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13px" }}
            >
                {data.targets?.[0]?.node_name || ''} {/* If undefined, it will show nothing */}
            </TableCell>

        </TableRow>
    );
};

export default DeployRowComponent;
