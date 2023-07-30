import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../helpers/helpers";
import React from "react";

function BillingPopUp ({ open, setOpen, tableNo }) {
    const navigate = useNavigate();
    const [bill, setBill] = React.useState(0);
    const [currPoints, setCurrPoints] = React.useState(0);
    const [pointsEarned, setPointsEarned] = React.useState(0);
    const [hasPaid, setHasPaid] = React.useState(false);
    const [finalPayment, setFinalPayment] = React.useState(0);

    const [newPoints, setNewPoints] = React.useState(0);

    const customerId = localStorage.getItem("mvuser");

    async function handleConfirm(redeemvalue) {
        // Once finish dining and paid, "log out"
        const body = {
            table_number: tableNo,
            customer_id: customerId,
            redeem: redeemvalue
        }
        const data = await apiCall("orders/pay_bill", "POST", body);
        if (data.status !== 200) {
            console.log("hey this doesnt work btw");
        } else {
            setHasPaid(true);
            setFinalPayment(data.amount);
        }
    }

    const handleExit = () => {
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
                setPointsEarned(data.points_earned);

                if (customerId) {
                    const cust = await apiCall("auth/customer/" + customerId, "GET", {});
                    setCurrPoints(cust.customer_info.points);
                    setNewPoints(pointsEarned + currPoints);
                }
            } 
            else {
                console.log("Failed to get bill amount");
            }
        }
        
        getBill();
      }, []); 

    return (
        <>
            {!hasPaid ? (
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>{"Request Bill"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Your total current bill is ${bill}.</DialogContentText>
                        {customerId && 
                            <>
                                <DialogContentText>You currently have {currPoints} MV points.</DialogContentText>
                                <DialogContentText>You have earned {pointsEarned} MV points.</DialogContentText>
                                <DialogContentText>Your new balance will be {newPoints} MV points.</DialogContentText>
                                <DialogContentText>You can spend 100 MV points for a 10% discount</DialogContentText>  
                            </>
                        }
                        <DialogContentText>Are you ready to stop dining and pay your bill?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="error">No</Button>
                        <Button onClick={async () => await handleConfirm(false)} variant="contained" color="success">Yes, pay bill</Button>
                        {customerId && <Button onClick={async () => await handleConfirm(true)} disabled={currPoints < 100}>Yes, apply the discount</Button>}
                    </DialogActions>
                </Dialog>
            ) : (
                <Dialog open={open} onClose={handleExit}>
                    <DialogTitle>Thank you for dining with us</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Please proceed to the counter and pay ${finalPayment}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleExit()} variant="contained">Finish dining</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    )
}

export default BillingPopUp;