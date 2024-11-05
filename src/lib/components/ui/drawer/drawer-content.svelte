<script lang="ts">
    import DrawerOverlay from "./drawer-overlay.svelte";
    import {Drawer as DrawerPrimitive} from "vaul-svelte";
    import {cn} from "$lib/utils.js";

    type $$Props = DrawerPrimitive.ContentProps & { disableDrag: boolean };

    let className: $$Props["class"] = undefined;
    let disableDrag: $$Props["disableDrag"] = false;

    if(disableDrag){
        $$restProps["data-vaul-no-drag"] = true;
    }

    export {className as class, disableDrag};
</script>

<DrawerPrimitive.Portal>
    <DrawerOverlay/>
    <DrawerPrimitive.Content
            class={cn(
			"bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border",
			className
		)}
            {...$$restProps}
    >
        {#if !disableDrag}
            <div class="bg-muted mx-auto mt-4 h-2 w-[100px] rounded-full"></div>
        {/if}
        <slot/>
    </DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
