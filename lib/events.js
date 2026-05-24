export const events = [
  {
    date: '2026-05-24',
    title: '系統升級',
    description: '此次系統升級停機時間爲 10 分鐘，已接入的網站不受影響。',
  },
];

export function getEvents() {
  return [...events].sort((a, b) => b.date.localeCompare(a.date));
}
