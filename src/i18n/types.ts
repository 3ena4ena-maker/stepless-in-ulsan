export type Lang = 'KR' | 'EN' | 'JA' | 'ZH' | 'ES' | 'FR' | 'DE';

export type LocalizedText = Record<Lang, string>;

export interface LanguageOption {
  code: Lang;
  nativeName: string;
  shortLabel: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'KR', nativeName: '한국어', shortLabel: '한국어' },
  { code: 'EN', nativeName: 'English', shortLabel: 'English' },
  { code: 'JA', nativeName: '日本語', shortLabel: '日本語' },
  { code: 'ZH', nativeName: '中文', shortLabel: '中文' },
  { code: 'ES', nativeName: 'Español', shortLabel: 'Español' },
  { code: 'FR', nativeName: 'Français', shortLabel: 'Français' },
  { code: 'DE', nativeName: 'Deutsch', shortLabel: 'Deutsch' },
];

export type MultiLangRecord = {
  KR: string;
  EN: string;
} & Partial<Record<Exclude<Lang, 'KR' | 'EN'>, string>>;

export function pickLang(record: MultiLangRecord, lang: Lang): string {
  return record[lang] || record.EN || record.KR;
}
