import React from "react";
import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

function StaffSelect () {
    const boxcss = { display: 'inline-block', width: '20%', padding: '10px', border: '1px black solid', margin: '10px', height: '50px', verticalAlign: 'top' }

    return (
        <>
            <div style={{textAlign: 'center', marginTop: '60px'}}>
                <Box component={Link} to={'/waitstafflogin'} sx={boxcss}>
                    <Typography>Wait Staff</Typography>
                </Box>
                <Box component={Link} to={'/kitchenstafflogin'} sx={boxcss}>
                    <Typography>Kitchen Staff</Typography>    
                </Box>
                <Box component={Link} to={'/managerlogin'} sx={boxcss}>
                    <Typography>Manager</Typography>    
                </Box>
            </div>
        </>
    )
}

export default StaffSelect;