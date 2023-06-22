import React from "react";
import { Typography, Button, TextField } from "@mui/material";

function DeleteAccount() {
    const [password, setPassword] = React.useState('');

    function acceptdelete() {
        /* deletion stuff here */
    }

    return (
        <>
        <Button component={Link} to={"/loggedselect"}>Back</Button>
        <div style={{textAlign: "center"}}>
            <Typography variant="h2">We're sad to see you go, Menuvenuer</Typography>
            <Typography>Are you sure you want to delete your account?</Typography>
            <Typography>All your personal information and MV Points will be removed.</Typography>
            <Typography>Please enter your password and confirm deletion of your account</Typography>
            <TextField sx={{margin: '10px'}} id="confirm-password" value={password} type="password" label="Password" onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" component={Link} to={"/updateaccount"}>No, keep my profile</Button>
            <Button variant="contained" onClick={acceptdelete}>Yes, delete my account</Button>
        </div>
        </>
    )
}