import React from "react";
import { apiCall } from "../helpers/helpers";
import { Dialog, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

function ChatbotPopup({ open, setOpen }) {
    const [hasLoaded, setHasLoaded] = React.useState(false);
    const [questions, setQuestions] = React.useState([]);
    const [answers, setAnswers] = React.useState([]);
    const bottomscroll = React.useRef(null);

    const createChatBot = async () => {
        const data = await apiCall("chatbot/data_update", "PUT", {});
        if (data.status == 200) {
            console.log("yes");
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
            e.target.value = ""
        }
        
    }

    function handleClose() {
        setOpen(false);
    }

    React.useEffect(() => {
        createChatBot();
    }, [open]);

    React.useEffect(() => {
        if (bottomscroll.current) {
            bottomscroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [answers]);

    return (
        <Dialog open={open} onClose={handleClose} sx={{'& .MuiDialog-root': {backgroundColor: "#ededed"}}}>
            <DialogTitle sx={{textAlign: "center"}}>MenuVenuTron</DialogTitle>
            {hasLoaded ? <DialogContent sx={{minWidth: "500px"}}>
                <div style={{height: "50vh", overflow: "auto", marginBottom: "15px", display: "flex", flexDirection: "column"}}>
                {questions.map((question, index) => <>
                    <Box sx={{margin: "10px", padding: "10px", border: "1px solid #caccce", borderRadius: "20px 20px 0 20px", maxWidth: "65%", alignSelf: "flex-end", backgroundColor: "#0084FF", color: "white"}}>You: {question}</Box>
                    {answers[index] && <Box  sx={{margin: "10px", padding: "10px", border: "1px solid #caccce", borderRadius: "20px 20px 20px 0", alignSelf: "flex-start", maxWidth: "65%"}}>MVTron: {answers[index]}</Box>}
                </>)}
                <div ref={bottomscroll}></div>
                </div>
                <TextField fullWidth label="Enter query" onKeyDown={askQuestion} disabled={questions.length != answers.length}/>
            </DialogContent> : <Typography>Loading robot...</Typography>}
        </Dialog>
    )
}

export default ChatbotPopup;