import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { audio } from '../systems/AudioSystem.js';
import { getBestScore, saveBestScore } from '../systems/Storage.js';
import { createButton } from '../ui/Button.js';

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.stats = data;
  }

  create() {
    const isRecord = saveBestScore(this.stats.score ?? 0);
    const best = getBestScore();

    this.add.image(0, 0, 'bg').setOrigin(0);
    this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x02040a, 0.72)
      .setOrigin(0);

    this.add.particles(0, 0, 'spark', {
      x: { min: 0, max: GAME_WIDTH },
      y: GAME_HEIGHT + 10,
      speedX: { min: -12, max: 12 },
      speedY: { min: -40, max: -12 },
      scale: { start: 0.22, end: 0 },
      alpha: { start: 0.35, end: 0 },
      lifespan: { min: 3000, max: 6000 },
      frequency: 240,
      blendMode: 'ADD',
      tint: [0xff7b2e, 0x8d99a6]
    });

    this.add
      .text(GAME_WIDTH / 2, 150, 'TE APAGASTE', {
        fontFamily: 'Georgia, serif',
        fontSize: '84px',
        color: '#e8eef4',
        shadow: { offsetX: 0, offsetY: 0, color: '#ff5c5c', blur: 24, fill: true }
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 222, 'La oscuridad te alcanzó. La brasa todavía puede volver a encenderse.', {
        fontFamily: 'Georgia, serif',
        fontSize: '21px',
        color: '#9fb0bd',
        fontStyle: 'italic'
      })
      .setOrigin(0.5);

    this.add
      .rectangle(GAME_WIDTH / 2, 370, 560, 200, 0x081018, 0.82)
      .setStrokeStyle(1, 0x33465a, 0.9);

    const rows = [
      ['PUNTAJE', String(this.stats.score ?? 0).padStart(6, '0')],
      ['NIVEL ALCANZADO', `${this.stats.level ?? 1} / 3`],
      ['RECUERDOS CONSERVADOS', String(this.stats.memoriesKept ?? 0)],
      ['RECUERDOS QUEMADOS', String(this.stats.burned ?? 0)],
      ['TIEMPO', formatTime(this.stats.elapsed ?? 0)]
    ];

    rows.forEach(([label, value], index) => {
      const y = 306 + index * 34;
      this.add
        .text(GAME_WIDTH / 2 - 230, y, label, {
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          fontSize: '14px',
          color: '#7d8d99',
          letterSpacing: 2
        })
        .setOrigin(0, 0.5);

      this.add
        .text(GAME_WIDTH / 2 + 230, y, value, {
          fontFamily: 'Georgia, serif',
          fontSize: '22px',
          color: '#f4e6cf'
        })
        .setOrigin(1, 0.5);
    });

    const bestText = isRecord
      ? 'NUEVO RÉCORD PERSONAL'
      : `MEJOR PUNTAJE  ·  ${String(best).padStart(6, '0')}`;

    this.add
      .text(GAME_WIDTH / 2, 492, bestText, {
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        fontSize: '17px',
        color: isRecord ? '#ffd27a' : '#7d8d99',
        letterSpacing: 2
      })
      .setOrigin(0.5);

    createButton(this, GAME_WIDTH / 2 - 150, 570, 'REINTENTAR', () => this.restart(), { width: 260 });
    createButton(this, GAME_WIDTH / 2 + 150, 570, 'MENÚ', () => this.goToMenu(), { width: 220 });

    this.add
      .text(GAME_WIDTH / 2, 650, 'R o ENTER para reintentar · ESC para volver al menú', {
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        fontSize: '15px',
        color: '#5f6f7c'
      })
      .setOrigin(0.5);

    this.input.keyboard.on('keydown-R', () => this.restart());
    this.input.keyboard.on('keydown-ENTER', () => this.restart());
    this.input.keyboard.on('keydown-ESC', () => this.goToMenu());

    audio.play('lose');
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  restart() {
    audio.unlock();
    audio.play('click');
    this.scene.start('GameScene', {
      levelIndex: 0,
      score: 0,
      memoriesKept: 0,
      burned: 0,
      elapsed: 0
    });
  }

  goToMenu() {
    audio.play('click');
    this.scene.start('MenuScene');
  }
}
