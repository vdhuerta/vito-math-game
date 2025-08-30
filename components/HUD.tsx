

import React from 'react';
import { HeartIcon } from './icons';
import { GameMode } from './Game';

interface HUDProps {
    lives: number;
    score: number;
    level: number;
    stage: number;
    bonusTimer?: number;
    gameMode: GameMode;
    onRestart: () => void;
    onToggleHelp: () => void;
}

const HUD: React.FC<HUDProps> = ({ lives, score, level, stage, bonusTimer, gameMode, onRestart, onToggleHelp }) => {
    
    const getStageText = () => {
        if (bonusTimer !== undefined) {
            return `TIEMPO: ${bonusTimer}`;
        }
        if (gameMode === 'preCastleRun') {
            return 'CAMINO AL CASTILLO';
        }
        if (gameMode === 'finalRun') {
            return 'GRAN FINAL';
        }
        return `ETAPA ${level}-${stage}`;
    }

    return (
        <div className="absolute top-0 left-0 w-full p-4 z-30 flex justify-between items-start font-press-start text-white text-2xl" style={{textShadow: '2px 2px #000000'}}>
            <div className="flex items-start">
                <span>VIDAS:</span>
                <div className="flex flex-wrap ml-4 w-[9.5rem]">
                    {Array.from({ length: lives }).map((_, i) => (
                        <div key={i} className="w-8 h-8 mr-1 mb-1">
                          <HeartIcon />
                        </div>
                    ))}
                </div>
            </div>
             <div className="text-center">
                <span className={bonusTimer !== undefined ? 'text-vito-yellow' : ''}>
                    {getStageText()}
                </span>
            </div>
            <div className="flex items-center gap-4">
                <span>PUNTOS: {score.toString().padStart(4, '0')}</span>
                <button
                    onClick={onToggleHelp}
                    className="bg-vito-yellow text-black w-10 h-10 flex items-center justify-center rounded-full border-2 border-black/50 shadow-lg transform hover:scale-110 active:scale-95 transition-all"
                    title="Ayuda"
                >
                    <span className="text-2xl">?</span>
                </button>
                <button
                    onClick={onRestart}
                    className="text-lg bg-vito-red px-3 py-1 rounded-md border-2 border-white/50 hover:bg-red-700 active:scale-95 transition-all"
                    title="Volver al menú principal"
                >
                    Reiniciar
                </button>
            </div>
        </div>
    );
};

export default HUD;