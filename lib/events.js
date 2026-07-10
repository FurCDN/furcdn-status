export const events = [
  {
    date: '2026-07-09',
    title: {
      'zh-Hant': 'OVH VPS 維護導致停機',
      yue: 'OVH VPS 維護導致停機',
      en: 'Downtime caused by OVH VPS maintenance',
      ja: 'OVH VPS メンテナンスによるダウンタイム',
    },
    description: {
      'zh-Hant':
        'OVH 機房電力與冷卻基礎設施維護導致 VPS 重啟，停機約 1 小時 1 分鐘。',
      yue: 'OVH 機房嘅電力同冷卻設施維護令 VPS 重啟咗，停機大約 1 個鐘 1 分鐘。',
      en: 'OVH datacenter power and cooling infrastructure maintenance caused the VPS to reboot, resulting in about 1 hour 1 minute of downtime.',
      ja: 'OVH データセンターの電源および冷却設備のメンテナンスにより VPS が再起動し、約 1 時間 1 分のダウンタイムが発生しました。',
    },
  },
  {
    date: '2026-07-08',
    title: {
      'zh-Hant': '控制面板遷移',
      yue: '控制面板遷移',
      en: 'Control panel migration',
      ja: 'コントロールパネルの移行',
    },
    description: {
      'zh-Hant': '控制面板遷移完成，停機約 5 分鐘，已接入的網站不受影響。',
      yue: '控制面板遷移完成，停機大約 5 分鐘，已經接入嘅網站唔受影響。',
      en: 'Control panel migration completed with about 5 minutes of downtime. Onboarded sites were not affected.',
      ja: 'コントロールパネルの移行が完了しました。ダウンタイムは約 5 分間で、既に接続済みのサイトには影響ありません。',
    },
  },
  {
    date: '2026-06-14',
    title: {
      'zh-Hant': '遭受 CC 攻擊',
      yue: '遭受 CC 攻擊',
      en: 'CC attack incident',
      ja: 'CC 攻撃を受けました',
    },
    description: {
      'zh-Hant':
        '我們控制面板遭受 30M+ CC 攻擊，停機約 10 分鐘，已接入的網站不受影響。',
      yue: '我哋嘅控制面板遭受 30M+ CC 攻擊，停機大約 10 分鐘，已經接入嘅網站唔受影響。',
      en: 'Our control panel was hit by a 30M+ CC attack. About 10 minutes of downtime; onboarded sites were not affected.',
      ja: 'コントロールパネルが 30M+ の CC 攻撃を受けました。ダウンタイムは約 10 分間で、既に接続済みのサイトには影響ありません。',
    },
  },
  {
    date: '2026-05-24',
    title: {
      'zh-Hant': '系統升級',
      yue: '系統升級',
      en: 'System upgrade',
      ja: 'システムアップグレード',
    },
    description: {
      'zh-Hant': '此次系統升級停機時間爲 10 分鐘，已接入的網站不受影響。',
      yue: '今次系統升級停機大約 10 分鐘，已經接入嘅網站唔受影響。',
      en: 'System upgrade caused 10 minutes of downtime. Onboarded sites were not affected.',
      ja: '今回のシステムアップグレードによるダウンタイムは 10 分間で、既に接続済みのサイトには影響ありません。',
    },
  },
];

export function getEvents() {
  return [...events].sort((a, b) => b.date.localeCompare(a.date));
}

function pickText(field, locale) {
  if (typeof field === 'string') return field;
  if (!field) return '';
  return field[locale] || field['zh-Hant'] || Object.values(field)[0] || '';
}

export function localizeEvent(event, locale) {
  return {
    date: event.date,
    title: pickText(event.title, locale),
    description: pickText(event.description, locale),
  };
}
