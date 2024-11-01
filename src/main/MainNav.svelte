<script lang="ts">
    import {cubicInOut} from "svelte/easing";
    import {crossfade} from "svelte/transition";
    import {navElements, siteName} from "$lib/config"
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import {cn} from "$lib/utils";
    import navigationStore from "$lib/stores/navigation";
    import {Icons} from "$lib/components/icons";

    const [send, receive] = crossfade({
        duration: 250,
        easing: cubicInOut,
    });

    let currentIdentifier: string = $state('general')
    $effect(() => {
        navigationStore.subscribe((identifier) => {
            currentIdentifier = identifier;
        })
    })

</script>

<div class="mr-4 hidden md:flex">
    <button class="mr-6 flex items-center space-x-2" onclick={()=> navigationStore.set('general')}>
        <Icons.logo class="h-6 w-6"/>
        <span class="hidden font-bold xl:inline-block">
        {siteName}
        </span>
    </button>
    <ScrollArea orientation="both" scrollbarXClasses="invisible">
        <div
                class="m-4 flex items-center overflow-y-auto pb-3 md:pb-0">
            {#each navElements as tab, index (index)}
                {@const isActive = currentIdentifier === tab.identifier}
                <button onclick="{()=> navigationStore.set(tab.identifier)}"
                        id={tab.identifier}
                        data-sveltekit-noscroll
                        class={cn(
							"hover:text-primary relative flex h-9 items-center justify-center rounded-b-2xl px-4 text-center text-sm transition-colors min-w-36",
							isActive ? "text-primary font-medium" : "text-muted-foreground"
						)}
                >
                    {#if isActive}
                        <div
                                class="bg-muted absolute inset-0 rounded-2xl"
                                in:send={{ key: "activetab" }}
                                out:receive={{ key: "activetab" }}
                        ></div>
                    {/if}
                    <span class="relative">
                                {tab.name}
                            </span>
                </button>
            {/each}
        </div>
    </ScrollArea>
</div>
