import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/audio';
import TypeWriter from './TypeWriter';
import StatusBar from './StatusBar';
import '../../styles/Terminal.css';

interface TerminalProps {
  children: React.ReactNode;
}

const Terminal: React.FC<TerminalProps> = ({ children }) => {
  const [bootSequence, setBootSequence] = useState(true);
  const [bootMessages, setBootMessages] = useState<string[]>([]);
  const location = useLocation();
  const { state } = useGame();

  useEffect(() => {
    // Skip boot sequence if not on home page
    if (location.pathname !== '/') {
      setBootSequence(false);
      return;
    }

    // Play boot sound
    playSound('boot', state.audio.volume);

    // Boot sequence messages
    const messages = [
      'INITIALIZING SYSTEM...',
      'LOADING CORE MODULES...',
      'ESTABLISHING SECURE CONNECTION...',
      'DECRYPTING DATABASES...',
      'BYPASSING SECURITY PROTOCOLS...',
      'ACCESS GRANTED'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setBootMessages(prev => [...prev, messages[i]]);
        // Play a different sound for each message
        if (i === messages.length - 1) {
          playSound('access-granted', state.audio.volume);
        }
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootSequence(false), 1000);
      }
    }, 800);

    return () => {
      clearInterval(interval);
    };
  }, [location.pathname, state.audio.volume]);

  // Konami code detector
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          // Reset the index
          konamiIndex = 0;
          // Easter egg activation
          console.log('%c🔓 KONAMI CODE ACTIVATED', 'color: #ff0; font-size: 20px; font-weight: bold');
          console.log('%cSECRET HINT: In puzzle 3, the positions of the switches matter more than their state.', 'color: #ff0');
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', keyHandler);
    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, []);

  return (
    <div className="terminal w-full min-h-screen">
      <div className="terminal-screen bg-terminal-bg w-full min-h-screen relative overflow-hidden p-5">
        <div className="scanline"></div>
        <div className="terminal-content">
          {bootSequence ? (
            <div className="boot-sequence mt-12">
              {bootMessages.map((msg, index) => (
                <div key={index} className="boot-message text-terminal-text mb-4 text-lg">
                  <span className="prompt text-terminal-text font-bold">&gt; </span>
                  <TypeWriter text={msg} delay={50} />
                </div>
              ))}
            </div>
          ) : (
            <div className="terminal-main flex-1 flex flex-col py-2.5">
              {children}
            </div>
          )}
        </div>
        <StatusBar />
      </div>
    </div>
  );
};

export default Terminal;