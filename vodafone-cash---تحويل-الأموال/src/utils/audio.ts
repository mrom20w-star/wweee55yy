/**
 * High-fidelity Web Audio & Audio Element synthesizer for the exact "CHICHING" cash register sound
 * and mobile tactile effects.
 */

let globalAudioCtx: AudioContext | null = null;

export function unlockAudio() {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!globalAudioCtx && AudioContextClass) {
      globalAudioCtx = new AudioContextClass();
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume();
    }
  } catch {
    // Ignore error
  }
}

// Generate an authentic Cash Register "CHICHING" sound buffer
function createCashRegisterBuffer(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const duration = 1.3;
  const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // 1. Mechanical clack / latch release (0.0s - 0.08s)
  for (let i = 0; i < sampleRate * 0.08; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 50);
    const noise = (Math.random() * 2 - 1) * 0.4;
    const thud = Math.sin(2 * Math.PI * (160 - t * 800) * t) * 0.6;
    data[i] += (thud + noise) * env * 0.7;
  }

  // 2. Bell 1 (Bright brass bell chime at 2093 Hz - C7)
  const bellStart = 0.04;
  for (let i = Math.floor(sampleRate * bellStart); i < sampleRate * 0.9; i++) {
    const t = (i - sampleRate * bellStart) / sampleRate;
    const env = Math.exp(-t * 4.5);
    const f1 = 2093.0;
    const f2 = 4186.0;
    const f3 = 6279.0;
    const tone =
      Math.sin(2 * Math.PI * f1 * t) * 0.5 +
      Math.sin(2 * Math.PI * f2 * t) * 0.25 +
      Math.sin(2 * Math.PI * f3 * t) * 0.12;
    data[i] += tone * env * 0.65;
  }

  // 3. Bell 2 (High overtone bell chime at 2637 Hz - E7)
  const bell2Start = 0.09;
  for (let i = Math.floor(sampleRate * bell2Start); i < sampleRate * 1.1; i++) {
    const t = (i - sampleRate * bell2Start) / sampleRate;
    const env = Math.exp(-t * 3.8);
    const f1 = 2637.0;
    const f2 = 5274.0;
    const tone = Math.sin(2 * Math.PI * f1 * t) * 0.45 + Math.sin(2 * Math.PI * f2 * t) * 0.2;
    data[i] += tone * env * 0.6;
  }

  // 4. Coins rattle & slide (cascading coin pings)
  const coinEvents = [
    { time: 0.07, freq: 3800, gain: 0.35, decay: 22 },
    { time: 0.12, freq: 4400, gain: 0.4, decay: 20 },
    { time: 0.18, freq: 3500, gain: 0.38, decay: 18 },
    { time: 0.23, freq: 4900, gain: 0.35, decay: 19 },
    { time: 0.29, freq: 4200, gain: 0.3, decay: 16 },
    { time: 0.36, freq: 5200, gain: 0.25, decay: 15 },
  ];

  coinEvents.forEach((coin) => {
    const startIdx = Math.floor(sampleRate * coin.time);
    const endIdx = Math.min(sampleRate * duration, startIdx + Math.floor(sampleRate * 0.2));
    for (let i = startIdx; i < endIdx; i++) {
      const t = (i - startIdx) / sampleRate;
      const env = Math.exp(-t * coin.decay);
      const tone =
        Math.sin(2 * Math.PI * coin.freq * t) * 0.7 +
        (Math.random() * 2 - 1) * 0.15;
      data[i] += tone * env * coin.gain;
    }
  });

  // Normalize data so it's punchy and crisp without clipping
  let max = 0;
  for (let i = 0; i < data.length; i++) {
    const abs = Math.abs(data[i]);
    if (abs > max) max = abs;
  }
  if (max > 0) {
    const scale = 0.9 / max;
    for (let i = 0; i < data.length; i++) {
      data[i] *= scale;
    }
  }

  return buffer;
}

// Convert AudioBuffer to Base64 WAV data URI for fallback HTML5 Audio
function bufferToWavUrl(buffer: AudioBuffer): string {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new ArrayBuffer(length);
  const view = new DataView(out);
  const channels: Float32Array[] = [];
  let sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF chunk descriptor
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  // FMT sub-chunk
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // 16 for PCM
  setUint16(1); // 1 = PCM
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16); // bits per sample

  // data sub-chunk
  setUint32(0x61746164); // "data" chunk
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  const blob = new Blob([out], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

let cachedWavUrl: string | null = null;

export function playKeypadTick() {
  try {
    unlockAudio();
    if (!globalAudioCtx) return;

    const osc = globalAudioCtx.createOscillator();
    const gain = globalAudioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, globalAudioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, globalAudioCtx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.1, globalAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(globalAudioCtx.destination);

    osc.start();
    osc.stop(globalAudioCtx.currentTime + 0.035);
  } catch {
    // Ignore error
  }
}

export function playCashRegisterSound() {
  try {
    unlockAudio();

    // Primary playback via Web Audio API BufferSource
    if (globalAudioCtx) {
      if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
      }
      const buffer = createCashRegisterBuffer(globalAudioCtx);
      const source = globalAudioCtx.createBufferSource();
      const gainNode = globalAudioCtx.createGain();

      gainNode.gain.setValueAtTime(1.0, globalAudioCtx.currentTime);
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(globalAudioCtx.destination);

      source.start(0);

      // Also prepare fallback URL if not prepared
      if (!cachedWavUrl) {
        cachedWavUrl = bufferToWavUrl(buffer);
      }
    }

    // Secondary fallback: play via HTMLAudioElement for guaranteed user audible output
    if (cachedWavUrl) {
      const audio = new Audio(cachedWavUrl);
      audio.volume = 0.95;
      audio.play().catch(() => {});
    }
  } catch {
    // Ignore audio error gracefully
  }
}
