import React from 'react';

// --- Iconos de flecha de estilo retro para los controles ---
const LeftArrowIcon = () => (
    <svg viewBox="0 0 24 24" className="w-12 h-12">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

const RightArrowIcon = () => (
    <svg viewBox="0 0 24 24" className="w-12 h-12">
        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

const UpArrowIcon = () => (
     <svg viewBox="0 0 24 24" className="w-16 h-16">
        <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

interface OnScreenControlsProps {
    keysPressed: React.MutableRefObject<{ [key: string]: boolean }>;
    onJump: () => void;
}

const ControlButton: React.FC<{
    onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => void;
    onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => void;
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    children: React.ReactNode;
    ariaLabel: string;
}> = ({ onTouchStart, onTouchEnd, onMouseDown, onMouseUp, className, children, ariaLabel }) => (
    <button
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className={`bg-black/40 rounded-xl flex items-center justify-center text-white active:bg-black/60 transition-colors pointer-events-auto select-none border-2 border-white/20 shadow-lg ${className}`}
        aria-label={ariaLabel}
    >
        {children}
    </button>
);

const OnScreenControls: React.FC<OnScreenControlsProps> = ({ keysPressed, onJump }) => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        return null;
    }

    const handleEvent = (e: React.SyntheticEvent, action: () => void) => {
        e.preventDefault();
        action();
    }

    const handleMoveStart = (direction: 'left' | 'right') => {
        const key = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';
        keysPressed.current[key] = true;
    };

    const handleMoveEnd = (direction: 'left' | 'right') => {
        const key = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';
        keysPressed.current[key] = false;
    };

    return (
        <div className="fixed inset-0 z-30 pointer-events-none p-4 md:p-8 flex justify-between items-center">
            {/* Controles de Movimiento - Lado Izquierdo */}
            <div className="flex gap-4 pointer-events-auto">
                <ControlButton
                    onTouchStart={(e) => handleEvent(e, () => handleMoveStart('left'))}
                    onTouchEnd={(e) => handleEvent(e, () => handleMoveEnd('left'))}
                    onMouseDown={(e) => handleEvent(e, () => handleMoveStart('left'))}
                    onMouseUp={(e) => handleEvent(e, () => handleMoveEnd('left'))}
                    className="w-20 h-20"
                    ariaLabel="Mover a la izquierda"
                >
                    <LeftArrowIcon />
                </ControlButton>
                <ControlButton
                    onTouchStart={(e) => handleEvent(e, () => handleMoveStart('right'))}
                    onTouchEnd={(e) => handleEvent(e, () => handleMoveEnd('right'))}
                    onMouseDown={(e) => handleEvent(e, () => handleMoveStart('right'))}
                    onMouseUp={(e) => handleEvent(e, () => handleMoveEnd('right'))}
                    className="w-20 h-20"
                    ariaLabel="Mover a la derecha"
                >
                    <RightArrowIcon />
                </ControlButton>
            </div>

            {/* Control de Salto - Lado Derecho */}
            <div className="pointer-events-auto">
                 <ControlButton
                    onTouchStart={(e) => handleEvent(e, onJump)}
                    onTouchEnd={(e) => handleEvent(e, () => {})} // El salto es una sola pulsación
                    onMouseDown={(e) => handleEvent(e, onJump)}
                    onMouseUp={(e) => handleEvent(e, () => {})}
                    className="w-24 h-24 bg-vito-red/60 active:bg-vito-red/80"
                    ariaLabel="Saltar"
                >
                    <UpArrowIcon />
                </ControlButton>
            </div>
        </div>
    );
};

export default OnScreenControls;
