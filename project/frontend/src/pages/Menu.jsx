import { Alert, Box, Button } from "@mui/material";
import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import CategoryButton from "../components/CategoryButton";
import { apiCall } from "../helpers/helpers";
import BillingPopUp from "../components/BillingPopUp";
import TableOrders from "../components/TableOrders";
import { get_profile } from "../helpers/loaderfunctions";

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
    const [googleConnected, setGoogleConnected] = React.useState(false);
    const [caloriesBurned, setCaloriesBurned] = React.useState(0);

    const table = localStorage.getItem("mvtable"); 

    React.useEffect(() => {
        const getCaloriesBurned = async () => {
            const user = await get_profile();
            if (user !== []) {
                setCaloriesBurned(user.calories_burnt);
            }
        }

        getCaloriesBurned();
    }, []);

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
        if (data.order_count) {
            console.log("Bill amount received");
            setBill(data.bill);
            setPointsEarned(data.points_earned);

            if (customerId) {
                const cust = await apiCall("auth/customer/" + customerId, "GET", {});
                setCurrPoints(cust.customer_info.points);
                setNewPoints(data.points_earned + cust.customer_info.points);

                const google_connected = cust.customer_info.google_connected;
                setGoogleConnected(google_connected);
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
            <Box
                sx={{
                    backgroundColor: '#ffffff',
                    border: "1px solid #caccce",
                    borderRadius: "10px",
                    height: '82vh',
                    margin: "10px 10px 0 10px",
                    padding: "2px 10px 10px 10px",
                    textAlign: "center",
                    width: 15/100
                }}
            >
                <Box sx={{ height: '82vh', overflow: 'auto' }}>
                    {categories.map((category) => <CategoryButton key={category.category_id} category={category}/>)}
                </Box>
            </Box>
            <Outlet context={setUpdateTable}/>
            <Box
                sx={{
                    borderRadius: "10px",
                    height: '82vh',
                    margin: "10px",
                    textAlign: "center",
                    display: 'flex',
                    flexDirection: 'column',
                    width: 20/100
                }}
            >
                <TableOrders trigger={updateTable} caloriesBurned={caloriesBurned} />
                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px',
                        margin: '10px auto'
                    }
                }>
                    <Button onClick={handleRequestBill} variant="contained" sx={{ width: '130px' }}>Request Bill</Button>
                    <Button onClick={handleCallStaff} variant="contained" sx={{ width: '130px' }}>Call Staff</Button>
                </Box>
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
                    googleConnected={googleConnected}
                />
            } 
            {showInfo && <Alert severity="info" aria-label='infoAlert' sx={{ position: 'fixed', top: '17px', left: '500px', width: '300px' }} >{showInfo}</Alert>}
            {showAlert && <Alert severity="error" aria-label='errorAlert' sx={{ position: 'fixed', top: '17px', left: '500px', width: '300px' }} >{showAlert}</Alert>}
        </div>     
    )
}

export default Menu;