<script lang="ts">
import { existingLocales } from '../../../i18n';
import { get } from 'svelte/store';
import { locale } from 'svelte-i18n';
import * as Select from '$lib/components/ui/select';
import { localeStore } from '$lib/stores/locale';
const initialLocale = get(localeStore);

let selectedLocale = $state({ value: initialLocale.code, label: initialLocale.name });

locale.set(initialLocale.code);
const handleLocaleChange = (select: { value: string; label: string }) => {
  locale.set(select.value);
  localeStore.set(existingLocales.find(l => l.code === select.value)!);
  selectedLocale = select;
};
</script>

<Select.Root selected={selectedLocale} onSelectedChange={handleLocaleChange}>
  <Select.Trigger>
    <Select.Value></Select.Value>
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each existingLocales as locale}
        <Select.Item value={locale.code} label={locale.name}></Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
