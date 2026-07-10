import 'server-only';

import { cookies, headers } from 'next/headers';

import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  pickLocaleFromAcceptLanguage,
} from './i18n';

export const LOCALE_COOKIE = 'furcdn_locale';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  const headerList = await headers();
  const detected = pickLocaleFromAcceptLanguage(
    headerList.get('accept-language'),
  );
  return detected || DEFAULT_LOCALE;
}
