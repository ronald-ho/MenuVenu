import React from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Button, TextField, Typography} from "@mui/material";
import {apiCall} from "../helpers/helpers";

function WaitStaffLogin () {
    const navigate = useNavigate();

    // Get waitstaff password from database 
    const [password, setPassword] = React.useState('');
    const [showAlert, setShowAlert] = React.useState('');

    async function handleSubmit (event) {
        event.preventDefault();

        const body = {
            password: password
        };

        const data = await apiCall("auth/login/staff", "POST", body);

        if (data.message === "Staff login successful") {
            navigate("/waitstaff");
        } else {
            setShowAlert(data.message);
        }
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)} style={{textAlign: 'center'}}>
                <Typography>Wait Staff Login</Typography>
                <TextField sx={{margin: '10px'}} id='login-password' value={password} type="password" label='Password' placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                <br />
                <Button variant="contained" type="submit">Submit</Button>
            </form>
            {showAlert && <Alert severity="error" aria-label='errorAlert' sx={{ margin: 'auto', width: '300px' }}>{showAlert}</Alert>}
        </>
    );
}

export default WaitStaffLogin;