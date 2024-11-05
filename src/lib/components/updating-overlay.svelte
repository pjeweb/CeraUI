<script lang="ts">

    import {toast} from "svelte-sonner";
    import type {StatusMessage} from "$lib/types/socket-messages";
    import * as Drawer from "$lib/components/ui/drawer/index.js";
    import {Progress} from "$lib/components/ui/progress";

    let {details}: { details: Exclude<StatusMessage['updating'], boolean | null> } = $props()

    let progress: number = $state(0)
    let total: number = 3 * details.total
    $effect(() => {
        let {setting_up = 0, unpacking = 0, downloading = 0} = details;
        progress = setting_up + downloading + unpacking;
    })


    $effect(() => {
        if (progress === total)
            toast.success('Updated successfully.', {description: 'The device is rebooting, you will be able to used it with the latest features in a couple of minutes'});
    })

    const interval = setInterval(() => {
        if (details.downloading < details.total) {
            details.downloading++;
        } else if (details.unpacking < details.total) {
            details.unpacking++;
        } else if (details.setting_up < details.total) {
            details.setting_up++;
        } else {
            clearInterval(interval)
        }
    }, 100)


</script>

<Drawer.Root open={false} closeOnOutsideClick={false} closeOnEscape={false}>
    <Drawer.Content class="w-[100%] h-[100%] bg-transparent/50 " disableDrag={true}
                    data-vaul-no-drag>
        <div class="w-[100%] h-[100%]">
            <Drawer.Header>
                <div>
                    <Drawer.Title>
                        <div class="loading">Updating your device software</div>
                    </Drawer.Title>
                    <Drawer.Description>
                        <div>You will be able to use it once the update process is complete</div>
                        <div class="resize-none mt-5 w-[100%] md:w-[50%] ml-auto mr-auto disabled:cursor-default text-area text-lg">
                            <b class="loading">Updating packages</b>
                            {#if details.downloading}
                                <p><b>Downloading:</b> {`${details.downloading}/${details.total}`}</p>
                            {/if}
                            {#if details.unpacking}
                                <p><b>Unpacking:</b> {`${details.unpacking}/${details.total}`}</p>
                            {/if}
                            {#if details.setting_up}
                                <p><b>Installing:</b> {`${details.setting_up}/${details.total}`}</p>
                            {/if}
                            <p><b>Progress:</b> {`${(100 * progress / total).toFixed(2)}%`}</p>
                        </div>
                    </Drawer.Description>
                </div>
            </Drawer.Header>
            <div class="p-4 pb-0 text-center w-[100%] bottom-[20%] absolute grid justify-center">
                <div class="flex justify-center">
                    <img alt="" src="src/assets/images/1672353.svg" width="40%"/>
                </div>
                <div class="flex justify-center">
                    <Progress class="w-[60%] bg-accent" max={total} value={progress}></Progress>
                </div>
            </div>
            <Drawer.Footer>
            </Drawer.Footer>
        </div>
    </Drawer.Content>
</Drawer.Root>
