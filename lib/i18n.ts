export const LOCALES = ['zh-Hant', 'yue', 'en', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'zh-Hant';

export const LOCALE_LABELS: Record<Locale, string> = {
  'zh-Hant': '繁體中文',
  yue: '粵語',
  en: 'English',
  ja: '日本語',
};

export const INTL_LOCALES: Record<Locale, string> = {
  'zh-Hant': 'zh-Hant',
  yue: 'zh-Hant-HK',
  en: 'en-US',
  ja: 'ja-JP',
};

export const DATE_LOCALES: Record<Locale, string> = {
  'zh-Hant': 'en-US',
  yue: 'en-US',
  en: 'en-US',
  ja: 'ja-JP',
};

export interface Dict {
  overall: {
    up: string;
    down_partial: string;
    down_major: string;
    paused: string;
    unable: string;
  };
  monitor: Record<
    'Operational' | 'Degraded' | 'Down' | 'Paused' | 'Pending' | 'Unknown',
    string
  >;
  noMonitors: string;
  eventsTitle: string;
  daysAgo: (n: number) => string;
  today: string;
  days: (n: number) => string;
  autoRefresh: (s: number) => string;
  poweredBy: string;
  copyright: string;
  langMenuLabel: string;
  tgChannel: string;
  monitorsTitle: string;
  upOfTotal: (up: number, total: number) => string;
  uptimeWindow: (n: number) => string;
  affected: string;
  otherGroup: string;
  showAll: (n: number) => string;
  showLess: string;
  updatedLabel: string;
  bar: {
    noIncidents: string;
    brief: string;
    outage: string;
    noData: string;
    downtime: string;
  };
}

const dictionaries: Record<Locale, Dict> = {
  'zh-Hant': {
    overall: {
      up: '所有系統運作正常',
      down_partial: '部分服務中斷',
      down_major: '重大服務中斷',
      paused: '所有監控暫停',
      unable: '無法載入狀態',
    },
    monitor: {
      Operational: '正常',
      Degraded: '降級',
      Down: '中斷',
      Paused: '暫停',
      Pending: '待中',
      Unknown: '未知',
    },
    noMonitors: '目前沒有監控項目',
    eventsTitle: '事件記錄',
    daysAgo: (n) => `${n} 天前`,
    today: '今日',
    days: (n) => `${n} 天`,
    autoRefresh: (s) => `自動更新 ${s} 秒`,
    poweredBy: '技術支援',
    copyright: '版權所有',
    langMenuLabel: '語言',
    tgChannel: 'Telegram 頻道 @FurCDN（更即時的訊息）',
    monitorsTitle: '監控項目',
    upOfTotal: (up, total) => `${up}/${total} 項正常`,
    uptimeWindow: (n) => `${n} 天可用率`,
    affected: '受影響的項目',
    otherGroup: '其他',
    showAll: (n) => `顯示全部 ${n} 則`,
    showLess: '收合',
    updatedLabel: '更新於',
    bar: {
      noIncidents: '沒有事件',
      brief: '短暫異常',
      outage: '服務中斷',
      noData: '沒有監控資料',
      downtime: '停機',
    },
  },
  yue: {
    overall: {
      up: '所有系統運作正常',
      down_partial: '部分服務中斷',
      down_major: '重大服務中斷',
      paused: '所有監控暫停咗',
      unable: '載入唔到狀態',
    },
    monitor: {
      Operational: '正常',
      Degraded: '降級',
      Down: '中斷',
      Paused: '暫停',
      Pending: '待中',
      Unknown: '未知',
    },
    noMonitors: '而家未有任何監控項目',
    eventsTitle: '事件記錄',
    daysAgo: (n) => `${n} 日前`,
    today: '今日',
    days: (n) => `${n} 日`,
    autoRefresh: (s) => `自動更新 ${s} 秒`,
    poweredBy: '技術支援',
    copyright: '版權所有',
    langMenuLabel: '語言',
    tgChannel: 'Telegram 頻道 @FurCDN（即時消息）',
    monitorsTitle: '監控項目',
    upOfTotal: (up, total) => `${up}/${total} 項正常`,
    uptimeWindow: (n) => `${n} 日可用率`,
    affected: '受影響嘅項目',
    otherGroup: '其他',
    showAll: (n) => `睇晒全部 ${n} 則`,
    showLess: '收埋',
    updatedLabel: '更新於',
    bar: {
      noIncidents: '冇事件',
      brief: '短暫異常',
      outage: '服務中斷',
      noData: '冇監控資料',
      downtime: '停機',
    },
  },
  en: {
    overall: {
      up: 'All systems operational',
      down_partial: 'Partial outage',
      down_major: 'Major outage',
      paused: 'All monitors paused',
      unable: 'Unable to load status',
    },
    monitor: {
      Operational: 'Operational',
      Degraded: 'Degraded',
      Down: 'Down',
      Paused: 'Paused',
      Pending: 'Pending',
      Unknown: 'Unknown',
    },
    noMonitors: 'No monitors configured.',
    eventsTitle: 'Event log',
    daysAgo: (n) => `${n}d ago`,
    today: 'Today',
    days: (n) => `${n}d`,
    autoRefresh: (s) => `auto-refresh ${s}s`,
    poweredBy: 'Powered by',
    copyright: 'All rights reserved.',
    langMenuLabel: 'Language',
    tgChannel: 'Telegram channel @FurCDN (real-time updates)',
    monitorsTitle: 'Monitors',
    upOfTotal: (up, total) => `${up}/${total} operational`,
    uptimeWindow: (n) => `${n}-day uptime`,
    affected: 'Affected',
    otherGroup: 'Other',
    showAll: (n) => `Show all ${n}`,
    showLess: 'Show less',
    updatedLabel: 'Updated',
    bar: {
      noIncidents: 'No incidents',
      brief: 'Brief incident',
      outage: 'Outage',
      noData: 'No data',
      downtime: 'Downtime',
    },
  },
  ja: {
    overall: {
      up: 'すべてのシステムは正常です',
      down_partial: '一部で障害が発生しています',
      down_major: '重大な障害が発生しています',
      paused: 'すべての監視が一時停止中',
      unable: 'ステータスを読み込めません',
    },
    monitor: {
      Operational: '正常',
      Degraded: '低下',
      Down: '停止',
      Paused: '一時停止',
      Pending: '保留中',
      Unknown: '不明',
    },
    noMonitors: '監視対象がありません。',
    eventsTitle: 'イベント履歴',
    daysAgo: (n) => `${n}日前`,
    today: '今日',
    days: (n) => `${n}日`,
    autoRefresh: (s) => `自動更新 ${s}秒`,
    poweredBy: 'Powered by',
    copyright: 'All rights reserved.',
    langMenuLabel: '言語',
    tgChannel: 'Telegram チャンネル @FurCDN（リアルタイム更新）',
    monitorsTitle: '監視項目',
    upOfTotal: (up, total) => `${up}/${total} 正常`,
    uptimeWindow: (n) => `${n}日間の稼働率`,
    affected: '影響を受けた項目',
    otherGroup: 'その他',
    showAll: (n) => `すべて表示（${n} 件）`,
    showLess: '折りたたむ',
    updatedLabel: '更新',
    bar: {
      noIncidents: '障害なし',
      brief: '短時間の障害',
      outage: '障害発生',
      noData: 'データなし',
      downtime: 'ダウンタイム',
    },
  },
};

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}

export function normalizeLocale(raw: string | null | undefined): Locale | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.startsWith('yue') || lower === 'zh-hk' || lower.startsWith('zh-hk-')) {
    return 'yue';
  }
  if (lower.startsWith('zh')) return 'zh-Hant';
  if (lower.startsWith('ja')) return 'ja';
  if (lower.startsWith('en')) return 'en';
  return null;
}

export function pickLocaleFromAcceptLanguage(
  header: string | null | undefined,
): Locale | null {
  if (!header) return null;
  const entries = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? parseFloat(qParam.split('=')[1]) : 1;
      return { tag: tag.trim(), q: Number.isFinite(q) ? q : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of entries) {
    const match = normalizeLocale(tag);
    if (match) return match;
  }
  return null;
}
