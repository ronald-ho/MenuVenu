import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from "@mui/material";
import React from "react";

function TableOrders({ table }) {
    const [orders, setOrders] = React.useState([]);

    const fetchdata = async () => {
        /* add when route done */
        setOrders([]);
    }

    React.useEffect(() => {
        fetchdata();
    }, []);

    return (
        <Box sx={{margin: "1px solid black", padding: "5px"}}>
            <Typography variant="h3">Table {table}</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Energy</TableCell>
                        <TableCell>Cost</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((ordered_item) => <TableRow>
                        <TableCell>{ordered_item.name}</TableCell>
                        <TableCell>{ordered_item.calories}</TableCell>
                        <TableCell>{ordered_item.price}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </Box>
    )
}

export default TableOrders;