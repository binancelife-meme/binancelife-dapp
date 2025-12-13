export const SUPPORTED_LOCALES = ['en', 'zh'];

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type Language = {
  code: keyof typeof SUPPORTED_LANGUAGES
  name: string
  short: string
  long: string
}

export const DEFAULT_LOCALE: SupportedLocale = 'zh'

// List of languages supported
export const SUPPORTED_LANGUAGES: Record<SupportedLocale, Language> = {
  zh: { code: 'zh', name: 'chinese', short: '中文', long: '中文' },
  en: { code: 'en', name: 'english', short: 'EN', long: 'English' },
}

// mapping of momentjs locales
export const MOMENTJS_LANGUAGES = {
  "en": "en",
  "zh": "zh-cn",
}

// import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/shared/types';
export type LocalePrefix = 'as-needed' | 'always' | 'never';

export const LOCALE_PREFIX: LocalePrefix = 'as-needed';