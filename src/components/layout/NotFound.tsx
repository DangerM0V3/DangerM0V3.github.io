import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [showSecret, setShowSecret] = useState(false);
  
  useEffect(() => {
    // Countdown to redirect
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/');
    }
  }, [countdown, navigate]);
  
  const handleSecretClick = () => {
    setShowSecret(true);
    console.log('%c🔍 SECRET FOUND IN ERROR PAGE', 'color: #ff0; font-size: 18px');
    console.log('%cNOTE: There seems to be an encoded message in the static. Try adjusting the frequency.', 'color: #ff0');
  };
  
  return (
    <div className="not-found">
      <h1 className="glitch" data-text="ERROR 404">ERROR 404</h1>
      <div className="error-message">
        <p>FILE CORRUPTED OR CLASSIFIED</p>
        <p>SYSTEM WILL REDIRECT IN <span className="countdown">{countdown}</span> SECONDS</p>
        
        {/* Hidden clickable element */}
        <div className="error-static" onClick={handleSecretClick}>
          {/* Hidden message that appears when clicked */}
          {showSecret && (
            <div className="secret-message">
              <p>HIDDEN FREQUENCIES DETECTED</p>
              <p className="secret-code">TRY: 7.8.4.2</p>
            </div>
          )}
        </div>
        
        <button 
          className="terminal-button"
          onClick={() => navigate('/')}
        >
          RETURN TO SECURE TERMINAL
        </button>
      </div>
    </div>
  );
};

export default NotFound;