import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../helpers/helpers";
import React from "react";

function BillingPopUp ({ open, setOpen, tableNo, bill, currPoints, pointsEarned, newPoints }) {
    const navigate = useNavigate();
    const [hasPaid, setHasPaid] = React.useState(false);
    const [finalPayment, setFinalPayment] = React.useState(0);
    const [isUseDiscount, setIsUseDiscount] = React.useState(false);
    const [newBalance, setNewBalance] = React.useState(newPoints);
    const [pointsGained, setPointsGained] = React.useState(pointsEarned);
    const [newBill, setNewBill] = React.useState(0);

    const customerId = localStorage.getItem("mvuser");

    async function handleConfirm() {
        const body = {
            table_number: tableNo,
            customer_id: customerId,
            redeem: isUseDiscount
        }
        const data = await apiCall("orders/pay_bill", "POST", body);
        if (data.status !== 200) {
            console.log("hey this doesnt work btw");
        } else {
            setHasPaid(true);
            setFinalPayment(data.amount);
        }
    }

    function handleUseDiscount (isChecked) {
        setIsUseDiscount(isChecked);
        const discountPointsEarned = pointsEarned - Math.floor(bill) + Math.floor(bill * 0.9);
        const discountPointsBalance = currPoints + discountPointsEarned - 100;
        setNewBill(isChecked ? bill * 0.9 : bill);
        setNewBalance(isChecked ? discountPointsBalance : newPoints);
        setPointsGained(isChecked ? discountPointsEarned : pointsEarned);
    }

    const handleExit = () => {
        localStorage.removeItem("mvuser");
        localStorage.removeItem("mvtable");
        navigate("/customerselect");
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {!hasPaid ? (
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>{"Request Bill"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Your total current bill is ${bill.toFixed(2)}.</DialogContentText>
                        {customerId && 
                            <>
                                <DialogContentText>You currently have {currPoints} MV points.</DialogContentText>
                                {currPoints >= 100 && 
                                    <FormControlLabel 
                                        onChange={(e) => {handleUseDiscount(e.target.checked)}}
                                        control={<Checkbox />} 
                                        label="Redeem 100 MV points for a 10% discount?"
                                    />
                                }
                                {isUseDiscount && <DialogContentText>Your new bill is ${newBill.toFixed(2)}.</DialogContentText>} 
                                <DialogContentText>You will earn {pointsGained} MV points.</DialogContentText>
                                <DialogContentText>Your new balance will be {newBalance} MV points.</DialogContentText>
                            </>
                        }
                        <DialogContentText>Are you ready to stop dining and pay your bill?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="error">No</Button>
                        <Button onClick={() => handleConfirm()} variant="contained" color="success">Yes, pay bill</Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <Dialog open={open} onClose={handleExit}>
                    <DialogTitle>Thank you for dining with us</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Please proceed to the counter and pay ${finalPayment.toFixed(2)}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleExit} variant="contained">Finish dining</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    )
}

export default BillingPopUp;