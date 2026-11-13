const BEST_SCORE_KEY = 'brasa:best-score';

export function getBestScore() {
  const raw = Number.parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10);
  return Number.isFinite(raw) ? raw : 0;
}

export function saveBestScore(score) {
  if (score > getBestScore()) {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
    return true;
  }
  return false;
}
