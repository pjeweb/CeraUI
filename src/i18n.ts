import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

export type DefinedLocales = Array<{ name: string; file: string; code: string }>;

export const existingLocales: DefinedLocales = [
  { name: 'English', file: './locale/en.json', code: 'en' },
  { name: 'Français', file: './locale/fr.json', code: 'fr' },
  { name: 'Português', file: './locale/pt-BR.json', code: 'pt-BR' },
  { name: 'Español', file: './locale/es.json', code: 'es' },
];
export async function setupLocale() {
  existingLocales.forEach(loc => {
    register(loc.code, () => import(loc.file));
  });
  return await Promise.allSettled([
    init({
      fallbackLocale: 'en',
      initialLocale: getLocaleFromNavigator(),
    }),
  ]);
}
