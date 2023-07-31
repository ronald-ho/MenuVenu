import React from "react";
import { apiCall } from "../helpers/helpers";
import { Dialog, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

function ChatbotPopup({ open, setOpen }) {
    const [hasLoaded, setHasLoaded] = React.useState(false);
    const [questions, setQuestions] = React.useState([]);
    const [answers, setAnswers] = React.useState([]);

    const createChatBot = async () => {
        const data = apiCall("chatbot/data_update", "PUT", {});
        if (data.status === 200) {
            setHasLoaded(true);
        }
    }

    async function askQuestion(e) {
        if (e.keyCode == 13) {
            const question = e.target.value;
            setQuestions(oldArray => [...oldArray, question]);
            const response = await apiCall("chatbot/query", "POST", { query: question});
            if (response.status === 200) {
                setAnswers(oldArray => [...oldArray, response.message]);
            }
        }
    }

    function handleClose() {
        setOpen(false);
    }

    React.useEffect(() => {
        createChatBot();
    }, []);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Robowaiter 9000</DialogTitle>
            {hasLoaded ? <DialogContent>
                {questions.map((question, index) => <>
                    <Box>{question}</Box>
                    {answers[index] && <Box>{answers[index]}</Box>}
                </>)}
                <TextField label="Enter query" disabled={questions.length != answers.length}/>
            </DialogContent> : <Typography>Loading robot...</Typography>}
        </Dialog>
    )
}