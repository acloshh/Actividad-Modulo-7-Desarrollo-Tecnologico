import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import Fuel from '../entities/Fuel.js';
import Memory from '../entities/Memory.js';
import Torch from '../entities/Torch.js';
import Enemy from '../entities/Enemy.js';
import WindZone from '../entities/WindZone.js';

/**
 * Construye un nivel declarativo: plataformas, props, enemigos y salida.
 */
export default class LevelManager {
  constructor(scene, data) {
    this.scene = scene;
    this.data = data;

    this.platformBodies = [];
    this.platformGroup = scene.physics.add.staticGroup();
    this.fuelGroup = scene.physics.add.group({ allowGravity: false, immovable: true });
    this.memoryGroup = scene.physics.add.group({ allowGravity: false, immovable: true });
    this.enemyGroup = scene.physics.add.group();
    this.torches = [];
    this.winds = [];
    this.hazards = [];
  }

  build() {
    const { scene, data } = this;

    this.createBackdrop();
    this.createPlatforms();
    this.createHazards();
    this.createProps();
    this.createTorches();
    this.createEnemies();
    this.createWinds();
    this.createExit();

    return this;
  }

  createBackdrop() {
    const { scene, data } = this;

    scene.add.image(0, 0, 'bg').setOrigin(0).setScrollFactor(0).setDepth(-100);

    scene.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, data.tint, 0.16)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-95);

    this.mountainsFar = scene.add
      .tileSprite(0, GAME_HEIGHT - 320, GAME_WIDTH, 320, 'mountains-far')
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-90)
      .setAlpha(0.85);

    this.mountainsNear = scene.add
      .tileSprite(0, GAME_HEIGHT - 240, GAME_WIDTH, 240, 'mountains-near')
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-80)
      .setAlpha(0.95);

    // Ruinas de fondo, puramente decorativas.
    for (let i = 0; i < 9; i += 1) {
      const x = 220 + i * 420;
      const height = 90 + (i % 3) * 45;
      scene.add
        .rectangle(x, GAME_HEIGHT - 50, 34 + (i % 2) * 18, height, 0x091219, 0.72)
        .setOrigin(0.5, 1)
        .setDepth(-60);
    }
  }

  createPlatforms() {
    const { scene, data } = this;

    data.platforms.forEach((platform) => {
      scene.add
        .tileSprite(platform.x, platform.y, platform.w, platform.h, 'stone')
        .setOrigin(0)
        .setDepth(10);

      const zone = scene.add.zone(
        platform.x + platform.w / 2,
        platform.y + platform.h / 2,
        platform.w,
        platform.h
      );
      scene.physics.add.existing(zone, true);
      this.platformGroup.add(zone);
      this.platformBodies.push(zone);
    });
  }

  createHazards() {
    const { scene, data } = this;

    data.hazards.forEach((hazard) => {
      scene.add
        .tileSprite(hazard.x, hazard.y, hazard.w, hazard.h, 'water')
        .setOrigin(0)
        .setDepth(11)
        .setAlpha(0.95);

      this.hazards.push({
        rect: new Phaser.Geom.Rectangle(hazard.x, hazard.y, hazard.w, hazard.h),
        x: hazard.x,
        y: hazard.y,
        w: hazard.w,
        h: hazard.h
      });
    });
  }

  createProps() {
    const { scene, data } = this;

    data.fuels.forEach((fuel) => {
      const item = new Fuel(scene, fuel.x, fuel.y);
      this.fuelGroup.add(item);
    });

    data.memories.forEach((memory) => {
      const item = new Memory(scene, memory.x, memory.y, memory);
      this.memoryGroup.add(item);
    });
  }

  createTorches() {
    this.torches = this.data.torches.map((torch) => new Torch(this.scene, torch.x, torch.y));
  }

  createEnemies() {
    this.data.enemies.forEach((enemyData) => {
      const enemy = new Enemy(this.scene, enemyData);
      this.enemyGroup.add(enemy);
    });
  }

  createWinds() {
    this.winds = this.data.winds.map((wind) => new WindZone(this.scene, wind));
  }

  createExit() {
    const { scene, data } = this;

    if (data.beacon) {
      const beacon = scene.add
        .image(data.beacon.x, data.beacon.y, 'beacon')
        .setOrigin(0.5, 1)
        .setDepth(12);

      const glow = scene.add
        .image(data.beacon.x, data.beacon.y - 82, 'glow')
        .setBlendMode(Phaser.BlendModes.ADD)
        .setTint(0xffb648)
        .setAlpha(0.5)
        .setScale(1.6)
        .setDepth(11);

      scene.tweens.add({
        targets: glow,
        alpha: 0.3,
        scale: 1.35,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      scene.add.particles(0, 0, 'spark', {
        x: data.beacon.x,
        y: data.beacon.y - 70,
        speed: { min: 18, max: 70 },
        angle: { min: 235, max: 305 },
        scale: { start: 0.5, end: 0 },
        alpha: { start: 0.8, end: 0 },
        lifespan: { min: 700, max: 1500 },
        frequency: 55,
        blendMode: 'ADD',
        tint: [0xffb648, 0xff7b2e, 0xfff1c9]
      });

      this.exit = { isBeacon: true, x: data.beacon.x, y: data.beacon.y, sprite: beacon, glow };
      return;
    }

    const gate = scene.add.image(data.gate.x, data.gate.y, 'gate').setOrigin(0.5, 1).setDepth(12);
    const glow = scene.add
      .image(data.gate.x, data.gate.y - 74, 'glow')
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0xf2a93b)
      .setAlpha(0.22)
      .setScale(0.6)
      .setDepth(11);

    scene.tweens.add({
      targets: glow,
      alpha: 0.36,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.exit = { isBeacon: false, x: data.gate.x, y: data.gate.y, sprite: gate, glow };
  }

  updateParallax(camera) {
    this.mountainsFar.tilePositionX = camera.scrollX * 0.08;
    this.mountainsNear.tilePositionX = camera.scrollX * 0.22;
  }

  destroy() {
    this.winds.forEach((wind) => wind.destroy());
    this.torches.forEach((torch) => {
      torch.flickerTween?.stop();
      torch.flame?.destroy();
      torch.glow?.destroy();
      torch.destroy();
    });
  }
}
