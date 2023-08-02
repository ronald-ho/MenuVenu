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
        <Box 
            sx={{
                margin: "10px 0 0 0",
                textAlign: "center",
                width: '50vw'
            }}
        >
            <Typography variant="h4" sx={{ margin: '0 0 20px 0' }}>{item_info.name}</Typography>
            <Box sx={{ columnGap: "20px", display: 'flex' }}>
                <Box sx={{ textAlign: "center", width: 3/8 }}>
                    <Box sx={{ alignItems: "center", border: "1px solid #caccce", display: "flex", height: "200px", margin: 'auto', width: "200px" }}>
                        {item_info.image ? (
                            <img src={item_info.image} alt={item_info.name} style={{maxWidth: "200px", maxHeight: "200px"}}/>
                        ) : (
                            <Typography 
                                sx={{ 
                                    fontSize: '130px', 
                                    fontWeight: 700, 
                                    opacity: '0.1' 
                                }}
                            >
                                MV
                            </Typography>
                        )}
                    </Box>
                    {item_info.calories && <Typography>{item_info.calories} Cal</Typography>}
                    {item_info.ingredients.map((i) => ( <Chip label={i} /> ))}
                </Box>
                <Box sx={{ width: 5/8 }}>
                    <Box sx={{ height: "150px", textAlign: "right" }}>
                        <Typography>Price: ${item_info.price.toFixed(2)}</Typography>
                        {item_info.points_to_redeem && <Typography>Redeem for: {item_info.points_to_redeem} MV points</Typography>}
                        {item_info.points_earned && <Typography>Earn extra: {item_info.points_earned} MV points</Typography>}
                    </Box>
                    {item_info.description && <Typography sx={{ textAlign: 'left' }}>{item_info.description}</Typography>}
                </Box>
            </Box>
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