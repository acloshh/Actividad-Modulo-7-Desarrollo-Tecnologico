import Phaser from 'phaser';

/** Zona de viento: empuja al jugador y acelera el drenaje de Calor. */
export default class WindZone {
  constructor(scene, data) {
    this.scene = scene;
    this.rect = new Phaser.Geom.Rectangle(data.x, data.y, data.w, data.h);
    this.dir = data.dir;

    scene.add
      .rectangle(data.x + data.w / 2, data.y + data.h / 2, data.w, data.h, 0x9fd8e6, 0.035)
      .setDepth(6);

    this.emitter = scene.add.particles(0, 0, 'wind-streak', {
      lifespan: { min: 700, max: 1200 },
      speedX: { min: this.dir * 220, max: this.dir * 380 },
      speedY: { min: -8, max: 8 },
      scaleX: { start: 1, end: 0.35 },
      alpha: { start: 0.45, end: 0 },
      frequency: 65,
      quantity: 1,
      blendMode: 'ADD',
      tint: 0xa8d4e0,
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(data.x, data.y, data.w, data.h)
      }
    });
    this.emitter.setDepth(17);
  }

  contains(x, y) {
    return Phaser.Geom.Rectangle.Contains(this.rect, x, y);
  }

  destroy() {
    this.emitter?.destroy();
  }
}
