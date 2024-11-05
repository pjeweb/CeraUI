<script lang="ts">
    import Auth from "./Auth.svelte";
    import Main from "./MainView.svelte";
    import {toast} from 'svelte-sonner';
    import type {NotificationType, StatusMessage} from "$lib/types/socket-messages";
    import {Toaster} from '$lib/components/ui/sonner';
    import UpdatingOverlay from "$lib/components/updating-overlay.svelte"
    import {authStatusStore} from "$lib/stores/auth-status";
    import {AuthMessages, NotificationsMessages, StatusMessages, sendAuthMessage} from '$lib/stores/websocket-store';


    let authStatus = $state(false)
    let isCheckingAuthStatus = $state(true)
    let updatingStatus: StatusMessage['updating'] = $state(false)

    $effect(() => {
        StatusMessages.subscribe((status) => {
           updatingStatus = status?.updating ?? false;
        })
    })
    $effect(() => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            sendAuthMessage(auth, true, () => {
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
    {#if updatingStatus}
        <UpdatingOverlay details={updatingStatus}></UpdatingOverlay>
    {/if}
    <Main></Main>
{:else if !isCheckingAuthStatus}
    <Auth></Auth>
{/if}

<Toaster richColors></Toaster>
