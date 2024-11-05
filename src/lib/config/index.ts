import General from '../../main/Tabs/General.svelte';
import Network from '../../main/Tabs/Network.svelte';
import Settings from '../../main/Tabs/Settings.svelte';
import type { ComponentProps } from 'svelte';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NavElements = { [key: string]: { label: string; component: ComponentProps<any> } };
export const navElements: NavElements = {
  general: { label: 'General', component: General },
  wifi: { label: 'Network', component: Network },
  settings: { label: 'Settings', component: Settings },
};

const navElementsEntries = Object.entries(navElements);

export const defaultNavElement = {
  [navElementsEntries[2][0]]: {
    label: navElementsEntries[2][1].label,
    component: navElementsEntries[2][1].component,
  },
};

export const siteName = 'CeraBOX';
