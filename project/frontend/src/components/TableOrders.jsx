import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from "@mui/material";
import React from "react";
import { apiCall } from "../helpers/helpers";
import { get_profile } from "../helpers/loaderfunctions";

function TableOrders({ trigger, caloriesBurned }) {
    const table = localStorage.getItem("mvtable");
    const customer = localStorage.getItem("mvuser");

    const [orders, setOrders] = React.useState([]);
    const [bill, setBill] = React.useState(0);
    const [caloriesGained, setCaloriesGained] = React.useState(0);

    React.useEffect(() => {
        const fetchOrderedItems = async () => {
            const body = {
                "table_number": localStorage.getItem("mvtable")
            };
            const response = await apiCall("orders/get_ordered_items", "POST", body);
            setOrders(response?.ordered_list ?? []);
        }
    
        const fetchCurrBill = async () => {
            const data = await apiCall("orders/get_bill", "POST", { 'table_number': table });
            if (data.order_count) {
                console.log("Bill amount received");
                setBill(data.bill);
            }
        }

        // const fetchCaloriesGained = async () => {
        //     const user = await get_profile();
        //     if (user !== []) {
        //         setCaloriesGained(user.calories_gained);
        //     }
        // }

        fetchOrderedItems();
        fetchCurrBill();
        // fetchCaloriesGained();
    }, [trigger]);

    return (
        <>
            <Box 
                sx={{ 
                    backgroundColor: '#ffffff', 
                    border: "1px solid #caccce", 
                    borderRadius: "10px",
                    height: '60vh',
                    padding: '0 10px'
                }}
            >
                <Box sx={{ height: '60vh', overflow: 'auto' }}>
                    <Typography variant="h4" sx={{ margin: "10px 0 0 0", textAlign: 'center' }}>Table {table}</Typography>
                    {orders.length === 0 ? (
                        <Typography sx={{ textAlign: 'center' }}>No items ordered</Typography>
                    ) : (
                        <Table stickyHeader size='small'>
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
            </Box>
            <Box 
                sx={{ 
                    backgroundColor: '#ffffff', 
                    border: "1px solid #caccce", 
                    borderRadius: "10px",
                    height: '20vh',
                    margin: '10px 0 0 0',
                    padding: '0 10px', 
                }}
            >
                <Table size='small'>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ textAlign: 'right' }}>Total Cost</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>${bill.toFixed(2)}</TableCell>
                        </TableRow>
                        {customer &&
                            <TableRow>
                                <TableCell sx={{ textAlign: 'right' }}>Calories Burned</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{caloriesBurned}</TableCell>
                            </TableRow>
                        }
                        <TableRow>
                            <TableCell sx={{ textAlign: 'right' }}>Calories Gained</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{caloriesGained}</TableCell>
                        </TableRow>
                        {customer &&
                            <TableRow>
                                <TableCell sx={{ borderBottom: 0, textAlign: 'right' }}>Net Calories</TableCell>
                                <TableCell sx={{ borderBottom: 0, textAlign: 'right' }}>{-caloriesBurned + caloriesGained}</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </Box>
        </>
    )
}

export default TableOrders;