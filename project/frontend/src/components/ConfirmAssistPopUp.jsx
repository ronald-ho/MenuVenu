import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

function ConfirmAssistPopUp ({ open, setOpen, table}) {
    async function handleConfirm() {
        const data = await apiCall("orders/finish_assist", "POST", {table_number: table});
        if (data.message === "Assistance completed") {
            // remove table from column or
            // likely reload a list of all tables needing assist
        } 
        else {
            // setShowAlert(data.message);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{"Confirm Table Assisted"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Have you assisted Table {table}?</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>No</Button>
                <Button onClick={handleConfirm} autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfirmAssistPopUp;