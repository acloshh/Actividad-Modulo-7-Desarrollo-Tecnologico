import { EventBus, EVENTS } from './EventBus.js';

export default class ScoreSystem {
  constructor(initialScore = 0) {
    this.score = initialScore;
    EventBus.emit(EVENTS.score, this.score);
  }

  add(points) {
    this.score += Math.max(0, Math.round(points));
    EventBus.emit(EVENTS.score, this.score);
    return this.score;
  }
}
