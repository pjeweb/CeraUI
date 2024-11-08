import { type DefinedLocales, existingLocales } from '../../i18n';
import { writable } from '@macfja/svelte-persistent-store';

const localeStore = writable<DefinedLocales[number]>('locale', existingLocales[0]);

export { localeStore };
