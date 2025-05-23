import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';
import '../../styles/FinalReward.css';

const FinalReward: React.FC = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [typing, setTyping] = useState(true);
  const [decodedText, setDecodedText] = useState('');
  const navigate = useNavigate();
  const { state, resetGame } = useGame();
  
  // Custom message - this would be personalized for the gift recipient
  const finalMessage = `CONGRATULATIONS AGENT!

YOU HAVE SUCCESSFULLY COMPLETED OPERATION MIDNIGHT.

YOUR SPECIAL GIFT IS WAITING FOR YOU AT:
[send "Troll16" to me for it)]

MISSION DETAILS:
This was created especially for you as a unique birthday gift! 
I hope you enjoyed solving these puzzles as much as I enjoyed creating them.

Happy Birthday!`;
  
  // Redirect if prerequisites not met
  useEffect(() => {
    if (!state.progress.login || !state.progress.puzzle1 || 
        !state.progress.puzzle2 || !state.progress.puzzle3 ||
        !state.progress.decoder) {
      navigate('/decoder');
    } else {
      // Play completion sound
      playSound('mission-complete');
      
      // Start typing animation
      setTimeout(() => {
        setShowMessage(true);
        startDecodingAnimation();
      }, 2000);
    }
  }, [state.progress, navigate]);
  
  const startDecodingAnimation = () => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < finalMessage.length) {
        setDecodedText(finalMessage.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTyping(false);
      }
    }, 50);
  };
  
  const handleReset = () => {
    resetGame();
    navigate('/');
  };
  
  return (
    <div className="final-container">
      <h1 className="final-title">MISSION ACCOMPLISHED</h1>
      
      {!showMessage && (
        <div className="decrypting">
          <p className="blink">DECRYPTING FINAL MESSAGE...</p>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      )}
      
      {showMessage && (
        <div className="final-message-container">
          <div className="final-message">
            <pre className="message-text">{decodedText}</pre>
            {typing && <span className="cursor">_</span>}
          </div>
          
          {!typing && (
            <div className="celebration">
              <Sparkles size={24} className="sparkle-icon" />
              <button onClick={handleReset} className="terminal-button restart-button">
                RESTART MISSION
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinalReward;