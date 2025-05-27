// Audio file URLs
const sounds = {
  'keypress': '/audio/keypress.wav',
  'access-granted': '/audio/accesG.mp3',
  'access-denied': '/audio/accesD.mp3',
  'discovery': '/audio/discover.mp3',
  'level-complete': '/audio/LvlC.mp3',
  'mission-complete': 'https://assets.mixkit.co/active_storage/sfx/1339/1339-preview.mp3',
  'switch': '/audio/switch.mp3',
  'signal-found': 'https://assets.mixkit.co/active_storage/sfx/2308/2308-preview.mp3',
  'ambient': '/audio/ambientGOAT.mp3',
  'boot': '/audio/boot.mp3',
  // Sequence note sounds
  'sequence/OOT_Notes_Flute_D_long': '/audio/sequence/OOT_Notes_Flute_D_long.wav',
  'sequence/OOT_Notes_Flute_D_short': '/audio/sequence/OOT_Notes_Flute_D_short.wav',
  'sequence/OOT_Notes_Flute_D2_long': '/audio/sequence/OOT_Notes_Flute_D2_long.wav',
  'sequence/OOT_Notes_Flute_D2_short': '/audio/sequence/OOT_Notes_Flute_D2_short.wav',
  'sequence/OOT_Notes_Flute_F_long': '/audio/sequence/OOT_Notes_Flute_F_long.wav',
  'sequence/OOT_Notes_Flute_F_short': '/audio/sequence/OOT_Notes_Flute_F_short.wav',
  'sequence/OOT_Notes_Flute_A_long': '/audio/sequence/OOT_Notes_Flute_A_long.wav',
  'sequence/OOT_Notes_Flute_A_short': '/audio/sequence/OOT_Notes_Flute_A_short.wav',
  'sequence/OOT_Notes_Flute_B_long': '/audio/sequence/OOT_Notes_Flute_B_long.wav',
  'sequence/OOT_Notes_Flute_B_short': '/audio/sequence/OOT_Notes_Flute_B_short.wav'
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