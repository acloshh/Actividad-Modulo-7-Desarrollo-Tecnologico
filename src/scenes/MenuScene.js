import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { audio } from '../systems/AudioSystem.js';
import { getBestScore } from '../systems/Storage.js';
import { createButton } from '../ui/Button.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.transitioning = false;

    this.add.image(0, 0, 'bg').setOrigin(0);
    this.add.image(0, GAME_HEIGHT - 320, 'mountains-far').setOrigin(0).setAlpha(0.8);
    this.add.image(0, GAME_HEIGHT - 240, 'mountains-near').setOrigin(0);

    this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x02040a, 0.32)
      .setOrigin(0);

    this.createEmbers();

    const glow = this.add
      .image(GAME_WIDTH / 2, 400, 'glow')
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0xff9a3c)
      .setAlpha(0.3)
      .setScale(1.9);

    this.tweens.add({
      targets: glow,
      alpha: 0.45,
      scale: 2.2,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.add
      .text(GAME_WIDTH / 2, 128, 'BRASA', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '112px',
        color: '#f4e6cf',
        letterSpacing: 16,
        shadow: { offsetX: 0, offsetY: 0, color: '#f2a93b', blur: 28, fill: true }
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 220, 'EL ÚLTIMO FUEGO', {
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        fontSize: '22px',
        color: '#f2a93b',
        letterSpacing: 8
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 260, 'Tu vida es fuego. Tu luz es el precio.', {
        fontFamily: 'Georgia, serif',
        fontSize: '20px',
        color: '#9fb0bd',
        fontStyle: 'italic'
      })
      .setOrigin(0.5);

    const flame = this.add
      .image(GAME_WIDTH / 2, 405, 'flame')
      .setScale(3)
      .setDepth(5);
    this.tweens.add({
      targets: flame,
      scaleX: 2.8,
      scaleY: 3.25,
      y: 398,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    createButton(this, GAME_WIDTH / 2, 512, 'JUGAR', () => this.startGame(), { width: 270, height: 64 });

    this.add
      .text(
        GAME_WIDTH / 2,
        588,
        'A / D mover      ESPACIO saltar      SHIFT correr      J chispa      K avivar      Q quemar recuerdo',
        {
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          fontSize: '17px',
          color: '#c3d0da'
        }
      )
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 620, 'ESC pausa      M sonido      R reiniciar run', {
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        fontSize: '16px',
        color: '#7d8d99'
      })
      .setOrigin(0.5);

    const best = getBestScore();
    this.add
      .text(GAME_WIDTH / 2, 664, `MEJOR PUNTAJE  ·  ${best.toString().padStart(6, '0')}`, {
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        fontSize: '18px',
        color: '#f2a93b',
        letterSpacing: 2
      })
      .setOrigin(0.5);

    this.muteLabel = this.add
      .text(GAME_WIDTH - 24, 22, audio.muted ? 'M · sonido OFF' : 'M · sonido ON', {
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        fontSize: '15px',
        color: '#8d99a6'
      })
      .setOrigin(1, 0);

    this.add
      .text(GAME_WIDTH / 2, 700, 'Trabajo Práctico · Módulo 7 · Desarrollo Tecnológico 2', {
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        fontSize: '13px',
        color: '#55636f'
      })
      .setOrigin(0.5);

    this.input.keyboard.on('keydown-ENTER', () => this.startGame());
    this.input.keyboard.on('keydown-SPACE', () => this.startGame());
    this.input.keyboard.on('keydown-M', () => {
      const muted = audio.toggleMute();
      this.muteLabel.setText(muted ? 'M · sonido OFF' : 'M · sonido ON');
    });

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  createEmbers() {
    this.add.particles(0, 0, 'spark', {
      x: { min: 0, max: GAME_WIDTH },
      y: GAME_HEIGHT + 20,
      speedX: { min: -20, max: 20 },
      speedY: { min: -80, max: -30 },
      scale: { start: 0.38, end: 0 },
      alpha: { start: 0.55, end: 0 },
      lifespan: { min: 4000, max: 9000 },
      frequency: 180,
      quantity: 1,
      blendMode: 'ADD',
      tint: [0xffb648, 0xff7b2e, 0xffd27a]
    });
  }

  startGame() {
    if (this.transitioning) return;
    this.transitioning = true;

    audio.unlock();
    audio.play('click');
    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('GameScene', {
        levelIndex: 0,
        score: 0,
        memoriesKept: 0,
        burned: 0,
        elapsed: 0
      });
    });
  }
}
