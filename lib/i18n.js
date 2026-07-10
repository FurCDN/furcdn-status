export const LOCALES = ['zh-Hant', 'yue', 'en', 'ja'];
export const DEFAULT_LOCALE = 'zh-Hant';

export const LOCALE_LABELS = {
  'zh-Hant': '繁體中文',
  yue: '粵語',
  en: 'English',
  ja: '日本語',
};

export const INTL_LOCALES = {
  'zh-Hant': 'zh-Hant',
  yue: 'zh-Hant-HK',
  en: 'en-US',
  ja: 'ja-JP',
};

export const DATE_LOCALES = {
  'zh-Hant': 'en-US',
  yue: 'en-US',
  en: 'en-US',
  ja: 'ja-JP',
};

const dictionaries = {
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
    drivenBy: '驅動',
    copyright: '版權所有',
    langMenuLabel: '語言',
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
    drivenBy: '驅動',
    copyright: '版權所有',
    langMenuLabel: '語言',
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
    drivenBy: 'Driven by',
    copyright: 'All rights reserved.',
    langMenuLabel: 'Language',
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
    drivenBy: 'Driven by',
    copyright: 'All rights reserved.',
    langMenuLabel: '言語',
  },
};

export function getDict(locale) {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}

export function normalizeLocale(raw) {
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

export function pickLocaleFromAcceptLanguage(header) {
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
