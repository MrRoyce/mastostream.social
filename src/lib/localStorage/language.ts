const KEY = 'utLanguage'

export const setLanguage = (language: string) => localStorage.setItem(KEY, language)

export const getLanguage = () => localStorage.getItem(KEY)

export const clearLanguage = () => localStorage.removeItem(KEY)