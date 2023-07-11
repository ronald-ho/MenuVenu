import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useLoaderData } from "react-router-dom";

function OrderItem() {
    const item_info = useLoaderData();
    const [ordercount, setOrdercount] = React.useState(1);

    return (
        <Box sx={{textAlign: "center"}}>
            <div style={{display: "inline-block"}}>
                <Typography variant="h4">{item_info.name}</Typography>
                <img src={item_info.image}  style={{maxWidth: "100px", maxHeight: "100px"}}/>
            </div>
            <div style={{display: "inline-block"}}>
                <Typography>${item_info.price}</Typography>
                <Typography>{item_info.description}</Typography>
            </div>
            <br />
            <div style={{display: "flex", justifyContent: "center"}}>
                <Button disabled={ordercount <= 1} onClick={() => {setOrdercount(ordercount => ordercount-1)}}>-</Button>
                <Typography>{ordercount}</Typography>
                <Button onClick={() => {setOrdercount(ordercount => ordercount+1)}}>+</Button>
            </div>
            <br />
            <Button type="submit">Add to order</Button>

        </Box>
    )
}

export default OrderItem;