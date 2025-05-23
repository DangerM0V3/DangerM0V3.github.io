import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Login from './components/puzzles/Login';
import Terminal from './components/layout/Terminal';
import Puzzle1 from './components/puzzles/Puzzle1';
import CipherPuzzle from './components/puzzles/CipherPuzzle';
import Puzzle2 from './components/puzzles/Puzzle2';
import SequencePuzzle from './components/puzzles/SequencePuzzle';
import Puzzle3 from './components/puzzles/Puzzle3';
import FinalReward from './components/puzzles/FinalReward';
import FileSystem from './components/puzzles/FileSystem';
import FinalDecoder from './components/puzzles/FinalDecoder';
import NotFound from './components/layout/NotFound';
import AudioController from './components/audio/AudioController';
import './styles/App.css';

const App: React.FC = () => {
  React.useEffect(() => {
    document.title = "Operation Midnight - Classified";
    
    console.log("%c⚠️ WARNING: UNAUTHORIZED ACCESS DETECTED", "color: red; font-size: 24px; font-weight: bold");
    console.log("%cAGENT NOTE: Type 'help()' for assistance", "color: #0f0; font-size: 16px");
    
    window.help = () => {
      console.log("%c--- TOP SECRET COMMANDS ---", "color: #0f0; font-weight: bold");
      console.log("%c> viewMission()", "color: #0f0");
      console.log("%c> accessCode('ALPHA-9')", "color: #0f0");
      return "Displaying available commands...";
    };
    
    window.viewMission = () => {
      console.log("%c--- MISSION BRIEFING ---", "color: #0f0; font-weight: bold");
      console.log("%cYour objective is to navigate through a series of encrypted challenges to recover the hidden artifact.", "color: #0f0");
      return "Mission details accessed.";
    };
    
    window.accessCode = (code: string) => {
      if (code === "ALPHA-9") {
        console.log("%c--- ACCESS GRANTED ---", "color: #0f0; font-weight: bold");
        console.log("%cHint for Puzzle #2: Look for patterns in the static", "color: #0f0");
        return "Decryption key accepted.";
      }
      return "Invalid access code. Security alerted.";
    };
    
    return () => {
      delete window.help;
      delete window.viewMission;
      delete window.accessCode;
    };
  }, []);

  return (
    <div className="app bg-terminal-bg min-h-screen">
      <Router>
        <Terminal>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/files" element={<FileSystem />} />
            <Route path="/puzzle1" element={<Puzzle1 />} />
            <Route path="/cipher" element={<CipherPuzzle />} />
            <Route path="/puzzle2" element={<Puzzle2 />} />
            <Route path="/sequence" element={<SequencePuzzle />} />
            <Route path="/puzzle3" element={<Puzzle3 />} />
            <Route path="/decoder" element={<FinalDecoder />} />
            <Route path="/final" element={<FinalReward />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Terminal>
        <AudioController />
      </Router>
    </div>
  );
};

export default App;