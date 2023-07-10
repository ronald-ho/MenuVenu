import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../helpers/helpers";
import React from "react";

function BillingPopUp ({ open, setOpen, tableNo }) {
    const navigate = useNavigate();
    const [bill, setBill] = React.useState(0);
    const [customerId, setCustomerId] = React.useState('');

    async function handleConfirm() {
        // Once finish dining and paid, "log out"
        localStorage.removeItem("mvuser");
        localStorage.removeItem("mvtable");
        navigate("/customerselect");
    }

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        async function getBill() {
            const data = await apiCall("orders/bill", "POST", { 'table_number': tableNo });
            if (data.bill) {
                console.log("Bill amount received");
                setBill(data.bill);
            } 
            else {
                console.log("Failed to get bill amount");
            }
        }

        setCustomerId(localStorage.getItem("mvuser"));
        // setBill(10);
        getBill();
      }, []); 

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{"Request Bill"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Your total bill is ${bill}.</DialogContentText>
                    {customerId !== null && 
                        <>
                            <DialogContentText>You have earned 0 MV points.</DialogContentText>
                            <DialogContentText>Your new balance will be 0 MV points.</DialogContentText>
                        </>
                    }
                    <DialogContentText>Please proceed to the front counter.</DialogContentText>
                    <DialogContentText>Have you paid?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleConfirm}>Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BillingPopUp;