export const events = [
  {
    date: '2026-07-09',
    title: 'OVH VPS 維護導致停機',
    description: 'OVH 機房電力與冷卻基礎設施維護導致 VPS 重啟，停機約 1 小時 1 分鐘。',
  },
  {
    date: '2026-07-08',
    title: '控制面板遷移',
    description: '控制面板遷移完成，停機約 5 分鐘，已接入的網站不受影響。',
  },
  {
    date: '2026-06-14',
    title: '遭受 CC 攻擊',
    description: '我們控制面板遭受 30M+ CC 攻擊，停機約 10 分鐘，已接入的網站不受影響。',
  },
  {
    date: '2026-05-24',
    title: '系統升級',
    description: '此次系統升級停機時間爲 10 分鐘，已接入的網站不受影響。',
  },
];

export function getEvents() {
  return [...events].sort((a, b) => b.date.localeCompare(a.date));
}
