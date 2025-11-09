export enum GameLevel {
    FirstGrade = 1,
    SecondGrade = 2,
    ThirdGrade = 3,
}

export interface Question {
    question: string;
    options: number[];
    answer: number;
}

export interface QuestionBlockState {
    id: number;
    position: { x: number; y: number };
    cleared: boolean;
}

export interface PlatformState {
    id: number;
    position: number;
}

export interface GemState {
    id: number;
    position: { x: number; y: number };
}

export interface RockPlatformState {
    id: number;
    position: { x: number; y: number };
}

export interface TortubitState {
    id: number;
    position: { x: number };
    isDefeated: boolean;
    defeatTime?: number;
    speed: number;
    spawned: boolean;
}