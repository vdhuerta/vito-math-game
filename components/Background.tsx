import React from 'react';

// --- Reusable Styled Components for Scenery ---

export const Cloud: React.FC<{ style: React.CSSProperties, animationClass: string }> = ({ style, animationClass }) => (
    <div className={`absolute ${animationClass} z-0`} style={style}>
        <div className="relative w-32 h-10 bg-white/70 rounded-full">
            <div className="absolute -top-5 left-8 w-20 h-16 bg-white/70 rounded-full"></div>
            <div className="absolute -top-3 right-6 w-16 h-12 bg-white/70 rounded-full"></div>
        </div>
    </div>
);

const Tree: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute bottom-0 w-20 h-48 opacity-75" style={style}>
        {/* Trunk */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-20 bg-[#8b5a2b] border-2 border-black/50"></div>
        {/* Leaves */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-24 bg-[#348a51] rounded-full border-2 border-black/50"></div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-16 h-20 bg-[#4caf50] rounded-full border-2 border-black/50"></div>
    </div>
);

const Bush: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute bottom-0 w-32 h-20 opacity-75" style={style}>
         <div className="absolute bottom-0 left-0 w-20 h-16 bg-[#529a30] rounded-t-full border-2 border-black/50"></div>
         <div className="absolute bottom-0 right-0 w-24 h-20 bg-[#68b543] rounded-t-full border-2 border-black/50"></div>
    </div>
    
);

// --- Main Background Component ---

interface BackgroundProps {
    playerX: number;
    level: number;
}

const TREE_POSITIONS_DEFAULT = [ '8%', '22%', '36%', '55%', '75%', '95%' ];
const BUSH_POSITIONS_DEFAULT = [ '6%', '19%', '33%', '50%', '70%', '90%' ];

const TREE_POSITIONS_LEVEL_3 = [ '5%', '30%', '58%', '82%' ]; 
const BUSH_POSITIONS_LEVEL_3 = [ '14%', '38%', '65%', '90%' ];


const Background: React.FC<BackgroundProps> = ({ playerX, level }) => {
    // Parallax factors: Farther elements move less
    const parallaxFactorFar = -0.15;
    const parallaxFactorNear = -0.4;

    const farX = playerX * parallaxFactorFar;
    const nearX = playerX * parallaxFactorNear;

    const treePositions = level === 3 ? TREE_POSITIONS_LEVEL_3 : TREE_POSITIONS_DEFAULT;
    const bushPositions = level === 3 ? BUSH_POSITIONS_LEVEL_3 : BUSH_POSITIONS_DEFAULT;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden w-[250%]">
            {/* Scenery Container: Positioned above the ground blocks */}
            <div className="absolute left-0 w-full h-[28vh]" style={{ bottom: '9vh' }}>

                {/* Far Scenery Layer (Trees) */}
                <div
                    className="absolute inset-0 w-full"
                    style={{
                        transform: `translateX(${farX}%)`
                    }}
                >
                    {treePositions.map((pos, index) => <Tree key={`tree-${index}`} style={{ left: pos }} />)}
                </div>

                {/* Near Scenery Layer (Bushes) */}
                <div
                    className="absolute inset-0 w-full"
                    style={{
                        transform: `translateX(${nearX}%)`
                    }}
                >
                    {bushPositions.map((pos, index) => <Bush key={`bush-${index}`} style={{ left: pos }} />)}
                </div>
            </div>
        </div>
    );
};

export default Background;