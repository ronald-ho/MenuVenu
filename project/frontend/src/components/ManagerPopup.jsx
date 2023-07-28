import React from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { apiCall } from "../helpers/helpers";


function ManagerPopup({ open, setOpen }) {
    const [staffpass, setStaffpass] = React.useState("");
    const [managerpass, setManagerpass] = React.useState("");
    const [numtables, setNumtables] = React.useState("");

    function handleClose() {
        setOpen(false);
    }

    async function sendChanges() {
        if (staffpass) {
            //apiCall to change staffpass
        }
        if (managerpass) {
            //other one
        }
        //apiCall to set tables
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Manager Settings</DialogTitle>
            <DialogContent>
                <TextField label="Edit staff password" 
                variant="outlined" margin="normal" value={staffpass} 
                onChange={(e) => {setStaffpass(e.target.value)}} 
                helperText="Leave empty for no change"/>
                <TextField label="Edit manager password" 
                variant="outlined" margin="normal" value={managerpass} 
                onChange={(e) => {setManagerpass(e.target.value)}} 
                helperText="Leave empty for no change"/>
                <TextField label="Set number of tables" 
                variant="outlined" margin="normal" type="number" value={numtables}
                onChange={(e) => {setNumtables(e.target.value)}}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
                <Button variant="contained" color="error" onClick={sendChanges}>Save changes</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ManagerPopup;