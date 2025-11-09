

import React, { useState, useCallback } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import SplashScreen from './components/SplashScreen';
import { GameLevel } from './types';
import { initAudio, playMusic, stopMusic, playSound } from './services/audioService';

const App: React.FC = () => {
    const [appState, setAppState] = useState<'splash' | 'start' | 'playing' | 'gameOver'>('splash');
    const [level, setLevel] = useState<GameLevel>(GameLevel.FirstGrade);
    const [score, setScore] = useState(0);

    const handleSplashFinish = useCallback(() => {
        setAppState('start');
    }, []);

    const handleStartGame = useCallback((selectedLevel: GameLevel) => {
        initAudio().then(() => {
            playMusic();
        });
        setLevel(selectedLevel);
        setScore(0);
        setAppState('playing');
    }, []);

    const handleGameOver = useCallback((finalScore: number) => {
        stopMusic();
        playSound('gameOver');
        setScore(finalScore);
        setAppState('gameOver');
    }, []);

    const handleRestart = useCallback(() => {
        stopMusic();
        setAppState('start');
    }, []);

    return (
        <div className="w-screen h-screen bg-vito-blue overflow-hidden font-fredoka flex items-center justify-center">
            {appState === 'splash' && <SplashScreen onStart={handleSplashFinish} />}
            {appState === 'start' && <StartScreen onStart={handleStartGame} />}
            {appState === 'playing' && <Game level={level} onGameOver={handleGameOver} onRestart={handleRestart} />}
            {appState === 'gameOver' && (
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