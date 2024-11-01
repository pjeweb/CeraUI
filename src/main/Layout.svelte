<script lang="ts">
    import {toast} from 'svelte-sonner';
    import {Toaster} from '$lib/components/ui/sonner';
    import {AuthMessages, NotificationsMessages, sendAuthMessage} from '$lib/stores/websocket-store';
    import Main from "./MainView.svelte";

    import type {NotificationType} from "$lib/types/socket-messages";
    import Auth from "./Auth.svelte";
    import {authStatusStore} from "$lib/stores/auth-status";

    let authStatus = $state(false)
    let isCheckingAuthStatus = $state(true)

    $effect(()=>{
        const auth = localStorage.getItem('auth');
        if (auth) {
            sendAuthMessage(auth, true, ()=>{
                isCheckingAuthStatus = false;
            })
        } else {
            isCheckingAuthStatus = false
        }

    })


    $effect(() => {

        AuthMessages.subscribe(message => {
            if (message?.success) {
                isCheckingAuthStatus = false
                toast.success('AUTH', {
                    duration: 5000,
                    description: 'Successfully authenticated',
                })
                authStatusStore.set(true)
            }
        })

        $effect(() => {
            authStatusStore.subscribe(status => {
                authStatus = status
            })
        })

        NotificationsMessages.subscribe((notifications) => {
            notifications?.show?.forEach((notification) => {
                toast[notification.type as NotificationType](notification.name.toUpperCase(), {
                    description: notification.msg,
                    duration: notification.duration * 1500,
                });
            });
        });
    });

</script>
{#if authStatus}
    <Main></Main>
{:else if !isCheckingAuthStatus}
    <Auth></Auth>
{/if}

<Toaster richColors></Toaster>
