import Phaser from 'phaser';

/**
 * Observer global. Desacopla la lógica del juego de la interfaz:
 * los sistemas publican eventos y el HUD / las escenas se suscriben.
 */
export const EventBus = new Phaser.Events.EventEmitter();

export const EVENTS = {
  heat: 'brasa:heat',
  heatState: 'brasa:heat-state',
  score: 'brasa:score',
  memories: 'brasa:memories',
  level: 'brasa:level',
  toast: 'brasa:toast',
  objective: 'brasa:objective',
  playerHurt: 'brasa:player-hurt',
  memoryBurned: 'brasa:memory-burned',
  levelComplete: 'brasa:level-complete',
  gameOver: 'brasa:game-over',
  victory: 'brasa:victory'
};
