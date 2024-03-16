import { getLanguageList } from "./getLanguage";
import { locale } from '$lib/translations';

let defaultLanguage = 'en';

function getTargetLanguage(languageText: string) {
  const languages = getLanguageList();
  const result = languages.filter((language) => language.text === languageText);
  return result[0]?.value || 'en';
}

export const handleLocaleChange = (event: Event) => {
  event.preventDefault();
  defaultLanguage = getTargetLanguage(event?.target?.innerHTML || 'English');
  $locale = defaultLanguage;
}