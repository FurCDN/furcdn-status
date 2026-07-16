import type { Locale } from './i18n';

type LocalizedString = Record<Locale, string>;

export interface RawEvent {
  date: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface LocalizedEvent {
  date: string;
  title: string;
  description: string;
}

export const events: RawEvent[] = [
  {
    date: '2026-07-15',
    title: {
      'zh-Hant': '遭受 CC 攻擊',
      yue: '遭受 CC 攻擊',
      en: 'CC attack incident',
      ja: 'CC 攻撃を受けました',
    },
    description: {
      'zh-Hant':
        '我們控制面板遭受 100M+ CC 攻擊，停機約 1 小時，已接入的網站不受影響。',
      yue: '我哋嘅控制面板遭受 100M+ CC 攻擊，停機大約 1 個鐘，已經接入嘅網站唔受影響。',
      en: 'Our control panel was hit by a 100M+ CC attack. About 1 hour of downtime; onboarded sites were not affected.',
      ja: 'コントロールパネルが 100M+ の CC 攻撃を受けました。ダウンタイムは約 1 時間で、既に接続済みのサイトには影響ありません。',
    },
  },
  {
    date: '2026-07-09',
    title: {
      'zh-Hant': 'OVH 獨服維護導致停機',
      yue: 'OVH 獨服維護導致停機',
      en: 'Downtime caused by OVH dedicated server maintenance',
      ja: 'OVH 専用サーバーメンテナンスによるダウンタイム',
    },
    description: {
      'zh-Hant':
        'OVH 機房電力與冷卻基礎設施維護導致獨服重啟，停機約一小時，已接入的網站不受影響。',
      yue: 'OVH 機房嘅電力同冷卻設施維護令獨服重啟咗，停機大約一個鐘，已經接入嘅網站唔受影響。',
      en: 'OVH datacenter power and cooling infrastructure maintenance caused the dedicated server to reboot, resulting in about one hour of downtime. Onboarded sites were not affected.',
      ja: 'OVH データセンターの電源および冷却設備のメンテナンスにより専用サーバーが再起動し、約 1 時間のダウンタイムが発生しました。既に接続済みのサイトには影響ありません。',
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

export function getEvents(): RawEvent[] {
  return [...events].sort((a, b) => b.date.localeCompare(a.date));
}

function pickText(field: LocalizedString, locale: Locale): string {
  return field[locale] || field['zh-Hant'] || '';
}

export function localizeEvent(event: RawEvent, locale: Locale): LocalizedEvent {
  return {
    date: event.date,
    title: pickText(event.title, locale),
    description: pickText(event.description, locale),
  };
}
