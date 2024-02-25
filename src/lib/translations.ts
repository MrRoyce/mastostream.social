import i18n, { type Config } from 'sveltekit-i18n';

const config: Config<unknown> = {
  initLocale: 'en',
  loaders: [
    {
      locale: 'de',
      key: '',
      loader: async () => (await import('./lang/de.json')).default
    },
    {
      locale: 'en',
      key: '',
      loader: async () => (await import('./lang/en.json')).default
    },
    {
      locale: 'es',
      key: '',
      loader: async () => (await import('./lang/es.json')).default
    },
    {
      locale: 'fr',
      key: '',
      loader: async () => (await import('./lang/fr.json')).default
    },
    {
      locale: 'hi',
      key: '',
      loader: async () => (await import('./lang/hi.json')).default
    },
    {
      locale: 'ja',
      key: '',
      loader: async () => (await import('./lang/ja.json')).default
    },
    {
      locale: 'pt',
      key: '',
      loader: async () => (await import('./lang/pt.json')).default
    },
    {
      locale: 'sv',
      key: '',
      loader: async () => (await import('./lang/sv.json')).default
    },
    {
      locale: 'tl',
      key: '',
      loader: async () => (await import('./lang/tl.json')).default
    }
    // },
    // {
    //   locale: 'zu',
    //   key: '',
    //   loader: async () => (await import('./lang/zu.json')).default
    // }
  ]
};

export const { t, loading, locales, locale, initialized, translations, loadTranslations } =
  new i18n(config);
