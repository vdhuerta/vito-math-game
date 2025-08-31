import React from 'react';

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
        className={`w-20 h-20 bg-black/40 rounded-full flex items-center justify-center text-white text-4xl font-bold active:bg-black/60 transition-colors pointer-events-auto select-none ${className}`}
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
        <div className="fixed inset-0 z-30 pointer-events-none p-4 md:p-8 flex justify-between items-end">
            {/* Movement Controls */}
            <div className="flex gap-4 pointer-events-auto">
                <ControlButton
                    onTouchStart={(e) => handleEvent(e, () => handleMoveStart('left'))}
                    onTouchEnd={(e) => handleEvent(e, () => handleMoveEnd('left'))}
                    onMouseDown={(e) => handleEvent(e, () => handleMoveStart('left'))}
                    onMouseUp={(e) => handleEvent(e, () => handleMoveEnd('left'))}
                    ariaLabel="Mover a la izquierda"
                >
                    &larr;
                </ControlButton>
                <ControlButton
                    onTouchStart={(e) => handleEvent(e, () => handleMoveStart('right'))}
                    onTouchEnd={(e) => handleEvent(e, () => handleMoveEnd('right'))}
                    onMouseDown={(e) => handleEvent(e, () => handleMoveStart('right'))}
                    onMouseUp={(e) => handleEvent(e, () => handleMoveEnd('right'))}
                    ariaLabel="Mover a la derecha"
                >
                    &rarr;
                </ControlButton>
            </div>

            {/* Jump Control */}
            <div className="pointer-events-auto">
                 <ControlButton
                    onTouchStart={(e) => handleEvent(e, onJump)}
                    onTouchEnd={(e) => handleEvent(e, () => {})} // Jump is a single press, no need for onTouchEnd logic
                    onMouseDown={(e) => handleEvent(e, onJump)}
                    onMouseUp={(e) => handleEvent(e, () => {})}
                    className="w-24 h-24 bg-vito-red/60 active:bg-vito-red/80"
                    ariaLabel="Saltar"
                >
                    &#x2191;
                </ControlButton>
            </div>
        </div>
    );
};

export default OnScreenControls;
