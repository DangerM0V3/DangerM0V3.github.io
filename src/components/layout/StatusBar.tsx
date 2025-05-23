import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Clock } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import '../../styles/StatusBar.css';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [statusText, setStatusText] = useState('IDLE');
  const { state, toggleAmbient } = useGame();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setStatusText('LOGIN REQUIRED');
        break;
      case '/files':
        setStatusText('FILE SYSTEM ACCESS');
        break;
      case '/puzzle1':
        setStatusText('DECODING FILE');
        break;
      case '/cipher':
        setStatusText('CRYPTOGRAPHIC ANALYSIS');
        break;
      case '/puzzle2':
        setStatusText('SIGNAL ANALYSIS');
        break;
      case '/sequence':
        setStatusText('SEQUENCE ANALYSIS');
        break;
      case '/puzzle3':
        setStatusText('SECURITY OVERRIDE');
        break;
      case '/decoder':
        setStatusText('FINAL DECODER');
        break;
      case '/final':
        setStatusText('MISSION COMPLETE');
        break;
      case '/404':
        setStatusText('FILE NOT FOUND');
        break;
      default:
        setStatusText('SYSTEM ERROR');
    }
  }, [location]);
  
  const formattedTime = time.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  const getRandomAccessNumber = () => {
    return Math.floor(Math.random() * 999).toString().padStart(3, '0');
  };
  
  const [accessNumber, setAccessNumber] = useState(getRandomAccessNumber());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAccessNumber(getRandomAccessNumber());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-label">STATUS:</span>
        <span className="status-value status-blink">{statusText}</span>
      </div>
      <div className="status-item">
        <span className="status-label">ACCESS:</span>
        <span className="status-value">{accessNumber}</span>
      </div>
      <div className="status-item">
        <span className="status-label">TIME:</span>
        <span className="status-value">
          <Clock size={14} className="status-icon" />
          {formattedTime}
        </span>
      </div>
      <div className="status-item status-clickable" onClick={toggleAmbient}>
        {state.audio.ambientEnabled ? (
          <Volume2 size={16} className="status-icon" />
        ) : (
          <VolumeX size={16} className="status-icon" />
        )}
      </div>
    </div>
  );
};

export default StatusBar;