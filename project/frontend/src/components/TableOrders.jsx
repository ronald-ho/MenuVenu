import { Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from "@mui/material";
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
        <Box
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                height: '75vh', 
                margin: "10px",
                width: 20/100
            }}
        >
            <Box 
                sx={{ 
                    backgroundColor: '#ffffff', 
                    border: "1px solid #caccce", 
                    borderRadius: "10px",
                    height: '60vh',
                    overflow: "auto", 
                    padding: "10px", 
                }}
            >
                <Typography variant="h3" sx={{ textAlign: 'center' }}>Table {table}</Typography>
                {orders.length === 0 ? (
                    <Typography>No items ordered</Typography>
                ) : (
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Energy (Cal)</TableCell>
                                <TableCell>Cost ($)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((ordered_item) => (
                                <TableRow key={ordered_item.id}>
                                    <TableCell>{ordered_item.name}</TableCell>
                                    <TableCell>{ordered_item.calories}</TableCell>
                                    <TableCell>
                                        {ordered_item.redeemed ? (
                                            <>
                                                0.00
                                                <Typography sx={{ fontSize: '12px' }}>(- {ordered_item.points_to_redeem} MV points)</Typography>  
                                            </>
                                        ) : ( 
                                            ordered_item.price
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
            <Box 
                sx={{ 
                    backgroundColor: '#ffffff', 
                    border: "1px solid #caccce", 
                    borderRadius: "10px",
                    height: '15vh',
                    margin: '10px 0 0 0',
                    padding: "10px", 
                }}
            >
                Total Cost<br/>
                Calories burned <br/>
                Calories gained <br/>
                Net calories
            </Box>
        </Box>
    )
}

export default TableOrders;