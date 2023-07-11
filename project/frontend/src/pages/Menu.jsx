import { Alert, Box, Button } from "@mui/material";
import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import CategoryButton from "../components/CategoryButton";
import { apiCall } from "../helpers/helpers";
import BillingPopUp from "../components/BillingPopUp";
import TableOrders from "../components/TableOrders";

function Menu () {
    const categories = useLoaderData();

    const [updatetable, setUpdatetable] = React.useState(0);
    const [openBilling, setOpenBilling] = React.useState(false);
    const [showInfo, setShowInfo] = React.useState(null);
    const [showAlert, setShowAlert] = React.useState(null);

    // Can get table number from localstorage (saved during table selection) OR
    // Store users under table number in db and API call with useEffect 
    const table = localStorage.getItem("mvtable"); 

    async function handleCallStaff () {
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

    return (
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <Box sx={{border: "1px solid black", margin: "10px", padding: "10px", textAlign: "center"}}>
                {categories.map((category) => <CategoryButton key={category.category_id} category={category}/>)}
            </Box>
            <Outlet context={setUpdatetable}/>
            {/*rename to table order thing*/}
            <TableOrders trigger={updatetable} />
            <Box sx={{ position: 'absolute', bottom: '24px', right: '10px' }}>
                <Button onClick={() => setOpenBilling(true)} variant="contained" sx={{ marginRight: '10px', width: '140px' }}>Request Bill</Button>
                <Button onClick={handleCallStaff} variant="contained" sx={{ width: '140px' }}>Call Staff</Button>
            </Box>
            {openBilling && <BillingPopUp open={openBilling} setOpen={setOpenBilling} tableNo={table}/>} 
            {showInfo && <Alert severity="info" aria-label='infoAlert' sx={{ position: 'fixed', top: '17px', left: '500px', width: '300px' }} >{showInfo}</Alert>}
            {showAlert && <Alert severity="error" aria-label='errorAlert' sx={{ position: 'fixed', top: '17px', left: '500px', width: '300px' }} >{showAlert}</Alert>}
        </div>     
    )
}

export default Menu;