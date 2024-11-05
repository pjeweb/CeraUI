<script lang="ts">
import { mode } from 'mode-watcher';
import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';

type $$Props = SonnerProps;
</script>

<Sonner
  theme={$mode}
  class="toaster group"
  toastOptions={{
    classes: {
      toast:
        'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
      description: 'group-[.toast]:text-muted-foreground',
      actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
      cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
      error: 'group-[.toaster]:text-red-500',
      success: 'group-[.toaster]:text-green-500',
      warning: 'group-[.toaster]:text-yellow-500',
      info: 'group-[.toaster]:text-blue-500',
    },
  }}
  {...$$restProps} />
