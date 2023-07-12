import React, { useState, useEffect } from "react";
import {
  submitAnswer,
  realTimeScore,
} from "../services/games.service";
import {
  CircularProgress,
  Button,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Chat from "./Chat";
import ScoreBoard from "./Scoreboard";
import GlobalLeaderboard from "./GlobalLeaderboard";

const StyledContainer = styled(Container)`
  background-color: #28282a;
  color: #ffffff;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // change this from flex-start to center
`;

const StyledQuestionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 2rem;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const StyledButton = styled(Button)`
  color: #28282a;
  background-color: #62d2a2;
  &:hover {
    background-color: #ffffffaa;
  }
  font-size: 1.5rem;
  border-radius: 12px;
  padding: 1rem 2rem;
  width: 45%;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const StyledScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
`;

const StyledInfoContainer = styled(Grid)`
  width: 100%;
  margin: 2rem 0;
`;

const initialTeams = [
  {
    id: "1",
    name: "The Quizzards",
    score: 0,
    members: [
      { name: "Alice", score: 0 },
      { name: "Bob", score: 0 },
      { name: "Kathy", score: 0 },
    ],
  },
  {
    id: "2",
    name: "RBC",
    score: 3,
    members: [
      { name: "Charlie", score: 0 },
      { name: "David", score: 0 },
      { name: "Rahul", score: 0 },
    ],
  },
  {
    id: "3",
    name: "CSK",
    score: 2,
    members: [
      { name: "Edward", score: 0 },
      { name: "Frank", score: 0 },
    ],
  },
  {
    id: "4",
    name: "DC",
    score: 0,
    members: [
      { name: "George", score: 0 },
      { name: "Helen", score: 0 },
    ],
  },
];

const Game = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [scores, setScores] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [minimizeChat, setMinimizeChat] = useState(true);
  const [gameOver, setGameOver] = useState(false); // add this
  const [explanation, setExplanation] = useState(null);
  const [teams, setTeams] = useState(initialTeams);
  const [currentTeam, setCurrentTeam] = useState(initialTeams[0]); // assume the first team is playing initially
  const [isWaiting, setIsWaiting] = useState(false);

  const [answerSubmitted, setAnswerSubmitted] = useState(false);




  const questions = [
    {
      id: "1",
      question: "What is the capital of France?",
      options: ["Paris", "London", "Rome", "Berlin"],
    },
    {
      id: "2",
      question: "What is the smallest planet in the solar system?",
      options: ["Mercury", "Venus", "Earth", "Mars"],
    },
    {
      id: "3",
      question: "What is the largest animal?",
      options: ["Elephant", "Blue Whale", "Tyrannosaurus Rex", "Anaconda"],
    },
    // More questions...
  ];

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        if (prevTimeRemaining > 0) {
          return prevTimeRemaining - 1;
        } else {
          // Time has run out. Show score for this question.
          setShowScore(true);
          setIsSubmitting(false);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showScore) {
      // Wait 5 seconds then go to next question or end the game
      const timer = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setTimeRemaining(10);
          setShowScore(false);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setExplanation(null);
          setAnswerSubmitted(false); // added this

        } else {
          setGameOver(true);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showScore]);

  
  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setIsWaiting(true);
  };
  
  useEffect(() => {
    if (timeRemaining === 0 && !answerSubmitted) {
      console.log(selectedAnswer);
      if (selectedAnswer === null) {
        // If the user hasn't selected an answer, default to null and submit
        submitAnswerHandler(null);
      } else {
        submitAnswerHandler();
      }
      setAnswerSubmitted(true); 
    }
  }, [timeRemaining, selectedAnswer, answerSubmitted]);
  


  const submitAnswerHandler = async (defaultAnswer = selectedAnswer) => {
    try {
      console.log(defaultAnswer);
      const response = await submitAnswer(currentQuestion.id, defaultAnswer);
      const { data: answerData } = response;
      setIsCorrect(answerData.isCorrect);
      setExplanation(answerData.explanation);
      setShowScore(true);
  
      if (answerData.isCorrect) {
        const scoreResponse = await realTimeScore(currentQuestion.id, currentTeam.id, defaultAnswer);
        const { data: scoreData } = scoreResponse;
        setScores((prevScores) => prevScores + scoreData.newTeamScore);
        setTeams((prevTeams) => {
          return prevTeams.map((team) => {
            if (team.id === currentTeam.id) {
              return {
                ...team,
                score: scoreData.newTeamScore,
                members: team.members.map((member) => {
                  const updatedMember = scoreData.members.find(updated => updated.username === member.name);
                  return {
                    ...member,
                    score: updatedMember ? updatedMember.newScore : member.score
                  };
                }),
              };
            } else {
              return team;
            }
          });
        });
      }
      // setExplanation(data.explanation);
      // setShowScore(true);
    } catch (error) {
      console.error("Error while submitting answer:", error);
    } finally {
      setIsWaiting(false);
      setSelectedAnswer(null); // reset selected answer after processing
    }
  };
  
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsOpen(open);
  };

  // Inside Game.js, replace the previous gameOver condition with this:

    useEffect(() => {
    setCurrentTeam(teams.find((team) => team.id === currentTeam.id));
  }, [teams]);

  if (gameOver) {
    return <GlobalLeaderboard teams={teams} currentTeam={currentTeam} />;
  }

  return (
    <StyledContainer>
      <StyledQuestionContainer>
        <Typography
          variant="h2"
          css={css`
            margin-bottom: 1.5rem;
            font-size: 2.5rem;
          `}
        >
          {currentQuestion?.question}
        </Typography>
      </StyledQuestionContainer>
      {!isSubmitting && !showScore && (
        <StyledInfoContainer
          container
          justifyContent="center"
          marginBottom="3rem"
        >
          <Grid item>
            <Typography
              variant="h4"
              css={css`
                font-size: 2.5rem;
                font-weight: bold;
              `}
            >
              Time Remaining: {timeRemaining}
            </Typography>
          </Grid>
        </StyledInfoContainer>
      )}
      {isSubmitting && <CircularProgress />}
      {!isSubmitting && showScore && (
        <Typography variant="h4">Score: {scores}</Typography>
      )}
      {!isSubmitting && showScore && isCorrect !== null && (
        <>
          {isCorrect ? (
            <Typography variant="h4">Correct!</Typography>
          ) : (
            <Typography variant="h4">Wrong!</Typography>
          )}
          {explanation && <Typography variant="h6">{explanation}</Typography>}
          {showScore && <ScoreBoard teams={teams} currentTeam={currentTeam} />}
        </>
      )}
      <StyledButtonContainer>
  {isWaiting ? (
    <CircularProgress />
  ) : (
    !showScore &&
    currentQuestion?.options.map((option, index) => (
      <StyledButton
        variant="contained"
        onClick={() => handleAnswerClick(option)}
        disabled={isSubmitting}
      >
        {option}
      </StyledButton>
    ))
  )}
</StyledButtonContainer>

      <Chat
        isOpen={isOpen}
        toggleDrawer={toggleDrawer}
        minimizeChat={minimizeChat}
        setMinimizeChat={setMinimizeChat}
      />
    </StyledContainer>
  );
};

export default Game;

