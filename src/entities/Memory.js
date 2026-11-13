import Phaser from 'phaser';

/**
 * Recuerdo: se puede conservar (puntaje y final) o quemar por +100 Calor.
 */
export default class Memory extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, data) {
    super(scene, x, y, 'memory');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.memoryId = data.id;
    this.title = data.title;
    this.collected = false;

    this.setDepth(16);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);

    this.glow = scene.add
      .image(x, y, 'glow')
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0x7fe3ff)
      .setAlpha(0.24)
      .setScale(0.45)
      .setDepth(15);

    this.floatTween = scene.tweens.add({
      targets: [this, this.glow],
      y: y - 9,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.pulseTween = scene.tweens.add({
      targets: this.glow,
      alpha: 0.1,
      scale: 0.6,
      duration: 900,
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
    this.pulseTween?.stop();

    this.scene.tweens.add({
      targets: [this, this.glow],
      y: this.y - 42,
      alpha: 0,
      scale: 1.8,
      duration: 380,
      ease: 'Cubic.easeOut',
      onComplete: () => this.destroy()
    });

    return true;
  }

  destroy(fromScene) {
    this.glow?.destroy();
    super.destroy(fromScene);
  }
}
