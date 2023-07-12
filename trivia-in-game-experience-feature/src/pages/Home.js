import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import ChatInterface from './ChatInterface';

const StyledButton = styled(Button)`
  width: 80%; // Set a percentage width to allow button to resize with container
  max-width: 500px; // Set a max-width to avoid the button becoming too wide on larger screens
  height: 70px;
  font-size: 40px;
  margin-top: 30px;

  // Use media queries to adjust styles for different screen sizes
  @media (max-width: 768px) { 
    font-size: 20px; // adjust font size
    height: 50px; // adjust height
  }
`;


const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 90vh;
  width: 40vw;
  background: #F0F8FF;
  border: 5px solid darkblue;
  border-radius: 10px;
  margin: 3vh auto;
  padding: 10px 10px 0 10px;
`;

const Header = styled.div`
  background-color: black;
  color: white;
  font-weight: bold;
  padding: 10px;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
`;

const Home = () => {
  const [chatStarted, setChatStarted] = useState(false);

  const handleButtonClick = () => {
    setChatStarted(true);
  };

  return (
    <HomeContainer>
      <Header>
        <Typography variant="h2" component="h1">
          Game Chatbot
        </Typography>
      </Header>
      {chatStarted ? (
        <ChatInterface />
      ) : (
        <StyledButton variant="contained" color="primary" onClick={handleButtonClick}>
          Start a Chat
        </StyledButton>
      )}
    </HomeContainer>
  );
};

export default Home;
