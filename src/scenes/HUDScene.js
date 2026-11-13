import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { EventBus, EVENTS } from '../systems/EventBus.js';

const UI_FONT = '"Segoe UI", system-ui, sans-serif';
const TITLE_FONT = 'Georgia, serif';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super('HUDScene');
  }

  create() {
    this.heatValue = 100;
    this.heatMax = 100;

    this.createHeatBar();
    this.createScorePanel();
    this.createLevelLabel();
    this.createToast();
    this.createHints();
    this.bindEvents();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
  }

  createHeatBar() {
    this.add
      .text(28, 12, 'CALOR', {
        fontFamily: UI_FONT,
        fontSize: '13px',
        color: '#8d99a6',
        letterSpacing: 3
      })
      .setOrigin(0, 0);

    this.add
      .rectangle(26, 38, 282, 18, 0x000000, 0.55)
      .setOrigin(0, 0.5)
      .setStrokeStyle(1, 0x3c4d5c, 0.9);

    this.barFill = this.add
      .rectangle(28, 38, 278, 12, 0xf2a93b, 1)
      .setOrigin(0, 0.5);

    this.stateText = this.add
      .text(318, 38, 'Fogata · 100', {
        fontFamily: UI_FONT,
        fontSize: '15px',
        color: '#ffd27a'
      })
      .setOrigin(0, 0.5);

    this.heatWarning = this.add
      .text(28, 54, 'Busca una antorcha o una astilla', {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: '#ff8a7a'
      })
      .setOrigin(0, 0)
      .setVisible(false);
  }

  createScorePanel() {
    this.scoreLabel = this.add
      .text(GAME_WIDTH - 26, 12, 'PUNTAJE', {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: '#8d99a6',
        letterSpacing: 3
      })
      .setOrigin(1, 0);

    this.scoreText = this.add
      .text(GAME_WIDTH - 26, 28, '000000', {
        fontFamily: TITLE_FONT,
        fontSize: '30px',
        color: '#f4e6cf'
      })
      .setOrigin(1, 0);

    this.memoryText = this.add
      .text(GAME_WIDTH - 26, 68, '◆  0 recuerdos', {
        fontFamily: UI_FONT,
        fontSize: '16px',
        color: '#7fe3ff'
      })
      .setOrigin(1, 0);

    this.burnHint = this.add
      .text(GAME_WIDTH - 26, 92, 'Q · quemar recuerdo (+100 Calor)', {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: '#f2a93b'
      })
      .setOrigin(1, 0)
      .setVisible(false);
  }

  createLevelLabel() {
    this.levelText = this.add
      .text(GAME_WIDTH / 2, 14, '', {
        fontFamily: UI_FONT,
        fontSize: '13px',
        color: '#8d99a6',
        letterSpacing: 3,
        align: 'center'
      })
      .setOrigin(0.5, 0);

    this.levelName = this.add
      .text(GAME_WIDTH / 2, 34, '', {
        fontFamily: TITLE_FONT,
        fontSize: '22px',
        color: '#c3d0da',
        align: 'center'
      })
      .setOrigin(0.5, 0);
  }

  createToast() {
    this.toast = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 96, '', {
        fontFamily: UI_FONT,
        fontSize: '20px',
        color: '#f4e6cf',
        backgroundColor: 'rgba(5, 10, 16, 0.72)',
        padding: { x: 18, y: 10 },
        align: 'center'
      })
      .setOrigin(0.5)
      .setAlpha(0);
  }

  createHints() {
    this.add
      .text(
        24,
        GAME_HEIGHT - 26,
        'A / D mover · ESPACIO saltar · SHIFT correr · J chispa · K avivar · Q quemar · ESC pausa',
        {
          fontFamily: UI_FONT,
          fontSize: '13px',
          color: '#5f6f7c'
        }
      )
      .setOrigin(0, 0.5);

    this.add
      .text(GAME_WIDTH - 24, GAME_HEIGHT - 26, 'R reiniciar · M sonido', {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: '#4d5c67'
      })
      .setOrigin(1, 0.5);
  }

  bindEvents() {
    this.onHeat = (data) => this.updateHeat(data);
    this.onScore = (value) => this.scoreText.setText(String(value).padStart(6, '0'));
    this.onMemories = (data) => this.updateMemories(data);
    this.onLevel = (data) => this.updateLevel(data);
    this.onToast = (message) => this.showToast(message);
    this.onHurt = () => this.flashHeatBar();
    this.onBurned = () => {
      this.cameras.main.flash(120, 90, 45, 0);
    };

    EventBus.on(EVENTS.heat, this.onHeat, this);
    EventBus.on(EVENTS.score, this.onScore, this);
    EventBus.on(EVENTS.memories, this.onMemories, this);
    EventBus.on(EVENTS.level, this.onLevel, this);
    EventBus.on(EVENTS.toast, this.onToast, this);
    EventBus.on(EVENTS.playerHurt, this.onHurt, this);
    EventBus.on(EVENTS.memoryBurned, this.onBurned, this);
  }

  updateHeat({ value, max, label }) {
    this.heatValue = value;
    this.heatMax = max;
    const ratio = Phaser.Math.Clamp(value / max, 0, 1);

    this.barFill.displayWidth = Math.max(2, 278 * ratio);

    let color = 0xffd27a;
    if (value <= 25) color = 0xff5c5c;
    else if (value <= 65) color = 0xf2a93b;

    this.barFill.setFillStyle(color, 1);
    this.stateText.setText(`${label} · ${Math.ceil(value)}`);
    this.stateText.setColor(value <= 25 ? '#ff8a7a' : value <= 65 ? '#f2a93b' : '#ffd27a');
    this.heatWarning.setVisible(value <= 25);
  }

  updateMemories({ count }) {
    this.memoryText.setText(`◆  ${count} recuerdo${count === 1 ? '' : 's'}`);
    this.burnHint.setVisible(count > 0);
  }

  updateLevel({ index, total, name }) {
    this.levelText.setText(`NIVEL ${index + 1} / ${total}`);
    this.levelName.setText(name);
  }

  showToast(message) {
    this.toast.setText(message);
    this.toast.setAlpha(1);
    this.tweens.killTweensOf(this.toast);
    this.tweens.add({
      targets: this.toast,
      alpha: 0,
      delay: 2100,
      duration: 550,
      ease: 'Quad.easeIn'
    });
  }

  flashHeatBar() {
    this.tweens.killTweensOf(this.barFill);
    this.barFill.setAlpha(0.25);
    this.tweens.add({
      targets: this.barFill,
      alpha: 1,
      duration: 260,
      yoyo: true,
      repeat: 1
    });
  }

  handleShutdown() {
    EventBus.off(EVENTS.heat, this.onHeat, this);
    EventBus.off(EVENTS.score, this.onScore, this);
    EventBus.off(EVENTS.memories, this.onMemories, this);
    EventBus.off(EVENTS.level, this.onLevel, this);
    EventBus.off(EVENTS.toast, this.onToast, this);
    EventBus.off(EVENTS.playerHurt, this.onHurt, this);
    EventBus.off(EVENTS.memoryBurned, this.onBurned, this);
    this.tweens.killAll();
  }
}
