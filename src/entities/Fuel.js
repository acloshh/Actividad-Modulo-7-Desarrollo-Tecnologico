import Phaser from 'phaser';

/** Astilla: recupera Calor y suma puntaje. */
export default class Fuel extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'fuel');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.collected = false;
    this.setDepth(14);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);

    this.floatTween = scene.tweens.add({
      targets: this,
      y: y - 6,
      duration: 1100 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  collect() {
    if (this.collected) return false;
    this.collected = true;
    this.body.enable = false;
    this.floatTween?.stop();

    this.scene.tweens.add({
      targets: this,
      y: this.y - 28,
      alpha: 0,
      scale: 1.7,
      duration: 260,
      ease: 'Cubic.easeOut',
      onComplete: () => this.destroy()
    });

    return true;
  }
}
