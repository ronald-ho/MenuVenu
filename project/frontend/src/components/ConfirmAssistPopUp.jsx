import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";
import { apiCall } from "../helpers/helpers";

function ConfirmAssistPopUp ({ open, setOpen, tableNo, setTables }) {
    async function handleConfirm() {
        const data = await apiCall("orders/finish_assist", "POST", {table_number: tableNo});
        if (data.message === "Assistance completed") {
            const data = await apiCall("orders/get_assist", "GET", {});
            console.log(data);
            if (data.assistance_list) {
                setTables(data.assistance_list);
                handleClose();
            }
            else {
                console.log("Failed to fetch tables req assistance");
            }
            console.log("table successfully assisted");
            
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