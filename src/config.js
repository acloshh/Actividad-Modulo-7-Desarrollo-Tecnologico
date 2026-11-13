export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const TUNING = {
  heatMax: 100,
  heatStart: 100,
  heatDrain: 1.2,
  runDrain: 3,
  windDrain: 6,
  torchRegen: 3,
  sparkCost: 10,
  dashCost: 8,
  enemyDamage: 20,
  hazardDamage: 20,
  fallDamage: 15,
  fuelHeat: 15,
  memoryHeat: 100,
  gateMemories: 1,
  invulnerabilityMs: 1000
};

export const HEAT_STATES = {
  ember: { min: 0, max: 25, detect: 90, light: 160, label: 'Brasa' },
  flame: { min: 26, max: 65, detect: 160, light: 240, label: 'Llama' },
  blaze: { min: 66, max: 100, detect: 240, light: 320, label: 'Fogata' }
};

export const COLORS = {
  background: 0x04070d,
  amber: 0xf2a93b,
  amberLight: 0xffd27a,
  ember: 0xff7b2e,
  ash: 0x8d99a6,
  text: 0xe8eef4,
  danger: 0xff5c5c,
  water: 0x2a6f7a,
  stone: 0x25313d,
  stoneTop: 0x3c4d5c
};

export const FONT = {
  ui: '"Segoe UI", system-ui, -apple-system, sans-serif',
  title: 'Georgia, "Times New Roman", serif'
};

export const LEVEL_NAMES = ['El Bosque Húmedo', 'La Ciudad Sumergida', 'El Primer Fuego'];
