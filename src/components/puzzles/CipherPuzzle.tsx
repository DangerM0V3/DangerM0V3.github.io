import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/audio';
import '../../styles/CipherPuzzle.css';

// Matrix-style cipher with shift of 5
const SHIFT = 5;

// Original message: "Your answer is not this and not this or maybe this, hmm MTG previous verb is password"
// Shifted message: "DTZW FSBXJW NX STY YMNX FSI STY YMNX TW RFGDJ YMNX, MRR RYL JWAJNX AJWX NX UFXBJIW"
const ENCRYPTED_MESSAGE = [
    '01000100 01110100 01111010 01110111',
    '00100000 01100110 01110011 01111000 01100010',
    '01101010 01100110 01110111 00100000',
    '01101110 01111000 00100000 01110011',
    '01110100 01111001 00100000 01111001 01101101',
    '01101110 01111000 00100000 01100110 01110011',
    '01101001 00100000 01110011 01110100',
    '01111001 00100000 01111001 01101101 ',
    '1101110 01111000 00100000 01110100 01110111',
    '00100000 01110010 01100110 01100100 01100111',
    '01101010 00100000 01111001 01101101 01101110 01111000',
    '00101100 00100000 01101101 01110010 01110010 00100000',
    '01010010 01011001 01001100 00100000 01110101 01110111',
    '01101010 01100001 01101110 01111010 01110100',
    '01111000 00100000 01100001 01101010 01110111',
    '01100111 00100000 01101110 01111000 00100000',
    '01110101 01100110 01111000 01111000',
    '01100010 01110100 01110111 01101001'
];

// Function to convert text to binary
const textToBinary = (text: string): string[] => {
  return text.split('').map(char => {
    const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
    return binary;
  });
};

// Function to convert binary to text
const binaryToText = (binary: string): string => {
  return binary.split(' ').map(byte => {
    return String.fromCharCode(parseInt(byte, 2));
  }).join('');
};

// Function to shift text by 5 letters
const shiftText = (text: string, forward: boolean = true): string => {
  return text.split('').map(char => {
    if (char === ' ') return ' ';
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) { // Uppercase letters
      const shift = forward ? 5 : -5;
      return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
    }
    if (code >= 97 && code <= 122) { // Lowercase letters
      const shift = forward ? 5 : -5;
      return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
    }
    return char;
  }).join('');
};

const Puzzle2: React.FC = () => {
  const [input, setInput] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [success, setSuccess] = useState(false);
  const [matrixEffect, setMatrixEffect] = useState(true);
  const navigate = useNavigate();
  const { state, completePuzzle, attemptPuzzle, revealHint } = useGame();

  useEffect(() => {
    if (!state.progress.login) {
      navigate('/');
    }
  }, [state.progress.login, navigate]);

  useEffect(() => {
    if (state.progress.puzzle2) {
      setSuccess(true);
    }
  }, [state.progress.puzzle2]);

  useEffect(() => {
    if (attempts >= 3 && !state.hints.puzzle2Revealed) {
      setShowHint(true);
    }
  }, [attempts, state.hints.puzzle2Revealed]);

  const handleDecode = () => {
    attemptPuzzle('puzzle2');
    setAttempts(prev => prev + 1);
    
    if (input === 'MTG') {
      playSound('access-granted', state.audio.volume);
      completePuzzle('puzzle2');
      setSuccess(true);
      setDecodedMessage('SEQUENCE VERIFIED: MTG');
    } else {
      playSound('access-denied', state.audio.volume);
      setDecodedMessage('ERROR: Invalid sequence');
    }
  };

  const handleBack = () => {
    navigate('/files');
  };

  const handleRevealHint = () => {
    revealHint('puzzle2Revealed');
    setShowHint(false);
    playSound('keypress', state.audio.volume);
  };

  // Debug function to verify the encoding/decoding
  const verifyEncoding = () => {
    const originalText = "Your answer is not this and not this or maybe this, hmm MTG previous verb is password";
    const shiftedText = shiftText(originalText, true);
    const binary = textToBinary(shiftedText);
    const decodedText = binaryToText(binary.join(' '));
    const unshiftedText = shiftText(decodedText, false);
    console.log('Original:', originalText);
    console.log('Shifted:', shiftedText);
    console.log('Binary:', binary);
    console.log('Decoded:', decodedText);
    console.log('Unshifted:', unshiftedText);
  };

  return (
    <div className="puzzle-container matrix-theme">
      <div className="puzzle-header">
        <button onClick={handleBack} className="back-button matrix-button">
          ← Back to Desktop
        </button>
        <h1 className="puzzle-title matrix-text">CIPHER DECODER</h1>
      </div>

      {!success ? (
        <>
          <p className="instructions matrix-text">
            Decode the encrypted message. The truth lies within the binary.
            Look for patterns in the sequence.
          </p>

          <div className="cipher-display matrix-display">
            <h3 className="matrix-text">ENCRYPTED MESSAGE:</h3>
            <div className="encrypted-text matrix-code">
              {ENCRYPTED_MESSAGE.map((line, index) => (
                <div key={index} className="matrix-line" style={{ animationDelay: `${index * 0.1}s` }}>
                  {line}
                </div>
              ))}
            </div>
            <div className="cipher-hint matrix-hint">+5</div>
          </div>

          <div className="decoder-panel matrix-panel">
            <div className="input-group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                placeholder="Enter decoded message"
                className="decoder-input matrix-input"
              />
              <button 
                onClick={handleDecode}
                className="terminal-button matrix-button"
              >
                DECODE
              </button>
            </div>
            {decodedMessage && (
              <div className={`message ${decodedMessage.includes('ERROR') ? 'error' : 'info'} matrix-text`}>
                {decodedMessage}
              </div>
            )}
          </div>

          {showHint && !state.hints.puzzle2Revealed && (
            <div className="hint-button-container">
              <button onClick={handleRevealHint} className="terminal-button matrix-button">
                REQUEST ASSISTANCE
              </button>
            </div>
          )}

          {state.hints.puzzle2Revealed && (
            <div className="hint-container matrix-hint-box">
              <p className="matrix-text">SYSTEM MESSAGE: The binary code hides the truth.
                 Convert each 8-bit sequence to ASCII, then shift each letter back by 5 positions.
                 The answer lies in the previous verb of the decoded message.</p>
            </div>
          )}
        </>
      ) : (
        <div className="success-message matrix-success">
          <p className="blink-slow matrix-text">MESSAGE DECODED</p>
          <div className="key-info matrix-text">
            <p>Key Information:</p>
            <ul>
              <li>Decoded Message: MTG</li>
              <li>Cipher Type: Binary + Shift</li>
              <li>This code will be needed for the final decoder</li>
            </ul>
          </div>
          <div className="button-group">
            <button onClick={handleBack} className="terminal-button matrix-button">
              Return to Desktop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Puzzle2;