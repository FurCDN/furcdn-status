import 'server-only';

import { cookies, headers } from 'next/headers';

import {
  DEFAULT_LOCALE,
  LOCALES,
  pickLocaleFromAcceptLanguage,
} from './i18n';

export const LOCALE_COOKIE = 'furcdn_locale';

export async function getLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale)) return cookieLocale;

  const headerList = await headers();
  const detected = pickLocaleFromAcceptLanguage(
    headerList.get('accept-language'),
  );
  return detected || DEFAULT_LOCALE;
}
