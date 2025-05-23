// Audio file URLs
const sounds = {
  'keypress': './src/utils/audio/keypress.wav',
  'access-granted': './src/utils/audio/accesG.mp3',
  'access-denied': './src/utils/audio/accesD.mp3',
  'discovery': './src/utils/audio/discover.mp3',
  'level-complete': './src/utils/audio/LvlC.mp3',
  'mission-complete': 'https://assets.mixkit.co/active_storage/sfx/1339/1339-preview.mp3',
  'switch': './src/utils/audio/switch.mp3',
  'signal-found': 'https://assets.mixkit.co/active_storage/sfx/2308/2308-preview.mp3',
  'ambient': './src/utils/audio/ambientGOAT.mp3',
  'boot': './src/utils/audio/boot.mp3',
  // Sequence note sounds
  'sequence/OOT_Notes_Flute_D_long': './src/utils/audio/sequence/OOT_Notes_Flute_D_long.wav',
  'sequence/OOT_Notes_Flute_D_short': './src/utils/audio/sequence/OOT_Notes_Flute_D_short.wav',
  'sequence/OOT_Notes_Flute_D2_long': './src/utils/audio/sequence/OOT_Notes_Flute_D2_long.wav',
  'sequence/OOT_Notes_Flute_D2_short': './src/utils/audio/sequence/OOT_Notes_Flute_D2_short.wav',
  'sequence/OOT_Notes_Flute_F_long': './src/utils/audio/sequence/OOT_Notes_Flute_F_long.wav',
  'sequence/OOT_Notes_Flute_F_short': './src/utils/audio/sequence/OOT_Notes_Flute_F_short.wav',
  'sequence/OOT_Notes_Flute_A_long': './src/utils/audio/sequence/OOT_Notes_Flute_A_long.wav',
  'sequence/OOT_Notes_Flute_A_short': './src/utils/audio/sequence/OOT_Notes_Flute_A_short.wav',
  'sequence/OOT_Notes_Flute_B_long': './src/utils/audio/sequence/OOT_Notes_Flute_B_long.wav',
  'sequence/OOT_Notes_Flute_B_short': './src/utils/audio/sequence/OOT_Notes_Flute_B_short.wav'
};

type SoundName = keyof typeof sounds;

// Audio context for better control
let audioContext: AudioContext | null = null;
const audioElements: Map<SoundName, HTMLAudioElement> = new Map();
let hasUserInteracted = false;
let ambientPlaying = false;

// Initialize audio context
const initAudio = async () => {
  if (!audioContext) {
    audioContext = new AudioContext();
    // Preload all sounds
    Object.entries(sounds).forEach(([name, url]) => {
      const audio = new Audio(url);
      audio.load(); // Preload the audio
      audioElements.set(name as SoundName, audio);
    });
  }

  // Resume audio context if it's suspended
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
};

// Add user interaction listener
document.addEventListener('click', async () => {
  if (!hasUserInteracted) {
    hasUserInteracted = true;
    await initAudio();
  }
}, { once: true });

// Function to play sound effects with volume control
export const playSound = async (name: SoundName, volume = 0.5) => {
  try {
    await initAudio();
    const audio = audioElements.get(name);
    if (audio) {
      audio.volume = volume;
      audio.currentTime = 0; // Reset to start
      await audio.play();
    }
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
};

// Function to play ambient sound with loop
export const playAmbient = async (volume = 0.3) => {
  try {
    if (ambientPlaying) return; // Prevent multiple ambient sounds
    await initAudio();
    const ambient = audioElements.get('ambient');
    if (ambient) {
      ambient.loop = true;
      ambient.volume = volume;
      await ambient.play();
      ambientPlaying = true;
    }
  } catch (error) {
    console.error('Failed to play ambient sound:', error);
  }
};

// Function to stop ambient sound
export const stopAmbient = () => {
  const ambient = audioElements.get('ambient');
  if (ambient) {
    ambient.pause();
    ambient.currentTime = 0;
    ambientPlaying = false;
  }
};