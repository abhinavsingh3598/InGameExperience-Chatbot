import React, { useState, useEffect } from 'react';
import { TextField, Card, CardContent, Typography, Container, Box } from '@mui/material';
import { LexRuntimeV2Client, DeleteSessionCommand, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import { v4 as uuidv4 } from 'uuid';

const client = new LexRuntimeV2Client({ region: "us-east-1" , credentials: {
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
}});

const ChatInterface = () => {
  const [message, setMessage] = useState(''); // initialize with an empty string
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState(uuidv4()); 
  useEffect(() => {
    // Add the initial message to the conversation
    const initialMessage = 'How can I help you?';
    setConversation([{ message: initialMessage, from: 'bot' }]);
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = {
      botId: 'L6WLIJGSHN', /* required */
      botAliasId: 'TSTALIASID', /* required */
      localeId: 'en_US', /* required */
      sessionId: sessionId, /* required */
      text: message, /* required */
    };
    const command = new RecognizeTextCommand(params);
    client.send(command, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        let botMessage = "I'm sorry, I didn't understand that. Could you please rephrase?";
        console.log(data);
        if (data.messages && data.messages.length > 0) {
          botMessage = data.messages[0].content;
        }
    
        setConversation([...conversation, { message, from: 'user' }, { message: botMessage, from: 'bot' }]);
        setMessage('');
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <CardContent>
          {/* display the conversation */}
          {conversation.map((convo, index) => (
            <Box
              key={index}
              alignSelf={convo.from === 'bot' ? 'flex-start' : 'flex-end'}
              bgcolor={convo.from === 'bot' ? 'grey.200' : 'blue.200'}
              m={1}
              p={1}
              borderRadius={2}
              maxWidth="80%"
            >
              <Typography variant="body1">{convo.message}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit}>
        <TextField
          id="standard-basic"
          label="Type your message"
          variant="standard"
          value={message}
          onChange={handleChange}
          fullWidth
        />
      </form>
    </Container>
  );
};

export default ChatInterface;
