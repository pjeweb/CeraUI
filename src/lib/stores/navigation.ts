import { writable } from 'svelte/store';
import { type NavElements, defaultNavElement } from '$lib/config';

const navigationStore = writable<NavElements>(defaultNavElement);

export { navigationStore };
