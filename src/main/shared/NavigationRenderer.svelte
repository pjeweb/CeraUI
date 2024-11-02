<script lang="ts">
    import {navigationStore} from "$lib/stores/navigation";
    import type {SvelteComponent} from "svelte";


    let CurrentComponent: SvelteComponent | undefined = $state(undefined)

    $effect(() => {
        navigationStore.subscribe(tab => {
            if (tab) {
                CurrentComponent = Object.values(tab)[0].component
            }

        })
    })
</script>

<div class="container relative pb-10 pt-10">
    {#if CurrentComponent}
        <CurrentComponent/>
    {/if}
</div>
