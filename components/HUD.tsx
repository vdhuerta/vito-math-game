import React, { useState, useEffect } from 'react';
import { HeartIcon, SoundOnIcon, SoundOffIcon } from './icons';
import { GameMode } from './Game';
import { setVolume, getVolume, toggleMute, getMuteState } from '../services/audioService';

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
    const [volume, setVolumeState] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        setVolumeState(getVolume());
        setIsMuted(getMuteState());
    }, []);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume); // Actualiza el volumen en el servicio de audio
        setVolumeState(newVolume);
        setIsMuted(getMuteState()); // Sincroniza el estado de silencio desde el servicio
    };

    const handleMuteToggle = () => {
        toggleMute();
        setIsMuted(getMuteState());
        setVolumeState(getVolume()); // Sincroniza el volumen para reflejar el estado de silencio/sonido
    };
    
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
        <>
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
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-4">
                        <span>PUNTOS: {score.toString().padStart(4, '0')}</span>
                        <button
                            onClick={onToggleHelp}
                            className="bg-yellow-400 text-yellow-800 w-10 h-10 flex items-center justify-center rounded-md border-4 border-yellow-600 shadow-lg animate-coin"
                            title="Ayuda"
                        >
                            <span className="text-3xl font-bold">?</span>
                        </button>
                    </div>

                    <button
                        onClick={onRestart}
                        className="text-lg bg-vito-red px-3 py-1 rounded-md border-2 border-white/50 hover:bg-red-700 active:scale-95 transition-all"
                        title="Volver al menú principal"
                    >
                        Reiniciar
                    </button>
                    
                    <div className="w-32">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-full h-2 appearance-none bg-black/30 rounded-full accent-vito-yellow cursor-pointer"
                            aria-label="Control de volumen"
                        />
                    </div>
                    
                    <button
                        onClick={handleMuteToggle}
                        className="bg-yellow-400 text-yellow-800 w-10 h-10 flex items-center justify-center rounded-md border-4 border-yellow-600 shadow-lg"
                        title={isMuted ? "Activar Sonido" : "Silenciar"}
                    >
                        {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
                    </button>
                </div>
            </div>
        </>
    );
};

export default HUD;