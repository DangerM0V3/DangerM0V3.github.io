import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { playAmbient, stopAmbient } from '../../utils/audio';

const AudioController: React.FC = () => {
  const { state } = useGame();
  
  useEffect(() => {
    if (state.audio.ambientEnabled) {
      playAmbient(state.audio.volume * 0.3);
    } else {
      stopAmbient();
    }
  }, [state.audio.ambientEnabled, state.audio.volume]);
  
  return null; // Audio controller doesn't need to render anything
};

export default AudioController;