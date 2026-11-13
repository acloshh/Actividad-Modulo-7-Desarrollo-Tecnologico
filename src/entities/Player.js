import Phaser from 'phaser';
import { TUNING } from '../config.js';
import { audio } from '../systems/AudioSystem.js';

/**
 * Jugador: una brasa con movimiento, salto con coyote time,
 * carrera, impulso (Avivar) e invulnerabilidad temporal.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, heat) {
    super(scene, x, y, 'flame');

    this.scene = scene;
    this.heat = heat;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(20);
    this.setCollideWorldBounds(true);
    this.body.setSize(20, 32);
    this.body.setOffset(8, 16);
    this.setMaxVelocity(460, 900);

    this.facing = 1;
    this.isRunning = false;
    this.invulnerable = false;
    this.jumpBuffer = 0;
    this.coyoteTime = 0;
    this.dashTime = 0;
    this.dashCooldown = 0;
    this.windDir = 0;
    this.wasOnGround = true;

    this.glow = scene.add
      .image(x, y, 'glow')
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0xffa53d)
      .setAlpha(0.2)
      .setDepth(15);

    this.emitter = scene.add.particles(0, 0, 'spark', {
      follow: this,
      followOffset: { x: 0, y: -6 },
      speed: { min: 8, max: 34 },
      angle: { min: 245, max: 295 },
      scale: { start: 0.32, end: 0 },
      alpha: { start: 0.65, end: 0 },
      lifespan: { min: 300, max: 700 },
      frequency: 70,
      quantity: 1,
      blendMode: 'ADD',
      tint: [0xffb648, 0xff7b2e, 0xfff1c9]
    });
    this.emitter.setDepth(18);
  }

  keyDown(control) {
    return Array.isArray(control) ? control.some((key) => key.isDown) : control.isDown;
  }

  keyJustDown(control) {
    return Array.isArray(control)
      ? control.some((key) => Phaser.Input.Keyboard.JustDown(key))
      : Phaser.Input.Keyboard.JustDown(control);
  }

  update(delta, controls) {
    const dt = delta / 1000;
    const onGround = this.body.blocked.down || this.body.touching.down;

    if (onGround) {
      this.coyoteTime = 110;
    } else {
      this.coyoteTime = Math.max(0, this.coyoteTime - delta);
    }

    if (this.keyJustDown(controls.jump)) {
      this.jumpBuffer = 130;
    } else {
      this.jumpBuffer = Math.max(0, this.jumpBuffer - delta);
    }

    if (this.jumpBuffer > 0 && this.coyoteTime > 0) {
      this.setVelocityY(-610);
      this.jumpBuffer = 0;
      this.coyoteTime = 0;
      audio.play('jump');
      this.scene.tweens.add({
        targets: this,
        scaleX: 0.82,
        scaleY: 1.18,
        duration: 90,
        yoyo: true
      });
    }

    // Salto variable: al soltar, se corta el impulso.
    if (!this.keyDown(controls.jump) && this.body.velocity.y < -220) {
      this.setVelocityY(this.body.velocity.y * 0.94);
    }

    if (onGround && !this.wasOnGround) {
      audio.play('land');
    }
    this.wasOnGround = onGround;

    const left = this.keyDown(controls.left);
    const right = this.keyDown(controls.right);
    const moving = left || right;
    const running = this.keyDown(controls.run) && moving && onGround && this.heat.value > 5;

    this.isRunning = running;

    if (moving) {
      this.facing = left ? -1 : 1;
    }

    const baseSpeed = running ? 300 : 205;
    const targetSpeed = moving ? this.facing * baseSpeed + this.windDir : this.windDir;
    const smoothing = 1 - Math.exp(-16 * dt);
    this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, targetSpeed, smoothing));

    // Avivar: impulso corto que también empuja enemigos.
    this.dashCooldown = Math.max(0, this.dashCooldown - delta);
    if (this.keyJustDown(controls.dash) && this.dashCooldown <= 0 && this.heat.value > TUNING.dashCost) {
      this.heat.spend(TUNING.dashCost);
      this.dashTime = 240;
      this.dashCooldown = 900;
      this.setVelocityX(this.facing * 440);
      audio.play('dash');
      this.scene.repelEnemies(this.x, this.y, 130);
      this.scene.cameras.main.shake(120, 0.002);
    }

    if (this.dashTime > 0) {
      this.dashTime -= delta;
      this.setVelocityX(this.facing * 440);
    }

    this.setRotation(this.facing * 0.06 + Phaser.Math.Clamp(this.body.velocity.y / 4000, -0.06, 0.06));

    this.updateVisuals(dt);
    this.updateLight();
  }

  updateVisuals(dt) {
    const heatRatio = this.heat.value / this.heat.max;
    const pulse = 1 + Math.sin(this.scene.time.now / 130) * 0.025;

    const targetScale = (0.9 + heatRatio * 0.28) * pulse;
    this.scaleX = Phaser.Math.Linear(this.scaleX, targetScale, 1 - Math.exp(-8 * dt));
    this.scaleY = Phaser.Math.Linear(this.scaleY, targetScale * (1 + (this.isRunning ? 0.05 : 0)), 1 - Math.exp(-8 * dt));

    if (this.heat.stateKey === 'ember') {
      this.setTint(0xffc9b0);
    } else if (this.heat.stateKey === 'flame') {
      this.setTint(0xffe2bd);
    } else {
      this.clearTint();
    }

    this.glow.setPosition(this.x, this.y - 4);
    this.glow.setScale(0.55 + heatRatio * 0.75);
    this.glow.setAlpha(0.12 + heatRatio * 0.22);

    this.emitter.frequency = this.heat.stateKey === 'blaze' ? 40 : this.heat.stateKey === 'flame' ? 90 : 170;
  }

  updateLight() {
    // La luz se usa desde GameScene para recortar la oscuridad.
    this.lightTexture = this.heat.lightTexture;
  }

  hurt(amount, sourceX = this.x) {
    if (this.invulnerable || this.heat.value <= 0) return false;

    this.heat.spend(amount);
    this.invulnerable = true;
    audio.play('hurt');

    const knockbackDir = this.x < sourceX ? -1 : 1;
    this.setVelocity(knockbackDir * 260, -260);
    this.scene.cameras.main.shake(220, 0.006);
    this.scene.cameras.main.flash(120, 120, 20, 0);

    this.scene.tweens.add({
      targets: this,
      alpha: 0.35,
      duration: 90,
      yoyo: true,
      repeat: 5,
      onComplete: () => this.setAlpha(1)
    });

    this.scene.time.delayedCall(TUNING.invulnerabilityMs, () => {
      this.invulnerable = false;
      this.setAlpha(1);
    });

    return true;
  }

  destroy(fromScene) {
    this.glow?.destroy();
    this.emitter?.destroy();
    super.destroy(fromScene);
  }
}
