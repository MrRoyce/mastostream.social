import i18n, { type Config } from 'sveltekit-i18n';

const files = import.meta.glob("./lang/*.json");
const fileNames = Object.keys(files).map((file) => {
  const fileName = file.replace('./lang/', '')
  return {
    lang: fileName.split('.')[0],
    fileName
  }
})

const loaders = fileNames.map((file) => {
  //const fileName =  // !! Needed to fix vite warning!
  return {
    locale: file.lang,
    key: '',
    loader: async () => (await import(`./lang/${file.fileName.replace('.json', '')}.json`)).default
  }
})

const config: Config<unknown> = {
  initLocale: 'en',
  loaders
};

export const { t, loading, locales, locale, initialized, translations, loadTranslations } =
  new i18n(config);
