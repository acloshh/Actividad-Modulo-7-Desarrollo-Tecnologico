import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, TUNING } from '../config.js';
import { LEVELS } from '../data/levels.js';
import Player from '../entities/Player.js';
import SparkManager from '../entities/Spark.js';
import HeatSystem from '../systems/HeatSystem.js';
import ScoreSystem from '../systems/ScoreSystem.js';
import LevelManager from '../systems/LevelManager.js';
import { EventBus, EVENTS } from '../systems/EventBus.js';
import { audio } from '../systems/AudioSystem.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.levelIndex = data.levelIndex ?? 0;
    this.carry = {
      score: data.score ?? 0,
      memoriesKept: data.memoriesKept ?? 0,
      burned: data.burned ?? 0,
      elapsed: data.elapsed ?? 0
    };
  }

  create() {
    this.levelData = LEVELS[this.levelIndex];
    this.memoriesKept = this.carry.memoriesKept;
    this.burned = this.carry.burned;
    this.elapsed = this.carry.elapsed;

    this.isPaused = false;
    this.isTransitioning = false;
    this.isGameOver = false;
    this.nextSparkAt = 0;
    this.gateMessageAt = 0;
    this.safeAccumulator = 0;
    this.hudAccumulator = 0;

    this.physics.world.setBounds(0, 0, this.levelData.width, GAME_HEIGHT);
    this.physics.world.setFPS(60);

    this.levelManager = new LevelManager(this, this.levelData).build();

    this.heat = new HeatSystem(this);
    this.score = new ScoreSystem(this.carry.score);
    this.sparks = new SparkManager(this);

    this.player = new Player(this, this.levelData.spawn.x, this.levelData.spawn.y, this.heat);
    this.lastSafe = { x: this.levelData.spawn.x, y: this.levelData.spawn.y };

    this.setupControls();
    this.setupPhysics();
    this.setupCamera();

    this.darkness = this.add
      .renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(900);

    this.useDarkness = this.game.renderer.type === Phaser.WEBGL;
    if (!this.useDarkness) this.darkness.setVisible(false);

    this.createPauseOverlay();

    this.scene.launch('HUDScene');
    this.time.delayedCall(100, () => this.emitInitialHud());
    this.time.delayedCall(1100, () => this.showToast(this.levelData.hint));

    this.cameras.main.fadeIn(450, 0, 0, 0);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
  }

  setupControls() {
    const keyboard = this.input.keyboard;
    const cursors = keyboard.createCursorKeys();

    this.controls = {
      left: [keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A), cursors.left],
      right: [keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D), cursors.right],
      jump: [
        keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        cursors.up
      ],
      run: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      dash: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
      spark: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
      burn: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      pause: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
      restart: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
      mute: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
    };

    this.input.on('pointerdown', this.handlePointerDown, this);
  }

  setupPhysics() {
    const platforms = this.levelManager.platformGroup;

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.levelManager.enemyGroup, platforms);

    this.physics.add.overlap(this.player, this.levelManager.fuelGroup, (_player, fuel) => {
      this.collectFuel(fuel);
    });

    this.physics.add.overlap(this.player, this.levelManager.memoryGroup, (_player, memory) => {
      this.collectMemory(memory);
    });

    this.physics.add.overlap(this.player, this.levelManager.enemyGroup, (player, enemy) => {
      if (player.hurt(TUNING.enemyDamage, enemy.x)) {
        EventBus.emit(EVENTS.playerHurt, { damage: TUNING.enemyDamage });
      }
    });

    this.physics.add.overlap(this.sparks.group, this.levelManager.enemyGroup, (spark, enemy) => {
      enemy.stun(2000);
      this.burstAt(enemy.x, enemy.y, 10);
      this.sparks.release(spark);
    });

    this.physics.add.collider(this.sparks.group, platforms, (spark) => {
      this.sparks.release(spark);
    });
  }

  setupCamera() {
    const camera = this.cameras.main;
    camera.setBounds(0, 0, this.levelData.width, GAME_HEIGHT);
    camera.startFollow(this.player, true, 0.12, 0.12);
    camera.setDeadzone(180, 140);
    camera.setBackgroundColor(0x04070d);
  }

  emitInitialHud() {
    EventBus.emit(EVENTS.level, {
      index: this.levelIndex,
      total: LEVELS.length,
      name: this.levelData.name,
      subtitle: this.levelData.subtitle
    });
    EventBus.emit(EVENTS.score, this.score.score);
    EventBus.emit(EVENTS.memories, { count: this.memoriesKept, burned: this.burned });
    this.heat.emit(true);
  }

  update(_time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.controls.pause) && !this.isTransitioning && !this.isGameOver) {
      this.togglePause();
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.restart)) {
      this.restartRun();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.mute)) {
      const muted = audio.toggleMute();
      this.showToast(muted ? 'Audio silenciado (M)' : 'Audio activado (M)');
    }

    if (this.isPaused || this.isTransitioning || this.isGameOver) return;

    const dt = Math.min(delta, 50) / 1000;
    this.elapsed += dt;

    const wind = this.levelManager.winds.find((zone) => zone.contains(this.player.x, this.player.y));
    this.player.windDir = wind ? wind.dir * 55 : 0;

    const nearTorch = this.levelManager.torches.some(
      (torch) => torch.isLit && torch.distanceTo(this.player.x, this.player.y) < 115
    );

    this.heat.update(dt, {
      running: this.player.isRunning,
      inWind: Boolean(wind),
      nearTorch
    });

    if (this.heat.value <= 0) {
      this.gameOver();
      return;
    }

    this.player.update(delta, this.controls);

    this.levelManager.enemyGroup.getChildren().forEach((enemy) => {
      if (enemy.active) {
        enemy.update(delta, this.player, this.heat, this.levelManager.torches);
      }
    });

    this.levelManager.torches.forEach((torch) => torch.update());
    this.sparks.update(delta);

    this.handleSparkTorchCollisions();
    this.handleInputActions();
    this.checkHazards(dt);
    this.updateDarkness();
    this.levelManager.updateParallax(this.cameras.main);
    this.updateHud(dt);
  }

  handleInputActions() {
    if (Phaser.Input.Keyboard.JustDown(this.controls.spark)) {
      this.trySpark();
    }
    if (Phaser.Input.Keyboard.JustDown(this.controls.burn)) {
      this.burnMemory();
    }
  }

  handlePointerDown(pointer) {
    if (pointer.leftButtonDown() && !this.isPaused && !this.isTransitioning && !this.isGameOver) {
      audio.unlock();
      this.trySpark();
    }
  }

  trySpark() {
    if (this.time.now < this.nextSparkAt || this.heat.value <= TUNING.sparkCost) {
      if (this.heat.value <= TUNING.sparkCost) this.showToast('No hay Calor suficiente');
      return;
    }

    this.heat.spend(TUNING.sparkCost);
    this.sparks.fire(this.player.x + this.player.facing * 22, this.player.y - 8, this.player.facing);
    this.nextSparkAt = this.time.now + 260;
    audio.play('spark');
  }

  burnMemory() {
    if (this.memoriesKept <= 0) {
      this.showToast('No tenés recuerdos para quemar');
      return;
    }

    this.memoriesKept -= 1;
    this.burned += 1;
    this.heat.add(TUNING.memoryHeat);
    audio.play('burn');
    EventBus.emit(EVENTS.memories, { count: this.memoriesKept, burned: this.burned });
    EventBus.emit(EVENTS.memoryBurned, { burned: this.burned });
    this.showToast('Quemaste un recuerdo · +100 Calor');
    this.burstAt(this.player.x, this.player.y - 10, 26);
    this.cameras.main.flash(220, 90, 45, 0);

    this.tweens.add({
      targets: this.player,
      scale: 1.35,
      duration: 140,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
  }

  collectFuel(fuel) {
    if (!fuel.collect()) return;
    this.heat.add(TUNING.fuelHeat);
    this.score.add(10);
    audio.play('collect');
  }

  collectMemory(memory) {
    if (!memory.collect()) return;
    this.memoriesKept += 1;
    this.score.add(50);
    audio.play('memory');
    EventBus.emit(EVENTS.memories, { count: this.memoriesKept, burned: this.burned });
    this.showToast(`Recuerdo: ${memory.title} · Q para quemarlo`);
  }

  handleSparkTorchCollisions() {
    for (let i = this.sparks.active.length - 1; i >= 0; i -= 1) {
      const spark = this.sparks.active[i];
      const torch = this.levelManager.torches.find(
        (candidate) => !candidate.isLit && candidate.distanceTo(spark.x, spark.y) < 42
      );

      if (torch) {
        torch.light();
        this.burstAt(spark.x, spark.y, 8);
        this.sparks.release(spark);
      }
    }
  }

  checkHazards(dt) {
    if (this.player.y > GAME_HEIGHT + 60) {
      this.respawn(TUNING.fallDamage, 0x1b3b4a);
      return;
    }

    const inHazard = this.levelManager.hazards.some((hazard) =>
      Phaser.Geom.Rectangle.Contains(hazard.rect, this.player.x, this.player.y + 12)
    );

    if (inHazard) {
      this.respawn(TUNING.hazardDamage, 0x2a6f7a);
      return;
    }

    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    this.safeAccumulator += dt;
    if (onGround && this.safeAccumulator > 0.35) {
      this.lastSafe = { x: this.player.x, y: this.player.y - 2 };
      this.safeAccumulator = 0;
    }

    this.checkExit();
  }

  checkExit() {
    const exit = this.levelManager.exit;
    const horizontal = Math.abs(this.player.x - exit.x);
    const vertical = Math.abs(this.player.y - (exit.y - 60));

    if (horizontal > 62 || vertical > 130) return;

    if (exit.isBeacon) {
      this.victory();
      return;
    }

    if (this.memoriesKept > 0) {
      this.memoriesKept -= 1;
      EventBus.emit(EVENTS.memories, { count: this.memoriesKept, burned: this.burned });
      audio.play('gate');
      this.completeLevel();
      return;
    }

    if (this.time.now > this.gateMessageAt) {
      this.showToast('La puerta pide un recuerdo. Buscá uno en el nivel.');
      this.gateMessageAt = this.time.now + 2600;
    }
  }

  respawn(damage, flashColor = 0x1b3b4a) {
    if (this.player.invulnerable) return;

    this.heat.spend(damage);
    this.player.setPosition(this.lastSafe.x, this.lastSafe.y);
    this.player.setVelocity(0, -120);
    this.player.invulnerable = true;

    this.cameras.main.flash(220, (flashColor >> 16) & 0xff, (flashColor >> 8) & 0xff, flashColor & 0xff);
    this.cameras.main.shake(180, 0.005);
    audio.play('hurt');

    this.time.delayedCall(TUNING.invulnerabilityMs, () => {
      this.player.invulnerable = false;
    });
  }

  repelEnemies(x, y, radius) {
    this.levelManager.enemyGroup.getChildren().forEach((enemy) => {
      if (!enemy.active) return;
      const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      if (distance <= radius) {
        enemy.stun(1500);
      }
    });

    const ring = this.add.circle(x, y, 22, 0xffd27a, 0).setStrokeStyle(3, 0xffd27a, 0.85).setDepth(850);
    this.tweens.add({
      targets: ring,
      scale: 4.5,
      alpha: 0,
      duration: 320,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy()
    });
  }

  burstAt(x, y, quantity = 16) {
    const emitter = this.add.particles(x, y, 'spark', {
      speed: { min: 40, max: 190 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.48, end: 0 },
      alpha: { start: 0.9, end: 0 },
      lifespan: { min: 300, max: 700 },
      blendMode: 'ADD',
      tint: [0xffb648, 0xff7b2e, 0xfff1c9],
      emitting: false
    });
    emitter.setDepth(860);
    emitter.explode(quantity);
    this.time.delayedCall(800, () => emitter.destroy());
  }

  updateDarkness() {
    if (!this.useDarkness) return;

    const camera = this.cameras.main;
    this.darkness.clear();
    this.darkness.fill(0x02040a, 0.87);

    const playerSize = {
      'light-small': 240,
      'light-medium': 340,
      'light-large': 460
    }[this.player.lightTexture] ?? 340;

    // Halo tenue más amplio para que el entorno se lea sin perder la penumbra.
    this.darkness.erase(
      'light-ambient',
      this.player.x - camera.scrollX - 360,
      this.player.y - camera.scrollY - 8 - 360
    );

    this.darkness.erase(
      this.player.lightTexture,
      this.player.x - camera.scrollX - playerSize / 2,
      this.player.y - camera.scrollY - 8 - playerSize / 2
    );

    this.levelManager.torches.forEach((torch) => {
      if (torch.isLit) {
        const size = 420;
        this.darkness.erase(
          'light-torch',
          torch.x - camera.scrollX - size / 2,
          torch.y - 40 - camera.scrollY - size / 2
        );
      }
    });

    const exit = this.levelManager.exit;
    const exitSize = exit.isBeacon ? 560 : 360;
    this.darkness.erase(
      exit.isBeacon ? 'light-large' : 'light-medium',
      exit.x - camera.scrollX - exitSize / 2,
      exit.y - 70 - camera.scrollY - exitSize / 2
    );
  }

  updateHud(delta) {
    this.hudAccumulator += delta;
    if (this.hudAccumulator < 120) return;
    this.hudAccumulator = 0;
    EventBus.emit(EVENTS.score, this.score.score);
    EventBus.emit(EVENTS.memories, { count: this.memoriesKept, burned: this.burned });
  }

  createPauseOverlay() {
    this.pauseOverlay = this.add.container(0, 0).setDepth(1000).setVisible(false);
    const backdrop = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x02040a, 0.84).setOrigin(0);
    const title = this.add
      .text(GAME_WIDTH / 2, 250, 'PAUSA', {
        fontFamily: 'Georgia, serif',
        fontSize: '64px',
        color: '#f2a93b'
      })
      .setOrigin(0.5);
    const subtitle = this.add
      .text(GAME_WIDTH / 2, 320, 'La llama espera.', {
        fontFamily: '"Segoe UI", sans-serif',
        fontSize: '22px',
        color: '#8d99a6'
      })
      .setOrigin(0.5);
    const help = this.add
      .text(GAME_WIDTH / 2, 410, 'ESC  continuar      R  reiniciar run      M  sonido', {
        fontFamily: '"Segoe UI", sans-serif',
        fontSize: '20px',
        color: '#e8eef4',
        align: 'center',
        lineSpacing: 12
      })
      .setOrigin(0.5);

    this.pauseOverlay.add([backdrop, title, subtitle, help]);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.pauseOverlay.setVisible(this.isPaused);

    if (this.isPaused) {
      this.physics.pause();
    } else {
      this.physics.resume();
    }

    audio.play('click');
  }

  restartRun() {
    this.physics.resume();
    audio.play('click');
    this.scene.stop('HUDScene');
    this.scene.start('GameScene', {
      levelIndex: 0,
      score: 0,
      memoriesKept: 0,
      burned: 0,
      elapsed: 0
    });
  }

  completeLevel() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.physics.pause();

    const bonus = 250 + Math.floor(this.heat.value);
    this.score.add(bonus);
    audio.play('level');

    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x02040a, 0.72).setDepth(1000);
    const title = this.add
      .text(GAME_WIDTH / 2, 300, 'NIVEL COMPLETADO', {
        fontFamily: 'Georgia, serif',
        fontSize: '52px',
        color: '#f2a93b'
      })
      .setOrigin(0.5)
      .setDepth(1001);
    const detail = this.add
      .text(GAME_WIDTH / 2, 370, `+${bonus} puntos · El calor te sostuvo`, {
        fontFamily: '"Segoe UI", sans-serif',
        fontSize: '22px',
        color: '#e8eef4'
      })
      .setOrigin(0.5)
      .setDepth(1001);

    this.time.delayedCall(1500, () => {
      overlay.destroy();
      title.destroy();
      detail.destroy();

      this.scene.stop('HUDScene');
      this.scene.start('GameScene', {
        levelIndex: this.levelIndex + 1,
        score: this.score.score,
        memoriesKept: this.memoriesKept,
        burned: this.burned,
        elapsed: this.elapsed
      });
    });
  }

  victory() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.physics.pause();

    const bonus = 500 + this.memoriesKept * 100;
    this.score.add(bonus);
    audio.play('win');
    this.cameras.main.flash(700, 255, 190, 90);

    this.time.delayedCall(1100, () => {
      this.scene.stop('HUDScene');
      this.scene.start('VictoryScene', {
        score: this.score.score,
        memoriesKept: this.memoriesKept,
        burned: this.burned,
        elapsed: this.elapsed
      });
    });
  }

  gameOver() {
    if (this.isGameOver || this.isTransitioning) return;
    this.isGameOver = true;
    this.physics.pause();
    this.player.setVisible(false);
    audio.play('lose');
    this.cameras.main.fade(700, 0, 0, 0);

    this.time.delayedCall(750, () => {
      this.scene.stop('HUDScene');
      this.scene.start('GameOverScene', {
        score: this.score.score,
        level: this.levelIndex + 1,
        memoriesKept: this.memoriesKept,
        burned: this.burned,
        elapsed: this.elapsed
      });
    });
  }

  showToast(message) {
    EventBus.emit(EVENTS.toast, message);
  }

  handleShutdown() {
    this.input.off('pointerdown', this.handlePointerDown, this);
    this.levelManager?.destroy();
    this.sparks?.releaseAll();
    this.scene.stop('HUDScene');
    this.tweens.killAll();
  }
}
