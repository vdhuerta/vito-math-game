import React from 'react';

interface TortubitProps {
    position: { x: number };
    isDefeated?: boolean;
}

const Tortubit: React.FC<TortubitProps> = ({ position, isDefeated }) => {
    
    const defeatedClass = isDefeated ? 'h-[2vh] opacity-60' : 'h-[6vh]';

    return (
        <div
            className="absolute z-10"
            style={{
                left: `${position.x}%`,
                bottom: `12vh`, // Sits on the ground
                width: '4%', 
            }}
            aria-label="Un enemigo tortuga llamado Tortubit"
        >
            <div className={`relative w-full transition-all duration-300 ${defeatedClass}`}>
                {/* Body/Head Container */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[70%]">
                    {/* Head */}
                    <div className="absolute bottom-[20%] left-[-25%] w-[50%] h-[60%] bg-yellow-400 border-2 border-black rounded-full">
                         {/* Eye */}
                         <div className={`absolute top-1/2 -translate-y-1/2 left-[20%] w-2 h-2 bg-black rounded-full transition-opacity duration-200 ${isDefeated ? 'opacity-0' : 'opacity-100'}`}></div>
                    </div>
                     {/* Feet */}
                    <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[30%] bg-yellow-400 border-2 border-black rounded-b-md"></div>
                    <div className="absolute bottom-[-10%] right-[5%] w-[35%] h-[30%] bg-yellow-400 border-2 border-black rounded-b-md"></div>
                </div>

                {/* Shell */}
                <div className="absolute top-0 left-0 w-full h-[85%] bg-green-700 border-2 border-black rounded-t-full rounded-b-md">
                     <div className="absolute top-1 left-1 w-[calc(100%-8px)] h-[calc(100%-8px)] border-2 border-green-900/50 rounded-t-full rounded-b-md"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 bg-green-500/30 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default Tortubit;