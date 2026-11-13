import Phaser from 'phaser';
import { StateMachine } from '../patterns/StateMachine.js';

/**
 * Apagado: patrulla, persigue según el Calor del jugador y huye de la luz.
 */
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, data) {
    super(scene, data.x, data.y, 'shade');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.minX = data.minX;
    this.maxX = data.maxX;
    this.patrolTarget = data.maxX;
    this.stunnedUntil = 0;
    this.setDepth(19);
    this.setCollideWorldBounds(true);
    this.body.setSize(28, 32);
    this.body.setOffset(8, 6);
    this.setMaxVelocity(180, 800);

    this.fsm = new StateMachine(this, {
      patrol: {
        enter: (enemy) => {
          enemy.clearTint();
          enemy.setAlpha(0.92);
        },
        update: (enemy) => {
          if (enemy.x <= enemy.minX) enemy.patrolTarget = enemy.maxX;
          if (enemy.x >= enemy.maxX) enemy.patrolTarget = enemy.minX;
          const direction = Math.sign(enemy.patrolTarget - enemy.x) || 1;
          enemy.setVelocityX(direction * 46);
          enemy.setFlipX(direction < 0);
        }
      },
      chase: {
        enter: (enemy) => {
          enemy.setTint(0xffb0a0);
          enemy.setAlpha(1);
        },
        update: (enemy, _delta, timeInState) => {
          const direction = Math.sign(enemy.scene.player.x - enemy.x) || 1;
          const wobble = Math.sin(timeInState / 160) * 0.12;
          enemy.setVelocityX(direction * 120);
          enemy.setFlipX(direction < 0);
          enemy.setScale(1 + wobble);
          enemy.x = Phaser.Math.Clamp(enemy.x, enemy.minX, enemy.maxX);
        }
      },
      flee: {
        enter: (enemy) => {
          enemy.setTint(0x9fd8e6);
        },
        update: (enemy) => {
          const direction = Math.sign(enemy.x - enemy.scene.player.x) || 1;
          enemy.setVelocityX(direction * 96);
          enemy.setFlipX(direction < 0);
        }
      },
      stunned: {
        enter: (enemy) => {
          enemy.setVelocityX(0);
          enemy.setTint(0xfff1c9);
          enemy.setAlpha(0.65);
        },
        update: (enemy) => {
          enemy.setVelocityX(0);
        }
      }
    }, 'patrol');
  }

  stun(duration = 2000) {
    this.stunnedUntil = Math.max(this.stunnedUntil, this.scene.time.now + duration);
  }

  update(delta, player, heat, torches) {
    if (this.stunnedUntil > this.scene.time.now) {
      this.fsm.setState('stunned');
      this.fsm.update(delta);
      return;
    }

    if (this.fsm.is('stunned')) {
      this.fsm.setState('patrol');
    }

    const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

    const nearestLitTorch = torches
      .filter((torch) => torch.isLit)
      .map((torch) => ({ torch, distance: torch.distanceTo(this.x, this.y) }))
      .sort((a, b) => a.distance - b.distance)[0];

    if (nearestLitTorch && nearestLitTorch.distance < 145) {
      this.fsm.setState('flee');
    } else if (distanceToPlayer < heat.detectRadius && Math.abs(player.y - this.y) < 130) {
      this.fsm.setState('chase');
    } else {
      this.fsm.setState('patrol');
    }

    this.fsm.update(delta);
  }
}
