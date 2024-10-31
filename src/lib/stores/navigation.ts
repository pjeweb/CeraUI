import { writable } from 'svelte/store';

const navigationStore = writable<string>('general');

export default navigationStore;
