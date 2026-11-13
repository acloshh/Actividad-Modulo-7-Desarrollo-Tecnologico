import Phaser from 'phaser';
import { TUNING, HEAT_STATES } from '../config.js';
import { EventBus, EVENTS } from './EventBus.js';

/**
 * Fuente única de verdad del Calor.
 * Es salud, radio de luz y munición al mismo tiempo.
 */
export default class HeatSystem {
  constructor(scene) {
    this.scene = scene;
    this.max = TUNING.heatMax;
    this.value = TUNING.heatStart;
    this.stateKey = 'blaze';
    this.emitAccumulator = 0;
    this.lastState = null;
    this.emit(true);
  }

  get state() {
    return HEAT_STATES[this.stateKey];
  }

  get detectRadius() {
    return this.state.detect;
  }

  get lightTexture() {
    return {
      ember: 'light-small',
      flame: 'light-medium',
      blaze: 'light-large'
    }[this.stateKey];
  }

  update(delta, { running = false, inWind = false, nearTorch = false } = {}) {
    let rate = TUNING.heatDrain;

    if (nearTorch) {
      rate = -TUNING.torchRegen;
    } else {
      if (running) rate += TUNING.runDrain;
      if (inWind) rate += TUNING.windDrain;
    }

    const previousState = this.stateKey;
    this.value = Phaser.Math.Clamp(this.value - rate * delta, 0, this.max);
    this.updateState();

    if (this.stateKey !== previousState) {
      EventBus.emit(EVENTS.heatState, {
        state: this.stateKey,
        label: this.state.label,
        value: this.value
      });
    }

    this.emitAccumulator += delta;
    if (this.emitAccumulator >= 0.08) {
      this.emit();
      this.emitAccumulator = 0;
    }
  }

  updateState() {
    if (this.value <= HEAT_STATES.ember.max) {
      this.stateKey = 'ember';
    } else if (this.value <= HEAT_STATES.flame.max) {
      this.stateKey = 'flame';
    } else {
      this.stateKey = 'blaze';
    }
  }

  spend(amount) {
    if (this.value <= 0) return false;
    this.value = Phaser.Math.Clamp(this.value - amount, 0, this.max);
    this.updateState();
    this.emit();
    return true;
  }

  add(amount) {
    this.value = Phaser.Math.Clamp(this.value + amount, 0, this.max);
    this.updateState();
    this.emit();
    return this.value;
  }

  emit(force = false) {
    if (!force && this.value === this.lastEmitted) return;
    this.lastEmitted = this.value;
    EventBus.emit(EVENTS.heat, {
      value: this.value,
      max: this.max,
      state: this.stateKey,
      label: this.state.label
    });
  }
}
