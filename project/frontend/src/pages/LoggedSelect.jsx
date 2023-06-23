import React from "react";
import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

function LoggedSelect () {
    return (
        <div style={{textAlign: "center"}}>
            <Typography>I want to...</Typography>
            <Box component={Link} to={"/tableselect"} sx={{ display: 'inline-block', width: '20%', padding: '10px', border: '1px black solid', margin: '10px' }}>
                <Typography>Start dining</Typography>
            </Box>
            <Box component={Link} to={"/updateaccount"} sx={{ display: 'inline-block', width: '20%', padding: '10px', border: '1px black solid', margin: '10px' }}>
                <Typography>Update my profile</Typography>
            </Box>
        </div>
    )
}

export default LoggedSelect;