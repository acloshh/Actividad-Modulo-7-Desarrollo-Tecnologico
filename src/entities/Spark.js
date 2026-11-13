import Phaser from 'phaser';
import { ObjectPool } from '../patterns/ObjectPool.js';

/**
 * Gestor de chispas con Object Pool: no se crean y destruyen objetos por disparo.
 */
export default class SparkManager {
  constructor(scene) {
    this.scene = scene;
    this.group = scene.physics.add.group({ allowGravity: false });
    this.active = [];

    this.pool = new ObjectPool(
      () => {
        const spark = scene.physics.add.image(0, 0, 'spark');
        spark.setDepth(22);
        spark.body.setAllowGravity(false);
        spark.setActive(false).setVisible(false);
        spark.body.enable = false;
        this.group.add(spark);
        return spark;
      },
      { initial: 8, max: 24 }
    );
  }

  fire(x, y, direction) {
    const spark = this.pool.acquire();
    if (!spark) return false;

    spark.enableBody(true, x, y, true, true);
    spark.setActive(true).setVisible(true);
    spark.body.setAllowGravity(false);
    spark.setVelocity(direction * 640, -8);
    spark.setRotation(0);
    spark.lifetime = 1200;
    spark.setTint(0xffd27a);
    this.active.push(spark);
    return true;
  }

  release(spark) {
    const index = this.active.indexOf(spark);
    if (index >= 0) this.active.splice(index, 1);
    this.pool.release(spark);
  }

  update(delta) {
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const spark = this.active[i];
      spark.lifetime -= delta;
      if (spark.lifetime <= 0) {
        this.release(spark);
      }
    }
  }

  releaseAll() {
    [...this.active].forEach((spark) => this.release(spark));
  }
}
