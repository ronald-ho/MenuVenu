import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";
import { Delete, Google, Update } from '@mui/icons-material';
import { get_profile } from "../helpers/loaderfunctions";
import useGoogleOAuth from "../components/ConnectGoogle";

function UpdateAccount() {
    const [details, setDetails] = React.useState(useLoaderData());
    const { client } = useGoogleOAuth();

    React.useEffect(() => {
        async function getCustomerDetails () {
            const data = await get_profile();
            setDetails(data);
        }

        getCustomerDetails();
        
    }, []);

    return (
        <>
            <Button component={Link} to={"/loggedselect"}>Back</Button>
            <div style={{ textAlign: "center" }}>
                <Typography variant="h2">{details.full_name}</Typography>
                <Typography>Email address: {details.email}</Typography>
                <Typography>MV Points: {details.points}</Typography>
                {details.google_connected && <Typography>Calories burned: {details.calories_burnt}</Typography>}
                <Typography sx={{ marginBottom: '20px' }}>Google Fit: {details.google_connected ? 'Connected' : 'Unconnected'}</Typography>
                <Box sx={{ display: 'inline-flex', justifyContent: 'center', gap: '30px' }}>
                    <Button component={Link} to={"/changedetails"} variant="contained" size="large" sx={{ width: '300px' }}>
                        <Update sx={{ mr: 1, fontSize: 30 }} />
                        <Typography>Update Account</Typography>
                    </Button>
                    <Button onClick={() => client.requestAccessToken()} component={Link} variant="contained" size="large" sx={{ width: '300px' }}>
                        {details.calories_burnt ? (
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
