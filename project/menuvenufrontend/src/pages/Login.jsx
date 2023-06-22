import React from "react";
import { redirect, useNavigate, Link } from "react-router-dom";
import { Alert, Typography, TextField, Button } from "@mui/material";
import ResetPopup from "../components/ResetPopup";

function Login () {
    const navigate = useNavigate();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showAlert, setShowAlert] = React.useState('');
    const [showReset, setShowReset] = React.useState(false);

    async function handleSubmit (event) {
        event.preventDefault();
        const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!email || !validEmailRegex.test(email)) {
            setShowAlert('Please enter a valid email');
            return;
        } else if (!password) {
            setShowAlert('Please enter a valid password');
        } else {
            setShowAlert(null);
        }

        /*add APICALL once done*/
        navigate("/loggedselect");
    }

    return (
        <>
            <Button component={Link} to={"/customerselect"}>Back</Button>
            <form onSubmit={(e) => handleSubmit(e)} style={{textAlign: 'center'}}>
                <Typography>Login</Typography>
                <TextField sx={{margin: '10px'}} id='login-email' value={email} type="text" label="Email address" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                <br />
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

export default Login;