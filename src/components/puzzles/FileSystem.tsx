import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/audio';
import { Folder, FileText, Lock, Unlock } from 'lucide-react';
import '../../styles/FileSystem.css';

interface File {
  id: string;
  name: string;
  type: 'document' | 'folder' | 'puzzle';
  icon: React.ReactNode;
  route: string;
  locked?: boolean;
  completed: boolean;
}

const FileSystem: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { state } = useGame();

  const files: File[] = [
    {
      id: 'puzzle1',
      name: 'Puzzle 1',
      type: 'puzzle',
      icon: <FileText />,
      route: '/puzzle1',
      completed: state.progress.puzzle1
    },
    {
      id: 'cipher',
      name: 'Cipher',
      type: 'puzzle',
      icon: <FileText />,
      route: '/cipher',
      completed: state.progress.cipherPuzzle
    },
    {
      id: 'puzzle2',
      name: 'Puzzle 2',
      type: 'puzzle',
      icon: <FileText />,
      route: '/puzzle2',
      completed: state.progress.puzzle2
    },
    {
      id: 'sequence',
      name: 'Sequence',
      type: 'puzzle',
      icon: <FileText />,
      route: '/sequence',
      completed: state.progress.sequencePuzzle
    },
    {
      id: 'puzzle3',
      name: 'Puzzle 3',
      type: 'puzzle',
      icon: <FileText />,
      route: '/puzzle3',
      completed: state.progress.puzzle3
    },
    {
      id: 'decoder',
      name: 'Final Decoder',
      type: 'puzzle',
      icon: <FileText />,
      route: '/decoder',
      completed: state.progress.decoder
    }
  ];

  useEffect(() => {
    if (!state.progress.login) {
      navigate('/');
    }
  }, [state.progress.login, navigate]);

  const handleFileClick = (file: File) => {
    playSound('keypress', state.audio.volume);
    navigate(file.route);
  };

  const handleContextMenu = (e: React.MouseEvent, file: File) => {
    e.preventDefault();
    setSelectedFile(file);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleContextMenuClose = () => {
    setShowContextMenu(false);
  };

  useEffect(() => {
    const handleClick = () => {
      setShowContextMenu(false);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleOpen = () => {
    if (selectedFile) {
      navigate(selectedFile.route);
    }
    setShowContextMenu(false);
  };

  return (
    <div className="file-system" onClick={handleContextMenuClose}>
      <div className="desktop">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file ${file.completed ? 'completed' : ''}`}
            onClick={() => handleFileClick(file)}
            onContextMenu={(e) => handleContextMenu(e, file)}
          >
            <div className="file-icon">
              {file.icon}
            </div>
            <div className="file-name">
              {file.name}
              {file.completed && <span className="completion-indicator">+</span>}
            </div>
          </div>
        ))}
      </div>

      {showContextMenu && selectedFile && (
        <div
          className="context-menu"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y
          }}
        >
          <div
            className="context-menu-item"
            onClick={handleOpen}
          >
            Open
          </div>
          <div className="context-menu-item">
            Properties
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSystem; 