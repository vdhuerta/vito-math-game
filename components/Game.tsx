

import React, { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import { GameLevel, Question, QuestionBlockState, PlatformState, GemState, RockPlatformState, TortubitState } from '../types';
import { generateQuestion } from '../services/geminiService';
import { playSound } from '../services/audioService';
import QuestionModal from './QuestionModal';
import HUD from './HUD';
import Player from './Player';
import Background, { Cloud } from './Background';
import Platform, { RockPlatform } from './Platform';
import UndergroundBackground from './UndergroundBackground';
import Gem from './Gem';
import Tortubit from './Tortubit';
import HelpModal from './HelpModal';
import { RedArrowIcon, CheckmarkIcon } from './icons';
import OnScreenControls from './OnScreenControls';


const GOAL_POSITION = 110;
const STAGES_PER_LEVEL = 6;

// --- Physics Constants ---
const GRAVITY = 0.1;
const JUMP_FORCE = 2.2;
const GROUND_Y = 12; // vh. This is the top of the ground where characters stand.
const GROUND_BASE_VH = 9; // The height of the brown dirt part of the ground.
const GROUND_TOP_VH = 3; // The height of the green grass part of the ground.
const QUESTION_BLOCK_Y_DEFAULT = 25; // vh
const QUESTION_BLOCK_Y_HIGH = 40; // vh
const QUESTION_BLOCK_WIDTH = 4; // %
const QUESTION_BLOCK_HEIGHT = 8; // vh
const PLAYER_WIDTH = 3.5; // % - A little wider for better feel
const PLAYER_HEIGHT = 10; // vh
const PLATFORM_WIDTH = 8; // %
const PLATFORM_HEIGHT = 4; // vh
const PLATFORM_Y = 25; // vh
const GEM_WIDTH = 2; // %
const GEM_HEIGHT = 4; // vh
const ROCK_PLATFORM_WIDTH = 6; // %
const ROCK_PLATFORM_HEIGHT = 5; // vh
const TORTUBIT_WIDTH = 5; // % - Hitbox is wider than sprite to account for head
const TORTUBIT_HEIGHT = 6; // vh
const TORTUBIT_DEFAULT_SPEED = 0.1;
const TORTUBIT_FAST_SPEED = TORTUBIT_DEFAULT_SPEED * 1.35;
const TORTUBIT_LEVEL2_SPEED = TORTUBIT_DEFAULT_SPEED * 1.3;
const TORTUBIT_LEVEL3_SPEED = TORTUBIT_DEFAULT_SPEED * 1.6;
const DEFEAT_BOUNCE_FORCE = 1.6;
const TORTUBIT_KILL_POINTS = 200;


// --- Bonus Level Constants ---
const BONUS_TIME_LIMIT = 30;
const GEM_VALUE = 50;
const BONUS_HOLE_X = 5; // % from left
const BONUS_HOLE_WIDTH = 8; // %

// --- Final Run Constants ---
const PRE_CASTLE_GOAL = 150;
const CASTLE_POSITION = 130; // %
const CASTLE_DOOR_X = CASTLE_POSITION + 13; // Player must reach this X to "enter"

const PRE_CASTLE_GEMS: GemState[] = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    position: {
        x: 20 + i * 4,
        y: 20 + Math.sin(i * 0.5) * 10
    }
}));


