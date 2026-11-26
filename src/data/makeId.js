// A unique id for each subject and session.
// crypto.randomUUID() only works on https:// or localhost, so when you
// test on your phone over Wi-Fi (http://192.168...) we use a fallback.
export function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}
