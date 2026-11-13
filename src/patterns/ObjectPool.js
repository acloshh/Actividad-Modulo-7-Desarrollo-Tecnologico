/**
 * Pool de objetos genérico (patrón Object Pool).
 * Evita crear y destruir instancias en cada disparo de chispa.
 */
export class ObjectPool {
  constructor(factory, { initial = 6, max = 24 } = {}) {
    this.factory = factory;
    this.max = max;
    this.free = [];
    this.active = new Set();

    for (let i = 0; i < initial; i += 1) {
      this.free.push(factory());
    }
  }

  acquire() {
    let item = this.free.pop();
    if (!item && this.active.size < this.max) {
      item = this.factory();
    }
    if (!item) return null;

    this.active.add(item);
    return item;
  }

  release(item) {
    if (!this.active.has(item)) return;
    this.active.delete(item);
    item.setActive(false).setVisible(false);
    if (item.body) {
      item.body.enable = false;
    }
    this.free.push(item);
  }

  releaseAll() {
    [...this.active].forEach((item) => this.release(item));
  }

  getActive() {
    return [...this.active];
  }
}
