import { Box, Button } from "@mui/material";
import React from "react";

function AssistReqTableButton ({ handleClick, table }) {
    // change colour later 
    const button_css = { 
        border: 1,
        borderRadius: '50%', 
        fontSize: '18px',
        height: '85px',
        lineHeight: '25px',
        marginBottom: '20px',
        width: '85px'
    };

    // change to Table {table.table_id} later

    return (
        <Button onClick={handleClick} sx={button_css}>Table<br></br>{table}</Button>
    )
}

export default AssistReqTableButton;