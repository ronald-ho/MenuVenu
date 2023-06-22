import React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Typography, TextField } from '@mui/material';

function Register () {
    const navigate = useNavigate();

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showErrorAlert, setShowErrorAlert] = React.useState(null);

    async function handleSubmit (event) {
        event.preventDefault();
        const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!name) {
            setShowErrorAlert('Please enter a valid name');
            return;
        } else if (!email || !validEmailRegex.test(email)) {
            setShowErrorAlert('Please enter a valid email');
            return;
        } else if (!password || !password.match(/^[^a-zA-Z0-9]+$/)) {
            setShowErrorAlert('Please enter a valid password');
            return;
        } else {
            setShowErrorAlert(null);
        }

        /*Register api call*/
        navigate("/customerselect");
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)} style={{textAlign: 'center'}}>
                <Typography>Register</Typography>
                <TextField sx={{margin: '10px'}} id='login-name' value={name} type="text" label='Name' placeholder="Enter name" onChange={(e) => setName(e.target.value)} />
                <br />
                <TextField sx={{margin: '10px'}} id='login-email' value={email} type="text" label="Email address" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                <br />
                <TextField sx={{margin: '10px'}} id='login-password' value={password} type="password" label='Password' placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                <br />
                <Button variant="contained" type="submit">Submit</Button>
            </form>
            {showErrorAlert && <Alert severity="error" aria-label='errorAlert' sx={{ margin: 'auto', width: '300px' }}>{showErrorAlert}</Alert>}
        </>
    )
}

export default Register;