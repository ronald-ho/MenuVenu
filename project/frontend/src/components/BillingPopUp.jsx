import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../helpers/helpers";
import React from "react";

function BillingPopUp ({ open, setOpen, tableNo }) {
    const navigate = useNavigate();
    const [bill, setBill] = React.useState(0);
    const [curpoints, setCurpoints] = React.useState(0);
    const [pointsearned, setPointsearned] = React.useState(0);

    const customerId = localStorage.getItem("mvuser");

    async function handleConfirm() {
        // Once finish dining and paid, "log out"
        const body = {
            table_number: tableNo,
            customer_id: customerId,
            redeem: false
        }
        const data = await apiCall("orders/pay_bill", "POST", body);
        if (data.status !== 200) {
            console.log("hey this doesnt work btw");
        }
        localStorage.removeItem("mvuser");
        localStorage.removeItem("mvtable");
        navigate("/customerselect");
    }

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        async function getBill() {
            const data = await apiCall("orders/get_bill", "POST", { 'table_number': tableNo });
            if (data.bill) {
                console.log("Bill amount received");
                setBill(data.bill);
                setPointsearned(data.points_earned);
            } 
            else {
                console.log("Failed to get bill amount");
            }
            if (customerId) {
                const cust = await apiCall("auth/customer/" + customerId, "GET", {});
                setCurpoints(cust.customer_info.points);
            }
        }
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
                            <DialogContentText>You have earned {pointsearned} MV points.</DialogContentText>
                            <DialogContentText>Your new balance will be {curpoints} MV points.</DialogContentText>
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