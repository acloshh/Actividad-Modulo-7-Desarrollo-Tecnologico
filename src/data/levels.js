/**
 * Niveles declarativos. LevelManager los interpreta y construye la escena.
 * Coordenadas en píxeles del mundo. `y` de una plataforma es su borde superior.
 */
export const LEVELS = [
  {
    id: 'bosque',
    name: 'El Bosque Húmedo',
    subtitle: 'Todo empezó con una chispa.',
    width: 3200,
    tint: 0x0c1a22,
    spawn: { x: 140, y: 590 },
    platforms: [
      { x: 0, y: 660, w: 900, h: 60 },
      { x: 980, y: 660, w: 700, h: 60 },
      { x: 1760, y: 660, w: 600, h: 60 },
      { x: 2460, y: 660, w: 740, h: 60 },
      { x: 460, y: 550, w: 200, h: 24 },
      { x: 1180, y: 545, w: 220, h: 24 },
      { x: 1500, y: 470, w: 160, h: 24 },
      { x: 1980, y: 550, w: 220, h: 24 },
      { x: 2280, y: 480, w: 160, h: 24 },
      { x: 2700, y: 550, w: 200, h: 24 }
    ],
    fuels: [
      { x: 300, y: 632 },
      { x: 720, y: 632 },
      { x: 1030, y: 632 },
      { x: 1350, y: 632 },
      { x: 1650, y: 632 },
      { x: 1900, y: 632 },
      { x: 2100, y: 632 },
      { x: 2500, y: 632 },
      { x: 2900, y: 632 },
      { x: 540, y: 522 },
      { x: 1250, y: 517 },
      { x: 2050, y: 522 },
      { x: 2320, y: 452 },
      { x: 2780, y: 522 }
    ],
    memories: [
      { x: 560, y: 510, id: 'm1', title: 'La casa' },
      { x: 1580, y: 430, id: 'm2', title: 'El faro' },
      { x: 2800, y: 510, id: 'm3', title: 'La tormenta' }
    ],
    torches: [
      { x: 820, y: 660 },
      { x: 1440, y: 660 },
      { x: 2160, y: 660 },
      { x: 2620, y: 660 }
    ],
    enemies: [
      { x: 1300, y: 610, minX: 1120, maxX: 1620 },
      { x: 2000, y: 610, minX: 1820, maxX: 2300 }
    ],
    winds: [
      { x: 1000, y: 280, w: 260, h: 380, dir: 1 },
      { x: 2300, y: 300, w: 220, h: 360, dir: -1 }
    ],
    hazards: [],
    gate: { x: 3090, y: 660 },
    hint: 'A / D para moverte · ESPACIO para saltar · J para lanzar una chispa'
  },
  {
    id: 'ciudad',
    name: 'La Ciudad Sumergida',
    subtitle: 'El agua recuerda lo que el fuego olvidó.',
    width: 3400,
    tint: 0x081820,
    spawn: { x: 120, y: 590 },
    platforms: [
      { x: 0, y: 660, w: 820, h: 60 },
      { x: 920, y: 660, w: 630, h: 60 },
      { x: 1650, y: 660, w: 650, h: 60 },
      { x: 2400, y: 660, w: 600, h: 60 },
      { x: 3100, y: 660, w: 300, h: 60 },
      { x: 380, y: 550, w: 200, h: 24 },
      { x: 700, y: 480, w: 160, h: 24 },
      { x: 1080, y: 545, w: 200, h: 24 },
      { x: 1350, y: 460, w: 180, h: 24 },
      { x: 1720, y: 540, w: 220, h: 24 },
      { x: 2040, y: 470, w: 180, h: 24 },
      { x: 2450, y: 550, w: 200, h: 24 },
      { x: 2760, y: 480, w: 160, h: 24 }
    ],
    fuels: [
      { x: 260, y: 632 },
      { x: 620, y: 632 },
      { x: 980, y: 632 },
      { x: 1200, y: 632 },
      { x: 1480, y: 632 },
      { x: 1720, y: 632 },
      { x: 1950, y: 632 },
      { x: 2150, y: 632 },
      { x: 2500, y: 632 },
      { x: 2860, y: 632 },
      { x: 3200, y: 632 },
      { x: 440, y: 522 },
      { x: 760, y: 452 },
      { x: 1410, y: 432 },
      { x: 1780, y: 512 },
      { x: 2100, y: 442 },
      { x: 2820, y: 452 }
    ],
    memories: [
      { x: 470, y: 510, id: 'm4', title: 'El nombre' },
      { x: 1440, y: 420, id: 'm5', title: 'La niña' },
      { x: 2130, y: 430, id: 'm6', title: 'La promesa' }
    ],
    torches: [
      { x: 600, y: 660 },
      { x: 1260, y: 660 },
      { x: 1900, y: 660 },
      { x: 2600, y: 660 },
      { x: 3160, y: 660 }
    ],
    enemies: [
      { x: 1150, y: 610, minX: 950, maxX: 1480 },
      { x: 1850, y: 610, minX: 1680, maxX: 2220 },
      { x: 2650, y: 610, minX: 2440, maxX: 2940 }
    ],
    winds: [
      { x: 1500, y: 250, w: 300, h: 410, dir: -1 },
      { x: 2300, y: 250, w: 260, h: 410, dir: 1 }
    ],
    hazards: [
      { x: 820, y: 668, w: 100, h: 52 },
      { x: 1550, y: 668, w: 100, h: 52 },
      { x: 2300, y: 668, w: 100, h: 52 },
      { x: 3000, y: 668, w: 100, h: 52 }
    ],
    gate: { x: 3300, y: 660 },
    hint: 'El agua apaga tu llama. Buscá antorchas y no caigas en los huecos.'
  },
  {
    id: 'primerfuego',
    name: 'El Primer Fuego',
    subtitle: 'Todo lo que queda es una brasa.',
    width: 3800,
    tint: 0x140d0a,
    spawn: { x: 100, y: 590 },
    platforms: [
      { x: 0, y: 660, w: 700, h: 60 },
      { x: 800, y: 660, w: 650, h: 60 },
      { x: 1550, y: 660, w: 650, h: 60 },
      { x: 2300, y: 660, w: 700, h: 60 },
      { x: 3100, y: 660, w: 700, h: 60 },
      { x: 350, y: 550, w: 180, h: 24 },
      { x: 620, y: 470, w: 150, h: 24 },
      { x: 950, y: 540, w: 200, h: 24 },
      { x: 1250, y: 455, w: 170, h: 24 },
      { x: 1600, y: 530, w: 200, h: 24 },
      { x: 1900, y: 450, w: 170, h: 24 },
      { x: 2250, y: 540, w: 200, h: 24 },
      { x: 2550, y: 465, w: 170, h: 24 },
      { x: 2900, y: 535, w: 200, h: 24 },
      { x: 3200, y: 455, w: 170, h: 24 },
      { x: 3450, y: 560, w: 170, h: 24 }
    ],
    fuels: [
      { x: 240, y: 632 },
      { x: 500, y: 632 },
      { x: 850, y: 632 },
      { x: 1100, y: 632 },
      { x: 1400, y: 632 },
      { x: 1650, y: 632 },
      { x: 2000, y: 632 },
      { x: 2200, y: 632 },
      { x: 2450, y: 632 },
      { x: 2750, y: 632 },
      { x: 3000, y: 632 },
      { x: 3300, y: 632 },
      { x: 3600, y: 632 },
      { x: 420, y: 522 },
      { x: 680, y: 442 },
      { x: 1010, y: 512 },
      { x: 1310, y: 427 },
      { x: 1660, y: 502 },
      { x: 1960, y: 422 },
      { x: 2610, y: 437 },
      { x: 3260, y: 427 },
      { x: 3510, y: 532 }
    ],
    memories: [
      { x: 1330, y: 415, id: 'm7', title: 'El primer nombre' },
      { x: 2630, y: 425, id: 'm8', title: 'La última brasa' }
    ],
    torches: [
      { x: 500, y: 660 },
      { x: 1100, y: 660 },
      { x: 1800, y: 660 },
      { x: 2500, y: 660 },
      { x: 3300, y: 660 }
    ],
    enemies: [
      { x: 1000, y: 610, minX: 820, maxX: 1400 },
      { x: 2000, y: 610, minX: 1570, maxX: 2180 },
      { x: 2700, y: 610, minX: 2320, maxX: 2980 }
    ],
    winds: [
      { x: 1400, y: 220, w: 300, h: 440, dir: 1 },
      { x: 2400, y: 220, w: 320, h: 440, dir: -1 },
      { x: 3350, y: 220, w: 300, h: 440, dir: 1 }
    ],
    hazards: [],
    beacon: { x: 3700, y: 660 },
    hint: 'Llegá al Primer Fuego. Cada recuerdo que conserves cambiará el final.'
  }
];

export const TOTAL_MEMORIES = LEVELS.reduce((total, level) => total + level.memories.length, 0);
