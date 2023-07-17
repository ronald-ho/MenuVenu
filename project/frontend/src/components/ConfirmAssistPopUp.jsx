import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";
import { apiCall } from "../helpers/helpers";

function ConfirmAssistPopUp ({ open, setOpen, tableNo, setTableNo }) {
    async function handleConfirm() {
        const data = await apiCall("orders/finish_assist", "POST", {table_number: tableNo});
        if (data.message === "Assistance completed") {
            // The polling should have one less table in the data, and rerender
            console.log("table successfully assisted");
            setTableNo(null);
        } 
        else {
            console.log("failed to fetch tables");
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
                    <DialogContentText>Have you assisted Table {tableNo}?</DialogContentText>
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