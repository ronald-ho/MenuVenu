import React from "react";
import {Button, Dialog, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {apiCall} from "../helpers/helpers";
import useGoogleOAuth from "./ConnectGoogle";
import {Google} from "@mui/icons-material";

function ProfilePopup({ open, setOpen }) {
    const [info, setInfo] = React.useState(null);
    const { client } = useGoogleOAuth();

    React.useEffect(() => {
        const getProfile = async () => {
            const response = await apiCall("auth/customer/"+localStorage.getItem("mvuser"), "GET", {});
            setInfo(response.customer_info);
        };
        getProfile();
    }, []);

    function handleClose() {
        setOpen(false)
    }

    return (
        <>
        {info && <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{info.full_name}</DialogTitle>
            <DialogContent>
                <DialogContentText>Email address: {info.email}</DialogContentText>
                <DialogContentText>MV Points: {info.points}</DialogContentText>
                <DialogContentText>GoogleFit: {info.google_connected ? 'Connected' : 'Unconnected'}</DialogContentText>
                {!info.google_connected &&
                  <Button onClick={() => client.requestAccessToken()} variant="contained">
                    <Google sx={{mr: 1, fontSize: 20}} />
                    Connect Google Fit
                  </Button>}
            </DialogContent>
        </Dialog>}
        </>
    )
}

export default ProfilePopup;

