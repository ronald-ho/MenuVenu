import React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Typography, TextField, Button } from "@mui/material";
import ResetPopup from "../components/ResetPopup";

function WaitStaffLogin () {
    const navigate = useNavigate();

    const [password, setPassword] = React.useState('');
    const [showAlert, setShowAlert] = React.useState('');

    async function handleSubmit (event) {
        event.preventDefault();
        
        if (!password) {
            setShowAlert('Incorrect password');
        } else {
            setShowAlert(null);
        }

        navigate("/waitstaff");
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)} style={{textAlign: 'center'}}>
                <Typography>Login</Typography>
                <TextField sx={{margin: '10px'}} id='login-password' value={password} type="password" label='Password' placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                <br />
                <Button variant="contained" type="submit">Submit</Button>
                <Button variant="contained" onClick={(e) => setShowReset(true)}>Reset password</Button>
            </form>
            {showReset && <ResetPopup open={showReset} setOpen={setShowReset}/>}
            {showAlert && <Alert severity="error" aria-label='errorAlert' sx={{ margin: 'auto', width: '300px' }}>{showAlert}</Alert>}
        </>
    );
}

export default WaitStaffLogin;