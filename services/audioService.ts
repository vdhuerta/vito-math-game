// services/audioService.ts

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicSource: AudioBufferSourceNode | null = null;
const soundBuffers = new Map<string, AudioBuffer>();

const BASE_URL = 'https://raw.githubusercontent.com/vdhuerta/assets-aplications/main/';

export const soundSources = {
  hitBlock: `${BASE_URL}Activar_Acertijo2.mp3`,
  gameOver: `${BASE_URL}Fin_del_Juego.mp3`,
  bonusLevel: `${BASE_URL}Game_Bonus.mp3`,
  startStage: `${BASE_URL}Iniciar_Etapa.mp3`,
  collectGem: `${BASE_URL}Gemas.mp3`,
  jump: `${BASE_URL}Jump_Vito.mp3`,
  defeatEnemy: `${BASE_URL}Matar_TortuBit.mp3`,
  loseLife: `${BASE_URL}Pierde_Vida2.mp3`,
  correctAnswer: `${BASE_URL}Respuesta_Correcta.mp3`,
  incorrectAnswer: `${BASE_URL}Respuesta_Incorrecta.mp3`,
  music: `${BASE_URL}Vito_Music2.mp3`,
};

type SoundName = keyof typeof soundSources;

const loadSound = async (name: string, url: string) => {
  if (!audioContext) return;
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    soundBuffers.set(name, audioBuffer);
  } catch (error) {
    console.error(`Error al cargar el sonido: ${name}`, error);
  }
};

export const initAudio = async () => {
  if (audioContext) return;
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);

    musicGain = audioContext.createGain();
    musicGain.connect(masterGain);
    musicGain.gain.value = 0.3; // Música al 30% del volumen maestro

    const loadPromises = Object.entries(soundSources).map(([name, url]) => loadSound(name, url));
    await Promise.all(loadPromises);
    console.log("Todos los sonidos han sido cargados.");
  } catch (e) {
    console.error("La Web Audio API no es compatible o el usuario no ha interactuado con la página.", e);
  }
};

export const playSound = (name: SoundName) => {
  if (!audioContext || !masterGain) return;
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  const buffer = soundBuffers.get(name);
  if (buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(masterGain);
    source.start(0);
  }
};

export const playMusic = () => {
  if (!audioContext || !musicGain || musicSource) return;
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  const buffer = soundBuffers.get('music');
  if (buffer) {
    musicSource = audioContext.createBufferSource();
    musicSource.buffer = buffer;
    musicSource.loop = true;
    musicSource.connect(musicGain);
    musicSource.start(0);
  }
};

export const stopMusic = () => {
  if (musicSource) {
    musicSource.stop();
    musicSource.disconnect();
    musicSource = null;
  }
};

export const setVolume = (volume: number) => {
  if (masterGain) {
    masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }
};

export const getVolume = (): number => {
  return masterGain ? masterGain.gain.value : 1;
};
