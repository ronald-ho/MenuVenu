import React from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AssistReqTableButton from "../components/AssistReqTableButton";
import ConfirmAssistPopUp from "../components/ConfirmAssistPopUp";
import { apiCall } from "../helpers/helpers";

function WaitStaff () {
    // ORDER ITEM READY 
    // 1. Poll for new items to be served and show in table
    // 2. If waitstaff clicks table in Table no. column, pop up appears confirming whether food served or not
    // 3. If no, do nothing. If yes, send API call to show item was served. Remove item from list

    // ASSISTANCE REQUIRED
    // 1. Poll for tables needing assistance and show in the column
    // 2. If waitstaff clicks table in column, pop up appears confirming whether assisted or not
    // 3. If no, do nothing. If yes, send API call to show table has been assisted. Remove table from the column
       
    const [tableData, setTableData] = React.useState([]);
    const [showConfirmAssist, setShowConfirmAssist] = React.useState(false);
    const [confirmTable, setConfirmTable] = React.useState();

    React.useEffect(() => {
        const fetchTableData = async () => {
            // Make API call to fetch tables requiring assistance
            const data = await apiCall("orders/get_assist", "GET", {});
            console.log(data);
            if (data.assistance_list) {
                setTableData(data.assistance_list);
                console.log(tableData)
            }
            else {
                console.log("Failed to fetch tables req assistance");
            }
        };

        // Check updates every 5 seconds -> can adjust if suitable
        const interval1 = setInterval(fetchTableData, 5000);

        return () => clearInterval(interval1);
    }, []);

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
                <Box sx={{ height: '74vh', overflow: 'auto' }}>
                    {tableData && tableData.map((table) => (
                        <AssistReqTableButton 
                            key={table} 
                            handleClick={() => {
                                setShowConfirmAssist(true);
                                setConfirmTable(table);
                            }}
                            tableNo={table}
                        >
                        </AssistReqTableButton>
                    ))}
                </Box>
            </Box>
            {showConfirmAssist && <ConfirmAssistPopUp open={showConfirmAssist} setOpen={setShowConfirmAssist} tableNo={confirmTable} setTableNo={setConfirmTable}/>}
        </>
    );
}

export default WaitStaff;