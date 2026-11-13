/**
 * Máquina de estados finitos reutilizable (patrón State).
 * Cada estado puede implementar enter / update / exit.
 */
export class StateMachine {
  constructor(owner, states, initialState) {
    this.owner = owner;
    this.states = states;
    this.currentName = null;
    this.previousName = null;
    this.currentState = null;
    this.timeInState = 0;
    this.setState(initialState);
  }

  setState(name, payload) {
    const next = this.states[name];
    if (!next || name === this.currentName) return;

    if (this.currentState?.exit) {
      this.currentState.exit(this.owner);
    }

    this.previousName = this.currentName;
    this.currentName = name;
    this.currentState = next;
    this.timeInState = 0;

    if (next.enter) {
      next.enter(this.owner, payload, this.previousName);
    }
  }

  update(delta) {
    this.timeInState += delta;
    if (this.currentState?.update) {
      this.currentState.update(this.owner, delta, this.timeInState);
    }
  }

  is(name) {
    return this.currentName === name;
  }
}
