import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React from "react";

function BillingPopUp ({ tableNo }) {
    // check local storage for customer_id,  then update state variable for customer status and pass into this function 
    const [bill, setBill] = React.useState();

    async function handleConfirm() {
        // navigate to customer selection
    }

    const handleClose = () => {
        setOpen(false);
    };

    // make apicall to get total bill
    async function getBill() {
        const data = await apiCall("orders/bill", "POST", {table_number: tableNo});
        if (data.bill) {
            console.log("Bill amount received");
            setBill(data.bill);
        } 
        else {
            console.log("Failed to get bill amount");
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{"Request Bill"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Your total bill is ${bill}.</DialogContentText>
                    <DialogContentText>You have earned 0 MV points.</DialogContentText>
                    <DialogContentText>Your new balance will be 0 MV points.</DialogContentText>
                    <DialogContentText>Please proceed to the front counter.</DialogContentText>
                    <DialogContentText>Have you paid?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleConfirm} autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BillingPopUp;