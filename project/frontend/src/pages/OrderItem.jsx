import { Alert, Box, Button, Chip, Typography } from "@mui/material";
import React from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { apiCall } from "../helpers/helpers";

function OrderItem() {
    const updatevalue = useOutletContext();
    const item_info = useLoaderData();
    const [ordercount, setOrdercount] = React.useState(1);
    const [alert, setAlert] = React.useState(false);

    async function sendOrder(points) {
        const body = {
            "name": item_info.name,
            "table_number": localStorage.getItem("mvtable"),
            "redeem": points,
            "customer_id": localStorage.getItem("mvuser")
        }
        let i = 0;
        while (i < ordercount) {
            const response = await apiCall("orders/order_item", "POST", body);
            if (response.status === 400) {
                setAlert(true);
                break;
            }
            i++;
        }
        
        updatevalue((c) => c + 1);
    }

    return (
        <Box sx={{textAlign: "center"}}>
            <div style={{display: "inline-block"}}>
                <Typography variant="h4">{item_info.name}</Typography>
                <img src={item_info.image} alt={item_info.name} style={{maxWidth: "100px", maxHeight: "100px"}}/>
                <Typography>${item_info.price}</Typography>
                {item_info.points_to_redeem && <Typography>{item_info.points_to_redeem} MV points</Typography>}
            </div>
            <div style={{display: "inline-block"}}>
                <Typography>{item_info.description}</Typography>
            </div>
            <br />
            <div style={{display: "flex", justifyContent: "center"}}>
                <Button disabled={ordercount <= 1} onClick={() => {setOrdercount(ordercount => ordercount-1)}}>-</Button>
                <Typography>{ordercount}</Typography>
                <Button onClick={() => {setOrdercount(ordercount => ordercount+1)}}>+</Button>
            </div>
            <br />
            {item_info.points_to_redeem > 0 && <Button onClick={() => {sendOrder(true)}}>Redeem with points</Button>}
            <Button onClick={() => {sendOrder(false)}}>Add to order</Button>
            {alert && <Alert severity="error">Not enough points</Alert>}
        </Box>
    )
}

export default OrderItem;