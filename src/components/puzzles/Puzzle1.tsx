import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/audio';
import '../../styles/Puzzle1.css';

const SIGNAL_PATTERNS = [
  { frequency: '88.5', strength: 45, type: 'NOISE' },
  { frequency: '92.1', strength: 60, type: 'MUSIC' },
  { frequency: '95.7', strength: 75, type: 'VOICE' },
  { frequency: '98.3', strength: 55, type: 'NOISE' },
  { frequency: '101.9', strength: 65, type: 'MUSIC' },
  { frequency: '104.3', strength: 85, type: 'ENCRYPTED' },
  { frequency: '106.7', strength: 50, type: 'NOISE' }
];

const Puzzle1: React.FC = () => {
  const [input, setInput] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState(88.0);
  const [scanning, setScanning] = useState(false);
  const [signalFound, setSignalFound] = useState(false);
  const [analyzedSignals, setAnalyzedSignals] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { state, completePuzzle, attemptPuzzle, revealHint } = useGame();

  useEffect(() => {
    if (!state.progress.login) {
      navigate('/');
    }
  }, [state.progress.login, navigate]);

  useEffect(() => {
    if (state.progress.puzzle1) {
      setSuccess(true);
    }
  }, [state.progress.puzzle1]);

  const handleNoteAdd = (note: string) => {
    setNotes(prev => [...prev, note]);
    playSound('keypress', state.audio.volume);
  };

  const handleScan = () => {
    setScanning(true);
    playSound('keypress', state.audio.volume);
    
    // Simulate scanning through frequencies
    let scanProgress = 0;
    const scanInterval = setInterval(() => {
      scanProgress += 0.1;
      setCurrentFrequency(prev => {
        const newFreq = Math.min(108.0, prev + 0.1);
        return Number(newFreq.toFixed(1));
      });

      if (scanProgress >= 200) {
        clearInterval(scanInterval);
        setScanning(false);
        handleNoteAdd(`Scan complete. Current frequency: ${currentFrequency} MHz`);
      }
    }, 50);
  };

  const handleAnalyze = () => {
    const signal = SIGNAL_PATTERNS.find(s => 
      Math.abs(parseFloat(s.frequency) - currentFrequency) < 0.1
    );

    if (signal) {
      setSignalFound(true);
      const analysis = `Frequency ${signal.frequency} MHz: ${signal.strength}% strength, ${signal.type} signal`;
      setAnalyzedSignals(prev => [...prev, analysis]);
      handleNoteAdd(analysis);
      
      if (signal.type === 'ENCRYPTED') {
        handleNoteAdd('WARNING: Encrypted transmission detected. This frequency requires further analysis.');
      }
    } else {
      setSignalFound(false);
      handleNoteAdd(`No significant signal detected at ${currentFrequency} MHz`);
    }
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFreq = parseFloat(e.target.value);
    setCurrentFrequency(newFreq);
    setSignalFound(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attemptPuzzle('puzzle1');
    
    if (input === '104.3') {
      playSound('access-granted', state.audio.volume);
      completePuzzle('puzzle1');
      setSuccess(true);
      handleNoteAdd('Frequency verified: 104.3 MHz - Encrypted transmission confirmed');
    } else {
      playSound('access-denied', state.audio.volume);
      handleNoteAdd(`Attempt failed: ${input} MHz`);
    }
  };

  const handleBack = () => {
    navigate('/files');
  };

  return (
    <div className="puzzle-container">
      <div className="puzzle-header">
        <button onClick={handleBack} className="back-button">
          ← Back to Desktop
        </button>
        <h1 className="puzzle-title">RADIO FREQUENCY SCANNER</h1>
      </div>

      {!success ? (
        <>
          <p className="instructions">Scan the frequency band and analyze signals to find the encrypted transmission.</p>
          
          <div className="cipher-workspace">
            <div className="frequency-display">
              <div className="frequency-value">
                {currentFrequency.toFixed(1)} MHz
              </div>
              <div className="signal-strength">
                {signalFound ? 'SIGNAL DETECTED' : 'NO SIGNAL'}
              </div>
            </div>

            <div className="frequency-controls">
              <input
                type="range"
                min="88.0"
                max="108.0"
                step="0.1"
                value={currentFrequency}
                onChange={handleFrequencyChange}
                className="frequency-slider"
              />
              <div className="frequency-labels">
                <span>88.0</span>
                <span>108.0</span>
              </div>
            </div>

            <div className="workspace-tools">
              <div className="tool-panel">
                <h3>SCANNER CONTROLS</h3>
                <button 
                  onClick={handleScan}
                  disabled={scanning}
                  className="tool-button"
                >
                  {scanning ? 'SCANNING...' : 'START SCAN'}
                </button>
                <button 
                  onClick={handleAnalyze}
                  className="tool-button"
                >
                  ANALYZE SIGNAL
                </button>
                <button 
                  onClick={() => handleNoteAdd('Frequency range: 88.0 - 108.0 MHz')}
                  className="tool-button"
                >
                  FREQUENCY INFO
                </button>
              </div>

              <div className="notes-panel">
                <h3>ANALYSIS LOG</h3>
                <div className="notes-container">
                  {notes.map((note, index) => (
                    <div key={index} className="note-entry">{note}</div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="solution-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ENTER FREQUENCY"
                className="solution-input"
              />
              <button type="submit" className="terminal-button">
                VERIFY FREQUENCY
              </button>
            </form>
          </div>
          
          {showHint && !state.hints.puzzle1Revealed && (
            <div className="hint-button-container">
              <button onClick={() => revealHint('puzzle1Revealed')} className="terminal-button">
                REQUEST ASSISTANCE
              </button>
            </div>
          )}

          {state.hints.puzzle1Revealed && (
            <div className="hint-container">
              <p>SYSTEM MESSAGE: Use the scanner to sweep through frequencies.
                 Look for signals with high strength and unusual characteristics.
                 The encrypted transmission will be clearly marked in the analysis log.</p>
            </div>
          )}
        </>
      ) : (
        <div className="success-message">
          <p className="blink-slow">FREQUENCY VERIFIED</p>
          <div className="key-info">
            <p>Key Information:</p>
            <ul>
              <li>Frequency: 104.3 MHz</li>
              <li>Signal Type: Encrypted Transmission</li>
              <li>Signal Strength: 85%</li>
              <li>This frequency will be needed for the radio interceptor</li>
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

export default Puzzle1;