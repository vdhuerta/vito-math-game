let audioContext: AudioContext | null = null;
const soundBuffers: { [key: string]: AudioBuffer } = {};

export const soundSources = {
    jump: 'https://storage.googleapis.com/hume-rick-assets/mario-jump-sound.mp3',
    correct: 'https://storage.googleapis.com/hume-rick-assets/mario-coin-sound.mp3',
    incorrect: 'https://storage.googleapis.com/hume-rick-assets/mario-pipe-sound.mp3',
    victory: 'https://storage.googleapis.com/hume-rick-assets/level-clear-sound.mp3',
    bonusStart: 'https://storage.googleapis.com/hume-rick-assets/power-up-appears-sound.mp3',
    gem: 'https://storage.googleapis.com/hume-rick-assets/mario-coin-sound.mp3',
    stomp: 'https://storage.googleapis.com/hume-rick-assets/stomp-sound.mp3',
    hitBlock: 'https://storage.googleapis.com/hume-rick-assets/block-hit-sound.mp3',
    gameOver: 'https://storage.googleapis.com/hume-rick-assets/game-over-sound.mp3',
};

const soundVolumes: { [key: string]: number } = {
    jump: 0.5, correct: 0.5, incorrect: 0.5,
    victory: 0.6, bonusStart: 0.5, gem: 0.7, stomp: 0.6,
    hitBlock: 0.5, gameOver: 0.7
};

export const initAudio = async () => {
    if (audioContext && audioContext.state !== 'closed') {
        if (audioContext.state === 'suspended') {
            try {
                await audioContext.resume();
            } catch (e) {
                console.error("Audio context resume failed.", e);
            }
        }
        return;
    }
    try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const soundPromises = Object.entries(soundSources).map(async ([name, url]) => {
            if (soundBuffers[name]) return;
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                if (audioContext) {
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                    soundBuffers[name] = audioBuffer;
                }
            } catch (loadError) {
                console.error(`Failed to load sound: ${name}`, loadError);
            }
        });
        
        await Promise.all(soundPromises);

    } catch (e) {
        console.error("Failed to initialize Web Audio API", e);
        audioContext = null;
    }
};

export const playSound = (name: keyof typeof soundSources) => {
    if (!audioContext || !soundBuffers[name]) {
        console.warn(`Sound not ready or not found: ${name}`);
        return;
    }
    
    if (audioContext.state === 'suspended') {
        audioContext.resume().catch(e => console.error("Audio resume failed on play", e));
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = soundBuffers[name];
    
    const gainNode = audioContext.createGain();
    gainNode.gain.value = soundVolumes[name] || 0.5;
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
};