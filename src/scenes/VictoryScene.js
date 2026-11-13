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

const ENDINGS = [
  {
    min: 5,
    title: 'FINAL DEL FARO',
    subtitle: 'Volviste a encender el mundo.',
    text: 'Conservaste casi todos tus recuerdos. El Primer Fuego se abre como un faro y la costa vuelve a tener luz.\nNo estás solo: tu historia sigue ardiendo en otros.'
  },
  {
    min: 3,
    title: 'FINAL DE LA LÁMPARA',
    subtitle: 'Compartiste lo que quedaba de vos.',
    text: 'Quemaste una parte del pasado para llegar hasta acá. La llama alcanza para iluminar un refugio, no un mundo.\nAlguien más tendrá que continuar el camino.'
  },
  {
    min: 0,
    title: 'FINAL DEL ASCUA',
    subtitle: 'Llegaste, pero ya no recordás por qué.',
    text: 'Quemaste casi todos tus recuerdos para sobrevivir. El Primer Fuego te reconoce, pero no encuentra nada que encender.\nQuedás como una brasa pequeña, testigo de un mundo que ya no sabe su nombre.'
  }
];

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  init(data) {
    this.stats = data;
  }

  create() {
    const isRecord = saveBestScore(this.stats.score ?? 0);
    const best = getBestScore();
    const ending = ENDINGS.find((candidate) => (this.stats.memoriesKept ?? 0) >= candidate.min) ?? ENDINGS[ENDINGS.length - 1];

    this.add.image(0, 0, 'bg').setOrigin(0);
    this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x140d0a, 0.35)
      .setOrigin(0);

    this.add
      .image(GAME_WIDTH / 2, 690, 'glow')
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0xffa53d)
      .setAlpha(0.5)
      .setScale(3.4);

    this.add.particles(0, 0, 'spark', {
      x: { min: GAME_WIDTH / 2 - 120, max: GAME_WIDTH / 2 + 120 },
      y: GAME_HEIGHT + 10,
      speedX: { min: -30, max: 30 },
      speedY: { min: -160, max: -60 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.75, end: 0 },
      lifespan: { min: 2500, max: 5500 },
      frequency: 60,
      blendMode: 'ADD',
      tint: [0xffb648, 0xff7b2e, 0xfff1c9]
    });

    this.add
      .text(GAME_WIDTH / 2, 92, 'EL PRIMER FUEGO', {
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        fontSize: '18px',
        color: '#f2a93b',
        letterSpacing: 8
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 148, ending.title, {
        fontFamily: 'Georgia, serif',
        fontSize: '62px',
        color: '#f4e6cf',
        shadow: { offsetX: 0, offsetY: 0, color: '#f2a93b', blur: 26, fill: true }
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 208, ending.subtitle, {
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        color: '#ffd27a',
        fontStyle: 'italic'
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 280, ending.text, {
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        fontSize: '17px',
        color: '#b9c7d2',
        align: 'center',
        lineSpacing: 7,
        wordWrap: { width: 720 }
      })
      .setOrigin(0.5);

    this.add
      .rectangle(GAME_WIDTH / 2, 424, 600, 142, 0x081018, 0.84)
      .setStrokeStyle(1, 0x5a4528, 0.9);

    const rows = [
      ['PUNTAJE FINAL', String(this.stats.score ?? 0).padStart(6, '0')],
      ['RECUERDOS CONSERVADOS', `${this.stats.memoriesKept ?? 0} / 8`],
      ['RECUERDOS QUEMADOS', String(this.stats.burned ?? 0)],
      ['TIEMPO', formatTime(this.stats.elapsed ?? 0)]
    ];

    rows.forEach(([label, value], index) => {
      const y = 386 + index * 30;
      this.add
        .text(GAME_WIDTH / 2 - 260, y, label, {
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          fontSize: '13px',
          color: '#7d8d99',
          letterSpacing: 2
        })
        .setOrigin(0, 0.5);

      this.add
        .text(GAME_WIDTH / 2 + 260, y, value, {
          fontFamily: 'Georgia, serif',
          fontSize: '21px',
          color: '#f4e6cf'
        })
        .setOrigin(1, 0.5);
    });

    this.add
      .text(
        GAME_WIDTH / 2,
        520,
        isRecord ? 'NUEVO RÉCORD PERSONAL' : `MEJOR PUNTAJE  ·  ${String(best).padStart(6, '0')}`,
        {
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          fontSize: '17px',
          color: isRecord ? '#ffd27a' : '#7d8d99',
          letterSpacing: 2
        }
      )
      .setOrigin(0.5);

    createButton(this, GAME_WIDTH / 2 - 155, 582, 'JUGAR DE NUEVO', () => this.restart(), { width: 280 });
    createButton(this, GAME_WIDTH / 2 + 155, 582, 'MENÚ', () => this.goToMenu(), { width: 220 });

    this.add
      .text(GAME_WIDTH / 2, 650, 'Gracias por jugar. La llama queda encendida.', {
        fontFamily: 'Georgia, serif',
        fontSize: '17px',
        color: '#8d99a6',
        fontStyle: 'italic'
      })
      .setOrigin(0.5);

    this.input.keyboard.on('keydown-R', () => this.restart());
    this.input.keyboard.on('keydown-ENTER', () => this.restart());
    this.input.keyboard.on('keydown-ESC', () => this.goToMenu());

    audio.play('win');
    this.cameras.main.fadeIn(700, 0, 0, 0);
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
