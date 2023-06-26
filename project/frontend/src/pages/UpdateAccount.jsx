import { Typography, Box, Button } from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";
import React from "react";

function UpdateAccount () {
    const details = useLoaderData();

    return (
        <>
        <Button component={Link} to={"/loggedselect"}>Back</Button>
        <div style={{textAlign: "center"}}>
            <Typography variant="h2">{details.name}</Typography>
            <Typography>Email address: {details.email}</Typography>
            <Typography>MV Points: {details.points}</Typography>
            <Typography>MyFitnessPal: Unconnected</Typography>
            <Box component={Link} to={"/changedetails"} sx={{ display: 'inline-block', width: '20%', padding: '10px', margin: '10px' }}>
                <Typography>Update Account</Typography>
            </Box>
            {/*Leave below empty for now */}
            <Box component={Link} sx={{ display: 'inline-block', width: '20%', padding: '10px', margin: '10px' }}>
                <Typography>Connect MyFitnessPal</Typography>
            </Box>
            <Box component={Link} to={"/deleteaccount"} sx={{ display: 'inline-block', width: '20%', padding: '10px', margin: '10px' }}>
                <Typography>Delete Account</Typography>
            </Box>
        </div>
        </>
    )
}

export default UpdateAccount;