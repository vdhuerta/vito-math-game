import React from 'react';

interface PlayerProps {
    position: { x: number; y: number };
    isInvincible?: boolean;
    isJumping?: boolean;
    isFadingOut?: boolean;
}

const Player: React.FC<PlayerProps> = ({ position, isInvincible, isJumping, isFadingOut }) => {
    const invincibilityClass = isInvincible ? 'animate-pulse opacity-70' : '';
    const jumpClass = isJumping ? 'animate-jump' : '';
    const fadeClass = isFadingOut ? 'opacity-0 transition-opacity duration-1000 ease-in' : '';
    const playerStyle = {
        left: `${position.x}%`,
        bottom: `${position.y}vh`,
    };

    return (
        <div
            className={`absolute w-12 h-20 z-20 ${invincibilityClass} ${jumpClass} ${fadeClass}`}
            style={playerStyle}
        >
            <div className="relative w-full h-full">
                {/* Hat */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[45px] h-[15px] bg-orange-500 rounded-t-lg border-2 border-black z-10">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-black flex items-center justify-center">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                     </div>
                </div>
                 <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[52px] h-[6px] bg-orange-500 rounded-md border-2 border-black"></div>

                {/* Head */}
                <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[40px] h-[36px] bg-[#f9d6ac] rounded-b-xl border-2 border-black">
                     {/* Hair/Sideburns */}
                     <div className="absolute top-[2px] left-[-2px] w-2 h-5 bg-[#6b3e04] rounded-l-md border-r-2 border-black"></div>
                     <div className="absolute top-[2px] right-[-2px] w-2 h-5 bg-[#6b3e04] rounded-r-md border-l-2 border-black"></div>
                     <div className="absolute top-[-2px] left-1 w-3 h-2 bg-[#6b3e04]"></div>
                     <div className="absolute top-[-2px] right-1 w-3 h-2 bg-[#6b3e04]"></div>


                     {/* Eyes */}
                    <div className="absolute top-[9px] left-[6px] w-2 h-3 bg-white rounded-full border-2 border-black">
                         <div className="absolute top-1/2 -translate-y-1/2 right-[1px] w-1 h-1 bg-black rounded-full"></div>
                    </div>
                    <div className="absolute top-[9px] right-[6px] w-2 h-3 bg-white rounded-full border-2 border-black">
                         <div className="absolute top-1/2 -translate-y-1/2 right-[1px] w-1 h-1 bg-black rounded-full"></div>
                    </div>
                     
                     {/* Mustache */}
                     <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-6 h-3 bg-[#6b3e04] rounded-t-full border-black border-2"></div>
                     {/* Nose */}
                     <div className="absolute bottom-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f9d6ac] rounded-full border-2 border-black z-10"></div>
                </div>

                {/* Body / Overalls */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[38px] h-[28px] bg-vito-yellow border-2 border-black rounded-sm">
                    {/* Straps */}
                     <div className="absolute top-[-5px] left-[2px] w-2 h-3 bg-vito-yellow rotate-[-45deg] border-y-2 border-black"></div>
                     <div className="absolute top-[-5px] right-[2px] w-2 h-3 bg-vito-yellow rotate-[45deg] border-y-2 border-black"></div>
                     {/* Buttons */}
                     <div className="absolute top-[0px] left-[6px] w-2 h-2 bg-vito-blue rounded-full border-2 border-black"></div>
                     <div className="absolute top-[0px] right-[6px] w-2 h-2 bg-vito-blue rounded-full border-2 border-black"></div>
                </div>

                 {/* Arms */}
                <div className="absolute top-[48px] left-[-6px] w-4 h-4 bg-orange-500 border-2 border-black rounded-sm"></div>
                <div className="absolute top-[48px] right-[-6px] w-4 h-4 bg-orange-500 border-2 border-black rounded-sm"></div>
                 {/* Hands (Gloves) */}
                <div className="absolute top-[60px] left-[-9px] w-5 h-5 bg-white border-2 border-black rounded-full"></div>
                <div className="absolute top-[60px] right-[-9px] w-5 h-5 bg-white border-2 border-black rounded-full"></div>
                
                 {/* Shoes */}
                <div className="absolute bottom-[-2px] left-[0px] w-5 h-3 bg-[#6b3e04] border-2 border-black rounded-tl-md rounded-bl-md"></div>
                <div className="absolute bottom-[-2px] right-[0px] w-5 h-3 bg-[#6b3e04] border-2 border-black rounded-tr-md rounded-br-md"></div>
            </div>
        </div>
    );
};

export default Player;