<script lang="ts">
    import {Icons} from "$lib/components/icons";
    import {Button} from "$lib/components/ui/button";
    import {Input} from "$lib/components/ui/input";
    import {Label} from "$lib/components/ui/label";
    import {cn} from "$lib/utils.js";
    import {siteName} from "$lib/config";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {AuthMessages, NotificationsMessages, sendAuthMessage} from "$lib/stores/websocket-store";


    // import AuthenticationLight from "$lib/img/examples/authentication-light.png?enhanced";
    // import AuthenticationDark from "$lib/img/examples/authentication-dark.png?enhanced";

    let className: string | undefined | null = $state(undefined);
    export {className as class};

    let password: string = $state('')
    let remember: boolean = $state(false)

    let isLoading = $state(false);

    $effect(() => {

        AuthMessages.subscribe(message => {
            if (message?.success && remember && password) {
                localStorage.setItem('auth', password);


            }
        })

        NotificationsMessages.subscribe(messages => {
            if (messages?.show?.find(message => {
                return message.name === 'auth'
            })) {
                isLoading = false;
                localStorage.removeItem('auth')
            }

        })
    })

    function login(password: string, remember: boolean) {
        isLoading = true
        sendAuthMessage(password, remember, () => isLoading = false)
    }


    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        login(password, remember)
    }


</script>

<div class="md:hidden">
    <!--	<enhanced:img src={AuthenticationLight} alt="Authentication" class="block dark:hidden" />-->
    <!--	<enhanced:img src={AuthenticationDark} alt="Authentication" class="hidden dark:block" />-->
</div>
<div
        class="container relative h-dvh flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
    <Button
            href="/examples/authentication"
            variant="ghost"
            class="absolute right-4 top-4 md:right-8 md:top-8"
    >
        Login
    </Button>
    <div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div
                class="absolute inset-0 bg-cover"
                style="
				background-image:
					url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
        ></div>
        <div class="relative z-20 flex items-center text-lg font-medium">
            <!-- <Command class="mr-2 h-6 w-6" /> -->
            {siteName} Beta UI
        </div>
        <div class="relative z-20 mt-auto">
            <blockquote class="space-y-2">
                <p class="text-lg">
                    &ldquo;The revolution of IRL...&rdquo;
                </p>
                <footer class="text-sm">Andres Cera</footer>
            </blockquote>
        </div>
    </div>
    <div class="lg:p-8">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div class="flex flex-col space-y-2 text-center">
                <h1 class="text-2xl font-semibold tracking-tight">Login with password</h1>
                <p class="text-muted-foreground text-sm">
                    Use the device password to access the functionalities
                </p>
            </div>
            <div class={cn("grid gap-6", className)}>
                <form onsubmit={onSubmit}>
                    <div class="grid gap-2">
                        <div class="grid gap-1">
                            <Label class="sr-only" for="password">Email</Label>
                            <Input bind:value={password}
                                   id="password"
                                   placeholder="*******"
                                   type="password"
                                   autocapitalize="none"
                                   autocomplete="off"
                                   autocorrect="off"
                                   disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {#if isLoading}
                                <Icons.spinner class="mr-2 h-4 w-4 animate-spin"/>
                            {/if}
                            Sign In
                        </Button>
                    </div>
                    <div class="flex items-center space-x-2  mt-3">
                        <Checkbox id="remember" bind:checked={remember}/>
                        <Label
                                for="remember"
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Remember me
                        </Label>
                    </div>
                </form>

                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <span class="w-full border-t"></span>
                    </div>
                    <div class="relative flex justify-center text-xs uppercase">
                        <span class="bg-background text-muted-foreground px-2"> {siteName}</span>
                    </div>
                </div>

            </div>
            <p class="text-muted-foreground px-8 text-center text-sm">
                Just sign in and enjoy bringing the joy
            </p>
        </div>
    </div>
</div>



