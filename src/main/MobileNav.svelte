<script lang="ts">
    import {Icons} from "$lib/components/icons";
    import MobileLink from "$lib/components/ui/mobile-link.svelte";
    import * as Sheet from "$lib/components/ui/sheet";
    import {navElements, siteName} from "$lib/config";
    import {Button} from "$lib/components/ui/button";
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import navigationStore from "$lib/stores/navigation";

    let currentIdentifier: string = $state('general')
    $effect(() => {
        navigationStore.subscribe((identifier) => {
            currentIdentifier = identifier;
        })
    })

    let open = $state(false);

    const handleClick = (identifier: string) => {
        navigationStore.set(identifier)
        open = false
    }

</script>

<Sheet.Root bind:open>
    <Sheet.Trigger asChild let:builder>
        <Button
                builders={[builder]}
                variant="ghost"
                class="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
            <Icons.Hamburger class="h-5 w-5"/>
            <span class="sr-only">Toggle Menu</span>
        </Button>
    </Sheet.Trigger>
    <Sheet.Content side="left" class="pr-0">
        <MobileLink identifier="general" class="flex items-center" onclick="()=>handleClick('general')">
            <Icons.logo class="mr-2 h-4 w-4"/>
            <span class="font-bold">{siteName}</span>
        </MobileLink>
        <ScrollArea orientation="both" class="my-4 h-[calc(100vh-8rem)] pb-10">
            <div class="flex flex-col space-y-3 pr-6">
                {#each navElements as navItem, index (navItem + index.toString())}
                    {@const isActive = currentIdentifier === navItem.identifier}
                    {#if navItem.identifier}
                        <MobileLink identifier={navItem.identifier} {isActive}
                                    onclick={()=>handleClick(navItem.identifier)}>
                            {navItem.name}
                        </MobileLink>
                    {/if}
                {/each}
            </div>
        </ScrollArea>
    </Sheet.Content>
</Sheet.Root>
