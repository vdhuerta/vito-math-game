import React, { useState, useCallback } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import { GameLevel } from './types';
import { initAudio } from './services/audioService';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
    const [level, setLevel] = useState<GameLevel>(GameLevel.FirstGrade);
    const [score, setScore] = useState(0);

    const handleStartGame = useCallback((selectedLevel: GameLevel) => {
        initAudio();
        setLevel(selectedLevel);
        setScore(0);
        setGameState('playing');
    }, []);

    const handleGameOver = useCallback((finalScore: number) => {
        setScore(finalScore);
        setGameState('gameOver');
    }, []);

    const handleRestart = useCallback(() => {
        setGameState('start');
    }, []);

    return (
        <div className="w-screen h-screen bg-vito-blue overflow-hidden font-fredoka flex items-center justify-center">
            {gameState === 'start' && <StartScreen onStart={handleStartGame} />}
            {gameState === 'playing' && <Game level={level} onGameOver={handleGameOver} onRestart={handleRestart} />}
            {gameState === 'gameOver' && (
                <div className="text-white text-center bg-black bg-opacity-50 p-10 rounded-lg shadow-2xl">
                    <h2 className="text-5xl font-press-start text-vito-red mb-4">FIN DEL JUEGO</h2>
                    <p className="text-3xl mb-8">Puntuación Final: {score}</p>
                    <button
                        onClick={handleRestart}
                        className="bg-vito-green text-white font-bold py-3 px-6 rounded-full hover:bg-vito-yellow hover:text-black transition-transform transform hover:scale-110 text-2xl"
                    >
                        Jugar de Nuevo
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;