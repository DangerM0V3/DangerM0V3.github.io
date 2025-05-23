import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/audio';
import '../../styles/Puzzle3.css';

const Puzzle3: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [switches, setSwitches] = useState([false, false, false, false]);
  const [success, setSuccess] = useState(false);
  const [sequence, setSequence] = useState(['D', 'F', 'A', 'B', 'D']);
  const navigate = useNavigate();
  const { state, completePuzzle, attemptPuzzle, revealHint } = useGame();
  
  useEffect(() => {
    if (!state.progress.login) {
      navigate('/');
    }
  }, [state.progress.login, navigate]);
  
  useEffect(() => {
    if (attempts >= 3 && !state.hints.puzzle3Revealed) {
      setShowHint(true);
    }
  }, [attempts, state.hints.puzzle3Revealed]);
  
  useEffect(() => {
    if (state.progress.puzzle3) {
      setSuccess(true);
    }
  }, [state.progress.puzzle3]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    if (error) setError('');
  };
  
  const toggleSwitch = (index: number) => {
    const newSwitches = [...switches];
    newSwitches[index] = !newSwitches[index];
    setSwitches(newSwitches);
    playSound('switch', state.audio.volume);
    
    if (newSwitches[0] && !newSwitches[1] && newSwitches[2] && newSwitches[3]) {
      console.log('%c🔍 CORRECT SWITCH PATTERN DETECTED', 'color: #0f0; font-size: 16px');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attemptPuzzle('puzzle3');
    setAttempts(prev => prev + 1);
    
    const correctSwitchPattern = switches[0] && !switches[1] && switches[2] && switches[3];
    
    if (code === '2003' && correctSwitchPattern) {
      playSound('access-granted', state.audio.volume);
      completePuzzle('puzzle3');
      setSuccess(true);
    } else {
      playSound('access-denied', state.audio.volume);
      setError('SECURITY OVERRIDE FAILED. INCORRECT CODE OR SWITCH CONFIGURATION.');
      
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  const handleBack = () => {
    navigate('/files');
  };
  
  const handleRevealHint = () => {
    revealHint('puzzle3Revealed');
    setShowHint(false);
  };
  
  return (
    <div className="puzzle-container">
      <div className="puzzle-header">
        <button onClick={handleBack} className="back-button">
          ← Back to Desktop
        </button>
        <h1 className="puzzle-title">SECURITY OVERRIDE</h1>
      </div>
      
      {!success ? (
        <>
          <p className="instructions">Enter the access code and set the correct switch configuration to disable security system.</p>
          
          <form className="safe-container" onSubmit={handleSubmit}>
            <div className="safe-display">
              <div className="safe-lights">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className={`safe-light ${error ? 'red-blink' : ''}`}></div>
                ))}
              </div>
              
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="ENTER CODE"
                maxLength={4}
                className="safe-input"
                required
              />
            </div>
            
            <div className="switch-panel">
              {switches.map((isOn, index) => (
                <div key={index} className="switch-container">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggleSwitch(index)}
                    />
                    <span className="slider"></span>
                  </label>
                  <div className="switch-label">{`SW${index + 1}`}</div>
                </div>
              ))}
            </div>
            
            {error && <div className="error-message blink">{error}</div>}
            
            <button type="submit" className="terminal-button">
              OVERRIDE SECURITY
            </button>
          </form>
          
          {showHint && !state.hints.puzzle3Revealed && (
            <div className="hint-button-container">
              <button onClick={handleRevealHint} className="terminal-button">
                REQUEST ASSISTANCE
              </button>
            </div>
          )}
          
          {state.hints.puzzle3Revealed && (
            <div className="hint-container">
              <p>SYSTEM MESSAGE: The sequence represents a significant year in the timeline.
                 Look for patterns that might reveal the year 2003.</p>
            </div>
          )}
        </>
      ) : (
        <div className="success-message">
          <p className="blink-slow">ACCESS GRANTED</p>
          <div className="key-info">
            <p>Key Information:</p>
            <ul>
              <li>Sequence Code: {sequence.join('-')}</li>
              <li>This code will be needed for the final decoder</li>
            </ul>
          </div>
          <div className="button-group">
            <button onClick={handleBack} className="terminal-button">
              Return to Desktop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Puzzle3;