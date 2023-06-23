import { Box, Button } from "@mui/material";
import React from "react";

function AssistReqTableButton ({ table }) {
    // change colour later 
    const circle_css = { 
        border: 1,
        borderRadius: '50%', 
        fontSize: '18px',
        height: '85px',
        lineHeight: '25px',
        width: '85px'
    };

    // change to Table {table.table_id} later

    return (
        <>
            <Box component={Button} sx={circle_css}>Table<br></br>{table}</Box>
        </>
    )
}

export default AssistReqTableButton;