import { Button } from "@mui/material";
import React from "react";

function AssistReqTableButton ({ handleClick, tableNo }) {
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

    return (
        <Button onClick={handleClick} sx={button_css}>Table<br />{tableNo}</Button>
    )
}

export default AssistReqTableButton;