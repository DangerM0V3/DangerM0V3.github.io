import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/audio';
import '../../styles/SequencePuzzle.css';

type Note = 'D' | 'D2' | 'F' | 'A' | 'B';
const NOTE_MAP: { [key: number]: Note } = {
  1: 'D',
  2: 'D2',
  3: 'F',
  4: 'A',
  5: 'B'
};

// Predefined melodic sequences for each level
const LEVEL_SEQUENCES: (Note | Note[])[][] = [
  // Level 1: Simple ascending melody with a twist
  ['D', 'F', 'A', ['B', 'D'], 'A'],
  
  // Level 2: Descending pattern with double notes
  ['B', ['A', 'F'], 'D2', ['D2', 'D'], 'F'],
  
  // Level 3: Alternating high and low notes
  [['D', 'A'], 'F', ['B', 'D'], 'A', ['F', 'D2']],
  
  // Level 4: Complex pattern with multiple double notes
  ['D', ['F', 'D2'], ['A', 'B'], 'D', ['F', 'A'], ['B', 'D2']],
  
  // Level 5: Final challenge with varied patterns
  [['D', 'F'], 'A', ['B', 'D'], ['F', 'D2'], 'A', ['B', 'A'], ['D', 'F']]
];

const SequencePuzzle: React.FC = () => {
  const [sequence, setSequence] = useState<(Note | Note[])[]>([]);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [level, setLevel] = useState(1);
  const [activeNote, setActiveNote] = useState<Note | Note[] | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [showCompletionNote, setShowCompletionNote] = useState(false);
  const navigate = useNavigate();
  const { state, completePuzzle, attemptPuzzle, revealHint } = useGame();
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (!state.progress.login) {
      navigate('/');
    }
  }, [state.progress.login, navigate]);

  useEffect(() => {
    setSequence(LEVEL_SEQUENCES[level - 1].map(note => 
      Array.isArray(note) ? note : note
    ));
  }, [level]);

  // Add effect to show completion note when puzzle is completed
  useEffect(() => {
    if (state.progress.sequencePuzzle) {
      setSuccess(true);
      setShowCompletionNote(true);
    }
  }, [state.progress.sequencePuzzle]);

  const playNote = (note: Note, isLong: boolean = false) => {
    const noteType = isLong ? 'long' : 'short';
    const soundName = `sequence/OOT_Notes_Flute_${note}_${noteType}` as const;
    playSound(soundName, state.audio.volume);
  };

  const playSequence = async () => {
    setIsPlaying(true);
    setUserSequence([]);
    setCurrentInput('');
    
    for (let i = 0; i < sequence.length; i++) {
      const note = sequence[i];
      setPlayingIndex(i);
      setActiveNote(note);
      
      if (Array.isArray(note)) {
        // Play multiple notes in quick succession
        for (let j = 0; j < note.length; j++) {
          playNote(note[j], false);
          // Wait between notes in a double note
          if (j < note.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      } else {
        playNote(note, false);
      }
      
      // Wait between different notes in the sequence
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Reset playing state after sequence completes
    setTimeout(() => {
      setActiveNote(null);
      setPlayingIndex(null);
      setIsPlaying(false);
    }, 800);
  };

  const handleNumberClick = (num: number) => {
    if (isPlaying) return;
    
    const newInput = currentInput + num.toString();
    // Allow up to 2 digits for double notes
    if (newInput.length > 2) return;
    
    setCurrentInput(newInput);
    playNote(NOTE_MAP[num], false);
  };

  const handleSubmit = () => {
    if (!currentInput) return;
    
    const num = parseInt(currentInput);
    if (num < 1 || num > 55) {
      playSound('access-denied', state.audio.volume);
      setCurrentInput('');
      return;
    }

    const newSequence = [...userSequence, num];
    setUserSequence(newSequence);
    setCurrentInput('');
    
    // Check if sequence matches so far
    for (let i = 0; i < newSequence.length; i++) {
      const expectedNote = sequence[i];
      const userInput = newSequence[i].toString();
      
      if (Array.isArray(expectedNote)) {
        const userNotes = userInput.split('').map(n => NOTE_MAP[parseInt(n)]);
        const matches = userNotes.every(note => expectedNote.includes(note));
        if (!matches) {
          playSound('access-denied', state.audio.volume);
          setUserSequence([]);
          setCurrentInput('');
          return;
        }
      } else {
        const userNote = NOTE_MAP[parseInt(userInput)];
        if (userNote !== expectedNote) {
          playSound('access-denied', state.audio.volume);
          setUserSequence([]);
          setCurrentInput('');
          return;
        }
      }
    }
    
    // Check if sequence is complete
    if (newSequence.length === sequence.length) {
      if (level < 5) {
        playSound('discovery', state.audio.volume);
        setLevel(level + 1);
        setUserSequence([]);
        setCurrentInput('');
      } else {
        playSound('access-granted', state.audio.volume);
        completePuzzle('sequencePuzzle');
        setSuccess(true);
        setShowCompletionNote(true);
      }
    }
  };

  const handleClear = () => {
    setCurrentInput('');
    playSound('keypress', state.audio.volume);
  };

  const handleBack = () => {
    navigate('/files');
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="puzzle-container">
      <div className="puzzle-header">
        <button onClick={handleBack} className="back-button">
          ← Back to Desktop
        </button>
        <h1 className="puzzle-title">SEQUENCE ANALYSIS</h1>
      </div>
      
      {!success ? (
        <>
          <p className="instructions">Analyze the sequence pattern and determine the next number.</p>
          
          <div className="sequence-workspace">
            <div className="sequence-display">
              <h3>LEVEL {level} / 5</h3>
              <div className="current-input">
                {currentInput && <span className="input-display">{currentInput}</span>}
              </div>
              <div className="sequence-progress">
                {userSequence.map((num, i) => (
                  <div key={i} className="sequence-dot active">
                    <span className="dot-value">{num}</span>
                  </div>
                ))}
                {Array(sequence.length - userSequence.length).fill(0).map((_, i) => {
                  const index = i + userSequence.length;
                  const isPlaying = playingIndex === index;
                  const note = activeNote && isPlaying ? activeNote : null;
                  const isDoubleNote = Array.isArray(note);
                  
                  return (
                    <div 
                      key={index} 
                      className={`sequence-dot ${isPlaying ? 'playing' : ''} ${isDoubleNote ? 'split' : ''}`}
                    >
                      {note && (
                        <span className="dot-value">?</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sequence-controls">
              <button 
                onClick={playSequence} 
                disabled={isPlaying}
                className="terminal-button"
              >
                PLAY SEQUENCE
              </button>
              
              <div className="number-grid">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    disabled={isPlaying}
                    className="number-button"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handleClear}
                  disabled={isPlaying}
                  className="number-button clear-button"
                >
                  CLEAR
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isPlaying || !currentInput}
                  className="number-button submit-button"
                >
                  ENTER
                </button>
              </div>
            </div>

            {showHint && !state.hints.sequencePuzzleRevealed && (
              <div className="hint-button-container">
                <button onClick={() => revealHint('sequencePuzzleRevealed')} className="terminal-button">
                  REQUEST ASSISTANCE
                </button>
              </div>
            )}

            {state.hints.sequencePuzzleRevealed && (
              <div className="hint-container">
                <p>SYSTEM MESSAGE: Listen carefully to the sequence of notes and repeat them using the corresponding numbers.
                   Each number represents a different note:
                   1 = D, 2 = D2, 3 = F, 4 = A, 5 = B
                   Some circles may contain two notes! Input both numbers quickly (e.g., "32" for F and D2).</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="success-message">
          <p className="blink-slow">SEQUENCE SOLVED</p>
          <div className="key-info">
            <p>Key Information:</p>
            <ul>
              <li>Secret Access Code: 89P13</li>
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

export default SequencePuzzle;