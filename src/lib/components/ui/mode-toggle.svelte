<script lang="ts">
import { resetMode, setMode } from 'mode-watcher';
import { get } from 'svelte/store';
import Moon from 'svelte-radix/Moon.svelte';
import Sun from 'svelte-radix/Sun.svelte';
import { Button } from '$lib/components/ui/button/index.js';
import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
import { themeStore } from '$lib/stores/theme';

let theme = get(themeStore);

const handleModeChange = (mode: 'light' | 'dark' | 'system') => {
  if (theme === 'system') {
    resetMode();
  } else {
    setMode(mode);
  }
  themeStore.set(mode);
};

handleModeChange(theme);
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="ghost" class="h-8 w-8 px-0" title="Change theme">
      <Sun class="dark:-roate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0" />
      <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span class="sr-only">Toggle theme</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item on:click={() => handleModeChange('light')}>Light</DropdownMenu.Item>
    <DropdownMenu.Item on:click={() => handleModeChange('dark')}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item on:click={() => handleModeChange('system')}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
