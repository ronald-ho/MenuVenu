import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import KitchenIcon from "@mui/icons-material/Kitchen";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

function StaffSelect () {

    return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
                <Button component={Link} to="/waitstafflogin" variant="contained" size="large" sx={{width: '300px'}}>
                    <FastfoodIcon sx={{mr: 1, fontSize: 30}} />
                    <Typography>Wait Staff</Typography>
                </Button>
                <Button component={Link} to="/kitchenstafflogin" variant="contained" size="large" sx={{width: '300px'}}>
                    <KitchenIcon sx={{mr: 1, fontSize: 30}} />
                    <Typography>Kitchen Staff</Typography>
                </Button>
                <Button component={Link} to="/managerlogin" variant="contained" size="large" sx={{width: '300px'}}>
                    <SupervisorAccountIcon sx={{mr: 1, fontSize: 30}} />
                    <Typography>Manager</Typography>
                </Button>
            </Box>
        </Box>
    )
}

export default StaffSelect;