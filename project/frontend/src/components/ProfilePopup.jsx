import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogContentText } from "@mui/material";
import { apiCall } from "../helpers/helpers";

function ProfilePopup({ open, setOpen }) {
    const [info, setInfo] = React.useState(null);

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
                <DialogContentText>MyFitnessPal: Unconnected</DialogContentText>
            </DialogContent>
        </Dialog>}
        </>
    )
}

export default ProfilePopup;

