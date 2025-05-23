import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/audio';
import '../../styles/Login.css';

const Login: React.FC = () => {
  const [codename, setCodename] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();
  const { state, completePuzzle, attemptPuzzle } = useGame();
  
  useEffect(() => {
    if (state.progress.login) {
      navigate('/puzzle1');
    }
  }, [state.progress.login, navigate]);
  
  useEffect(() => {
    if (state.attempts.login >= 3 && Math.random() > 0.7) {
      setShowHint(true);
    }
  }, [state.attempts.login]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('keypress', state.audio.volume);
    attemptPuzzle('login');
    
    // More complex login validation
    const isValidCodename = /^rocket$/i.test(codename.trim());
    const isValidPassword = /^2411$/i.test(password.trim());
    
    if (isValidCodename && isValidPassword) {
      playSound('access-granted', state.audio.volume);
      completePuzzle('login');
      navigate('/files');
    } else {
      playSound('access-denied', state.audio.volume);
      setError(
          !isValidCodename
              ? 'INVALID CODENAME. ACCESS DENIED.'
              : 'INVALID PASSWORD. ACCESS DENIED.'
      );
      
      setTimeout(() => setError(''), 3000);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="glitch" data-text="OPERATION MIDNIGHT">OPERATION MIDNIGHT</h1>
        <p className="blink-slow">TOP SECRET CLEARANCE REQUIRED</p>
      </div>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="codename">CODENAME:</label>
          <input
            type="text"
            id="codename"
            value={codename}
            onChange={(e) => setCodename(e.target.value)}
            autoComplete="off"
            autoFocus
            className="terminal-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">ACCESS CODE:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="terminal-input"
            required
          />
        </div>
        
        {error && <div className="error-message blink">{error}</div>}
        
        {showHint && (
          <div className="hint">
            <p>HINT: Agent codename is from one of guardian of the galaxy</p>
            <p className="hint-small">(You don't remember your phone password really?)</p>
          </div>
        )}

        <button type="submit" className="terminal-button">
          AUTHENTICATE
        </button>
      </form>
    </div>
  );
};

export default Login;