import React from 'react';
import { GameLevel } from '../types';

interface StartScreenProps {
    onStart: (level: GameLevel) => void;
}

const LevelButton: React.FC<{level: GameLevel, label: string, bgColor: string, onClick: (level: GameLevel) => void}> = ({ level, label, bgColor, onClick }) => (
    <button
        onClick={() => onClick(level)}
        className={`${bgColor} text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-200 text-xl md:text-2xl w-full`}
    >
        {label}
    </button>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-vito-blue/70 backdrop-blur-sm rounded-2xl shadow-2xl text-center flex flex-col items-center border-4 border-white">
            <h1 className="text-5xl md:text-7xl font-press-start text-vito-yellow mb-4" style={{ textShadow: '4px 4px #000' }}>
                Vito Math
            </h1>
            <p className="text-white text-2xl font-bold mb-10" style={{ textShadow: '2px 2px #000' }}>
                ¡Selecciona un Nivel para Empezar!
            </p>
            <div className="space-y-6 w-full max-w-sm">
                <LevelButton level={GameLevel.FirstGrade} label="1er Grado" bgColor="bg-vito-green" onClick={onStart} />
                <LevelButton level={GameLevel.SecondGrade} label="2do Grado" bgColor="bg-vito-red" onClick={onStart} />
                <LevelButton level={GameLevel.ThirdGrade} label="3er Grado" bgColor="bg-vito-brown" onClick={onStart} />
            </div>
        </div>
    );
};

export default StartScreen;