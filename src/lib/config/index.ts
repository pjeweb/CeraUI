import General from '../../main/Tabs/General.svelte';
import Network from '../../main/Tabs/Network.svelte';
import type { ComponentProps } from 'svelte';
import Settings from '../../main/Tabs/Settings.svelte';

export type NavElements = { [key: string]: { label: string; component: ComponentProps<any> } };
export const navElements: NavElements = {
  general: { label: 'General', component: General },
  wifi: { label: 'Network', component: Network },
  settings: { label: 'Settings', component: Settings },
};

const navElementsEntries = Object.entries(navElements);

export const defaultNavElement = {
  [navElementsEntries[0][0]]: {
    label: navElementsEntries[0][1].label,
    component: navElementsEntries[0][1].component,
  },
};

export const siteName = 'CeraBOX';
