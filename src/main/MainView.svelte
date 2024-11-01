<script lang="ts">
    import MainNav from "./MainNav.svelte";
    import ModeToggle from "$lib/components/ui/mode-toggle.svelte";
    import MobileNav from "./MobileNav.svelte";
    import Navigation from "$lib/stores/navigation";
    import {capitalizeFirstLetter} from "$lib/utils.js";
    import General from "./tabs/General.svelte";

    let CurrentTab: string = $state(undefined)

    $effect(() => {
        Navigation.subscribe(currentTab => {
            CurrentTab = capitalizeFirstLetter(currentTab);
        })
    })
</script>

<header
        class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
>
    <div class="container flex h-14 max-w-screen-2xl items-center">
        <MainNav/>
        <MobileNav/>
        <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div class="w-full flex-1 md:w-auto md:flex-none">
            </div>
            <nav class="flex items-center">
                <ModeToggle/>
            </nav>
        </div>

    </div>

</header>
<div>
<General></General>
</div>
