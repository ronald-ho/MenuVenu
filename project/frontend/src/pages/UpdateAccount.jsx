/* global google */	
import React from "react";	
import { Box, Button, Typography } from "@mui/material";	
import { Link, useLoaderData } from "react-router-dom";	
import { Delete, Google, Update } from '@mui/icons-material';	
import { apiCall } from "../helpers/helpers";	
import { get_profile } from "../helpers/loaderfunctions";	
function UpdateAccount({setmode}) {	
    const [details, setDetails] = React.useState(useLoaderData());	
    const [isSignedIn, setIsSignedIn] = React.useState(details.google_connected);

    React.useEffect(() => {
        setmode(localStorage.getItem('mvuser') ? 'customer' : '');
    }, []);

    const client = google.accounts.oauth2.initTokenClient({	
        client_id: "155679089529-vgjnspusl7a28vt5m4r0jsu2o31rvdhq.apps.googleusercontent.com",	
        scope: "https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/fitness.nutrition.write",	
        callback: handleCredentialResponse,	
    });	
    React.useEffect(() => {	
        async function getCustomerDetails () {	
            const data = await get_profile();	
            setDetails(data);	
        }	
        getCustomerDetails();	
        	
    }, [isSignedIn]);	
    async function handleCredentialResponse(response) {
        console.log(response);
        if (response.error) {
            setIsSignedIn(false);
        } else {
            const mvuser = localStorage.getItem("mvuser")
            const body = {
                token: response.access_token,
                expires_in: response.expires_in,
                id: mvuser,
            }
            const data = await apiCall('/fitness/token/store', 'POST', body)
            console.log(data);
            setIsSignedIn(true);
        }
    }

    return (	
        <>	
            <Button component={Link} to={"/loggedselect"}>Back</Button>	
            <div style={{ textAlign: "center" }}>	
                <Typography variant="h2">{details.full_name}</Typography>	
                <Typography>Email address: {details.email}</Typography>	
                <Typography>MV Points: {details.points}</Typography>	
                {isSignedIn && <Typography>Calories burned: {details.calories_burnt}</Typography>}	
                <Typography sx={{ marginBottom: '20px' }}>Google Fit: {isSignedIn ? 'Connected' : 'Unconnected'}</Typography>	
                <Box sx={{ display: 'inline-flex', justifyContent: 'center', gap: '30px' }}>	
                    <Button component={Link} to={"/changedetails"} variant="contained" size="large" sx={{ width: '300px' }}>	
                        <Update sx={{ mr: 1, fontSize: 30 }} />	
                        <Typography>Update Account</Typography>	
                    </Button>	
                    <Button onClick={() => client.requestAccessToken()} component={Link} variant="contained" size="large" sx={{ width: '300px' }}>	
                        {isSignedIn ? (	
                            <Typography>Google Fit Connected</Typography>	
                        ) : (	
                            <>	
                                <Google sx={{mr: 1, fontSize: 30}} />	
                                <Typography>Connect Google Fit</Typography>	
                            </>	
                        )}	
                    </Button>	
                    <Button component={Link} to={"/deleteaccount"} variant="contained" size="large" sx={{ width: '300px' }}>	
                        <Delete sx={{ mr: 1, fontSize: 30 }} />	
                        <Typography>Delete Account</Typography>	
                    </Button>	
                </Box>	
            </div>	
        </>	
    )	
}	
export default UpdateAccount;