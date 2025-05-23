import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface GameState {
  progress: {
    login: boolean;
    puzzle1: boolean;
    cipherPuzzle: boolean;
    puzzle2: boolean;
    sequencePuzzle: boolean;
    puzzle3: boolean;
    decoder: boolean;
    final: boolean;
  };
  attempts: {
    login: number;
    puzzle1: number;
    cipherPuzzle: number;
    puzzle2: number;
    sequencePuzzle: number;
    puzzle3: number;
    decoder: number;
  };
  hints: {
    puzzle1Revealed: boolean;
    cipherPuzzleRevealed: boolean;
    puzzle2Revealed: boolean;
    sequencePuzzleRevealed: boolean;
    puzzle3Revealed: boolean;
    decoderRevealed: boolean;
  };
  audio: {
    ambientEnabled: boolean;
    effectsEnabled: boolean;
    volume: number;
  };
  konami: boolean;
  timestamp: number;
}

type GameAction =
    | { type: 'COMPLETE_PUZZLE'; puzzleId: keyof GameState['progress'] }
    | { type: 'ATTEMPT_PUZZLE'; puzzleId: keyof GameState['attempts'] }
    | { type: 'REVEAL_HINT'; puzzleId: keyof GameState['hints'] }
    | { type: 'TOGGLE_AMBIENT' }
    | { type: 'TOGGLE_EFFECTS' }
    | { type: 'SET_VOLUME'; value: number }
    | { type: 'ACTIVATE_KONAMI' }
    | { type: 'RESET_GAME' };

const defaultState: GameState = {
  progress: {
    login: false,
    puzzle1: false,
    cipherPuzzle: false,
    puzzle2: false,
    sequencePuzzle: false,
    puzzle3: false,
    decoder: false,
    final: false
  },
  attempts: {
    login: 0,
    puzzle1: 0,
    cipherPuzzle: 0,
    puzzle2: 0,
    sequencePuzzle: 0,
    puzzle3: 0,
    decoder: 0
  },
  hints: {
    puzzle1Revealed: false,
    cipherPuzzleRevealed: false,
    puzzle2Revealed: false,
    sequencePuzzleRevealed: false,
    puzzle3Revealed: false,
    decoderRevealed: false
  },
  audio: {
    ambientEnabled: true,
    effectsEnabled: true,
    volume: 0.5
  },
  konami: false,
  timestamp: Date.now()
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'COMPLETE_PUZZLE':
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.puzzleId]: true
        },
        timestamp: Date.now()
      };
    case 'ATTEMPT_PUZZLE':
      return {
        ...state,
        attempts: {
          ...state.attempts,
          [action.puzzleId]: state.attempts[action.puzzleId] + 1
        },
        timestamp: Date.now()
      };
    case 'REVEAL_HINT':
      return {
        ...state,
        hints: {
          ...state.hints,
          [`${action.puzzleId}Revealed`]: true
        },
        timestamp: Date.now()
      };
    case 'TOGGLE_AMBIENT':
      return {
        ...state,
        audio: {
          ...state.audio,
          ambientEnabled: !state.audio.ambientEnabled
        },
        timestamp: Date.now()
      };
    case 'TOGGLE_EFFECTS':
      return {
        ...state,
        audio: {
          ...state.audio,
          effectsEnabled: !state.audio.effectsEnabled
        },
        timestamp: Date.now()
      };
    case 'SET_VOLUME':
      return {
        ...state,
        audio: {
          ...state.audio,
          volume: action.value
        },
        timestamp: Date.now()
      };
    case 'ACTIVATE_KONAMI':
      return {
        ...state,
        konami: true,
        timestamp: Date.now()
      };
    case 'RESET_GAME':
      return {
        ...defaultState,
        timestamp: Date.now()
      };
    default:
      return state;
  }
};

interface GameContextProps {
  state: GameState;
  completePuzzle: (puzzleId: keyof GameState['progress']) => void;
  attemptPuzzle: (puzzleId: keyof GameState['attempts']) => void;
  revealHint: (puzzleId: keyof GameState['hints']) => void;
  toggleAmbient: () => void;
  toggleEffects: () => void;
  setVolume: (value: number) => void;
  activateKonami: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, defaultState, () => {
    const savedState = localStorage.getItem('operationMidnightGame');
    return savedState ? JSON.parse(savedState) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem('operationMidnightGame', JSON.stringify(state));
  }, [state]);

  const value = {
    state,
    completePuzzle: (puzzleId: keyof GameState['progress']) =>
        dispatch({ type: 'COMPLETE_PUZZLE', puzzleId }),
    attemptPuzzle: (puzzleId: keyof GameState['attempts']) =>
        dispatch({ type: 'ATTEMPT_PUZZLE', puzzleId }),
    revealHint: (puzzleId: keyof GameState['hints']) =>
        dispatch({ type: 'REVEAL_HINT', puzzleId }),
    toggleAmbient: () => dispatch({ type: 'TOGGLE_AMBIENT' }),
    toggleEffects: () => dispatch({ type: 'TOGGLE_EFFECTS' }),
    setVolume: (value: number) => dispatch({ type: 'SET_VOLUME', value }),
    activateKonami: () => dispatch({ type: 'ACTIVATE_KONAMI' }),
    resetGame: () => dispatch({ type: 'RESET_GAME' })
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};