<script lang="ts">
    import {toast} from 'svelte-sonner';
    import {Toaster} from '$lib/components/ui/sonner';
    import {NotificationsMessages} from '$lib/stores/websocket-store';
    import MainNav from "./MainNav.svelte";
    import ModeToggle from "$lib/components/ui/mode-toggle.svelte";
    import MobileNav from "./MobileNav.svelte";
    import type {NotificationType} from "$lib/types/socket-messages";


    $effect(() => {
        NotificationsMessages.subscribe((notifications) => {
            notifications.show.forEach((notification) => {

                    toast[notification.type as NotificationType](notification.name.toUpperCase(), {
                        description: notification.msg,
                        duration: notification.duration * 1500,
                    });
            });
        });
    });

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

<Toaster richColors></Toaster>
