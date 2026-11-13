import Phaser from 'phaser';
import { audio } from '../systems/AudioSystem.js';

/** Antorcha: al encenderse crea una zona segura durante 20 segundos. */
export default class Torch extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'torch');
    scene.add.existing(this);

    this.setOrigin(0.5, 1);
    this.setDepth(13);
    this.lit = false;
    this.litUntil = 0;
    this.duration = 20000;

    this.flame = scene.add
      .image(x, y - 48, 'flame-small')
      .setOrigin(0.5, 1)
      .setDepth(14)
      .setVisible(false);

    this.glow = scene.add
      .image(x, y - 42, 'glow')
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0xffa53d)
      .setAlpha(0)
      .setScale(0.7)
      .setDepth(12);

    this.flickerTween = scene.tweens.add({
      targets: this.flame,
      scaleX: 0.82,
      scaleY: 1.12,
      duration: 180,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      paused: true
    });
  }

  get isLit() {
    return this.lit;
  }

  light() {
    const wasLit = this.lit;
    this.lit = true;
    this.litUntil = this.scene.time.now + this.duration;

    this.flame.setVisible(true);
    this.glow.setAlpha(0.4);
    this.flickerTween.resume();

    if (!wasLit) {
      audio.play('torch');
      this.scene.tweens.add({
        targets: this.glow,
        alpha: 0.55,
        scale: 0.85,
        duration: 220,
        yoyo: true
      });
    }
  }

  extinguish() {
    this.lit = false;
    this.flame.setVisible(false);
    this.glow.setAlpha(0);
    this.flickerTween.pause();
  }

  update() {
    if (this.lit && this.scene.time.now >= this.litUntil) {
      this.extinguish();
    }
  }

  distanceTo(x, y) {
    return Phaser.Math.Distance.Between(x, y, this.x, this.y - 30);
  }
}
