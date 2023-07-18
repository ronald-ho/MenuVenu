import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import FaceIcon from "@mui/icons-material/Face";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

function StaffSelect () {

    return (
        <>
        <div style={{textAlign: 'center', marginTop: '60px'}}>
            <Box sx={{ display: 'inline-flex', justifyContent: 'center', gap: '30px' }}>
                <Button component={Link} to="/waitstafflogin" variant="contained" size="large" sx={{width: '300px'}}>
                    <FaceIcon sx={{mr: 1, fontSize: 30}} />
                    <Typography>Wait Staff</Typography>
                </Button>
                <Button component={Link} to="/kitchenstafflogin" variant="contained" size="large" sx={{width: '300px'}}>
                    <SoupKitchenIcon sx={{mr: 1, fontSize: 30}} />
                    <Typography>Kitchen Staff</Typography>
                </Button>
                <Button component={Link} to="/managerlogin" variant="contained" size="large" sx={{width: '300px'}}>
                    <ManageAccountsIcon sx={{mr: 1, fontSize: 30}} />
                    <Typography>Manager</Typography>
                </Button>
            </Box>
        </div>
        </>
    )
}

export default StaffSelect;