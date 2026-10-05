// Web Audio API ambient sound generator
let audioCtx: AudioContext | null = null;
let currentSourceNode: AudioNode | null = null;
let gainNode: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let animationFrameId: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type AmbientSoundType = 'none' | 'rain' | 'library' | 'waves' | 'campfire';

export function playAmbientSound(type: AmbientSoundType, volume = 0.3) {
  stopAmbientSound();
  if (type === 'none') return;

  const ctx = getAudioContext();
  gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.connect(ctx.destination);

  // Generate 5 seconds of stereo noise buffer
  const bufferSize = ctx.sampleRate * 5;
  noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
  const left = noiseBuffer.getChannelData(0);
  const right = noiseBuffer.getChannelData(1);

  if (type === 'rain') {
    // Pinkish noise with random rain peaks
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.08;
      b2 = 0.85 * b2 + white * 0.15;
      const pink = (b0 + b1 + b2) * 0.4;
      left[i] = pink + (Math.random() > 0.998 ? (Math.random() - 0.5) * 0.3 : 0);
      right[i] = pink + (Math.random() > 0.998 ? (Math.random() - 0.5) * 0.3 : 0);
    }
  } else if (type === 'library') {
    // Gentle brown noise (cozy low frequency rumble)
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      left[i] = lastOut * 3.5;
      right[i] = lastOut * 3.5;
    }
  } else if (type === 'campfire') {
    // Brown noise + crackles
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.04 * white) / 1.04;
      const crackle = Math.random() > 0.996 ? (Math.random() * 1.5 - 0.75) : 0;
      left[i] = lastOut * 2.5 + crackle;
      right[i] = lastOut * 2.5 + crackle;
    }
  } else if (type === 'waves') {
    // Waves: noise shaped with a gentle LFO
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      const t = i / ctx.sampleRate;
      const waveEnv = 0.3 + 0.7 * Math.sin((t / 5) * 2 * Math.PI);
      left[i] = white * 0.4 * waveEnv;
      right[i] = white * 0.4 * waveEnv;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;

  // Filter for warmer tone
  const filter = ctx.createBiquadFilter();
  if (type === 'rain') {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
  } else if (type === 'library') {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);
  } else if (type === 'campfire') {
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
  } else if (type === 'waves') {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, ctx.currentTime);
  }

  source.connect(filter);
  filter.connect(gainNode);
  source.start(0);

  currentSourceNode = source;
}

export function setAmbientVolume(vol: number) {
  if (gainNode && audioCtx) {
    gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), audioCtx.currentTime);
  }
}

export function stopAmbientSound() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (currentSourceNode) {
    try {
      (currentSourceNode as AudioBufferSourceNode).stop();
      currentSourceNode.disconnect();
    } catch {}
    currentSourceNode = null;
  }
  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
}
