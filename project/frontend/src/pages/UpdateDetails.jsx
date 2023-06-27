import { TextField, Typography, Button, Alert } from "@mui/material";
import React from "react";
import { Form, useLoaderData, Link, useActionData } from "react-router-dom";

function UpdateDetails() {
    const details = useLoaderData();
    const response = useActionData();
    const [name, setName] = React.useState(details.full_name);
    const [email, setEmail] = React.useState(details.email);
    const [password, setPassword] = React.useState("");

    return (
        <>
        <Button component={Link} to={"/updateaccount"}>Back</Button>
        <div style={{textAlign: "center"}}>
            <Typography variant="h2">{details.name}</Typography>
            <Form method="put">
                <TextField sx={{margin: '10px'}} type="text" value={name} name="name" label="Change name" onChange={(e) => setName(e.target.value)} />
                <br />
                <TextField sx={{margin: '10px'}} type="text" value={email} name="email" label="Change email" onChange={(e) => setEmail(e.target.value)} />
                <br />
                <TextField sx={{margin: '10px'}} type="text" value={password} name="password" label="Change password" onChange={(e) => setPassword(e.target.value)} />
                <br />
                <Button variant="contained" type="submit">Submit</Button>
            </Form>
            {response !== undefined && <Alert severity={response === "Success!" ? "success" : "error"} sx={{ margin: 'auto', width: '300px' }}>{response}</Alert>}
        </div>
        </>
    )
}

export default UpdateDetails;