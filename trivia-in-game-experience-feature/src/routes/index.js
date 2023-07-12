import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "../pages/Game";
import ChatInterface from "../pages/ChatInterface";
import Home from "../pages/Home";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/startChat" element={<Home />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
