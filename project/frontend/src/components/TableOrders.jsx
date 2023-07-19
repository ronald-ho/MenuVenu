import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from "@mui/material";
import React from "react";
import { apiCall } from "../helpers/helpers";

function TableOrders({ trigger }) {
    const [orders, setOrders] = React.useState([]);
    const table = localStorage.getItem("mvtable");
    const fetchdata = async () => {
        const body = {
            "table": localStorage.getItem("mvtable")
        };
        const response = await apiCall("orders/get_ordered_items", "POST", body);
        setOrders(response?.ordered_list ?? []);
    }

    React.useEffect(() => {
        fetchdata();
    }, [trigger]);

    return (
        <Box sx={{border: "1px solid black", padding: "10px", margin: "5px", overflow: "auto", borderRadius: "10px"}}>
            <Typography variant="h3">Table {table}</Typography>
            {orders.length === 0 ? (
                <Typography>No orders available</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Energy</TableCell>
                            <TableCell>Cost</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((ordered_item) => (
                            <TableRow key={ordered_item.id}>
                                <TableCell>{ordered_item.name}</TableCell>
                                <TableCell>{ordered_item.calories}</TableCell>
                                <TableCell>{ordered_item.redeemed ? ordered_item.points_to_redeem + " MV Points" : "$" + ordered_item.price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Box>
    )
}

export default TableOrders;