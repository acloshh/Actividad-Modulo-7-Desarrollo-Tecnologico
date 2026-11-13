import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.js';

/**
 * Genera todas las texturas por código: el repositorio no depende de assets externos.
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.createFlameTextures();
    this.createCharacterTextures();
    this.createPropTextures();
    this.createWorldTextures();
    this.createLightTextures();

    this.scene.start('MenuScene');
  }

  makeCanvasTexture(key, width, height, draw) {
    if (this.textures.exists(key)) this.textures.remove(key);
    const canvasTexture = this.textures.createCanvas(key, width, height);
    const ctx = canvasTexture.getContext();
    draw(ctx, width, height);
    canvasTexture.refresh();
  }

  createFlameTextures() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Llama exterior
    graphics.fillStyle(0xff7b2e, 1);
    graphics.fillCircle(18, 32, 14);
    graphics.fillTriangle(18, 1, 33, 33, 3, 33);

    // Núcleo
    graphics.fillStyle(0xffc25e, 1);
    graphics.fillCircle(18, 34, 9);
    graphics.fillTriangle(18, 12, 27, 35, 9, 35);

    // Corazón claro
    graphics.fillStyle(0xfff1c9, 0.95);
    graphics.fillCircle(18, 37, 4.5);

    graphics.generateTexture('flame', 36, 50);
    graphics.destroy();

    // Llama pequeña para antorchas y HUD
    const small = this.make.graphics({ x: 0, y: 0, add: false });
    small.fillStyle(0xffa53d, 1);
    small.fillCircle(10, 19, 8);
    small.fillTriangle(10, 1, 19, 20, 1, 20);
    small.fillStyle(0xffe2a3, 1);
    small.fillCircle(10, 21, 4);
    small.generateTexture('flame-small', 20, 30);
    small.destroy();
  }

  createCharacterTextures() {
    // Apagado: silueta con ojos rojos.
    const shade = this.make.graphics({ x: 0, y: 0, add: false });
    shade.fillStyle(0x070b10, 0.98);
    shade.fillCircle(22, 22, 15);
    shade.fillTriangle(5, 38, 39, 38, 22, 8);
    shade.fillStyle(0x111b24, 1);
    shade.fillCircle(22, 20, 11);
    shade.fillStyle(0xff5c5c, 1);
    shade.fillCircle(16, 20, 2.6);
    shade.fillCircle(28, 20, 2.6);
    shade.fillStyle(0x000000, 1);
    shade.fillCircle(16.8, 20.4, 1.1);
    shade.fillCircle(28.8, 20.4, 1.1);
    shade.generateTexture('shade', 44, 40);
    shade.destroy();
  }

  createPropTextures() {
    // Astilla
    const fuel = this.make.graphics({ x: 0, y: 0, add: false });
    fuel.fillStyle(0x5b3a22, 1);
    fuel.fillRoundedRect(1, 2, 22, 12, 4);
    fuel.fillStyle(0x8a5c33, 1);
    fuel.fillRoundedRect(3, 3, 18, 5, 2);
    fuel.fillStyle(0xd99a55, 0.8);
    fuel.fillRect(6, 5, 4, 2);
    fuel.fillRect(13, 4, 3, 2);
    fuel.generateTexture('fuel', 24, 16);
    fuel.destroy();

    // Recuerdo
    const memory = this.make.graphics({ x: 0, y: 0, add: false });
    memory.fillStyle(0x9be7ff, 0.35);
    memory.fillCircle(15, 17, 14);
    memory.fillStyle(0x5fc7e8, 1);
    memory.beginPath();
    memory.moveTo(15, 2);
    memory.lineTo(27, 16);
    memory.lineTo(15, 32);
    memory.lineTo(3, 16);
    memory.closePath();
    memory.fillPath();
    memory.fillStyle(0xd8f6ff, 1);
    memory.beginPath();
    memory.moveTo(15, 8);
    memory.lineTo(21, 16);
    memory.lineTo(15, 25);
    memory.lineTo(9, 16);
    memory.closePath();
    memory.fillPath();
    memory.generateTexture('memory', 30, 34);
    memory.destroy();

    // Antorcha
    const torch = this.make.graphics({ x: 0, y: 0, add: false });
    torch.fillStyle(0x2a211a, 1);
    torch.fillRect(8, 18, 5, 40);
    torch.fillStyle(0x4a3826, 1);
    torch.fillRect(9, 18, 2, 40);
    torch.fillStyle(0x3a2c20, 1);
    torch.fillRoundedRect(3, 10, 15, 10, 3);
    torch.fillStyle(0x6b4a2a, 1);
    torch.fillRoundedRect(4, 11, 13, 4, 2);
    torch.generateTexture('torch', 21, 58);
    torch.destroy();

    // Chispa
    const spark = this.make.graphics({ x: 0, y: 0, add: false });
    spark.fillStyle(0xffb648, 0.35);
    spark.fillCircle(9, 9, 9);
    spark.fillStyle(0xffd27a, 1);
    spark.fillCircle(9, 9, 4.5);
    spark.fillStyle(0xfff8e2, 1);
    spark.fillCircle(9, 9, 2);
    spark.generateTexture('spark', 18, 18);
    spark.destroy();

    // Puerta / santuario
    const gate = this.make.graphics({ x: 0, y: 0, add: false });
    gate.fillStyle(0x1a2530, 1);
    gate.fillRoundedRect(2, 12, 96, 138, { tl: 46, tr: 46, bl: 2, br: 2 });
    gate.lineStyle(4, 0x33465a, 1);
    gate.strokeRoundedRect(6, 16, 88, 134, { tl: 42, tr: 42, bl: 2, br: 2 });
    gate.fillStyle(0x081018, 1);
    gate.fillRoundedRect(18, 32, 64, 118, { tl: 30, tr: 30, bl: 2, br: 2 });
    gate.lineStyle(3, 0xf2a93b, 0.85);
    gate.strokeCircle(50, 76, 14);
    gate.fillStyle(0xf2a93b, 0.9);
    gate.fillCircle(50, 76, 5);
    gate.generateTexture('gate', 100, 152);
    gate.destroy();

    // Primer Fuego
    const beacon = this.make.graphics({ x: 0, y: 0, add: false });
    beacon.fillStyle(0x241a13, 1);
    beacon.fillRoundedRect(14, 116, 72, 44, 8);
    beacon.fillStyle(0x4a3524, 1);
    beacon.fillRoundedRect(20, 120, 60, 10, 4);
    beacon.fillStyle(0xff7b2e, 0.9);
    beacon.fillTriangle(50, 4, 78, 84, 22, 84);
    beacon.fillCircle(50, 92, 29);
    beacon.fillStyle(0xffc25e, 1);
    beacon.fillTriangle(50, 30, 68, 92, 32, 92);
    beacon.fillCircle(50, 98, 18);
    beacon.fillStyle(0xfff1c9, 1);
    beacon.fillCircle(50, 104, 9);
    beacon.generateTexture('beacon', 100, 162);
    beacon.destroy();
  }

  createWorldTextures() {
    // Piedra
    const stone = this.make.graphics({ x: 0, y: 0, add: false });
    stone.fillStyle(0x1b2731, 1);
    stone.fillRect(0, 0, 64, 32);
    stone.fillStyle(0x334453, 1);
    stone.fillRect(0, 0, 64, 3);
    stone.fillStyle(0x25333f, 1);
    stone.fillRect(0, 3, 64, 3);
    stone.fillStyle(0x141e26, 0.9);
    stone.fillRect(8, 12, 10, 2);
    stone.fillRect(36, 20, 14, 2);
    stone.fillRect(22, 27, 8, 2);
    stone.generateTexture('stone', 64, 32);
    stone.destroy();

    // Agua
    const water = this.make.graphics({ x: 0, y: 0, add: false });
    water.fillStyle(0x123842, 1);
    water.fillRect(0, 0, 64, 64);
    water.fillStyle(0x2a6f7a, 0.65);
    water.fillRect(0, 2, 64, 4);
    water.lineStyle(1, 0x6fd3dc, 0.35);
    for (let y = 14; y < 64; y += 14) {
      water.beginPath();
      water.moveTo(0, y);
      for (let x = 0; x <= 64; x += 8) {
        water.lineTo(x, y + Math.sin(x / 8) * 2);
      }
      water.strokePath();
    }
    water.generateTexture('water', 64, 64);
    water.destroy();

    // Fondo
    this.makeCanvasTexture('bg', GAME_WIDTH, GAME_HEIGHT, (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#03060c');
      gradient.addColorStop(0.55, '#08131d');
      gradient.addColorStop(1, '#10202a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 90; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.75;
        const radius = Math.random() * 1.4 + 0.3;
        ctx.fillStyle = `rgba(200, 225, 240, ${Math.random() * 0.25 + 0.05})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Montañas lejanas
    this.makeCanvasTexture('mountains-far', GAME_WIDTH, 320, (ctx, width, height) => {
      ctx.fillStyle = '#0a1620';
      ctx.beginPath();
      ctx.moveTo(0, height);
      const peaks = [0.12, 0.38, 0.22, 0.52, 0.3, 0.62, 0.4, 0.7, 0.5];
      peaks.forEach((peak, index) => {
        const x = (width / (peaks.length - 1)) * index;
        ctx.lineTo(x, height - height * peak);
      });
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    });

    // Montañas cercanas
    this.makeCanvasTexture('mountains-near', GAME_WIDTH, 240, (ctx, width, height) => {
      ctx.fillStyle = '#050d14';
      ctx.beginPath();
      ctx.moveTo(0, height);
      const peaks = [0.2, 0.42, 0.25, 0.55, 0.33, 0.68, 0.3, 0.48, 0.18];
      peaks.forEach((peak, index) => {
        const x = (width / (peaks.length - 1)) * index;
        ctx.lineTo(x, height - height * peak);
      });
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    });

    // Ráfaga de viento
    this.makeCanvasTexture('wind-streak', 96, 6, (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(190, 220, 235, 0)');
      gradient.addColorStop(0.5, 'rgba(190, 220, 235, 0.55)');
      gradient.addColorStop(1, 'rgba(190, 220, 235, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });
  }

  createLightTextures() {
    const makeRadial = (key, size, innerAlpha) => {
      this.makeCanvasTexture(key, size, size, (ctx, width) => {
        const center = width / 2;
        const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${innerAlpha})`);
        gradient.addColorStop(0.45, `rgba(255, 255, 255, ${innerAlpha * 0.72})`);
        gradient.addColorStop(0.75, `rgba(255, 255, 255, ${innerAlpha * 0.28})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, width);
      });
    };

    makeRadial('light-small', 240, 1);
    makeRadial('light-medium', 340, 1);
    makeRadial('light-large', 460, 1);
    makeRadial('light-torch', 420, 0.95);
    makeRadial('light-ambient', 720, 0.45);
    makeRadial('glow', 320, 0.8);
  }
}
