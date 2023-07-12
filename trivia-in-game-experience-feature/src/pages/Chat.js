import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  IconButton,
  List,
  ListItem,
  Snackbar,
  ListItemText,
  Alert,
  Box
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MinimizeIcon from "@mui/icons-material/Minimize";
import styled from "@emotion/styled";
import {
  sendMessage as sendMsg,
  getMessages as getMsgs,
} from "../services/games.service";

const ChatBox = styled("div")`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 350px;
  height: ${({ minimized }) => (minimized ? "50px" : "500px")};
  background-color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform: ${({ isOpen }) => (isOpen ? "translateY(0)" : "translateY(100%)")};
  transition: transform 0.3s ease-in-out;
`;

const ChatHeader = styled("div")`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const ChatList = styled(List)`
  flex: 1;
  overflow-y: auto;
`;

const ChatInput = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const Username = styled("span")`
  color: #000; // You can change this to whatever color you want
  font-weight: bold;
`;


const MessageBubble = styled(Box)`
  background-color: ${({fromSender}) => fromSender ? '#e8f5e9' : '#bbdefb'};
  padding: 10px;
  border-radius: ${({fromSender}) => fromSender ? '8px 8px 0 8px' : '8px 8px 8px 0'};
  align-self: ${({fromSender}) => fromSender ? 'flex-end' : 'flex-start'};
  margin: 5px 10px;
  max-width: 70%;
  word-wrap: break-word;
`;

const Chat = ({ isOpen, minimizeChat, setMinimizeChat }) => {
  const [chat, setChat] = useState([]); // Stores chat history
  const [newMessage, setNewMessage] = useState(""); // The new message input by the user
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  // Call sendMessage API to send a message
  const messagesEndRef = useRef(null); // Add this ref

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
  
    const interval = setInterval(fetchMessages, 5000);
  
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [chat]);
  

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await getMsgs();
      if (fetchedMessages.status !== 204) {
        setChat(prevChat => {
          // Combine old and new messages
          const combinedChat = [...prevChat, ...fetchedMessages.data.messages];
          
          // Sort messages based on timestamp
          const sortedChat = combinedChat.sort((a, b) => a.timestamp - b.timestamp);
          
          return sortedChat;
        });
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    //   setErrorMessage("Failed to fetch messages. Please try again.");
    //   setOpenSnackbar(true);
    }
  };
  
  const currentSenderName = "Alice";

  const sendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      try {
        const response = await sendMsg("1", "1", currentSenderName, trimmedMessage);
        console.log(response.chatMessage);
        setNewMessage("");
        await fetchMessages();
        scrollToBottom(); // Scrolls to the bottom after fetching the new messages
      } catch (error) {
        console.error("Failed to send message:", error);
        setErrorMessage("Failed to send message. Please try again.");
        setOpenSnackbar(true);
      }
    }
  };
  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <ChatBox isOpen={isOpen} minimized={minimizeChat}>
      <ChatHeader>
        <IconButton onClick={() => setMinimizeChat(!minimizeChat)}>
          {minimizeChat ? <ExpandMoreIcon /> : <MinimizeIcon />}
        </IconButton>
      </ChatHeader>
      {!minimizeChat && (
        <>
          <ChatList>
            {chat.map((message, index) => (
              <ListItem key={index} disablePadding>
                <MessageBubble fromSender={message.senderName === currentSenderName}>
                  <ListItemText
                    primary={<Username>{message.senderName}</Username>}
                    secondary={message.message}
                  />
                </MessageBubble>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </ChatList>
          <ChatInput>
            <TextField
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              fullWidth
            />
            <IconButton onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          </ChatInput>
        </>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </ChatBox>
  );
};
export default Chat;
