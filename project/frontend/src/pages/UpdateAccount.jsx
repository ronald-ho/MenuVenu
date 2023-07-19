import { Typography, Box, Button } from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";
import React from "react";
import UpdateIcon from '@mui/icons-material/Update';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DeleteIcon from '@mui/icons-material/Delete';

function UpdateAccount () {
    const details = useLoaderData();

    return (
        <>
        <Button component={Link} to={"/loggedselect"}>Back</Button>
        <div style={{textAlign: "center"}}>
            <Typography variant="h2">{details.full_name}</Typography>
            <Typography>Email address: {details.email}</Typography>
            <Typography>MV Points: {details.points}</Typography>
            <Typography sx={{ marginBottom: '20px' }}>MyFitnessPal: Unconnected</Typography>
            <Box sx={{ display: 'inline-flex', justifyContent: 'center', gap: '30px' }}>
                <Button component={Link} to={"/changedetails"} variant="contained" size="large" sx={{width: '300px'}}>
                    <UpdateIcon sx={{mr: 1, fontSize: 30}} />
                    <Typography>Update Account</Typography>
                </Button>
                <Button component={Link} variant="contained" size="large" sx={{width: '300px'}}>
                    <FitnessCenterIcon sx={{mr: 1, fontSize: 30}} />
                    <Typography>Connect MyFitnessPal</Typography>
                </Button>
                <Button component={Link} to={"/deleteaccount"} variant="contained" size="large" sx={{width: '300px'}}>
                    <DeleteIcon sx={{mr: 1, fontSize: 30}} />
                    <Typography>Delete Account</Typography>
                </Button>
            </Box>
        </div>
        </>
    )
}

export default UpdateAccount;