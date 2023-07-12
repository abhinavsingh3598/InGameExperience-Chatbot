import axios from "axios";

const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/games`;

export const submitAnswer = (questionId, answer) =>
  axios.post(`${baseUrl}/questions/${questionId}/answer`, { answer });

export const getCorrectAnswer = (questionId) =>
  axios.get(`${baseUrl}/questions/${questionId}/answer`);

export const realTimeScore = (questionId, teamId, answer) =>
  axios.post(`${baseUrl}/questions/${questionId}/score`, { teamId, answer });

export const getIndividualScore = (userId) =>
  axios.get(`${baseUrl}/users/${userId}/individualPerformance`);

export const getTeamScore = (userId) =>
  axios.get(`${baseUrl}/users/${userId}/teamPerformance`);

export const sendMessage = (teamId,senderId, senderName, message) =>
  axios.post(`${baseUrl}/chat/send`, { teamId, senderId,senderName,message });

export const getMessages = () => axios.get(`${baseUrl}/chat/get`);
