import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import GoogleIcon from '@mui/icons-material/Google';

function UpdateAccount() {
    const details = useLoaderData();
    const [isSignedIn, setIsSignedIn] = useState(false); // Add this state

    function handleCredentialResponse(response) {
        console.log(response);
        if (response.error) {
            setIsSignedIn(false);
        } else {
            setIsSignedIn(true);

            const mvuser = localStorage.getItem("mvuser")

            const request = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: response.access_token,
                    expires_in: response.expires_in,
                    id: mvuser,
                })
            };

            fetch("http://127.0.0.1:5000/fitness/token/store", request)
                .then((res) => res.json())
                .then((data) => console.log(data));
        }


    }

    useEffect(() => {
        /* global google */
        const client = google.accounts.oauth2.initTokenClient({
            client_id: "155679089529-vgjnspusl7a28vt5m4r0jsu2o31rvdhq.apps.googleusercontent.com",
            scope: "https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/fitness.nutrition.write",
            callback: handleCredentialResponse,
        });

        document.getElementById("authorizeButton").addEventListener("click", () => {
            client.requestAccessToken();
        });
    }, []);

    return (
        <>
            <Button component={Link} to={"/loggedselect"}>Back</Button>
            <div style={{ textAlign: "center" }}>
                <Typography variant="h2">{details.full_name}</Typography>
                <Typography>Email address: {details.email}</Typography>
                <Typography>MV Points: {details.points}</Typography>
                <Typography sx={{ marginBottom: '20px' }}>Google Fit: {isSignedIn ? 'Connected' : 'Unconnected'}</Typography>
                <Box sx={{ display: 'inline-flex', justifyContent: 'center', gap: '30px' }}>
                    <Button component={Link} to={"/changedetails"} variant="contained" size="large" sx={{ width: '300px' }}>
                        <UpdateIcon sx={{ mr: 1, fontSize: 30 }} />
                        <Typography>Update Account</Typography>
                    </Button>
                    <Button id="authorizeButton" component={Link} variant="contained" size="large" sx={{ width: '300px' }}>
                        {isSignedIn ?
                        <Typography>Google Fit Connected</Typography> :
                        <>
                        <GoogleIcon sx={{mr: 1, fontSize: 30}} />
                        <Typography>Connect Google Fit</Typography>
                        </>
                        }
                    </Button>
                    <Button component={Link} to={"/deleteaccount"} variant="contained" size="large" sx={{ width: '300px' }}>
                        <DeleteIcon sx={{ mr: 1, fontSize: 30 }} />
                        <Typography>Delete Account</Typography>
                    </Button>
                </Box>
            </div>
        </>
    )
}

export default UpdateAccount;
