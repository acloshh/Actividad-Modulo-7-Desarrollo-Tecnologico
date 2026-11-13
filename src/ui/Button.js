import Phaser from 'phaser';
import { audio } from '../systems/AudioSystem.js';

/**
 * Botón reutilizable para menú, derrota y victoria.
 */
export function createButton(scene, x, y, label, onClick, options = {}) {
  const width = options.width ?? 260;
  const height = options.height ?? 60;

  const container = scene.add.container(x, y);
  const background = scene.add
    .rectangle(0, 0, width, height, 0x152430, 0.96)
    .setStrokeStyle(2, 0xf2a93b, 0.65);
  const text = scene.add
    .text(0, 0, label, {
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      fontSize: options.fontSize ?? '24px',
      color: '#f4e6cf',
      fontStyle: 'bold'
    })
    .setOrigin(0.5);

  container.add([background, text]);
  container.setSize(width, height);
  container.setInteractive(
    new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
    Phaser.Geom.Rectangle.Contains
  );
  if (container.input) container.input.cursor = 'pointer';

  container.on('pointerover', () => {
    background.setFillStyle(0x22384a, 1);
    background.setStrokeStyle(2, 0xffd27a, 1);
    text.setColor('#ffd27a');
    scene.tweens.add({ targets: container, scale: 1.03, duration: 120 });
  });

  container.on('pointerout', () => {
    background.setFillStyle(0x152430, 0.96);
    background.setStrokeStyle(2, 0xf2a93b, 0.65);
    text.setColor('#f4e6cf');
    scene.tweens.add({ targets: container, scale: 1, duration: 120 });
  });

  container.on('pointerdown', () => {
    audio.unlock();
    audio.play('click');
    onClick();
  });

  return container;
}
