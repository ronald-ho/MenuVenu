import React from "react";
import { Link } from "react-router-dom";  
import { Typography, Box } from "@mui/material";

function Restaurant () {
    return (
        <>
        <div style={{textAlign: 'center'}}>
            <Typography>I am a...</Typography>
            <Box component={Link} to={'/customerselect'} sx={{ display: 'inline-block', width: '20%', padding: '10px', border: '1px black solid', margin: '10px' }}>
                <Typography>Customer</Typography>
            </Box>
            <Box component={Link} to={'/staffselect'} sx={{ display: 'inline-block', width: '20%', padding: '10px', border: '1px black solid', margin: '10px' }}>
                <Typography>Staff Member</Typography>    
            </Box>
        </div>
        </>
    )
}

export default Restaurant;