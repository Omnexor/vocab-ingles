// One utterance at a time. Stale callbacks may never grade/unlock another card.
export function createGameAudio(host = globalThis) {
  let generation = 0, timer = null, current = null;
  const stop = () => {
    generation++;
    if (timer) host.clearTimeout(timer);
    timer = null;
    if (current) { current.onend = current.onerror = null; host.speechSynthesis?.cancel(); }
    current = null;
  };
  const play = (text, { slow = false, onComplete, onError } = {}) => {
    stop();
    const token = generation;
    if (!host.speechSynthesis || !host.SpeechSynthesisUtterance) { onError?.(); return; }
    try {
      host.speechSynthesis.cancel();
      const utterance = new host.SpeechSynthesisUtterance(text);
      current = utterance;
      utterance.lang = 'en-GB';
      utterance.rate = slow ? 0.7 : 1;
      const voice = host.speechSynthesis.getVoices().find(v => /^en[-_]GB/i.test(v.lang)) || host.speechSynthesis.getVoices().find(v => /^en[-_]/i.test(v.lang));
      if (voice) utterance.voice = voice;
      const finish = callback => {
        if (generation !== token) return;
        stop(); callback?.();
      };
      utterance.onend = () => finish(onComplete);
      utterance.onerror = () => finish(onError);
      timer = host.setTimeout(() => finish(onError), 20000);
      host.speechSynthesis.speak(utterance);
    } catch { if (generation === token) { stop(); onError?.(); } }
  };
  return { play, stop };
}
