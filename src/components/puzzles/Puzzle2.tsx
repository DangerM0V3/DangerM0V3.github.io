import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/audio';
import '../../styles/Puzzle2.css';

// Morse code patterns for each level
const MORSE_PATTERNS = [
  // Level 1: Simple pattern (2-0-0-4)
  '..--- ----- ----- ...--',
  // Level 2: More complex pattern (2-0-0-4 with different timing)
  '..--- / ----- / ----- / ....-',
  // Level 3: Complex pattern with pauses
  '..--- / ----- / ----- / ....- / ...--',
  // Level 4: Very complex pattern
  '..--- / ----- / ----- / ....- / ...-- / ..---',
  // Level 5: Final challenge
  '..--- / ----- / ----- / ....- / ...-- / ..--- / -----'
];

const Puzzle2: React.FC = () => {
  const [frequency, setFrequency] = useState(88.5);
  const [tuning, setTuning] = useState(false);
  const [showStatic, setShowStatic] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [decodedInput, setDecodedInput] = useState('');
  const [morseComplete, setMorseComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const staticRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { state, completePuzzle, revealHint, attemptPuzzle } = useGame();
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!state.progress.login) {
      navigate('/');
    }
  }, [state.progress.login, navigate]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!morseComplete && !state.hints.puzzle2Revealed) {
        setShowHint(true);
      }
    }, 60000);
    
    return () => clearTimeout(timer);
  }, [morseComplete, state.hints.puzzle2Revealed]);
  
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrequency = parseFloat(e.target.value);
    setFrequency(newFrequency);
    
    setTuning(true);
    setTimeout(() => setTuning(false), 500);
    
    // Make frequency tuning more precise
    if (Math.abs(newFrequency - 104.3) < 0.1) {
      if (showStatic) {
        playSound('signal-found');
        setShowStatic(false);
        
        const staticElement = staticRef.current;
        if (staticElement) {
          staticElement.volume = 0.1;
          setTimeout(() => {
            if (staticElement) staticElement.pause();
          }, 2000);
        }
        
        const audioElement = audioRef.current;
        if (audioElement) {
          audioElement.play().catch(console.error);
        }
      }
    } else {
      setShowStatic(true);
      
      const staticElement = staticRef.current;
      if (staticElement) {
        staticElement.volume = 0.3;
        staticElement.currentTime = 0;
        staticElement.play().catch(console.error);
      }
      
      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    }
  };

  const handleDecodeSubmit = () => {
    const correctPattern = MORSE_PATTERNS[currentLevel - 1].replace(/\s+/g, '');
    const userInput = decodedInput.replace(/\s+/g, '');
    
    if (userInput === correctPattern) {
      if (currentLevel < 5) {
        playSound('discovery');
        setCurrentLevel(prev => prev + 1);
        setDecodedInput('');
      } else {
        playSound('access-granted');
        setMorseComplete(true);
      }
    } else {
      playSound('access-denied');
      setDecodedInput('');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attemptPuzzle('puzzle2');
    setAttempts(prev => prev + 1);
    
    // Normalize the input by trimming whitespace and converting to uppercase
    const normalizedInput = code.trim().toUpperCase();
    
    if (normalizedInput === '2003') {
      playSound('access-granted', state.audio.volume);
      completePuzzle('puzzle2');
      setMorseComplete(true);
      setError('');
    } else {
      playSound('access-denied', state.audio.volume);
      setError('INVALID CODE. ACCESS DENIED.');
      
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  const handleBack = () => {
    navigate('/files');
  };
  
  // Add useEffect to check if puzzle was already completed
  useEffect(() => {
    if (state.progress.puzzle2) {
      setMorseComplete(true);
    }
  }, [state.progress.puzzle2]);
  
  return (
    <div className="puzzle-container">
      <div className="puzzle-header">
        <button onClick={handleBack} className="back-button">
          ← Back to Desktop
        </button>
        <h1 className="puzzle-title">RADIO INTERCEPTOR</h1>
      </div>
      
      {!morseComplete ? (
        <>
          <p className="instructions">Tune to the correct frequency and decode the Morse transmission.</p>
          
          <div className={`radio-container ${tuning ? 'tuning' : ''}`}>
            <div className="radio-display">
              <div className="frequency-display">
                <span className="frequency-value">{frequency.toFixed(1)}</span>
                <span className="frequency-unit">MHz</span>
              </div>
              
              {showStatic ? (
                <div className="static-visualization">
                  {Array(20).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className="static-bar" 
                      style={{ 
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.5}s`
                      }}
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="morse-visualization">
                  <div className="morse-code">
                    {MORSE_PATTERNS[currentLevel - 1].split('').map((char, i) => (
                      <span 
                        key={i} 
                        className={`morse-${char === '.' ? 'dot' : char === '-' ? 'dash' : 'space'}`}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="radio-controls">
              <input
                type="range"
                min="88.0"
                max="108.0"
                step="0.1"
                value={frequency}
                onChange={handleFrequencyChange}
                className="frequency-slider"
              />
              <div className="frequency-labels">
                <span>88.0</span>
                <span>108.0</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="code-submission">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter decoded code"
              className="terminal-input"
            />
            <button type="submit" className="terminal-button">
              SUBMIT CODE
            </button>
          </form>
          
          {error && <div className="error-message">{error}</div>}
          
          <audio ref={staticRef} loop>
            <source src="https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3" type="audio/mpeg" />
          </audio>
          
          <audio ref={audioRef} loop>
            <source src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" type="audio/mpeg" />
          </audio>
          
          {showHint && !morseComplete && !state.hints.puzzle2Revealed && (
            <div className="hint-button-container">
              <button onClick={() => revealHint('puzzle2Revealed')} className="terminal-button">
                REQUEST ASSISTANCE
              </button>
            </div>
          )}
          
          {state.hints.puzzle2Revealed && !morseComplete && (
            <div className="hint-container">
              <p>SYSTEM MESSAGE: The frequency 104.3 MHz contains the transmission. 
                 Each level requires decoding a different Morse pattern. 
                 Use dots (.) and dashes (-) to represent the code.</p>
            </div>
          )}
        </>
      ) : (
        <div className="success-message">
          <p className="blink-slow">TRANSMISSION DECODED</p>
          <div className="key-info">
            <p>Key Information:</p>
            <ul>
              <li>Frequency: 104.3 MHz</li>
              <li>Code: 2003</li>
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

export default Puzzle2;