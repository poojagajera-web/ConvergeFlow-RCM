/**
 * "Site ready" signal from the Preloader. Hero intros wait for it so they play
 * as the loading screen lifts instead of underneath it. Callbacks also fire
 * after a timeout, so an intro can never stay hidden if the loader fails.
 */
let ready = false;
const waiting = new Set<() => void>();

export function markSiteReady() {
  if (ready) return;
  ready = true;
  waiting.forEach((cb) => cb());
  waiting.clear();
}

/** Runs `cb` once the site is ready (immediately if it already is). Returns a cancel function. */
export function onSiteReady(cb: () => void, failsafeMs = 7000) {
  if (ready) {
    cb();
    return () => {};
  }
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    waiting.delete(run);
    cb();
  };
  const timer = window.setTimeout(run, failsafeMs);
  waiting.add(run);
  return () => {
    done = true;
    window.clearTimeout(timer);
    waiting.delete(run);
  };
}
