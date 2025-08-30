import React from 'react';
import { RockPlatformState } from '../types';

const PLATFORM_Y = 25; // vh
const PLATFORM_WIDTH_PERCENT = 8;
const PLATFORM_HEIGHT_VH = 4;

interface PlatformProps {
    position: number;
}

const Platform: React.FC<PlatformProps> = ({ position }) => {
    return (
        <div
            className="absolute bg-orange-800 border-2 border-black/70 rounded z-0"
            style={{
                left: `${position}%`,
                bottom: `${PLATFORM_Y}vh`,
                width: `${PLATFORM_WIDTH_PERCENT}%`,
                height: `${PLATFORM_HEIGHT_VH}vh`,
            }}
            aria-label="Plataforma de ladrillos"
        >
             {/* Brick pattern */}
             <div className="w-full h-1/2 flex">
                <div className="w-1/4 h-full border-r border-b border-black/30"></div>
                <div className="w-1/2 h-full border-r border-b border-black/30"></div>
                <div className="w-1/4 h-full border-b border-black/30"></div>
             </div>
             <div className="w-full h-1/2 flex">
                <div className="w-1/2 h-full border-r border-black/30"></div>
                <div className="w-1/2 h-full"></div>
             </div>
        </div>
    );
};

export default Platform;

export const ROCK_PLATFORM_WIDTH_PERCENT = 6;
export const ROCK_PLATFORM_HEIGHT_VH = 5;

interface RockPlatformProps {
    position: { x: number; y: number };
}

export const RockPlatform: React.FC<RockPlatformProps> = ({ position }) => {
    return (
        <div
            className="absolute bg-[#6b4a39] border-2 border-black/70 rounded-md z-0"
            style={{
                left: `${position.x}%`,
                bottom: `${position.y}vh`,
                width: `${ROCK_PLATFORM_WIDTH_PERCENT}%`,
                height: `${ROCK_PLATFORM_HEIGHT_VH}vh`,
                boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.3)',
            }}
            aria-label="Plataforma de roca"
        >
            {/* Rock texture details */}
            <div className="absolute top-1 left-1 w-3 h-3 bg-[#5a3f31] rounded-full opacity-50"></div>
            <div className="absolute top-2 right-2 w-5 h-2 bg-[#5a3f31] rounded-full opacity-40"></div>
            <div className="absolute bottom-1 right-1 w-2 h-4 bg-[#5a3f31] rounded-sm opacity-50"></div>
        </div>
    );
};
