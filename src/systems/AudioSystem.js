/**
 * Sintetizador mínimo basado en Web Audio API.
 * Evita depender de archivos de audio externos.
 */
class AudioSystem {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('brasa:muted') === '1';
    this.noiseBuffer = null;
  }

  unlock() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      this.noiseBuffer = this._createNoiseBuffer();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('brasa:muted', this.muted ? '1' : '0');
    return this.muted;
  }

  _createNoiseBuffer() {
    const length = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  tone(freq, endFreq, duration, type = 'sine', volume = 0.08, delay = 0) {
    if (!this.ctx || this.muted) return;
    const start = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq && endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), start + duration);
    }

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain).connect(this.ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  }

  noise(duration, volume = 0.08, filterFreq = 1200, delay = 0) {
    if (!this.ctx || this.muted || !this.noiseBuffer) return;
    const start = this.ctx.currentTime + delay;
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    source.buffer = this.noiseBuffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, start);

    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    source.connect(filter).connect(gain).connect(this.ctx.destination);
    source.start(start);
    source.stop(start + duration);
  }

  play(name) {
    if (!this.ctx || this.muted) return;

    switch (name) {
      case 'click':
        this.tone(520, 760, 0.07, 'square', 0.04);
        break;
      case 'jump':
        this.tone(240, 520, 0.16, 'triangle', 0.07);
        break;
      case 'land':
        this.noise(0.08, 0.05, 700);
        break;
      case 'collect':
        this.tone(660, 660, 0.09, 'sine', 0.07);
        this.tone(990, 990, 0.12, 'sine', 0.05, 0.06);
        break;
      case 'memory':
        this.tone(440, 440, 0.4, 'sine', 0.05);
        this.tone(554, 554, 0.4, 'sine', 0.045, 0.04);
        this.tone(659, 659, 0.45, 'sine', 0.045, 0.08);
        break;
      case 'burn':
        this.noise(0.45, 0.12, 1800);
        this.tone(180, 70, 0.4, 'sawtooth', 0.05);
        break;
      case 'spark':
        this.noise(0.13, 0.07, 2600);
        this.tone(1200, 320, 0.14, 'square', 0.04);
        break;
      case 'dash':
        this.noise(0.16, 0.07, 1400);
        this.tone(320, 160, 0.14, 'triangle', 0.05);
        break;
      case 'hurt':
        this.tone(190, 55, 0.32, 'sawtooth', 0.11);
        this.noise(0.18, 0.07, 600);
        break;
      case 'torch':
        this.noise(0.25, 0.08, 900);
        this.tone(320, 440, 0.2, 'sine', 0.05);
        break;
      case 'gate':
        this.tone(330, 330, 0.5, 'sine', 0.05);
        this.tone(440, 440, 0.6, 'sine', 0.05, 0.08);
        this.tone(660, 660, 0.7, 'sine', 0.05, 0.16);
        break;
      case 'level':
        [523, 659, 784, 1046].forEach((note, index) => {
          this.tone(note, note, 0.26, 'triangle', 0.06, index * 0.12);
        });
        break;
      case 'win':
        [392, 523, 659, 784, 1046].forEach((note, index) => {
          this.tone(note, note, 0.9, 'sine', 0.055, index * 0.16);
        });
        break;
      case 'lose':
        [330, 262, 196, 131].forEach((note, index) => {
          this.tone(note, note * 0.99, 0.42, 'triangle', 0.07, index * 0.2);
        });
        break;
      default:
        break;
    }
  }
}

export const audio = new AudioSystem();
