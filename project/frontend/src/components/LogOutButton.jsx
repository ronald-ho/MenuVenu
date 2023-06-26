import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LogOutButton () {
    /* Replace with function that removes token and redirects to start page in future */
    const nav = useNavigate();

    function logout() {
        localStorage.removeItem("mvuser");
        nav("/login");
    }

    return (
        <Button variant="contained" onClick={logout}>LogOut</Button>
    )

}

export default LogOutButton;