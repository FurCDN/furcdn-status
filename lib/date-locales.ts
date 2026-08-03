import type { Locale as DateFnsLocale } from 'date-fns';
import { enUS, ja } from 'date-fns/locale';
import type { Locale } from './i18n';

/**
 * Dates stay in en-US for the Chinese UIs, matching DATE_LOCALES in i18n.ts.
 */
export const DATE_FNS_LOCALES: Record<Locale, DateFnsLocale> = {
  'zh-Hant': enUS,
  yue: enUS,
  en: enUS,
  ja,
};
