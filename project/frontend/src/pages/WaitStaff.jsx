import React from "react";
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AssistReqTableButton from "../components/AssistReqTableButton";
import ConfirmAssistPopUp from "../components/ConfirmAssistPopUp";
import { apiCall } from "../helpers/helpers";
import WaitstaffOrderRow from "../components/WaitstaffOrderRow";

function WaitStaff () {
    // ORDER ITEM READY 
    // 1. Poll for new items to be served and show in table
    // 2. If waitstaff clicks table in Table no. column, pop up appears confirming whether food served or not
    // 3. If no, do nothing. If yes, send API call to show item was served. Remove item from list
       
    const [tablesToAssist, setTablesToAssist] = React.useState([]);
    const [orderItemsToServe, setOrderItemsToServe] = React.useState([]);
    const [showConfirmAssist, setShowConfirmAssist] = React.useState(false);
    const [confirmTableAssist, setConfirmTableAssist] = React.useState();

    React.useEffect(() => {
        const getTablesNeedAssist = async () => {
            const data = await apiCall("orders/get_assist", "GET", {});
            console.log(data);
            if (data.assistance_list) {
                setTablesToAssist(data.assistance_list);
                console.log(data.assistance_list);
            }
            else {
                console.log("Failed to fetch tables req assistance");
            }
        };

        // Check updates every 5 seconds -> can adjust if suitable
        const interval1 = setInterval(getTablesNeedAssist, 5000);

        return () => clearInterval(interval1);
    }, [tablesToAssist]);

    React.useEffect(() => {    
        const getOrdersToServe = async () => {
            const data = await apiCall("orders/get_serve_list", "GET", {});
            console.log(data);
            if (data.serve_list) {
                setOrderItemsToServe(data.serve_list);
                console.log(data.serve_list);
            }
            else {
                console.log("Failed to fetch orders");
            }
        };

        // Check updates every 5 seconds -> can adjust if suitable
        const interval2 = setInterval(getOrdersToServe, 5000);

        return () => clearInterval(interval2);
    }, [orderItemsToServe]);


    return (
        <>
            <Box sx={{border: "1px solid black", borderRadius: "15px", margin: "10px auto", padding: "10px", width: "70vw"}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>ORDER ITEM READY</b></TableCell>
                            <TableCell><b>TABLE #</b></TableCell>
                            <TableCell><b>CONFIRM SERVE?</b></TableCell>
                        </TableRow>
                    </TableHead> 
                    <TableBody>
                        {orderItemsToServe.length === 0 ? (
                            <Typography sx={{textAlign: 'center'}}> No orders ready yet</Typography>
                        ) : (
                            orderItemsToServe.map((orderItem) => 
                                <WaitstaffOrderRow key={orderItem.ordered_item_id} orderItem={orderItem} />
                            )
                        )}
                    </TableBody>
                </Table>
            </Box>
            <Box
                sx={{
                    border: 1,
                    borderRadius: "15px 0 0 15px",
                    borderRight: 0,
                    fontSize: '15px',
                    position: 'absolute',
                    margin: '10px 0 0 0',
                    textAlign: 'center',
                    top: '81.6px',
                    right: 0,
                    width: '140px',
                    height: '84vh',
                }}
            >
                <Typography sx={{ fontWeight: 'bold', padding: '15px 10px' }}>
                    ASSISTANCE REQUIRED AT
                </Typography>
                <Box sx={{ height: '74vh'}}>
                    {tablesToAssist.length === 0 ? (
                        <Box>
                            <Typography sx={{ margin: "0 0 35px 0" }}>Waiting for tables</Typography>
                            <CircularProgress />
                        </Box> 
                    ) : (
                        tablesToAssist.map((table) => (
                            <AssistReqTableButton 
                                key={table} 
                                handleClick={() => {
                                    setShowConfirmAssist(true);
                                    setConfirmTableAssist(table);
                                }}
                                tableNo={table}
                            >
                            </AssistReqTableButton>
                        )) 
                    )}
                </Box>
            </Box>
            {showConfirmAssist && <ConfirmAssistPopUp open={showConfirmAssist} setOpen={setShowConfirmAssist} tableNo={confirmTableAssist} setTablesToAssist={setTablesToAssist}/>}
        </>
    );
}

export default WaitStaff;