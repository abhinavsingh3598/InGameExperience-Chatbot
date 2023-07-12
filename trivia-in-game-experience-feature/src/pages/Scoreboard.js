import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import styled from '@emotion/styled';

const StyledScoreBoard = styled('div')`
    margin-top: 2rem;
    background-color: #28282A;
    color: #ffffff;
    padding: 2rem;
`;

const ScoreBoard = ({ teams, currentTeam }) => {
    return (
      <StyledScoreBoard>
        <Typography variant="h6">Scoreboard:</Typography>
        <List>
          {teams
            .sort((a, b) => b.score - a.score) // Sort the teams by score
            .map((team, index) => (
              <div key={team.name}>
                <ListItem>
                  <ListItemText primary={`${index + 1}. ${team.name}: ${team.score} points`} />
                </ListItem>
                {team.name === currentTeam.name && // Only display member scores for the current team
                  team.members.map((member) => (
                    <ListItem key={member.name}>
                      <ListItemText primary={`  - ${member.name}: ${member.score} points`} />
                    </ListItem>
                  ))}
              </div>
            ))}
        </List>
      </StyledScoreBoard>
    );
  };
  
  

export default ScoreBoard;
