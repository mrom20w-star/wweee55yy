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

// Generate an authentic Cash Register "CHA-CHING" sound buffer
function createCashRegisterBuffer(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const duration = 1.1;
  const buffer = ctx.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
  const data = buffer.getChannelData(0);

  // 1. "CHA" - Mechanical cash drawer spring pop & metallic latch release (0.0s - 0.09s)
  for (let i = 0; i < Math.floor(sampleRate * 0.09); i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 60);
    // Mechanical click & drawer slide ratchet noise
    const noise = (Math.random() * 2 - 1) * 0.5;
    const thud = Math.sin(2 * Math.PI * (280 - t * 1600) * t) * 0.7;
    const ratchet = Math.sin(2 * Math.PI * 1800 * t) * Math.sin(2 * Math.PI * 120 * t) * 0.4;
    data[i] += (thud + noise + ratchet) * env * 0.85;
  }

  // 2. "CHING!" - Metallic drawer strike and high-frequency coin ring (0.06s - 0.9s)
  const chingStart = 0.065;
  const chingLength = Math.floor(sampleRate * 0.8);
  for (let i = 0; i < chingLength; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 6.5);
    // Sharp resonant metallic coin / register strike frequencies
    const f1 = 2800.0;
    const f2 = 4200.0;
    const f3 = 5600.0;
    const f4 = 7200.0;

    const ring =
      Math.sin(2 * Math.PI * f1 * t) * 0.45 +
      Math.sin(2 * Math.PI * f2 * t) * 0.35 +
      Math.sin(2 * Math.PI * f3 * t) * 0.2 +
      Math.sin(2 * Math.PI * f4 * t) * 0.12;

    const sampleIdx = Math.floor(sampleRate * chingStart) + i;
    if (sampleIdx < data.length) {
      data[sampleIdx] += ring * env * 0.75;
    }
  }

  // 3. Cascading coins rattling in the metal tray
  const coinSparks = [
    { delay: 0.09, freq: 3900, gain: 0.38, decay: 28 },
    { delay: 0.14, freq: 4700, gain: 0.42, decay: 26 },
    { delay: 0.20, freq: 3600, gain: 0.36, decay: 22 },
    { delay: 0.27, freq: 5100, gain: 0.32, decay: 24 },
    { delay: 0.34, freq: 4300, gain: 0.28, decay: 20 },
  ];

  coinSparks.forEach((c) => {
    const start = Math.floor(sampleRate * c.delay);
    const count = Math.min(Math.floor(sampleRate * 0.18), data.length - start);
    for (let i = 0; i < count; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-t * c.decay);
      const tone = Math.sin(2 * Math.PI * c.freq * t) + (Math.random() * 2 - 1) * 0.2;
      data[start + i] += tone * env * c.gain;
    }
  });

  // Normalize data cleanly to 0.92
  let max = 0;
  for (let i = 0; i < data.length; i++) {
    const abs = Math.abs(data[i]);
    if (abs > max) max = abs;
  }
  if (max > 0) {
    const scale = 0.92 / max;
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