const FinalCastle: React.FC = () => {
    return (
        <div
            className="absolute z-10"
            style={{
                left: `${CASTLE_POSITION}%`,
                bottom: `${GROUND_Y}vh`,
                width: '32%',
                height: '45vh',
            }}
            aria-label="El gran castillo de la princesa"
        >
            <div className="relative w-full h-full">
                {/* Far Towers */}
                <div className="absolute bottom-0 left-[5%] w-[22%] h-[90%] bg-gray-400 border-2 border-black rounded-t-lg shadow-lg">
                    <div className="absolute -top-[7vh] left-1/2 -translate-x-1/2 w-[120%] h-[8vh]" style={{ background: '#e52521', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', border: '2px solid black', borderBottom: 'none' }}></div>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-8 bg-black/30 border-2 border-black rounded-sm"></div>
                </div>
                <div className="absolute bottom-0 right-[5%] w-[22%] h-[90%] bg-gray-400 border-2 border-black rounded-t-lg shadow-lg">
                    <div className="absolute -top-[7vh] left-1/2 -translate-x-1/2 w-[120%] h-[8vh]" style={{ background: '#e52521', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', border: '2px solid black', borderBottom: 'none' }}></div>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-8 bg-black/30 border-2 border-black rounded-sm"></div>
                </div>
            
                {/* Main Keep */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[100%] bg-gray-300 border-2 border-black rounded-t-lg shadow-2xl">
                    {/* Battlements */}
                    <div className="absolute -top-1 left-0 w-full h-4 flex justify-around bg-gray-300 border-b-2 border-black">
                        <div className="w-4 h-full bg-transparent border-x-2 border-t-2 border-black"></div>
                        <div className="w-4 h-full bg-transparent border-x-2 border-t-2 border-black"></div>
                        <div className="w-4 h-full bg-transparent border-x-2 border-t-2 border-black"></div>
                    </div>
                    {/* Grand Doorway */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[35%] bg-black/70 border-4 border-[#6b4a39] rounded-t-[50%] flex items-center justify-center overflow-hidden">
                       <div className="w-full h-full bg-[#8b5a2b] border-t-2 border-black">
                            <div className="w-1/2 h-full border-r-2 border-black"></div>
                       </div>
                    </div>
                    {/* Main Window */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-10 bg-vito-yellow border-2 border-black rounded-t-lg">
                         <div className="w-full h-1/2 border-b-2 border-black"></div>
                         <div className="w-1/2 h-1/2 border-r-2 border-black"></div>
                    </div>
                    {/* Flag */}
                    <div className="absolute -top-[10vh] left-1/2 -translate-x-1/2 w-1 h-[11vh] bg-yellow-600"></div>
                    <div className="absolute -top-[10vh] left-1/2 w-8 h-6 bg-vito-red border border-black flex items-center justify-center">
                        <div className="w-4 h-4 bg-vito-yellow rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Bonus Level Configs ---
// Stage 1-3
const GEM_LOCATIONS_1_3 = [
    { id: 1, position: { x: 15, y: 20 } }, { id: 2, position: { x: 20, y: 25 } }, { id: 3, position: { x: 25, y: 20 } },
    { id: 4, position: { x: 40, y: 35 } }, { id: 5, position: { x: 45, y: 40 } }, { id: 6, position: { x: 50, y: 35 } },
    { id: 7, position: { x: 65, y: 20 } }, { id: 8, position: { x: 70, y: 25 } }, { id: 9, position: { x: 75, y: 20 } },
    { id: 10, position: { x: 85, y: 50 } },
];
const BONUS_ROCK_PLATFORMS_1_3 = [{ id: 1, position: { x: 82, y: 30 } }];

// Stage 1-6
const GEM_LOCATIONS_1_6 = [
    { id: 1, position: { x: 10, y: 20 } }, { id: 2, position: { x: 15, y: 25 } }, { id: 3, position: { x: 35, y: 40 } },
    { id: 4, position: { x: 25, y: 65 } }, { id: 5, position: { x: 50, y: 55 } }, { id: 6, position: { x: 45, y: 60 } },
    { id: 7, position: { x: 65, y: 75 } }, { id: 8, position: { x: 60, y: 80 } }, { id: 9, position: { x: 80, y: 50 } },
    { id: 10, position: { x: 85, y: 55 } }, { id: 11, position: { x: 90, y: 30 } }, { id: 12, position: { x: 5, y: 45 } },
    { id: 13, position: { x: 70, y: 20 } }, { id: 14, position: { x: 75, y: 25 } }, { id: 15, position: { x: 55, y: 20 } },
];
const BONUS_ROCK_PLATFORMS_1_6 = [
    { id: 1, position: { x: 32, y: 30 } }, { id: 2, position: { x: 22, y: 55 } }, { id: 3, position: { x: 45, y: 45 } },
    { id: 4, position: { x: 57, y: 70 } }, { id: 5, position: { x: 78, y: 40 } }, { id: 6, position: { x: 5, y: 35 } }, { id: 7, position: { x: 88, y: 20 } }
];

// Stage 2-3
const GEM_LOCATIONS_2_3 = [
    { id: 1, position: { x: 10, y: 20 } }, { id: 2, position: { x: 15, y: 25 } }, { id: 3, position: { x: 20, y: 30 } },
    { id: 4, position: { x: 40, y: 45 } }, { id: 5, position: { x: 45, y: 50 } }, { id: 6, position: { x: 50, y: 45 } },
    { id: 7, position: { x: 70, y: 60 } }, { id: 8, position: { x: 75, y: 65 } }, { id: 9, position: { x: 80, y: 60 } },
    { id: 10, position: { x: 5, y: 50 } }, { id: 11, position: { x: 90, y: 30 } },
];
const BONUS_ROCK_PLATFORMS_2_3 = [
    { id: 1, position: { x: 38, y: 35 } }, { id: 2, position: { x: 68, y: 50 } }, { id: 3, position: { x: 5, y: 40 } },
    { id: 4, position: { x: 55, y: 25 } }, { id: 5, position: { x: 88, y: 20 } }
];

// Stage 2-6
const GEM_LOCATIONS_2_6 = [
    { id: 1, position: { x: 5, y: 20 } }, { id: 2, position: { x: 10, y: 25 } }, { id: 3, position: { x: 15, y: 30 } },
    { id: 4, position: { x: 25, y: 50 } }, { id: 5, position: { x: 30, y: 55 } }, { id: 6, position: { x: 35, y: 60 } },
    { id: 7, position: { x: 50, y: 80 } }, { id: 8, position: { x: 55, y: 85 } }, { id: 9, position: { x: 60, y: 80 } },
    { id: 10, position: { x: 80, y: 40 } }, { id: 11, position: { x: 85, y: 45 } }, { id: 12, position: { x: 90, y: 40 } },
    { id: 13, position: { x: 5, y: 60 } }, { id: 14, position: { x: 90, y: 70 } }, { id: 15, position: { x: 45, y: 25 } },
];
const BONUS_ROCK_PLATFORMS_2_6 = [
    { id: 1, position: { x: 23, y: 40 } }, { id: 2, position: { x: 5, y: 50 } }, { id: 3, position: { x: 48, y: 70 } },
    { id: 4, position: { x: 78, y: 30 } }, { id: 5, position: { x: 88, y: 60 } }, { id: 6, position: { x: 42, y: 20 } }
];

// Stage 3-3
const GEM_LOCATIONS_3_3 = [
    { id: 1, position: { x: 10, y: 25 } }, { id: 2, position: { x: 25, y: 40 } }, { id: 3, position: { x: 15, y: 55 } },
    { id: 4, position: { x: 40, y: 65 } }, { id: 5, position: { x: 55, y: 50 } }, { id: 6, position: { x: 70, y: 70 } },
    { id: 7, position: { x: 85, y: 85 } }, { id: 8, position: { x: 60, y: 20 } }, { id: 9, position: { x: 75, y: 35 } },
    { id: 10, position: { x: 90, y: 50 } },
];
const BONUS_ROCK_PLATFORMS_3_3 = [
    { id: 1, position: { x: 22, y: 30 } }, { id: 2, position: { x: 12, y: 45 } }, { id: 3, position: { x: 37, y: 55 } },
    { id: 4, position: { x: 67, y: 60 } }, { id: 5, position: { x: 82, y: 75 } }, { id: 6, position: { x: 72, y: 25 } }, { id: 7, position: { x: 88, y: 40 } },
];

// Stage 3-5
const GEM_LOCATIONS_3_5 = [
    { id: 1, position: { x: 10, y: 80 } }, { id: 2, position: { x: 20, y: 70 } }, { id: 3, position: { x: 30, y: 80 } },
    { id: 4, position: { x: 5, y: 50 } }, { id: 5, position: { x: 15, y: 40 } }, { id: 6, position: { x: 25, y: 50 } },
    { id: 7, position: { x: 40, y: 30 } }, { id: 8, position: { x: 50, y: 20 } }, { id: 9, position: { x: 60, y: 30 } },
    { id: 10, position: { x: 75, y: 50 } }, { id: 11, position: { x: 85, y: 60 } }, { id: 12, position: { x: 95, y: 50 } },
    { id: 13, position: { x: 50, y: 90 } },
];
const BONUS_ROCK_PLATFORMS_3_5 = [
    { id: 1, position: { x: 18, y: 60 } }, { id: 2, position: { x: 13, y: 30 } }, { id: 3, position: { x: 48, y: 80 } },
    { id: 4, position: { x: 48, y: 10 } }, { id: 5, position: { x: 83, y: 50 } }, { id: 6, position: { x: 30, y: 20 } },
    { id: 7, position: { x: 45, y: 40 } }, { id: 8, position: { x: 65, y: 60 } },
    { id: 9, position: { x: 50, y: 60 } }, { id: 10, position: { x: 55, y: 40 } },
];

const BONUS_LEVEL_CONFIGS = {
    '1-3': { gems: GEM_LOCATIONS_1_3, platforms: BONUS_ROCK_PLATFORMS_1_3 },
    '1-6': { gems: GEM_LOCATIONS_1_6, platforms: BONUS_ROCK_PLATFORMS_1_6 },
    '2-3': { gems: GEM_LOCATIONS_2_3, platforms: BONUS_ROCK_PLATFORMS_2_3 },
    '2-6': { gems: GEM_LOCATIONS_2_6, platforms: BONUS_ROCK_PLATFORMS_2_6 },
    '3-3': { gems: GEM_LOCATIONS_3_3, platforms: BONUS_ROCK_PLATFORMS_3_3 },
    '3-5': { gems: GEM_LOCATIONS_3_5, platforms: BONUS_ROCK_PLATFORMS_3_5 },
};


// --- Stage Configurations ---
const STAGE_CONFIG = {
    [GameLevel.FirstGrade]: [
        { stage: 1, questions: [{ x: 35, y: QUESTION_BLOCK_Y_DEFAULT }], platforms: [], tortubits: [] },
        { stage: 2, questions: [{ x: 35, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 60, y: QUESTION_BLOCK_Y_HIGH }], platforms: [{ id: 1, position: 45 }], tortubits: [{ id: 1, initialX: 115 }] },
        { stage: 3, questions: [{ x: 25, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 50, y: QUESTION_BLOCK_Y_HIGH }, { x: 75, y: QUESTION_BLOCK_Y_DEFAULT }], platforms: [{ id: 1, position: 40 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 150 }] },
        { stage: 4, questions: [{ x: 20, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 50, y: QUESTION_BLOCK_Y_HIGH + 5 }, { x: 80, y: QUESTION_BLOCK_Y_DEFAULT }], platforms: [{ id: 1, position: 45 }, { id: 2, position: 70 }], tortubits: [{ id: 1, initialX: 120 }, { id: 2, initialX: 160 }] },
        { stage: 5, questions: [{ x: 20, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 48, y: QUESTION_BLOCK_Y_HIGH + 5 }, { x: 78, y: QUESTION_BLOCK_Y_HIGH + 2 }], platforms: [{ id: 1, position: 42 }, { id: 2, position: 72 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 140 }, { id: 3, initialX: 180 }] },
        { stage: 6, questions: [{ x: 15, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 45, y: QUESTION_BLOCK_Y_HIGH + 5 }, { x: 70, y: QUESTION_BLOCK_Y_HIGH + 10 }, { x: 90, y: QUESTION_BLOCK_Y_DEFAULT }], platforms: [{ id: 1, position: 38 }, { id: 2, position: 65 }, { id: 3, position: 80 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 130 }, { id: 3, initialX: 150 }, { id: 4, initialX: 170 }] },
    ],
    [GameLevel.SecondGrade]: [
        { stage: 1, questions: [{ x: 40, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 70, y: QUESTION_BLOCK_Y_HIGH }], platforms: [{ id: 1, position: 60 }], tortubits: [{ id: 1, initialX: 120 }] },
        { stage: 2, questions: [{ x: 25, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 55, y: QUESTION_BLOCK_Y_HIGH }, { x: 85, y: QUESTION_BLOCK_Y_DEFAULT }], platforms: [{ id: 1, position: 48 }, { id: 2, position: 75 }], tortubits: [{ id: 1, initialX: 115 }, { id: 2, initialX: 155 }] },
        { stage: 3, questions: [{ x: 20, y: QUESTION_BLOCK_Y_HIGH }, { x: 50, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 80, y: QUESTION_BLOCK_Y_HIGH + 5 }], platforms: [{ id: 1, position: 15 }, { id: 2, position: 72 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 140 }, { id: 3, initialX: 180 }] },
        { stage: 4, questions: [{ x: 15, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 45, y: QUESTION_BLOCK_Y_HIGH + 10 }, { x: 75, y: QUESTION_BLOCK_Y_HIGH }, { x: 95, y: QUESTION_BLOCK_Y_DEFAULT }], platforms: [{ id: 1, position: 38 }, { id: 2, position: 68 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 135 }, { id: 3, initialX: 160 }, { id: 4, initialX: 190 }] },
        { stage: 5, questions: [{ x: 10, y: QUESTION_BLOCK_Y_HIGH }, { x: 35, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 60, y: QUESTION_BLOCK_Y_HIGH + 15 }, { x: 85, y: QUESTION_BLOCK_Y_HIGH }], platforms: [{ id: 1, position: 5 }, { id: 2, position: 53 }, { id: 3, position: 78 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 130 }, { id: 3, initialX: 150 }, { id: 4, initialX: 170 }] },
        { stage: 6, questions: [{ x: 15, y: QUESTION_BLOCK_Y_HIGH }, { x: 40, y: QUESTION_BLOCK_Y_HIGH + 20 }, { x: 65, y: QUESTION_BLOCK_Y_HIGH + 5 }, { x: 90, y: QUESTION_BLOCK_Y_DEFAULT }], platforms: [{ id: 1, position: 10 }, { id: 2, position: 35 }, { id: 3, position: 58 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 125 }, { id: 3, initialX: 140 }, { id: 4, initialX: 155 }, { id: 5, initialX: 170 }] },
    ],
    [GameLevel.ThirdGrade]: [
        { stage: 1, questions: [{ x: 30, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 60, y: QUESTION_BLOCK_Y_DEFAULT }], platforms: [], tortubits: [{ id: 1, initialX: 115 }] },
        { stage: 2, questions: [{ x: 25, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 50, y: QUESTION_BLOCK_Y_HIGH }, { x: 75, y: QUESTION_BLOCK_Y_DEFAULT }], platforms: [{ id: 1, position: 45 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 140 }] },
        { stage: 3, questions: [{ x: 20, y: QUESTION_BLOCK_Y_HIGH }, { x: 50, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 80, y: QUESTION_BLOCK_Y_HIGH }], platforms: [{ id: 1, position: 15 }, { id: 2, position: 75 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 130 }, { id: 3, initialX: 160 }] },
        { stage: 4, questions: [{ x: 15, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 35, y: QUESTION_BLOCK_Y_HIGH + 10 }, { x: 60, y: QUESTION_BLOCK_Y_HIGH + 10 }, { x: 85, y: QUESTION_BLOCK_Y_DEFAULT }], platforms: [{ id: 1, position: 30 }, { id: 2, position: 55 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 125 }, { id: 3, initialX: 150 }, { id: 4, initialX: 175 }] },
        { stage: 5, questions: [{ x: 10, y: QUESTION_BLOCK_Y_HIGH }, { x: 30, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 50, y: QUESTION_BLOCK_Y_HIGH + 15 }, { x: 70, y: QUESTION_BLOCK_Y_DEFAULT }, { x: 90, y: QUESTION_BLOCK_Y_HIGH }], platforms: [{ id: 1, position: 5 }, { id: 2, position: 45 }, { id: 3, position: 85 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 120 }, { id: 3, initialX: 140 }, { id: 4, initialX: 150 }, { id: 5, initialX: 170 }] },
        { stage: 6, questions: [{ x: 15, y: QUESTION_BLOCK_Y_HIGH }, { x: 35, y: QUESTION_BLOCK_Y_HIGH + 10 }, { x: 55, y: QUESTION_BLOCK_Y_HIGH }, { x: 75, y: QUESTION_BLOCK_Y_HIGH + 10 }], platforms: [{ id: 1, position: 10 }, { id: 2, position: 30 }, { id: 3, position: 50 }, { id: 4, position: 70 }], tortubits: [{ id: 1, initialX: 110 }, { id: 2, initialX: 120 }, { id: 3, initialX: 130 }, { id: 4, initialX: 140 }, { id: 5, initialX: 150 }, { id: 6, initialX: 160 }] },
    ],
};


type BonusTransitionState = 'none' | 'holeVisible' | 'falling' | 'complete' | 'returning';
export type GameMode = 'normal' | 'bonus' | 'preCastleRun' | 'finalRun';

interface GameProps {
    level: GameLevel;
    onGameOver: (score: number) => void;
    onRestart: () => void;
}

const Game: React.FC<GameProps> = ({ level, onGameOver, onRestart }) => {
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [stage, setStage] = useState(1);
    
    const playerPosition = useRef({ x: 10, y: GROUND_Y });
    const playerVelocity = useRef({ x: 0, y: 0 });
    const isOnGround = useRef(true);
    const tortubits = useRef<TortubitState[]>([]);
    
    const [_, forceUpdate] = useReducer(x => x + 1, 0);


    const [isInvincible, setIsInvincible] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [activeQuestionBlock, setActiveQuestionBlock] = useState<number | null>(null);
    const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
    const [gameMessage, setGameMessage] = useState<string | null>(null);
    const [stageComplete, setStageComplete] = useState(false);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    
    const [questionBlocks, setQuestionBlocks] = useState<QuestionBlockState[]>([]);
    const [platforms, setPlatforms] = useState<PlatformState[]>([]);
    const [bonusPoints, setBonusPoints] = useState<{id: number, position: number, value: number}[]>([]);
    const [questionPoints, setQuestionPoints] = useState<{ id: number; x: number; y: number; value: number } | null>(null);
    const [extraLifeMessage, setExtraLifeMessage] = useState<{ id: number, x: number, y: number } | null>(null);
    const [livesAtStageStart, setLivesAtStageStart] = useState(3);


    // Game State
    const [gameMode, setGameMode] = useState<GameMode>('normal');
    const [isEnteringCastle, setIsEnteringCastle] = useState(false);
    const [bonusTimer, setBonusTimer] = useState(0);
    const [gems, setGems] = useState<GemState[]>([]);
    const [rockPlatforms, setRockPlatforms] = useState<RockPlatformState[]>([]);
    const [bonusTransitionState, setBonusTransitionState] = useState<BonusTransitionState>('none');
    const [transitionYOffset, setTransitionYOffset] = useState(0);
    const [showBonusInstructions, setShowBonusInstructions] = useState(false);


    const keysPressed = useRef<{ [key: string]: boolean }>({});
    const isHandlingAnswer = useRef(false);
    const isPaused = useRef(false);

    const toggleHelp = useCallback(() => {
        setIsHelpVisible(v => {
            isPaused.current = !v;
            return !v;
        });
    }, []);
    
    const displayMessage = (msg: string, duration: number = 2000) => {
        setGameMessage(msg);
        setTimeout(() => setGameMessage(null), duration);
    };

    const setupFinalRun = useCallback(() => {
        setGameMode('finalRun');
        setStageComplete(false);
        setQuestionBlocks([]);
        setPlatforms([]);
        tortubits.current = [];
        setGems([]);
        playerPosition.current = { x: 10, y: GROUND_Y };
        playerVelocity.current = { x: 0, y: 0 };
    }, []);

    const setupPreCastleRun = useCallback(() => {
        setGameMode('preCastleRun');
        setStageComplete(false);
        setQuestionBlocks([]);
        setPlatforms([]);
        tortubits.current = [];
        setGems(PRE_CASTLE_GEMS);
        playerPosition.current = { x: 10, y: GROUND_Y };
        playerVelocity.current = { x: 0, y: 0 };
        displayMessage("¡Camino al Castillo!", 2000);
    }, []);

    const setupStage = useCallback((currentStage: number) => {
        const config = STAGE_CONFIG[level][currentStage - 1];
        if (!config) return;

        setPlatforms(config.platforms || []);
        
        const newQuestionBlocks = config.questions.map((q, i) => ({
            id: i + 1,
            position: { x: q.x, y: q.y },
            cleared: false,
        }));
        setQuestionBlocks(newQuestionBlocks);

        let tortubitSpeed = TORTUBIT_DEFAULT_SPEED;
        if (level === GameLevel.ThirdGrade) {
            tortubitSpeed = TORTUBIT_LEVEL3_SPEED;
        } else if (level === GameLevel.SecondGrade) {
            tortubitSpeed = TORTUBIT_LEVEL2_SPEED;
        } else if (level === GameLevel.FirstGrade) {
            const fastStages = [3, 4, 5, 6];
            if (fastStages.includes(currentStage)) {
                tortubitSpeed = TORTUBIT_FAST_SPEED;
            }
        }

        const newTortubits = (config.tortubits || []).map(t => ({
            ...t,
            position: { x: t.initialX },
            isDefeated: false,
            speed: tortubitSpeed,
            spawned: false, // Start as not spawned
        }));
        tortubits.current = newTortubits as TortubitState[];


        playerPosition.current = { x: 10, y: GROUND_Y };
        playerVelocity.current = { x: 0, y: 0 };
        setStageComplete(false);
        setIsEnteringCastle(false);
        setGameMode('normal');
        setBonusTransitionState('none');
        setTransitionYOffset(0);
        setGems([]);
        setRockPlatforms([]);
        displayMessage(`Etapa ${level}-${currentStage}`, 2000);

    }, [level]);

    useEffect(() => {
        setupStage(stage);
        setLivesAtStageStart(lives);
    }, [stage, level, setupStage]);

    // Effect to spawn tortubits after a delay
    useEffect(() => {
        if (stage > 0) { // To avoid running on initial mount before stage is set
            const timer = setTimeout(() => {
                tortubits.current = tortubits.current.map(t => ({ ...t, spawned: true }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [stage]);


    const fetchQuestion = useCallback(async (blockId: number) => {
        isPaused.current = true;
        isHandlingAnswer.current = false; // Reset guard for new question.
        setIsLoadingQuestion(true);
        setActiveQuestionBlock(blockId);
        const question = await generateQuestion(level);
        setCurrentQuestion(question);
        setShowQuestion(true);
        setIsLoadingQuestion(false);
    }, [level]);

    const handlePlayerHit = useCallback(() => {
        if (isInvincible) return;
        playSound('incorrect');
        setIsInvincible(true);
        displayMessage("¡Ay!", 1500);
        playerPosition.current = {...playerPosition.current, x: Math.max(playerPosition.current.x - 10, 0)};
        playerVelocity.current = { x: 0, y: 0 };

        setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
                playSound('gameOver');
                setTimeout(() => onGameOver(score), 500);
            }
            return newLives;
        });
        setTimeout(() => setIsInvincible(false), 1500);
    }, [isInvincible, onGameOver, score]);

    const startBonusTransition = useCallback(() => {
        setStageComplete(true);
        setBonusTransitionState('holeVisible');
    }, []);

    const endBonusLevel = useCallback(() => {
        displayMessage("¡Bonus Terminado!", 2000);
        setBonusTransitionState('returning');
    }, []);

    const handleStartBonus = () => {
        setShowBonusInstructions(false);
        setBonusTimer(BONUS_TIME_LIMIT);
        isPaused.current = false;
    };


    useEffect(() => {
        if (gameMode === 'bonus' && bonusTimer > 0 && !isPaused.current) {
            const timerId = setTimeout(() => setBonusTimer(t => t - 1), 1000);
            return () => clearTimeout(timerId);
        } else if (gameMode === 'bonus' && bonusTimer === 0) {
            endBonusLevel();
        }
    }, [gameMode, bonusTimer, endBonusLevel, isPaused.current]);

    useEffect(() => {
        if (bonusTransitionState === 'falling') {
            const fallInterval = setInterval(() => {
                setTransitionYOffset(prev => {
                    const newOffset = prev + 2; // Adjust speed of transition
                    if (newOffset >= 100) {
                        clearInterval(fallInterval);
                        setTransitionYOffset(100);
                        setBonusTransitionState('complete');
                        return 100;
                    }
                    return newOffset;
                });
            }, 16); // ~60fps
            return () => clearInterval(fallInterval);
        }
    }, [bonusTransitionState]);
    
    useEffect(() => {
        // This effect runs *after* the falling transition is complete.
        if (bonusTransitionState === 'complete' && gameMode !== 'bonus') {
            setGameMode('bonus');
            playerPosition.current = { x: 5, y: GROUND_Y };
            playerVelocity.current = { x: 0, y: 0 };
    
            const bonusKey = `${level}-${stage}`;
            const config = BONUS_LEVEL_CONFIGS[bonusKey as keyof typeof BONUS_LEVEL_CONFIGS];
    
            if (config) {
                setGems(config.gems);
                setRockPlatforms(config.platforms);
            } else {
                setGems([]);
                setRockPlatforms([]);
            }
            
            setShowBonusInstructions(true);
            isPaused.current = true;
        }
    }, [bonusTransitionState, level, stage, gameMode]);

    useEffect(() => {
        if (bonusTransitionState === 'returning') {
            const returnInterval = setInterval(() => {
                setTransitionYOffset(prev => {
                    const newOffset = prev - 2; // Animate upwards
                    if (newOffset <= 0) {
                        clearInterval(returnInterval);
                        setGameMode('normal');
                        playerPosition.current = { x: BONUS_HOLE_X + 2, y: GROUND_Y };
                        setBonusTransitionState('none'); // Reset state
                        
                        const isFinalBonus = (level === GameLevel.FirstGrade || level === GameLevel.SecondGrade) && stage === 6;
                        
                        if (isFinalBonus) {
                            displayMessage("¡Nivel Completado!", 3000);
                            setTimeout(() => onRestart(), 3000);
                        } else {
                            // This handles stage 1-3, 2-3, 3-3, and 3-5 bonuses
                            setTimeout(() => {
                               setStage(s => s + 1);
                            }, 500); 
                        }
                        
                        return 0;
                    }
                    return newOffset;
                });
            }, 16); // ~60fps
            return () => clearInterval(returnInterval);
        }
    }, [bonusTransitionState, level, stage, onGameOver, score, onRestart]);


    const handleJump = useCallback(() => {
        const canJump = isOnGround.current && !isPaused.current && (!stageComplete || gameMode !== 'normal');
        if (canJump) {
            playSound('jump');
            playerVelocity.current.y = JUMP_FORCE;
            isOnGround.current = false;
        }
    }, [stageComplete, gameMode]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isPaused.current) return;
            keysPressed.current[e.key] = true;
            if ((e.key === ' ' || e.key === 'ArrowUp')) {
                handleJump();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current[e.key] = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isPaused.current, handleJump]);

    useEffect(() => {
        let animationFrameId: number;

        const gameLoop = () => {
            if (isPaused.current || isEnteringCastle || (stageComplete && gameMode !== 'bonus' && bonusTransitionState !== 'holeVisible')) {
                animationFrameId = requestAnimationFrame(gameLoop);
                return;
            }

            // --- Enemy Logic ---
            if (gameMode === 'normal') {
                let playerWasHit = false;

                const nextTortubits = tortubits.current.map(tortubit => {
                    if (tortubit.isDefeated || !tortubit.spawned) {
                        return tortubit;
                    }

                    const newTortubit = { 
                        ...tortubit, 
                        position: { x: tortubit.position.x - tortubit.speed }
                    };

                    const playerRect = {
                        left: playerPosition.current.x, right: playerPosition.current.x + PLAYER_WIDTH,
                        top: playerPosition.current.y + PLAYER_HEIGHT, bottom: playerPosition.current.y
                    };
                    const tortubitRect = {
                        left: newTortubit.position.x, right: newTortubit.position.x + TORTUBIT_WIDTH,
                        top: GROUND_Y + TORTUBIT_HEIGHT, bottom: GROUND_Y
                    };

                    const horizontalOverlap = playerRect.right > tortubitRect.left && playerRect.left < tortubitRect.right;
                    const verticalOverlap = playerRect.top > tortubitRect.bottom && playerRect.bottom < tortubitRect.top;
                    
                    if (horizontalOverlap && verticalOverlap) {
                        const isFalling = playerVelocity.current.y < 0;
                        // Player's feet are above the enemy's head and they are falling on it.
                        // The -3 provides a small margin of error for the stomp.
                        const isStomp = isFalling && playerRect.bottom >= tortubitRect.top - 3;

                        if (isStomp) {
                            playSound('stomp');
                            playerVelocity.current.y = DEFEAT_BOUNCE_FORCE;
                            setScore(s => s + TORTUBIT_KILL_POINTS);

                            const pointId = Date.now();
                            setBonusPoints(bp => [...bp, { id: pointId, position: newTortubit.position.x, value: TORTUBIT_KILL_POINTS }]);
                            
                            setTimeout(() => {
                                setBonusPoints(currentPoints => currentPoints.filter(p => p.id !== pointId));
                            }, 1500);

                            return { ...newTortubit, isDefeated: true, defeatTime: Date.now() };
                        } else if (!isInvincible) {
                             // Any other collision is a hit, if the player is not invincible
                            playerWasHit = true;
                        }
                    }
                    
                    return newTortubit;

                }).filter(t => {
                    if (t.isDefeated) {
                        return t.defeatTime ? (Date.now() - t.defeatTime < 800) : true;
                    }
                    return t.position.x > -TORTUBIT_WIDTH;
                });

                tortubits.current = nextTortubits;

                if (playerWasHit) { // No need to check for isInvincible here, already checked above
                    handlePlayerHit();
                }
            }


            // --- Physics & Movement ---
            playerVelocity.current.y -= GRAVITY;

            const acceleration = 0.04;
            const maxSpeed = 0.8;
            const friction = 0.96;
            
            if (keysPressed.current['ArrowRight']) {
                playerVelocity.current.x = Math.min(playerVelocity.current.x + acceleration, maxSpeed);
            } else if (keysPressed.current['ArrowLeft']) {
                playerVelocity.current.x = Math.max(playerVelocity.current.x - acceleration, -maxSpeed);
            } else {
                playerVelocity.current.x *= friction;
                if (Math.abs(playerVelocity.current.x) < 0.01) playerVelocity.current.x = 0;
            }

            let newPos = {
                x: playerPosition.current.x + playerVelocity.current.x,
                y: playerPosition.current.y + playerVelocity.current.y
            };

            // --- Collision Detection & Resolution ---
            let onGround = false;

            if (gameMode === 'normal') {
                platforms.forEach(platform => {
                    const platformLeft = platform.position;
                    const platformRight = platform.position + PLATFORM_WIDTH;
                    const platformBottom = PLATFORM_Y;
                    const platformTop = platformBottom + PLATFORM_HEIGHT;
                    const playerLeft = newPos.x;
                    const playerRight = newPos.x + PLAYER_WIDTH;

                    if (playerRight > platformLeft && playerLeft < platformRight) {
                        if (playerPosition.current.y >= platformTop && newPos.y < platformTop && playerVelocity.current.y < 0) {
                            newPos.y = platformTop;
                            playerVelocity.current.y = 0;
                            onGround = true;
                        } else if (newPos.y < platformTop && newPos.y + PLAYER_HEIGHT > platformBottom) {
                            if (playerVelocity.current.x > 0 && playerRight > platformLeft && playerPosition.current.x + PLAYER_WIDTH <= platformLeft) {
                               newPos.x = platformLeft - PLAYER_WIDTH;
                               playerVelocity.current.x = 0;
                            } else if (playerVelocity.current.x < 0 && playerLeft < platformRight && playerPosition.current.x >= platformRight) {
                               newPos.x = platformRight;
                               playerVelocity.current.x = 0;
                            }
                        }
                    }
                });

                questionBlocks.forEach(block => {
                    const blockLeft = block.position.x;
                    const blockRight = block.position.x + QUESTION_BLOCK_WIDTH; 
                    const blockBottom = block.position.y;
                    const blockTop = blockBottom + QUESTION_BLOCK_HEIGHT;
                    const playerLeft = newPos.x;
                    const playerRight = newPos.x + PLAYER_WIDTH;
                    const playerBottom = newPos.y;
                    const playerTop = newPos.y + PLAYER_HEIGHT;
                    
                    if (playerRight > blockLeft && playerLeft < blockRight) {
                        if (playerTop > blockBottom && playerPosition.current.y + PLAYER_HEIGHT <= blockBottom && playerVelocity.current.y > 0 && !block.cleared) {
                            playerVelocity.current.y = 0;
                            newPos.y = blockBottom - PLAYER_HEIGHT;
                            if (!showQuestion && !isLoadingQuestion) {
                                playSound('hitBlock');
                                fetchQuestion(block.id);
                            }
                        } else if (playerBottom < blockTop && playerPosition.current.y >= blockTop && playerVelocity.current.y < 0) {
                            newPos.y = blockTop;
                            playerVelocity.current.y = 0;
                            onGround = true;
                        } else if (playerBottom < blockTop && playerTop > blockBottom) {
                             if (playerVelocity.current.x > 0 && playerRight > blockLeft && playerPosition.current.x + PLAYER_WIDTH <= blockLeft) {
                               newPos.x = blockLeft - PLAYER_WIDTH;
                               playerVelocity.current.x = 0;
                            } else if (playerVelocity.current.x < 0 && playerLeft < blockRight && playerPosition.current.x >= blockRight) { // platformRight was a bug here
                               newPos.x = blockRight;
                               playerVelocity.current.x = 0;
                            }
                        }
                    }
                });
            } else if (gameMode === 'bonus') {
                rockPlatforms.forEach(platform => {
                    const platformLeft = platform.position.x;
                    const platformRight = platform.position.x + ROCK_PLATFORM_WIDTH;
                    const platformBottom = platform.position.y;
                    const platformTop = platformBottom + ROCK_PLATFORM_HEIGHT;
                    const playerLeft = newPos.x;
                    const playerRight = newPos.x + PLAYER_WIDTH;
                    const playerBottom = newPos.y;
                    const playerTop = newPos.y + PLAYER_HEIGHT;

                    if (playerRight > platformLeft && playerLeft < platformRight) {
                         if (playerPosition.current.y >= platformTop && playerBottom < platformTop && playerVelocity.current.y < 0) {
                            newPos.y = platformTop;
                            playerVelocity.current.y = 0;
                            onGround = true;
                        } else if (playerTop > platformBottom && playerPosition.current.y + PLAYER_HEIGHT <= platformBottom && playerVelocity.current.y > 0) {
                            playerVelocity.current.y = 0;
                            newPos.y = platformBottom - PLAYER_HEIGHT;
                        // FIX: Changed blockTop to platformTop for correct collision detection logic with rock platforms.
                        } else if (playerBottom < platformTop && playerTop > platformBottom) {
                            if (playerVelocity.current.x > 0 && playerRight > platformLeft && playerPosition.current.x + PLAYER_WIDTH <= platformLeft) {
                               newPos.x = platformLeft - PLAYER_WIDTH;
                               playerVelocity.current.x = 0;
                            } else if (playerVelocity.current.x < 0 && playerLeft < platformRight && playerPosition.current.x >= platformRight) {
                               newPos.x = platformRight;
                               playerVelocity.current.x = 0;
                            }
                        }
                    }
                });
            }

            if (bonusTransitionState === 'holeVisible' && newPos.x > BONUS_HOLE_X && newPos.x < (BONUS_HOLE_X + BONUS_HOLE_WIDTH - PLAYER_WIDTH)) {
                 if (newPos.y < GROUND_Y) {
                    setBonusTransitionState('falling');
                    playSound('bonusStart');
                }
            }


            if (newPos.y < GROUND_Y && bonusTransitionState !== 'falling') {
                newPos.y = GROUND_Y;
                playerVelocity.current.y = 0;
                onGround = true;
            }
            isOnGround.current = onGround;

            let rightBoundary;
            if (gameMode === 'bonus' || bonusTransitionState === 'holeVisible') {
                rightBoundary = 100 - PLAYER_WIDTH;
            } else if (gameMode === 'preCastleRun') {
                rightBoundary = PRE_CASTLE_GOAL;
            } else if (gameMode === 'finalRun') {
                rightBoundary = CASTLE_DOOR_X + PLAYER_WIDTH;
            } else {
                rightBoundary = GOAL_POSITION;
            }

            if (newPos.x >= rightBoundary) {
                newPos.x = rightBoundary;
                playerVelocity.current.x = 0;
            } else if (newPos.x <= 0) {
                newPos.x = 0;
                playerVelocity.current.x = 0;
            }
            playerPosition.current = newPos;

            forceUpdate();
            animationFrameId = requestAnimationFrame(gameLoop);
        };
        animationFrameId = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [stageComplete, questionBlocks, platforms, fetchQuestion, isLoadingQuestion, gameMode, bonusTransitionState, rockPlatforms, handlePlayerHit, isInvincible, isEnteringCastle, score, onGameOver, showQuestion, isHelpVisible]);
    
    useEffect(() => {
        if (gameMode !== 'normal' || stageComplete) return;

        const allQuestionsCleared = questionBlocks.length > 0 && questionBlocks.every(b => b.cleared);
        
        let shouldTriggerBonus = false;
        if (allQuestionsCleared) {
            if (level === GameLevel.ThirdGrade) {
                if (stage === 3 || stage === 5) {
                    shouldTriggerBonus = true;
                }
            } else if (level === GameLevel.FirstGrade || level === GameLevel.SecondGrade) {
                if (stage === 3) {
                    shouldTriggerBonus = true;
                } else if (stage === 6 && lives === livesAtStageStart) { // Perfect score bonus
                    shouldTriggerBonus = true;
                    displayMessage("¡Puntuación Perfecta!", 2000);
                }
            }
        }

        if (shouldTriggerBonus) {
            const isPerfectBonus = stage === 6 && (level === GameLevel.FirstGrade || level === GameLevel.SecondGrade);
            setTimeout(() => startBonusTransition(), isPerfectBonus ? 1000 : 0);
            return;
        }

        if (playerPosition.current.x >= GOAL_POSITION) {
             setStageComplete(true);
             playSound('victory');
             
             const isFinalStageOfGame = level === GameLevel.ThirdGrade && stage === STAGES_PER_LEVEL;

             if (isFinalStageOfGame) {
                displayMessage("¡Último Esfuerzo!", 2000);
                setTimeout(setupPreCastleRun, 2000);
             } else if (stage === STAGES_PER_LEVEL) {
                 displayMessage("¡Nivel Completado!", 3000);
                 setTimeout(() => onRestart(), 3000);
             } else {
                 displayMessage("¡Etapa Superada!", 2000);

                 if (stage === 2 || stage === 4) {
                     setLives(l => l + 1);
                     const messageId = Date.now();
                     setExtraLifeMessage({ id: messageId, x: playerPosition.current.x, y: playerPosition.current.y });
                     setTimeout(() => {
                         setExtraLifeMessage(currentMessage => 
                             currentMessage && currentMessage.id === messageId ? null : currentMessage
                         );
                     }, 2000);
                 }

                 setTimeout(() => {
                     setStage(s => s + 1);
                 }, 2000);
             }
             return;
        }
    }, [playerPosition.current.x, questionBlocks, onGameOver, score, stageComplete, stage, gameMode, startBonusTransition, level, lives, livesAtStageStart, onRestart, setupFinalRun, setupPreCastleRun]);
    
     // Pre-Castle to Final Run transition
    useEffect(() => {
        if (gameMode === 'preCastleRun' && playerPosition.current.x >= PRE_CASTLE_GOAL) {
            displayMessage("¡El Castillo Final!", 2000);
            setTimeout(setupFinalRun, 2000);
        }
    }, [gameMode, setupFinalRun, playerPosition.current.x]);

     // Final Run End Game Check
     useEffect(() => {
        if (gameMode === 'finalRun' && playerPosition.current.x >= CASTLE_DOOR_X && !isEnteringCastle) {
            setIsEnteringCastle(true);
            playerVelocity.current.x = 0;
            keysPressed.current = {}; // Disable controls
            playSound('victory');
            displayMessage("¡Juego Completado!", 3000);
            setTimeout(() => onGameOver(score + 5000), 2000);
        }
    }, [gameMode, isEnteringCastle, onGameOver, score, playerPosition.current.x, playerPosition.current.y]);


    useEffect(() => {
        if (gameMode !== 'bonus' && gameMode !== 'preCastleRun') return;

        const playerLeft = playerPosition.current.x;
        const playerRight = playerPosition.current.x + PLAYER_WIDTH;
        const playerBottom = playerPosition.current.y;
        const playerTop = playerPosition.current.y + PLAYER_HEIGHT;

        gems.forEach(gem => {
            const gemLeft = gem.position.x;
            const gemRight = gem.position.x + GEM_WIDTH;
            const gemBottom = gem.position.y;
            const gemTop = gem.position.y + GEM_HEIGHT;

            if (playerRight > gemLeft && playerLeft < gemRight && playerTop > gemBottom && playerBottom < gemTop) {
                playSound('gem');
                setScore(s => s + GEM_VALUE);
                setGems(g => g.filter(g => g.id !== gem.id));
            }
        });
    }, [playerPosition.current.x, playerPosition.current.y, gameMode, gems]);


    const handleAnswer = (isCorrect: boolean) => {
        if (isHandlingAnswer.current) return;
        isHandlingAnswer.current = true;
    
        if (isCorrect) playSound('correct');
        else playSound('incorrect');

        const answeredBlock = questionBlocks.find(b => b.id === activeQuestionBlock);

        // Timeout to show correct/incorrect color on buttons
        setTimeout(() => {
            setShowQuestion(false);

            if (isCorrect) {
                // Update game state immediately
                setScore(s => s + 100);
                setQuestionBlocks(blocks => 
                    blocks.map(b => 
                        b.id === answeredBlock?.id ? { ...b, cleared: true } : b
                    )
                );
                displayMessage("¡Correcto!", 1500);
                
                // Show points animation after a short delay so the modal is gone
                if (answeredBlock) {
                    setTimeout(() => {
                        const pointsId = Date.now();
                        setQuestionPoints({
                            id: pointsId,
                            x: answeredBlock.position.x,
                            y: answeredBlock.position.y,
                            value: 100
                        });
                        setTimeout(() => {
                            setQuestionPoints(current => (current && current.id === pointsId ? null : current));
                        }, 1500);
                    }, 100);
                }
            } else {
                handlePlayerHit();
            }
            
            setCurrentQuestion(null);
            setActiveQuestionBlock(null);
            isPaused.current = false;
        }, 1500);
    };

    const isGameVisible = !isLoadingQuestion && !showQuestion;
    const isPlayerVisible = isGameVisible && bonusTransitionState !== 'falling' && bonusTransitionState !== 'returning';

    const cameraX = (gameMode === 'finalRun' || gameMode === 'preCastleRun') ? Math.max(0, playerPosition.current.x - 40) : 0;

    return (
        <div className="relative w-full h-full bg-vito-blue overflow-hidden">
            <Cloud style={{ top: '10vh', left: '15%' }} animationClass="animate-drift" />
            <Cloud style={{ top: '25vh', left: '80%' }} animationClass="animate-drift-delay" />
            <Cloud style={{ top: '18vh', left: '50%' }} animationClass="animate-drift" />

            <HUD lives={lives} score={score} level={level} stage={stage} bonusTimer={gameMode === 'bonus' ? bonusTimer : undefined} gameMode={gameMode} onRestart={onRestart} onToggleHelp={toggleHelp} />
            
             {gameMessage && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="text-5xl font-press-start text-white text-center" style={{ textShadow: '3px 3px #000' }}>
                        {gameMessage}
                    </div>
                </div>
            )}

            {/* World Container - applies camera scrolling */}
            <div 
                className="absolute inset-0 w-full h-full transition-transform"
                style={{ transform: `translateX(-${cameraX}vw)`, transitionDuration: '150ms', transitionTimingFunction: 'linear' }}
            >
                {/* Overworld Container */}
                <div 
                    className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateY(-${transitionYOffset}vh)` }}
                >
                    <Background playerX={playerPosition.current.x} level={level} />
                    {isGameVisible && (gameMode === 'normal' || gameMode === 'preCastleRun') && (
                    <>
                        {platforms.map(platform => <Platform key={platform.id} position={platform.position} />)}
                        {questionBlocks.map(block => (
                             <div
                                key={block.id}
                                className="absolute w-16 h-16 transition-opacity duration-500 z-20"
                                style={{ left: `${block.position.x}%`, bottom: `${block.position.y}vh`, opacity: block.cleared ? 0.6 : 1 }}
                            >
                                <div className={`w-full h-full bg-yellow-400 border-4 border-yellow-600 rounded-md flex items-center justify-center text-4xl font-bold text-yellow-800 ${block.cleared ? '' : 'animate-coin'}`}>
                                    {block.cleared ? <CheckmarkIcon className="w-10 h-10 text-vito-green drop-shadow-md" /> : '?'}
                                </div>
                            </div>
                        ))}
                        {tortubits.current.map(tortubit => (
                            tortubit.spawned &&
                            <Tortubit 
                               key={tortubit.id}
                               position={tortubit.position}
                               isDefeated={tortubit.isDefeated}
                            />
                        ))}
                        {gems.map(gem => <Gem key={gem.id} position={gem.position} />)}

                        {gameMode === 'normal' && (
                             <div className="absolute text-6xl z-20" style={{left: `${GOAL_POSITION}%`, bottom: `${GROUND_Y}vh`}}>
                                🏰
                            </div>
                        )}
                       
                    </>
                    )}

                    {isGameVisible && gameMode === 'finalRun' && <FinalCastle />}
    
                    <div
                        className="absolute bottom-0 left-0 bg-vito-brown border-t-8 border-green-800 z-10"
                        style={{ height: `${GROUND_BASE_VH}vh`, width: '250%' }}
                    />
                    <div
                        className="absolute left-0 bg-vito-green z-10"
                        style={{ bottom: `${GROUND_BASE_VH}vh`, height: `${GROUND_TOP_VH}vh`, width: '250%' }}
                    />
                    {bonusTransitionState === 'holeVisible' && (
                        <>
                            <div
                                className="absolute z-10"
                                style={{
                                    left: `${BONUS_HOLE_X}%`,
                                    bottom: `0`,
                                    width: `${BONUS_HOLE_WIDTH}%`,
                                    height: `${GROUND_Y}vh`,
                                    background: 'radial-gradient(ellipse at center, #2a1c12 0%, #4a342a 80%)',
                                    boxShadow: 'inset 0px 5px 15px rgba(0,0,0,0.5)',
                                }}
                                aria-label="Hoyo para el nivel de bonus"
                            />
                            <div
                                className="absolute w-16 h-16 animate-arrow-bob z-20"
                                style={{
                                    left: `calc(${BONUS_HOLE_X}% + ${BONUS_HOLE_WIDTH / 2}% - 32px)`, // Center 64px arrow
                                    bottom: `${GROUND_Y + 5}vh`,
                                }}
                            >
                                 <RedArrowIcon />
                            </div>
                        </>
                    )}

                    {isGameVisible && extraLifeMessage && (
                        <div
                            key={extraLifeMessage.id}
                            className="absolute text-2xl font-press-start text-vito-green animate-float-up z-30"
                            style={{
                                left: `${extraLifeMessage.x}%`,
                                bottom: `${extraLifeMessage.y + PLAYER_HEIGHT + 2}vh`,
                                textShadow: '2px 2px #000'
                            }}
                        >
                            VIDA +1
                        </div>
                    )}
                    {isGameVisible && bonusPoints.map(bonus => (
                        <div
                            key={bonus.id}
                            className="absolute text-2xl font-press-start text-vito-yellow animate-float-up z-20"
                            style={{ left: `${bonus.position}%`, bottom: `${GROUND_Y + 10}vh`, textShadow: '2px 2px #000' }}
                        >
                            +{bonus.value}
                        </div>
                    ))}
                    {isGameVisible && questionPoints && (
                        <div
                            key={questionPoints.id}
                            className="absolute text-2xl font-press-start text-vito-yellow animate-float-up z-30"
                            style={{
                                left: `${questionPoints.x}%`,
                                bottom: `${questionPoints.y + QUESTION_BLOCK_HEIGHT}vh`,
                                textShadow: '2px 2px #000'
                            }}
                        >
                            +{questionPoints.value}
                        </div>
                    )}
                    
                    {isPlayerVisible && (gameMode === 'normal' || gameMode === 'finalRun' || gameMode === 'preCastleRun') && <Player position={playerPosition.current} isInvincible={isInvincible} isJumping={!isOnGround.current} isFadingOut={isEnteringCastle} />}
                </div>
    
                {/* Underworld Container */}
                <div
                    className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateY(calc(100vh - ${transitionYOffset}vh))` }}
                >
                     <UndergroundBackground />
                      {isGameVisible && gameMode === 'bonus' && (
                        <>
                            {rockPlatforms.map(platform => <RockPlatform key={platform.id} position={platform.position} />)}
                            {gems.map(gem => <Gem key={gem.id} position={gem.position} />)}
                        </>
                    )}
                     <div
                        className="absolute bottom-0 left-0 w-full bg-[#5a3f31] border-t-8 border-[#4a342a] z-10"
                        style={{ height: `${GROUND_BASE_VH}vh` }}
                    />
                    <div
                        className="absolute left-0 w-full bg-[#785544] z-10"
                        style={{ bottom: `${GROUND_BASE_VH}vh`, height: `${GROUND_TOP_VH}vh` }}
                    />
                    {isPlayerVisible && gameMode === 'bonus' && <Player position={playerPosition.current} isInvincible={isInvincible} isJumping={!isOnGround.current} />}
                </div>
            </div>
            
            <OnScreenControls keysPressed={keysPressed} onJump={handleJump} />

            {/* Modals are outside the scrolling world container */}
            {showBonusInstructions && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 font-fredoka">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center border-8 border-vito-yellow w-full max-w-lg">
                        <h2 className="text-4xl font-press-start text-vito-blue mb-4" style={{ textShadow: '2px 2px #000' }}>¡Cueva de Gemas!</h2>
                        <p className="text-xl text-gray-700 mb-6">¡Atrapa todas las gemas que puedas en <strong>{BONUS_TIME_LIMIT} segundos</strong>!</p>
                        <button
                            onClick={handleStartBonus}
                            className="bg-vito-green text-white font-bold py-3 px-8 rounded-full hover:bg-vito-yellow hover:text-black transition-transform transform hover:scale-110 text-2xl"
                        >
                            ¡OK!
                        </button>
                    </div>
                </div>
            )}
            {isHelpVisible && <HelpModal onClose={toggleHelp} />}
            {showQuestion && currentQuestion && (
                <QuestionModal question={currentQuestion} onAnswer={handleAnswer} />
            )}
             {isLoadingQuestion && (
                 <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40">
                    <p className="text-white text-3xl font-press-start">Cargando Pregunta...</p>
                </div>
            )}
        </div>
    );
};

export default Game;