import React from "react";
import { Link } from "react-router-dom";  
import { Typography, Box } from "@mui/material";

function LogRegGuest () {
    const boxcss = { display: 'inline-block', width: '20%', padding: '10px', border: '1px black solid', margin: '10px', height: '50px', verticalAlign: 'top' }

    return (
        <>
        <div style={{textAlign: 'center', marginTop: '60px'}}>
            <Box component={Link} to={'/tableselect'} sx={boxcss}>
                <Typography>Continue as guest</Typography>
            </Box>
            <Box component={Link} to={'/register'} sx={boxcss}>
                <Typography>Register new MenuVenu account</Typography>    
            </Box>
            <Box component={Link} to={'/login'} sx={boxcss}>
                <Typography>Login as MenuVenu member</Typography>    
            </Box>
        </div>
        </>
    )
}

export default LogRegGuest;