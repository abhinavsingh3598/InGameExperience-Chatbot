import React from 'react';
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { css } from "@emotion/react";
import styled from '@emotion/styled';

const HighlightedTableCell = styled(TableCell)`
    background-color: #62D2A2;
`;

const GlobalLeaderboard = ({ teams, currentTeam }) => {
    // Sort teams by score in descending order
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

    return (
        <Container>
            <Typography variant="h2" css={css`margin-bottom: 1.5rem; font-size: 2.5rem;`}>Game Over</Typography>
            <Typography variant="h6">Final Team Scores:</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedTeams.map((team, index) => (
                            <TableRow key={team.name}>
                                <TableCell>{index + 1}</TableCell>
                                {team.name === currentTeam.name 
                                    ? <HighlightedTableCell>{team.name}</HighlightedTableCell>
                                    : <TableCell>{team.name}</TableCell>}
                                <TableCell>{team.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="h6" css={css`margin-top: 2rem;`}>Individual Scores in {currentTeam.name}:</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Member</TableCell>
                            <TableCell>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentTeam.members.sort((a, b) => b.score - a.score).map((member, index) => (
                            <TableRow key={member.name}>
                                <TableCell>{index + 1}</TableCell>
                                <HighlightedTableCell>{member.name}</HighlightedTableCell>
                                <TableCell>{member.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default GlobalLeaderboard;
