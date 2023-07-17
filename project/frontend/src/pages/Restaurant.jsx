import React from "react";
import {Link} from "react-router-dom";
import {Box, Button, Typography} from "@mui/material";
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import FaceIcon from '@mui/icons-material/Face';

function Restaurant () {
    return (
        <>
        <div style={{textAlign: 'center'}}>
            <Typography>I am a...</Typography>
            <Box sx={{ display: 'inline-flex', justifyContent: 'center', gap: '30px' }}>
                <Button component={Link} to="/customerselect" variant="contained" size="large" sx={{width: "200px", color: "white"}}>
                    <FaceIcon sx={{mr: 2, fontSize: 30}} />
                    <Typography>Customer</Typography>
                </Button>
                <Button component={Link} to="/staffselect" variant="contained" size="large" sx={{width: "200px", color: "white"}}>
                    <SoupKitchenIcon sx={{mr: 1, fontSize: 30}} />
                    <Typography>Staff Member</Typography>
                </Button>
            </Box>
        </div>
        </>
    )
}

export default Restaurant;