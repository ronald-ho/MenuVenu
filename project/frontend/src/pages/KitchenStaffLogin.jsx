import React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Typography, TextField, Button } from "@mui/material";

function KitchenStaffLogin () {
    const navigate = useNavigate();

    // Get waitstaff password from database 
    const [password, setPassword] = React.useState('');
    const [showAlert, setShowAlert] = React.useState('');

    async function handleSubmit (event) {
        event.preventDefault();
        
        // Implement once password is added in database 

        // if (!password) {
        //     setShowAlert('Incorrect password');
        // } else {
        //     setShowAlert(null);
        // }

        navigate("/kitchen");
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)} style={{textAlign: 'center'}}>
                <Typography>Kitchen Staff Login</Typography>
                <TextField sx={{margin: '10px'}} id='login-password' value={password} type="password" label='Password' placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                <br />
                <Button variant="contained" type="submit">Submit</Button>
            </form>
            {showAlert && <Alert severity="error" aria-label='errorAlert' sx={{ margin: 'auto', width: '300px' }}>{showAlert}</Alert>}
        </>
    );
}

export default KitchenStaffLogin;