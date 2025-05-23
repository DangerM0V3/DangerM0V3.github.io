import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/audio';
import '../../styles/FinalDecoder.css';

interface CodeField {
  id: string;
  label: string;
  value: string;
  placeholder: string;
}

const FinalDecoder: React.FC = () => {
  const [codes, setCodes] = useState<CodeField[]>([
    {
      id: 'radio',
      label: 'Puzzle1 Radio Frequency',
      value: '',
      placeholder: 'Enter frequency'
    },
    {
      id: 'morse',
      label: 'Puzzle2 Morse Code',
      value: '',
      placeholder: 'Enter decoded message'
    },
    {
      id: 'sequence',
      label: 'Puzzle3 Brute Force',
      value: '',
      placeholder: 'Enter sequence pattern'
    },
    {
      id: 'security',
      label: 'Cipher',
      value: '',
      placeholder: 'Enter decrypted message'
    },
    {
      id: 'nova',
      label: 'Zelda Music)',
      value: '',
      placeholder: 'Enter secret code'
    }
  ]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state, completePuzzle } = useGame();

  useEffect(() => {
    if (!state.progress.login) {
      navigate('/');
    }
  }, [state.progress.login, navigate]);

  const handleCodeChange = (id: string, value: string) => {
    setCodes(prev => prev.map(code => 
      code.id === id ? { ...code, value } : code
    ));
    if (error) setError('');
  };

  const validateCodes = () => {
    const radioCode = codes.find(c => c.id === 'radio')?.value;
    const morseCode = codes.find(c => c.id === 'morse')?.value;
    const sequenceCode = codes.find(c => c.id === 'sequence')?.value;
    const securityCode = codes.find(c => c.id === 'security')?.value;
    const novaCode = codes.find(c => c.id === 'nova')?.value;

    if (!radioCode || !morseCode || !sequenceCode || !securityCode || !novaCode) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const radioCode = codes.find(c => c.id === 'radio')?.value;
    const morseCode = codes.find(c => c.id === 'morse')?.value;
    const sequenceCode = codes.find(c => c.id === 'sequence')?.value;
    const securityCode = codes.find(c => c.id === 'security')?.value;
    const novaCode = codes.find(c => c.id === 'nova')?.value;

    // Validate each code
    if (radioCode !== '104.3') {
      setError('Invalid radio frequency');
      playSound('access-denied', state.audio.volume);
      return;
    }

    if (morseCode !== '2003') {
      setError('Invalid morse code');
      playSound('access-denied', state.audio.volume);
      return;
    }

    if (sequenceCode !== 'D-F-A-B-D') {
      setError('Invalid sequence pattern');
      playSound('access-denied', state.audio.volume);
      return;
    }

    if (securityCode !== 'MTG') {
      setError('Invalid decrypted message');
      playSound('access-denied', state.audio.volume);
      return;
    }

    if (novaCode !== '89P13') {
      setError('Invalid secret code');
      playSound('access-denied', state.audio.volume);
      return;
    }

    playSound('access-granted', state.audio.volume);
    setSuccess(true);
    completePuzzle('decoder');
    setTimeout(() => {
      navigate('/final');
    }, 3000);
  };

  // Add useEffect to check if decoder was already completed
  useEffect(() => {
    if (state.progress.decoder) {
      setSuccess(true);
    }
  }, [state.progress.decoder]);

  const handleBack = () => {
    navigate('/files');
  };

  return (
    <div className="decoder-container">
      <div className="decoder-header">
        <button onClick={handleBack} className="back-button">
          ← Back to Desktop
        </button>
        <h2>FINAL DECODER</h2>
        <p className="instructions">Enter the codes from completed puzzles to unlock the final message.</p>
      </div>

      {!success ? (
        <div className="input-section">
          <div className="input-group">
            <label>Radio Frequency Code:</label>
            <input
              type="text"
              value={codes.find(c => c.id === 'radio')?.value}
              onChange={(e) => handleCodeChange('radio', e.target.value)}
              placeholder="Enter frequency"
              className="terminal-input"
            />
          </div>

          <div className="input-group">
            <label>Morse Code:</label>
            <input
              type="text"
              value={codes.find(c => c.id === 'morse')?.value}
              onChange={(e) => handleCodeChange('morse', e.target.value)}
              placeholder="Enter decoded message"
              className="terminal-input"
            />
          </div>

          <div className="input-group">
            <label>Sequence Pattern:</label>
            <input
              type="text"
              value={codes.find(c => c.id === 'sequence')?.value}
              onChange={(e) => handleCodeChange('sequence', e.target.value)}
              placeholder="Enter sequence pattern"
              className="terminal-input"
            />
          </div>

          <div className="input-group">
            <label>Cipher Code:</label>
            <input
              type="text"
              value={codes.find(c => c.id === 'security')?.value}
              onChange={(e) => handleCodeChange('security', e.target.value)}
              placeholder="Enter decrypted message"
              className="terminal-input"
            />
          </div>

          <div className="input-group">
            <label>Zelda Music:</label>
            <input
              type="text"
              value={codes.find(c => c.id === 'nova')?.value}
              onChange={(e) => handleCodeChange('nova', e.target.value)}
              placeholder="Enter secret code"
              className="terminal-input"
            />
          </div>

          <button 
            onClick={handleSubmit}
            className="terminal-button"
          >
            DECODE MESSAGE
          </button>
        </div>
      ) : (
        <div className="success-message">
          <p className="blink-slow">MESSAGE DECODED</p>
          <div className="decoded-content">
            <p>Congratulations! You've completed all puzzles!</p>
            <p>Final Message:</p>
            <ul>
              <li>Radio Frequency: 104.3 MHz</li>
              <li>Morse Code: 2003</li>
              <li>Sequence Pattern: 89P13</li>
              <li>Security Code: NOVA</li>
            </ul>
          </div>
          <div className="button-group">
            <button onClick={handleBack} className="terminal-button">
              Return to Desktop
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default FinalDecoder; 