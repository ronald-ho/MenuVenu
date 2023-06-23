import React from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AssistReqTableButton from "../components/AssistReqTableButton";
import ConfirmAssistPopUp from "../components/ConfirmAssistPopUp";

function WaitStaff () {
    const [showConfirmAssist, setShowConfirmAssist] = React.useState(false);

    // ORDER ITEM READY 
    // 1. Poll for new items to be served and show in table
    // 2. If waitstaff clicks table in Table no. column, pop up appears confirming whether food served or not
    // 3. If no, do nothing. If yes, send API call to show item was served. Remove item from list

    // ASSISTANCE REQUIRED
    // 1. Poll for tables needing assistance -> in db will have "assistance" field etc.
    // 2. If needs assistance, show in the column
    // 3. If waitstaff clicks table in column, pop up appears confirming whether assisted or not
    // 4. If no, do nothing. If yes, send API call to show table has been assisted. Remove table from the column

    // loop through tables req assistance and display buttons in column
    // poll to reload and reflect changes

    return (
        <>
            <Table sx={{ margin: 'auto', maxWidth: 600 }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ borderLeft: 1, borderRight: 1}}><b>ORDER ITEM READY</b></TableCell>
                        <TableCell sx={{ borderRight: 1}}><b>TABLE NO.</b></TableCell>
                    </TableRow>
                </TableHead> 
                <TableBody>
                    <TableRow>Insert row</TableRow>
                </TableBody>
            </Table>

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
                <Typography sx={{
                    fontWeight: 'bold',
                    padding: '15px 10px',
                }}>ASSISTANCE REQUIRED AT</Typography>
                <Box sx={{ 
                    height: '74vh',
                    overflow: 'auto' 
                }}>
                    <AssistReqTableButton handleClick={() => setShowConfirmAssist(true)} table={1}></AssistReqTableButton>
                    <AssistReqTableButton handleClick={() => setShowConfirmAssist(true)} table={2}></AssistReqTableButton>
                </Box>
            </Box>
            {showConfirmAssist && <ConfirmAssistPopUp open={showConfirmAssist} setOpen={setShowConfirmAssist} table={1}/>}
        </>
    );
}

export default WaitStaff;