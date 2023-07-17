import React from "react";
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AssistReqTableButton from "../components/AssistReqTableButton";
import ConfirmAssistPopUp from "../components/ConfirmAssistPopUp";
import { apiCall } from "../helpers/helpers";

function WaitStaff () {
    // ORDER ITEM READY 
    // 1. Poll for new items to be served and show in table
    // 2. If waitstaff clicks table in Table no. column, pop up appears confirming whether food served or not
    // 3. If no, do nothing. If yes, send API call to show item was served. Remove item from list
       
    const [tables, setTables] = React.useState([]);
    const [showConfirmAssist, setShowConfirmAssist] = React.useState(false);
    const [confirmTable, setConfirmTable] = React.useState();

    React.useEffect(() => {
        const fetchTablesNeedAssist = async () => {
            const data = await apiCall("orders/get_assist", "GET", {});
            console.log(data);
            if (data.assistance_list) {
                setTables(data.assistance_list);
                console.log(tables);
            }
            else {
                console.log("Failed to fetch tables req assistance");
            }
        };

        // Check updates every 5 seconds -> can adjust if suitable
        const interval1 = setInterval(fetchTablesNeedAssist, 5000);

        return () => clearInterval(interval1);
    }, [tables]);

    return (
        <>
            <Table sx={{ margin: 'auto', maxWidth: 700 }}>
                <TableHead sx={{ border: 1, borderTop: 0 }}>
                    <TableRow>
                        <TableCell sx={{ borderRight: 1, borderBottom: 1 }}><b>ORDER ITEM READY</b></TableCell>
                        <TableCell sx={{ borderBottom: 1 }}><b>TABLE NO.</b></TableCell>
                    </TableRow>
                </TableHead> 
            </Table>
            <Typography sx={{textAlign: 'center'}}> No orders ready yet</Typography>
            <Box
                sx={{
                    border: 1,
                    borderTop: 0,
                    fontSize: '15px',
                    position: 'absolute',
                    textAlign: 'center',
                    top: '81.6px',
                    right: 0,
                    width: '140px',
                    height: '85vh',
                }}
            >
                <Typography sx={{ fontWeight: 'bold', padding: '15px 10px' }}>
                    ASSISTANCE REQUIRED AT
                </Typography>
                <Box sx={{ height: '74vh'}}>
                    {tables.length === 0 ? (
                        <Box>
                            <Typography sx={{ margin: "0 0 35px 0" }}>Waiting for tables</Typography>
                            <CircularProgress />
                        </Box> 
                    ) : (
                        tables.map((table) => (
                            <AssistReqTableButton 
                                key={table} 
                                handleClick={() => {
                                    setShowConfirmAssist(true);
                                    setConfirmTable(table);
                                }}
                                tableNo={table}
                            >
                            </AssistReqTableButton>
                        )) 
                    )}
                </Box>
            </Box>
            {showConfirmAssist && <ConfirmAssistPopUp open={showConfirmAssist} setOpen={setShowConfirmAssist} tableNo={confirmTable} setTables={setTables}/>}
        </>
    );
}

export default WaitStaff;