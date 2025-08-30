import React from 'react';

const Rock: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-24 h-16 bg-[#6b4a39] rounded-full border-2 border-black/50" style={style}>
        <div className="absolute top-2 right-2 w-20 h-12 bg-[#5a3f31] rounded-full"></div>
    </div>
);

const UndergroundBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-t from-[#4a342a] to-[#785544]">
            {/* Background elements */}
            <Rock style={{ bottom: '10vh', left: '15%' }} />
            <Rock style={{ bottom: '25vh', left: '80%', transform: 'scale(0.8)' }} />
            <Rock style={{ bottom: '40vh', left: '50%' }} />
            <Rock style={{ bottom: '5vh', left: '90%', transform: 'scale(1.2)' }} />
            <Rock style={{ bottom: '30vh', left: '5%', transform: 'scale(0.6)' }} />
        </div>
    );
};

export default UndergroundBackground;
