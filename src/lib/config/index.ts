import General from '../../main/Tabs/General.svelte';
import Network from '../../main/Tabs/Network.svelte';
import Settings from '../../main/Tabs/Settings.svelte';
import type { ComponentProps } from 'svelte';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NavElements = { [key: string]: { label: string; component: ComponentProps<any> } };
export const navElements: NavElements = {
  general: { label: 'general', component: General },
  wifi: { label: 'network', component: Network },
  settings: { label: 'streaming', component: Settings },
};

const navElementsEntries = Object.entries(navElements);

export const defaultNavElement = {
  [navElementsEntries[1][0]]: {
    label: navElementsEntries[1][1].label,
    component: navElementsEntries[1][1].component,
  },
};

export const siteName = 'CERABOX';
