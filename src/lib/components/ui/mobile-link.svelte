<script lang="ts">
    import {cn} from "$lib/utils.js";

    let className: string | undefined | null = undefined;
    export {className as class};

</script>

<button
        id={$$props.identifier}
        class={"py-2 " + cn($$props.isActive ? "text-primary font-medium bg-muted" : "text-foreground/60", className)}
        {...$$restProps}
>
    <slot/>
</button>
