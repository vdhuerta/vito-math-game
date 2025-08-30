import React from 'react';

interface GemProps {
    position: { x: number; y: number };
}

const Gem: React.FC<GemProps> = ({ position }) => {
    return (
        <div
            className="absolute w-8 h-8 z-20 animate-pulse"
            style={{ left: `${position.x}%`, bottom: `${position.y}vh` }}
            aria-label="Una gema brillante para coleccionar"
        >
            <div className="relative w-full h-full transform -rotate-45">
                <div className="absolute w-full h-full bg-cyan-400 rounded-md border-2 border-white"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-200 rounded-sm"></div>
            </div>
        </div>
    );
};

export default Gem;
