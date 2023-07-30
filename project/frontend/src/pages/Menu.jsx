import { Alert, Box, Button } from "@mui/material";
import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import CategoryButton from "../components/CategoryButton";
import { apiCall } from "../helpers/helpers";
import BillingPopUp from "../components/BillingPopUp";
import TableOrders from "../components/TableOrders";

function Menu () {
    const categories = useLoaderData();

    const [updateTable, setUpdateTable] = React.useState(0);
    const [openBilling, setOpenBilling] = React.useState(false);
    const [showInfo, setShowInfo] = React.useState(null);
    const [showAlert, setShowAlert] = React.useState(null);

    const [bill, setBill] = React.useState(0);
    const [currPoints, setCurrPoints] = React.useState(0);
    const [pointsEarned, setPointsEarned] = React.useState(0);
    const [newPoints, setNewPoints] = React.useState(0);

    const table = localStorage.getItem("mvtable"); 

    async function handleCallStaff () {
        console.log(table);
        const data = await apiCall('orders/req_assist', 'POST', { 'table_number': table });
        console.log(data);
        if (data.message === 'Assistance requested') {
            setShowInfo('Staff assistance has been called');
            setTimeout(() => setShowInfo(null), 5000);
        }
        else if (data.message === 'Assistance already requested') {
            setShowAlert(data.message);
            setTimeout(() => setShowAlert(null), 5000);
        }
    }

    async function handleRequestBill() {
        const customerId = localStorage.getItem("mvuser");
        const data = await apiCall("orders/get_bill", "POST", { 'table_number': table });
        if (data.bill) {
            console.log("Bill amount received");
            setBill(data.bill);
            setPointsEarned(data.points_earned);

            if (customerId) {
                const cust = await apiCall("auth/customer/" + customerId, "GET", {});
                setCurrPoints(cust.customer_info.points);
                setNewPoints(data.points_earned + cust.customer_info.points);
            }

            setOpenBilling(true);
        } 
        else {
            setShowAlert("Cannot request bill, no items in order.");
            setTimeout(() => setShowAlert(null), 5000);
        }
    }

    return (
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <Box sx={{border: "1px solid black", margin: "10px", padding: "10px", textAlign: "center", borderRadius: "10px"}}>
                {categories.map((category) => <CategoryButton key={category.category_id} category={category}/>)}
            </Box>
            <Outlet context={setUpdateTable}/>
            <TableOrders trigger={updateTable} />
            <Box sx={{ position: 'absolute', bottom: '24px', right: '10px' }}>
                <Button onClick={handleRequestBill} variant="contained" sx={{ marginRight: '10px', width: '140px' }}>Request Bill</Button>
                <Button onClick={handleCallStaff} variant="contained" sx={{ width: '140px' }}>Call Staff</Button>
            </Box>
            {openBilling && 
                <BillingPopUp 
                    open={openBilling} 
                    setOpen={setOpenBilling} 
                    tableNo={table}
                    bill={bill}
                    currPoints={currPoints} 
                    pointsEarned={pointsEarned}
                    newPoints={newPoints}
                    />} 
            {showInfo && <Alert severity="info" aria-label='infoAlert' sx={{ position: 'fixed', top: '17px', left: '500px', width: '300px' }} >{showInfo}</Alert>}
            {showAlert && <Alert severity="error" aria-label='errorAlert' sx={{ position: 'fixed', top: '17px', left: '500px', width: '300px' }} >{showAlert}</Alert>}
        </div>     
    )
}

export default Menu;