import React from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { apiCall } from "../helpers/helpers";


function ManagerPopup({ open, setOpen }) {
    const [restname, setRestname] = React.useState("MenuVenu");
    const [restphone, setRestphone] = React.useState("6969696969")
    const [staffpass, setStaffpass] = React.useState(null);
    const [managerpass, setManagerpass] = React.useState(null);
    const [numtables, setNumtables] = React.useState(null);
    const [mess, setMess] = React.useState("");

    function handleClose() {
        setOpen(false);
    }

    const getTables = async () => {
        const data = await apiCall("orders/get_tables", "GET", {});
        setNumtables(data.table_list.length);
    }

    React.useEffect(() => {
        getTables();
    }, []);

    async function sendChanges() {
        const payload = {
            restaurant_id: 1,
            new_name: restname,
            new_phone: restphone,
            new_staff_password: staffpass,
            new_manager_password: managerpass,
            num_tables: numtables
        }
        const data = await apiCall("manager/update", "PUT", payload);
        if (data.status === 200) {
            console.log('ey');
            if (data.undeletedtables !== 0) {
                setMess(data.undeletedtables + "tables occupied");
            } else {
                setMess("Successful update");
            }
        } else {
            setMess(data.message);
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} sx={{textAlign: "center"}}>
            <DialogTitle>Manager Settings</DialogTitle>
            <DialogContent>
                <TextField label="Change restaurant name" 
                variant="outlined" margin="normal" value={restname}
                onChange={(e) => {setRestname(e.target.value)}} 
                helperText="Leave empty for no change"/>
                <TextField label="Change restaurant phone number" 
                variant="outlined" margin="normal" value={restphone} 
                onChange={(e) => {setRestphone(e.target.value)}} 
                helperText="Leave empty for no change"/>
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
                onChange={(e) => {setNumtables(e.target.value)}}
                helperText="Leave empty for no change"/>
                {mess && <Alert severity={mess === "Successful update" ? "success" : "error"}>{mess}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
                <Button variant="contained" onClick={sendChanges}>Save changes</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ManagerPopup;