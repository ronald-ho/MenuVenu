import React from "react";
import {Alert, Typography, Button, TextField, Box} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { apiCall } from "../helpers/helpers";

function DeleteAccount() {
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    async function acceptdelete () {
        /* deletion stuff here */
        const body = {
            customer_id: localStorage.getItem("mvuser"),
            password: password
        };
        const data = await apiCall("auth/delete", "DELETE", body);
        if (data.message === 'User deleted') {
            navigate("/login");
        } else {
            setError(data.message);
        }
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
            <br />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 'fit-content', margin: 'auto', gap: '30px' }}>
                <Button variant="contained" component={Link} to={"/updateaccount"}>No, keep my profile</Button>
                <Button variant="contained" onClick={acceptdelete}>Yes, delete my account</Button>
            </Box>
            {error && <Alert severity="error" aria-label='errorAlert' sx={{ margin: 'auto', width: '300px' }}>{error}</Alert>}
        </div>
        </>
    )
}

export default DeleteAccount;